<?php

namespace App\Http\Controllers;
use App\Models\Servers;

use Illuminate\Http\Request;
use xPaw\SourceQuery\SourceQuery;

use Illuminate\Support\Facades\Http;
 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
function toCommunityID($id) {
    if (preg_match('/^STEAM_/', $id)) {
        $parts = explode(':', $id);
        return bcadd(bcadd(bcmul($parts[2], '2'), '76561197960265728'), $parts[1]);
    } elseif (is_numeric($id) && strlen($id) < 16) {
        return bcadd($id, '76561197960265728');
    } else {
        return $id; // We have no idea what this is, so just return it.
    }
}

class ServersController extends Controller
{
    public function retrieve(){
        $serverCache = Cache::remember('gmod_servers', 20, function () {
            $output = [];
            $output["servers"] = [];
            $servers = Servers::all();

            foreach ($servers as $server){
                $Query = new SourceQuery();
                try
                {
                    $Query->Connect( $server->ip, $server->port, 1.5, SourceQuery::SOURCE );
                    $info = $Query->GetInfo();
                    if (is_array($info) && !empty($info)){
                        $entry = array(
                            "ip" => $server->ip,
                            "port" => $server->port,
                            "name" =>  $info["HostName"],
                            "description" => $server->description,
                            "gamemode" => $info["ModDesc"],
                            "map" => $info["Map"],
                            "players" => $info["Players"],
                            "maxPlayers" => $info["MaxPlayers"],
                        );
                        $output["servers"][] = $entry;
                    } else {

                        $entry = array(
                            "ip" => $server->ip,
                            "port" => $server->port,
                            "name" =>  "OFFLINE",
                            "description" => $server->description,
                        );
                        $output["servers"][] = $entry;
                    }
                }
                catch( Exception $e )
                {
                    echo $e->getMessage( );
                }
                finally
                {
                    $Query->Disconnect( );
                }
                
            }

            return $output;
        });

        return $serverCache;
    }

    public function retrieveStaff(){
        $staffCache = Cache::remember('gmod_staff', 60, function () {
            $output = [];
            $users = DB::connection('garrysmod_sql')->select("SELECT * FROM sam_ranks SR INNER JOIN sam_players SP ON SP.rank=SR.name WHERE rank <> 'user' ORDER BY immunity DESC;");

            $steamids = "";
            $steamMap = []; //Used to retain sorted order
            $i = 0;
            foreach ($users as $user){
                $steamid64 = toCommunityID($user->steamid);
                $steamids = $steamids . $steamid64 . ",";

                $output['staff'][] = [
                    'steamid' => $steamid64,
                    'profile' => "",
                    'name' => "",
                    'rank' => ucfirst($user->rank),
                ];
                $steamMap[$steamid64] = $i;
                $i = $i + 1;
            }

            //Retrieve a more up to date steam name and profile image
            $steamPlayers = Http::get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' . env('STEAM_CLIENT_SECRET') . '&steamids=' . $steamids)->throw()["response"]["players"];
            foreach ($steamPlayers as $player){
                $output['staff'][$steamMap[$player['steamid']]]['profile'] = $player['avatarfull'];
                $output['staff'][$steamMap[$player['steamid']]]['name'] = $player['personaname'];
            }


            return $output;
        });
        return $staffCache;
    }
}
