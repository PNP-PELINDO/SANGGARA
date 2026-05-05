<?php

namespace App\Http\Controllers;

use App\Models\Anggaran;
use App\Models\Transaksi;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ==========================================================
        // 1. HITUNG AGREGAT GLOBAL (Untuk 4 Kartu di Atas)
        // ==========================================================
        $totalAnggaran = Anggaran::sum('total_anggaran');

        // Kita pecah sesuai pola Excel: Ada Commitment, Ada Actual (Realisasi)
        // Catatan: Pastikan di tabel `transaksis` kamu ada kolom `nominal_commitment`
        $totalCommitment = Transaksi::sum('nominal_commitment');
        $totalActual = Transaksi::sum('nominal_realisasi');

        // Total terpakai adalah gabungan uang yang dibooking (commitment) & dicairkan (actual)
        $totalTerpakai = $totalCommitment + $totalActual;
        $persentase = $totalAnggaran > 0 ? ($totalTerpakai / $totalAnggaran) * 100 : 0;

        // Logika Alert Card sesuai flowchart SANGGARA
        $status = 'Aman';
        if ($persentase > 100) {
            $status = 'Overbudget (>100%)';
        } elseif ($persentase > 80) {
            $status = 'Warning (>80%)';
        }

        // ==========================================================
        // 2. HITUNG DATA THE BIG 4 (Untuk Bar Chart & Priority Card)
        // ==========================================================
        $bigFourData = Anggaran::where('kategori', 'The Big 4')->get()->map(function ($item) {

            // Hitung total commitment & actual KHUSUS untuk ID Anggaran ini
            // Asumsi: Di tabel `transaksis` ada kolom `anggaran_id` yang berelasi ke tabel `anggarans`
            $itemCommitment = Transaksi::where('anggaran_id', $item->id)->sum('nominal_commitment');
            $itemActual = Transaksi::where('anggaran_id', $item->id)->sum('nominal_realisasi');

            return [
                'id' => $item->id,
                'nama_item' => $item->nama_item,
                'total_anggaran' => (float) $item->total_anggaran,
                'total_commitment' => (float) $itemCommitment,
                'total_actual' => (float) $itemActual,
            ];
        });

        // ==========================================================
        // 3. KIRIM DATA KE REACT (FRONTEND)
        // ==========================================================
        return Inertia::render('Dashboard', [
            'agregat' => [
                'total_anggaran' => (float) $totalAnggaran,
                'total_commitment' => (float) $totalCommitment,
                'total_actual' => (float) $totalActual,
                'persentase' => round($persentase, 2),
                'status' => $status,
            ],
            'big_four' => $bigFourData
        ]);
    }
}
