<?php

namespace App\Http\Controllers;

use App\Models\Anggaran;
use App\Models\Transaksi;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalAnggaran = Anggaran::sum('total_anggaran');
        // Saat ini transaksi masih 0 karena belum ada data
        $totalRealisasi = Transaksi::sum('nominal_realisasi');

        $persentase = $totalAnggaran > 0 ? ($totalRealisasi / $totalAnggaran) * 100 : 0;

        // Logika Alert Card sesuai flowchart
        $status = 'Aman';
        if ($persentase > 100) {
            $status = 'Overbudget (>100%)';
        } elseif ($persentase > 80) {
            $status = 'Warning (>80%)';
        }

        return Inertia::render('Dashboard', [
            'agregat' => [
                'total_anggaran' => $totalAnggaran,
                'total_realisasi' => $totalRealisasi,
                'persentase' => round($persentase, 2),
                'status' => $status,
            ],
            // Kirim data The Big 4 untuk Priority Card
            'big_four' => Anggaran::where('kategori', 'The Big 4')->get()
        ]);
    }
}
