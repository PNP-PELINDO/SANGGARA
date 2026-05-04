<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Anggaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
// Aktifkan baris di bawah ini jika library Excel & TransaksiExport sudah siap
// use Maatwebsite\Excel\Facades\Excel;
// use App\Exports\TransaksiExport;

class TransaksiController extends Controller
{
    // Menampilkan Halaman Tabel Transaksi
    public function index()
    {
        // Ambil data transaksi beserta relasi nama anggarannya, urutkan dari yang terbaru
        $transaksis = Transaksi::with('anggaran')->latest()->get();

        // Ambil master anggaran untuk diletakkan di Dropdown "Tambah Data"
        $anggarans = Anggaran::all();

        return Inertia::render('Transaksi/Index', [
            'transaksis' => $transaksis,
            'anggarans' => $anggarans,
        ]);
    }

    // Menyimpan Baris Transaksi Baru (New Row)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'anggaran_id' => 'required|exists:anggarans,id',
            'tanggal' => 'required|date',
            'keterangan' => 'required|string|max:255',
            'nominal_realisasi' => 'required|numeric|min:0',
        ]);

        Transaksi::create($validated);

        return redirect()->back(); // Inertia akan otomatis merespons tanpa refresh halaman
    }

    // Auto-Kalkulasi & Edit Sel Langsung (Inline Editing)
    public function update(Request $request, Transaksi $transaksi)
    {
        // 'sometimes' berarti validasi hanya berjalan jika field tersebut dikirim
        $validated = $request->validate([
            'keterangan' => 'sometimes|required|string|max:255',
            'nominal_realisasi' => 'sometimes|required|numeric|min:0',
        ]);

        $transaksi->update($validated);

        return redirect()->back();
    }

    // Menghapus Transaksi (Confirm Delete)
    public function destroy(Transaksi $transaksi)
    {
        $transaksi->delete();
        return redirect()->back();
    }

    // Ekspor Data ke Excel (Fase 5)
    public function export()
    {
        // Jika library Maatwebsite/Excel belum terinstall sempurna, gunakan pesan sementara:
        return back()->with('message', 'Sistem Ekspor sedang dalam maintenance.');

        // Jika sudah siap, gunakan baris ini:
        // return Excel::download(new TransaksiExport, 'Laporan_Realisasi_Sanggara.xlsx');
    }
}
