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
    // Menampilkan Halaman Tabel Transaksi
    public function index(Request $request)
    {
        // 1. Ambil semua COA untuk Dropdown Filter
        $anggarans = Anggaran::all();

        // 2. Ambil ID Anggaran dari request filter (Default ke COA pertama jika kosong)
        $selectedId = $request->query('anggaran_id', $anggarans->first()?->id);

        // 3. Ambil data Transaksi berdasarkan filter COA
        $transaksis = Transaksi::with('anggaran')
            ->when($selectedId, function ($query, $id) {
                return $query->where('anggaran_id', $id);
            })
            ->latest()
            ->get();

        // 4. Hitung Sisa Anggaran Terkini untuk COA yang dipilih
        $selectedAnggaran = Anggaran::find($selectedId);
        $consumableBudget = 0;
        $sisaAnggaranTerkini = 0;

        if ($selectedAnggaran) {
            $unreleasedRp = ($selectedAnggaran->original_budget * $selectedAnggaran->unreleased_persen) / 100;
            $consumableBudget = $selectedAnggaran->original_budget - $unreleasedRp;

            $totalRealisasi = $transaksis->sum('nominal_commitment') + $transaksis->sum('nominal_realisasi');
            $sisaAnggaranTerkini = $consumableBudget - $totalRealisasi;
        }

        return Inertia::render('Transaksi/Index', [
            'transaksis' => $transaksis,
            'anggarans' => $anggarans,
            'selectedId' => (int) $selectedId,
            'consumableBudget' => (float) $consumableBudget,
            'sisaAnggaranTerkini' => (float) $sisaAnggaranTerkini
        ]);
    }

    // Menyimpan Baris Transaksi Baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'anggaran_id' => 'required|exists:anggarans,id',
            'tanggal' => 'required|date',
            'keterangan' => 'required|string|max:255',
            'nominal_commitment' => 'required|numeric|min:0', // Ditambahkan
            'nominal_realisasi' => 'required|numeric|min:0',
        ]);

        Transaksi::create($validated);

        return redirect()->back()->with('message', 'Transaksi berhasil ditambahkan.');
    }

    // Auto-Kalkulasi & Edit Sel Langsung
    public function update(Request $request, Transaksi $transaksi)
    {
        $validated = $request->validate([
            'keterangan' => 'sometimes|required|string|max:255',
            'nominal_commitment' => 'sometimes|required|numeric|min:0', // Ditambahkan
            'nominal_realisasi' => 'sometimes|required|numeric|min:0',
        ]);

        $transaksi->update($validated);

        return redirect()->back();
    }

    // Menghapus Transaksi
    public function destroy(Transaksi $transaksi)
    {
        $transaksi->delete();
        return redirect()->back()->with('message', 'Transaksi dihapus.');
    }

    // Ekspor Data ke Excel
    public function export()
    {
        return back()->with('message', 'Sistem Ekspor sedang dalam maintenance.');
    }
}
