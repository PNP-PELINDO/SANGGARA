<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Anggaran;
// Transaksi tidak wajib di-import di sini jika belum dipakai
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

        // 2. Buat Data Master Anggaran (The Big 4 sesuai Flowchart)
        $items = [
            ['nama_item' => 'Rapat', 'kategori' => 'The Big 4', 'total_anggaran' => 10000000],
            ['nama_item' => 'RT', 'kategori' => 'The Big 4', 'total_anggaran' => 5000000],
            ['nama_item' => 'Perlengkapan', 'kategori' => 'The Big 4', 'total_anggaran' => 15000000],
            ['nama_item' => 'OR & Kes', 'kategori' => 'The Big 4', 'total_anggaran' => 8000000],
        ];

        foreach ($items as $item) {
            Anggaran::create($item);
        }
    }
}
