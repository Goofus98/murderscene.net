<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('manga_authors', function (Blueprint $table) {
            //$table->id();

            $table->string('manga_id', 8);
            $table->string('author');
    
            $table->foreign('manga_id')->references('manga_id')->on('mangas')
                ->onDelete('cascade');

            $table->foreign('author')->references('tag')->on('tags')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manga_authors');
    }
};
