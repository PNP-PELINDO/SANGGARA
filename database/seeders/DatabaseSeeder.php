<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Anggaran;
use App\Models\Transaksi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin JM SDM',
            'email' => 'admin@sanggara.com',
            'password' => Hash::make('password123'),
        ]);

        // Input murni: COA, Nama, Original Budget, dan Persentase Unreleased (Kunci)
        $items = [
            ['kode_coa' => '5020100000', 'nama_item' => 'Exp Bhn Bakar', 'original_budget' => 280500000, 'unreleased_persen' => 30],
            ['kode_coa' => '5020300000', 'nama_item' => 'Exp Bhn Makanan', 'original_budget' => 475750000, 'unreleased_persen' => 30],
            ['kode_coa' => '5020900000', 'nama_item' => 'Exp Bhn Pas Pla', 'original_budget' => 89200000, 'unreleased_persen' => 30],
            ['kode_coa' => '5021200000', 'nama_item' => 'Exp Perlengkapan', 'original_budget' => 408000000, 'unreleased_persen' => 30],
        ];

        foreach ($items as $item) {
            $anggaran = Anggaran::create($item);

            // Bikin dummy transaksi untuk Exp Bhn Bakar sesuai tabelmu
            if ($item['kode_coa'] === '5020100000') {
                Transaksi::create([
                    'anggaran_id' => $anggaran->id,
                    'tanggal' => date('Y-m-d'),
                    'keterangan' => 'Realisasi Awal',
                    'nominal_commitment' => 17865000,
                    'nominal_realisasi' => 21654000,
                ]);
            }
        }
    }
}
