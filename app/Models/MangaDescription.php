<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MangaDescription extends Model
{
    use HasFactory;

    public $timestamps = true;
    protected $fillable = ['manga_id', 'description'];


    public function manga(): BelongsToMany{
        return $this->belongsToMany(Mangas::class);
    }
}
