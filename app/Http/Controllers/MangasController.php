<?php

namespace App\Http\Controllers;
use App\Models\Mangas;
use App\Models\MangaTags;
use App\Models\Servers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Illuminate\Container\Container;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;


use Carbon\Carbon;

use xPaw\SourceQuery\SourceQuery;


class MangasController extends Controller
{

    public function retrieve(){
        $output = [];
        $users = DB::connection('garrysmod_sql')->select("SELECT * FROM sam_ranks SR INNER JOIN sam_players SP ON SP.rank=SR.name WHERE rank <> 'user' ORDER BY immunity DESC;");
        foreach ($users as $user){
            $output[] = [
                'steamid' => $user->steamid,
                'name' => $user->name,
                'rank' => $user->rank,
            ];
        }
        return $output;
    }
    public function retrieveTag(string $tag){
        $output = [];

        $mangas = DB::table('mangas')
            ->join('manga_tags', 'mangas.manga_id', '=', 'manga_tags.manga_id')
            //->join('tags', 'manga_tags.tag_id', '=', 'tags.tag')
            ->where('manga_tags.tag_id', $tag)
            ->get();

        foreach ($mangas as $manga){
            $output[] = $manga;
        }

        return $output;
    }

    public function retrieveAuthor(string $author){
        $output = [];

        $mangas = DB::table('mangas')
            ->join('manga_tags', 'mangas.manga_id', '=', 'manga_tags.manga_id')
            //->join('tags', 'manga_tags.tag_id', '=', 'tags.tag')
            ->where('manga_tags.tag_id', $author)
            ->get();

        foreach ($mangas as $manga){
            $output[] = $manga;
        }

        return $output;
    }

    public function retrieveSearchPage(){
        /*$product_ids = DB::table('mangas')
            ->select("manga_id")
            ->orderBy('mangas.created_at')
            ->get();

        $array = [];
        foreach ($product_ids as $manga){
            $array[] = $manga->manga_id;
        }
        $per_page = 25;
        $page = Paginator::resolveCurrentPage('page');
        $product_ids_this_page = array_slice($array, ($per_page * ($page-1)), $per_page);

        $itemsThisPage = DB::table('mangas')
            ->whereIn('mangas.manga_id', $product_ids_this_page)
            ->select("manga_id", "title")
            ->get();*/

        $mangas = DB::table('mangas')
            ->select("manga_id", "title")
            ->simplePaginate(25);

        return $mangas;
    }
    public function retrieveID(string $id){
        $output = [];
        
        $mangas = DB::table('mangas')
            ->where('mangas.manga_id', $id)
            ->join('manga_descriptions', 'mangas.manga_id', '=', 'manga_descriptions.manga_id')
            ->join('manga_tags', 'mangas.manga_id', 'manga_tags.manga_id')
            
            ->join('manga_authors', 'manga_authors.manga_id', '=', 'mangas.manga_id')

            ->get();

        if ( is_null($mangas[0])) {
            return $output;
        }

        $output["meta"] = $mangas[0];
        

        foreach ($mangas as $manga){
            $output["tags"][] = $manga->tag_id;
            $output["authors"][] = $manga->author;

        }

        $output["tags"] = DB::table('manga_tags')
            ->groupBy('tag_id')
            ->select(['tag_id', DB::raw('COUNT(*) as count')])
            ->whereIn('tag_id', $output["tags"])
            ->orderByDesc('count')
            ->get();

        $output["authors"] = DB::table('manga_authors')
            ->groupBy('author')
            ->select(['author', DB::raw('COUNT(*) as count')])
            ->whereIn('author', $output["authors"])
            ->orderByDesc('count')
            ->get();


        $current = Carbon::now();
        $created = \Carbon\Carbon::createFromFormat('Y-m-d H:s:i', $mangas[0]->created_at);

        $days = $current->diffInDays($created);
        $months = $current->diffInMonths($created);
        $year = $current->diffInYears($created);

        $output["time_since"] = ($year != 0 ? (string)$year.' year(s) ': '').($months != 0 ? (string)$months.' month(s) ': '').($days != 0 ? (string)$days.' day(s) ': '')."ago";

        $output["description"] = $manga->description;
        //echo $counts;
        unset($output["meta"]->description);
        unset($output["meta"]->author);
        unset($output["meta"]->tag_id);

        return $output;
    }
}
