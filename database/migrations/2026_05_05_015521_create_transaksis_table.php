<?php
// database/migrations/xxxx_xx_xx_create_transaksis_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            // Ini tali pengikatnya ke tabel anggarans (COA)
            $table->foreignId('anggaran_id')->constrained('anggarans')->cascadeOnDelete();

            $table->date('tanggal');
            $table->string('keterangan');

            // Pemisahan antara Uang Muka dan Uang Riil
            $table->bigInteger('nominal_commitment')->default(0);
            $table->bigInteger('nominal_realisasi')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
