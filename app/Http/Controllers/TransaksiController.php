<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Anggaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
// Aktifkan jika library Excel sudah siap
// use Maatwebsite\Excel\Facades\Excel;
// use App\Exports\TransaksiExport;

class TransaksiController extends Controller
{
    /**
     * Menampilkan Halaman Tabel Transaksi dengan Logika Saldo (Running Balance)
     */
    public function index(Request $request)
    {
        // 1. Ambil semua Master Anggaran untuk Dropdown Filter
        $anggarans = Anggaran::all();

        // 2. Ambil ID Anggaran dari filter (Default ke data pertama jika belum dipilih)
        $selectedId = $request->query('anggaran_id', $anggarans->first()?->id);

        // 3. Ambil data Transaksi
        // Penting: Urutan ASC (Tanggal & ID) agar kalkulasi sisa anggaran di frontend konsisten
        $transaksis = Transaksi::with('anggaran')
            ->when($selectedId, function ($query, $id) {
                return $query->where('anggaran_id', $id);
            })
            ->orderBy('tanggal', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        // 4. Kalkulasi Consumable Budget (Original - Unreleased %) dari Master sebagai saldo awal
        $selectedAnggaran = Anggaran::find($selectedId);
        $consumableBudget = 0;

        if ($selectedAnggaran) {
            $original = (float) $selectedAnggaran->original_budget;
            $persenUnreleased = (float) $selectedAnggaran->unreleased_persen;

            $unreleasedRp = ($original * $persenUnreleased) / 100;
            $consumableBudget = $original - $unreleasedRp;
        }

        // 5. Kirim data ke Frontend React
        return Inertia::render('Transaksi/Index', [
            'transaksis' => $transaksis,
            'anggarans' => $anggarans,
            'selectedId' => (int) $selectedId,
            'consumableBudget' => (float) $consumableBudget,
        ]);
    }

    /**
     * Menyimpan Baris Transaksi Realisasi Baru
     */
    public function store(Request $request)
    {
        // Validasi input termasuk kolom 'rincian' yang baru
        $validated = $request->validate([
            'anggaran_id'        => 'required|exists:anggarans,id',
            'tanggal'            => 'required|date',
            'keterangan'         => 'required|string|max:255',
            'rincian'            => 'required|string|max:100', // Kolom baru sesuai Excel
            'nominal_commitment' => 'required|numeric|min:0',
            'nominal_realisasi'  => 'required|numeric|min:0',
        ]);

        Transaksi::create($validated);

        return redirect()->back()->with('message', 'Data realisasi berhasil diposting.');
    }

    /**
     * Update data transaksi (Support Inline Editing)
     */
    public function update(Request $request, Transaksi $transaksi)
    {
        $validated = $request->validate([
            'keterangan'         => 'sometimes|required|string|max:255',
            'rincian'            => 'sometimes|required|string|max:100',
            'nominal_commitment' => 'sometimes|required|numeric|min:0',
            'nominal_realisasi'  => 'sometimes|required|numeric|min:0',
        ]);

        $transaksi->update($validated);

        return redirect()->back();
    }

    /**
     * Menghapus baris transaksi
     */
    public function destroy(Transaksi $transaksi)
    {
        $transaksi->delete();
        return redirect()->back()->with('message', 'Baris transaksi telah dihapus.');
    }

    /**
     * Ekspor Data ke Excel (Fase 5)
     */
    public function export()
    {
        return back()->with('message', 'Fitur ekspor sedang disiapkan oleh tim IT.');
    }
}
