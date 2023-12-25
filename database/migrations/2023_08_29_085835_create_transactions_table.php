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
        Schema::create('transactions', function (Blueprint $table) {
            //$table->id();
            $table->string('transaction_id')->unique();
            $table->string('steamid');
            $table->decimal('donation', 9, 3);
            $table->bigInteger('reward');
            $table->string('method');
            $table->timestamps();

            $table->primary('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
