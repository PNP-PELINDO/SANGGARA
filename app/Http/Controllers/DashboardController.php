<?php

namespace App\Http\Controllers;

use App\Models\Anggaran;
use App\Models\Transaksi;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Menampilkan Dashboard Utama SANGGARA dengan Analisis Budget
     */
    public function index()
    {
        // 1. Ambil semua data master anggaran untuk kalkulasi agregat
        $allAnggaran = Anggaran::all();

        // ==========================================================
        // 1. HITUNG AGREGAT GLOBAL (Untuk 4 Kartu di Atas Dashboard)
        // ==========================================================

        // Hitung total dana kotor (Original 100%)
        $totalOriginal = (float) $allAnggaran->sum('original_budget');

        // Hitung total dana yang dikunci (Unreleased Rp) secara agregat
        $totalUnreleasedRp = $allAnggaran->reduce(function ($carry, $item) {
            return $carry + (($item->original_budget * $item->unreleased_persen) / 100);
        }, 0);

        // Dana yang benar-benar bisa dipakai secara global (Consumable / Release)
        $totalConsumable = $totalOriginal - $totalUnreleasedRp;

        // Hitung realisasi dari seluruh transaksi
        $totalCommitment = (float) Transaksi::sum('nominal_commitment');
        $totalActual = (float) Transaksi::sum('nominal_realisasi');

        // FIX: Tambahkan total_realisasi sebagai gabungan Commitment & Actual
        $totalRealisasiGlobal = $totalCommitment + $totalActual;

        // Persentase dihitung terhadap Consumable Budget (Budget Release)
        $persentase = $totalConsumable > 0 ? ($totalRealisasiGlobal / $totalConsumable) * 100 : 0;

        // Logika Alert sesuai flowchart SANGGARA
        $status = 'Aman';
        if ($persentase > 100) {
            $status = 'Overbudget (>100%)';
        } elseif ($persentase > 80) {
            $status = 'Warning (>80%)';
        }

        // ==========================================================
        // 2. HITUNG DATA PER ITEM (Untuk Bar Chart & Priority Card)
        // ==========================================================

        // Kita petakan semua item agar grafik dan kartu prioritas berfungsi
        $bigFourData = $allAnggaran->map(function ($item) {

            // Hitung pemakaian per item
            $itemCommitment = (float) Transaksi::where('anggaran_id', $item->id)->sum('nominal_commitment');
            $itemActual = (float) Transaksi::where('anggaran_id', $item->id)->sum('nominal_realisasi');

            // FIX: Tambahkan total_realisasi per item
            $itemTotalRealisasi = $itemCommitment + $itemActual;

            // Hitung Consumable Budget per item (Original - Unreleased)
            $unreleasedRp = ($item->original_budget * $item->unreleased_persen) / 100;
            $consumablePerItem = $item->original_budget - $unreleasedRp;

            return [
                'id' => $item->id,
                'nama_item' => $item->nama_item,
                'total_anggaran' => (float) $consumablePerItem,
                'total_commitment' => (float) $itemCommitment,
                'total_actual' => (float) $itemActual,
                'total_realisasi' => (float) $itemTotalRealisasi, // Field yang dicari frontend
                'original_pagu' => (float) $item->original_budget
            ];
        });

        // ==========================================================
        // 3. KIRIM DATA KE REACT (FRONTEND)
        // ==========================================================
        return Inertia::render('Dashboard', [
            'agregat' => [
                'total_anggaran' => (float) $totalConsumable,
                'total_original' => (float) $totalOriginal,
                'total_commitment' => (float) $totalCommitment,
                'total_actual' => (float) $totalActual,
                'total_realisasi' => (float) $totalRealisasiGlobal, // Field yang dicari frontend
                'persentase' => round($persentase, 2),
                'status' => $status,
            ],
            'big_four' => $bigFourData
        ]);
    }
}
