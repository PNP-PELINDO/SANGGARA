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
            $table->string('kode_coa')->unique(); // Misal: 5020100000
            $table->string('nama_item');          // Misal: Exp Bhn Bakar
            $table->bigInteger('total_anggaran'); // Pagu 1 tahun
            $table->string('kategori')->default('Umum'); // Untuk menandai 'The Big 4'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggarans');
    }
};
