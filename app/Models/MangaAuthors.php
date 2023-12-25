<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MangaAuthors extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['manga_id', 'author'];



}
