<?php

namespace App\Http\Controllers;

use App\Models\Anggaran;
use App\Models\Transaksi;
use Inertia\Inertia;

class MasterAnggaranController extends Controller
{
    public function index()
    {
        // Tarik semua data Master Anggaran
        $anggarans = Anggaran::all()->map(function ($item, $index) {

            // Hitung total pemakaian per item (COA)
            $commitment = Transaksi::where('anggaran_id', $item->id)->sum('nominal_commitment');
            $actual = Transaksi::where('anggaran_id', $item->id)->sum('nominal_realisasi');

            $totalTerpakai = $commitment + $actual;
            $persentase = $item->total_anggaran > 0 ? ($totalTerpakai / $item->total_anggaran) * 100 : 0;

            // Logika Status Alert SANGGARA
            // Analisis 70% (Batas Aman 70%)
            $status70 = $persentase > 70 ? 'Over' : 'Safe';

            // Analisis 100% (Batas Kritis)
            $status100 = 'Safe';
            if ($persentase > 100) {
                $status100 = 'Over';
            } elseif ($persentase > 80) {
                $status100 = 'Warn';
            }

            // Kembalikan format array yang persis dengan struktur React kamu
            return [
                'id' => $item->id,
                'no' => $index + 1,
                'itemName' => $item->nama_item,
                'description' => 'COA: ' . $item->kode_coa, // Gabungkan teks info
                'totalPagu' => (float) $item->total_anggaran,
                'awal' => (float) $item->total_anggaran, // Diasumsikan sama dengan pagu awal
                'revisi' => 0, // Nilai default sementara
                'hutangVendor' => (float) $actual, // Kita petakan Actual ke Hutang Vendor/Riil
                'sisaKontrak' => 0, // Nilai default sementara
                'uangMuka' => (float) $commitment, // Kita petakan Commitment ke Uang Muka
                'terpakai70' => round($persentase, 2),
                'status70' => $status70,
                'terpakai100' => round($persentase, 2),
                'status100' => $status100,
            ];
        });

        // PENTING: Arahkan ke folder MasterAnggaran dan file Index.jsx
        return Inertia::render('MasterAnggaran/Index', [
            'dataAnggaran' => $anggarans
        ]);
    }
}
