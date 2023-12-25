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
        Schema::create('manga_tags', function (Blueprint $table) {
            //$table->id();

            $table->string('manga_id', 8);
            $table->string('tag_id');
    
            $table->foreign('manga_id')->references('manga_id')->on('mangas')
                ->onDelete('cascade');

            $table->foreign('tag_id')->references('tag')->on('tags')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manga_tags');
    }
};
