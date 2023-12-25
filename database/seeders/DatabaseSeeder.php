<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Item;
use App\Models\ItemInstance;
use App\Models\StorageArea;
use App\Models\Mangas;
use App\Models\MangaTags;
use App\Models\MangaDescription;

use App\Models\Servers;
use App\Models\MangaAuthors;
use App\Models\Tags;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */

     
    public function run(): void
    {

        Servers::factory()->create([
            'ip' => "148.59.74.92",
            'port' => 29110,
            'description' => "Community movie night server. Cinema is a gamemode where players can watch web videos synchronously in-game. Along with this are casino games and minigame entities to play. "
        ]);

        Servers::factory()->create([
            'ip' => "208.103.169.108",
            'port' => 27018,
            'description' => "A social experiment gamemode where players must get through a long journey in a desert without getting left behind by the desert bus. The end of the journey reamins a mystery."
        ]);

        Servers::factory()->create([
            'ip' => "216.126.207.5",
            'port' => 29114,
            'description' => "Our main that host the very popular murder gamemode.  One player is a murderer and must not get caught in the act."
        ]);

        /*\App\Models\User::factory(10)->create();
        $areas = StorageArea::factory(4)->create();
        $items = Item::factory(8)->create();
        $mangas = json_decode(file_get_contents(storage_path() . "/data.json"), true);

        $tagMap[] = [];
    
        foreach($mangas as $manga){
            Mangas::firstOrCreate([
                'title' => $manga['title'],
                'manga_id' => $manga['id'],
                'infoURL' => $manga['infoURL']
            ]);

            MangaDescription::firstOrCreate([
                'manga_id' => $manga['id'],
                'description' =>  $manga['description']
            ]);
            foreach($manga['tags'] as $tag){
                MangaTags::factory()->create([
                    'manga_id' => $manga['id'],
                    'tag_id' => $tag
                ]);
                if (empty($tagMap[$tag])) {
                    $tagMap[$tag] = 1;
                } else {
                    $tagMap[$tag] = $tagMap[$tag] + 1;
                }
                Tags::upsert([
                    ['tag' => $tag, 'count' => $tagMap[$tag]]
                ], ['tag'], ['count']);

            }
            if (!is_null($manga['authors'])){
                foreach($manga['authors'] as $tag){
                    MangaAuthors::factory()->create([
                        'manga_id' => $manga['id'],
                        'author' => $tag
                    ]);

                    if (empty($tagMap[$tag])) {
                        $tagMap[$tag] = 1;
                    } else {
                        $tagMap[$tag] = $tagMap[$tag] + 1;
                    }


                    Tags::upsert([
                        ['tag' => $tag, 'count' => $tagMap[$tag]]
                    ], ['tag'], ['count']);

                }
            }

        }
        ItemInstance::factory()->create([
            'item_id' => 1,
            'storage_area_id' => 1,
        ]);

        ItemInstance::factory()->create([
            'item_id' => 3,
            'storage_area_id' => 1,
        ]);
        ItemInstance::factory()->create([
            'item_id' => 4,
            'storage_area_id' => 1,
        ]);*/

    }
}
