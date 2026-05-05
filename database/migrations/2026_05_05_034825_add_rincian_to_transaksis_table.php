<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan kolom yang diperlukan untuk sinkronisasi dengan standar Excel Pelindo.
     */
    public function up(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            // Menambahkan kolom rincian setelah kolom keterangan
            if (!Schema::hasColumn('transaksis', 'rincian')) {
                $table->string('rincian')->nullable()->after('keterangan');
            }

            // Menambahkan kolom nominal_commitment (Booking/Uang Muka)
            if (!Schema::hasColumn('transaksis', 'nominal_commitment')) {
                $table->decimal('nominal_commitment', 15, 2)->default(0)->after('rincian');
            }

            // Memastikan nominal_realisasi sudah ada atau menambahkannya jika belum ada
            if (!Schema::hasColumn('transaksis', 'nominal_realisasi')) {
                $table->decimal('nominal_realisasi', 15, 2)->default(0)->after('nominal_commitment');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            // Menghapus kolom jika migration di-rollback
            $table->dropColumn(['rincian', 'nominal_commitment']);
        });
    }
};
