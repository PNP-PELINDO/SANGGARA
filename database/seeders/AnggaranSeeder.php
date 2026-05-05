<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Anggaran;
use App\Models\Transaksi;
use App\Models\User; // <-- Jangan lupa import User
use Illuminate\Support\Facades\Hash; // <-- Import Hash

class AnggaranSeeder extends Seeder
{
    public function run(): void
    {
        // 1. BUAT AKUN ADMIN BIAR BISA LOGIN
        User::create([
            'name' => 'Admin JM SDM',
            'email' => 'admin@pelindo.co.id', // Gunakan email ini untuk login nanti
            'password' => Hash::make('password123'), // Passwordnya: password123
        ]);

        // 2. Buat Master COA (Kodingan yang sebelumnya)
        $bbm = Anggaran::create([
            'kode_coa' => '5020100000',
            'nama_item' => 'Exp Bhn Bakar',
            'total_anggaran' => 280500000,
            'kategori' => 'The Big 4'
        ]);

        $makanan = Anggaran::create([
            'kode_coa' => '5020300000',
            'nama_item' => 'Exp Bhn Makanan',
            'total_anggaran' => 475750000,
            'kategori' => 'The Big 4'
        ]);

        // 3. Buat Contoh Transaksi
        Transaksi::create([
            'anggaran_id' => $bbm->id,
            'tanggal' => '2025-01-01',
            'keterangan' => 'Uang Muka BBM Operasional Januari',
            'nominal_commitment' => 17865000,
            'nominal_realisasi' => 18045000,
        ]);

        Transaksi::create([
            'anggaran_id' => $bbm->id,
            'tanggal' => '2025-02-01',
            'keterangan' => 'Uang Muka BBM Operasional Februari',
            'nominal_commitment' => 18045000,
            'nominal_realisasi' => 0,
        ]);
    }
}
