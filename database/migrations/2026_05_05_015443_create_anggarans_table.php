<?php
// database/migrations/xxxx_xx_xx_create_anggarans_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
        {
            Schema::create('anggarans', function (Blueprint $table) {
                $table->id();
                $table->string('kode_coa')->unique();
                $table->string('nama_item');

                // Logika Baru: Hanya 2 ini yang diinput
                $table->bigInteger('original_budget');
                $table->integer('unreleased_persen')->default(0); // Contoh: 30 untuk 30%

                $table->timestamps();
            });
        }
    public function down(): void
    {
        Schema::dropIfExists('anggarans');
    }
};
