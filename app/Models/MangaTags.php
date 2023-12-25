<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MangaTags extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['manga_id', 'tag_id'];


    public function manga(): BelongsToMany{
        return $this->belongsToMany(Mangas::class);
    }

    public function tags(): BelongsToMany{
        return $this->belongsToMany(Tags::class);
    }
}
