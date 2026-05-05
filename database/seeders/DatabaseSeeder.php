<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Anggaran;
use App\Models\Transaksi; // Import Transaksi agar grafiknya bisa nyala
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin JM SDM
        User::create([
            'name' => 'Admin JM SDM',
            'email' => 'admin@sanggara.com',
            'password' => Hash::make('password123'),
        ]);

        // 2. Buat Data Master Anggaran (The Big 4 sesuai Flowchart & Excel Pelindo)
        $items = [
            // Format: kode_coa, nama, kategori, Pagu Anggaran Riil
            ['kode_coa' => '5081200000', 'nama_item' => 'Rapat', 'kategori' => 'The Big 4', 'total_anggaran' => 588000000],
            ['kode_coa' => '5081300000', 'nama_item' => 'RT', 'kategori' => 'The Big 4', 'total_anggaran' => 600000000],
            ['kode_coa' => '5021200000', 'nama_item' => 'Perlengkapan', 'kategori' => 'The Big 4', 'total_anggaran' => 408000000],
            ['kode_coa' => '5081600000', 'nama_item' => 'OR & Kes', 'kategori' => 'The Big 4', 'total_anggaran' => 567021512],
        ];

        foreach ($items as $item) {
            // Simpan ke tabel master anggarans
            $anggaran = Anggaran::create($item);

            // 3. Buatkan data transaksi otomatis agar Bar Chart di Dashboard langsung hidup
            Transaksi::create([
                'anggaran_id' => $anggaran->id,
                'tanggal' => date('Y-m-d'),
                'keterangan' => 'Realisasi Awal ' . $item['nama_item'],
                // Anggap saja sudah ada uang muka 10% dan pengeluaran riil 20%
                'nominal_commitment' => $item['total_anggaran'] * 0.10,
                'nominal_realisasi' => $item['total_anggaran'] * 0.20,
            ]);
        }
    }
}
