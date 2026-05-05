<?php

namespace App\Http\Controllers;

use App\Models\Anggaran;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterAnggaranController extends Controller
{
    /**
     * Menampilkan data Master Anggaran ke tabel React
     */
    public function index()
    {
        $anggarans = Anggaran::all()->map(function ($item, $index) {

            // 1. DATA MASTER
            $originalBudget = (float) $item->original_budget;
            $unreleasedPersen = (float) $item->unreleased_persen;

            // 2. KALKULASI BUDGET UNRELEASED & RELEASED
            $unreleasedRp = ($originalBudget * $unreleasedPersen) / 100;
            $consumableBudget = $originalBudget - $unreleasedRp; // Sama dengan Budget Release

            // (Opsional) Budget Per Bulan sesuai Excel = Original / 12
            $budgetPerBulan = $originalBudget / 12;

            // 3. KALKULASI TRANSAKSI (REALISASI)
            $commitment = (float) Transaksi::where('anggaran_id', $item->id)->sum('nominal_commitment');
            $actual = (float) Transaksi::where('anggaran_id', $item->id)->sum('nominal_realisasi');
            $realisasiTotal = $commitment + $actual;

            // 4. ANALISIS TERHADAP CONSUMABLE BUDGET (Budget Release)
            $sisaConsumable = $consumableBudget - $realisasiTotal;
            $persenConsumable = $consumableBudget > 0 ? ($realisasiTotal / $consumableBudget) * 100 : 0;

            $statusConsumable = 'Safe';
            if ($persenConsumable > 100) $statusConsumable = 'Over';
            elseif ($persenConsumable > 80) $statusConsumable = 'Warn';

            // 5. ANALISIS TERHADAP 100% (Original Budget)
            $sisa100 = $originalBudget - $realisasiTotal;
            $persen100 = $originalBudget > 0 ? ($realisasiTotal / $originalBudget) * 100 : 0;

            $status100 = 'Safe';
            if ($persen100 > 100) $status100 = 'Over';
            elseif ($persen100 > 80) $status100 = 'Warn';

            // Return ke Frontend React
            return [
                'id' => $item->id,
                'no' => $index + 1,
                'kodeCoa' => $item->kode_coa,
                'itemName' => $item->nama_item,
                'originalBudget' => $originalBudget,
                'unreleasedPersen' => $unreleasedPersen,
                'unreleasedRp' => $unreleasedRp,
                'consumableBudget' => $consumableBudget,
                'budgetPerBulan' => $budgetPerBulan,
                'commitment' => $commitment,
                'actual' => $actual,
                'realisasiTotal' => $realisasiTotal,
                'sisaConsumable' => $sisaConsumable,
                'persenConsumable' => round($persenConsumable, 2),
                'statusConsumable' => $statusConsumable,
                'sisa100' => $sisa100,
                'persen100' => round($persen100, 2),
                'status100' => $status100,
            ];
        });

        // PENTING: Arahkan ke folder MasterAnggaran/Index
        return Inertia::render('MasterAnggaran/Index', [
            'dataAnggaran' => $anggarans
        ]);
    }

    /**
     * Menyimpan data Setup COA Master Baru dari form Modal React
     */
    public function store(Request $request)
    {
        // 1. Validasi inputan dari form React
        $request->validate([
            'kode_coa' => 'required|string|unique:anggarans,kode_coa',
            'nama_item' => 'required|string|max:255',
            'original_budget' => 'required|numeric|min:0',
            'unreleased_persen' => 'required|numeric|min:0|max:100',
        ], [
            'kode_coa.unique' => 'Kode COA ini sudah terdaftar di sistem! Silakan gunakan kode lain.',
        ]);

        // 2. Simpan ke tabel 'anggarans'
        Anggaran::create([
            'kode_coa' => $request->kode_coa,
            'nama_item' => $request->nama_item,
            'original_budget' => $request->original_budget,
            'unreleased_persen' => $request->unreleased_persen,
        ]);

        // 3. Redirect kembali ke halaman Master
        return redirect()->route('master-anggaran.index');
    }

    /**
     * Menghapus data Master Anggaran (Hanya COA Master)
     */
    public function destroy(Anggaran $anggaran)
    {
        // Proses hapus data
        // Jika di migration menggunakan onDelete('cascade'),
        // maka transaksi yang terhubung akan ikut terhapus otomatis.
        $anggaran->delete();

        // Kembali ke halaman sebelumnya dengan Inertia
        return redirect()->back();
    }
}
