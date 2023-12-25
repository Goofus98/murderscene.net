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
        Schema::create('manga_descriptions', function (Blueprint $table) {
            $table->string('manga_id', 8)->unique();
            $table->mediumText('description');
            $table->timestamps();
            $table->primary('manga_id');
            $table->foreign('manga_id')->references('manga_id')->on('mangas')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manga_descriptions');
    }
};
