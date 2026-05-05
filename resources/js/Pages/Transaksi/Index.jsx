import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function Index({ auth, transaksis, anggarans, selectedId, consumableBudget, sisaAnggaranTerkini }) {

    // Helper: Format angka ke Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka || 0);
    };

    // Fungsi Filter Otomatis saat dropdown berubah
    const handleFilterChange = (id) => {
        router.get(route('transaksi.index'), { anggaran_id: id }, {
            preserveState: true,
            replace: true
        });
    };

    // Fungsi Hapus Transaksi
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data transaksi ini?')) {
            router.delete(route('transaksi.destroy', id));
        }
    };

    // Kalkulasi Total untuk Footer
    const totalCommitment = transaksis.reduce((acc, curr) => acc + parseFloat(curr.nominal_commitment || 0), 0);
    const totalActual = transaksis.reduce((acc, curr) => acc + parseFloat(curr.nominal_realisasi || 0), 0);
    const totalTerpakai = totalCommitment + totalActual;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                    <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Data Transaksi Harian</h2>
                </div>
            }
        >
            <Head title="Data Transaksi Harian" />

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

                {/* --- TOP BAR: FILTERS & SISA ANGGARAN --- */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                        {/* Filter COA (Kategori) */}
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Pilih Kategori COA</span>
                            <select
                                value={selectedId}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="w-full sm:w-auto bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer transition-colors"
                            >
                                {anggarans.map((ang) => (
                                    <option key={ang.id} value={ang.id}>
                                        {ang.kode_coa} - {ang.nama_item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Indikator Sisa Anggaran Dinamis */}
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-5 py-2.5 rounded-xl shadow-sm flex items-center w-full md:w-auto justify-center transition-colors">
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mr-3">Sisa Anggaran Terkini:</span>
                        <span className={`text-base font-black ${sisaAnggaranTerkini < 0 ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                            {formatRupiah(sisaAnggaranTerkini)}
                        </span>
                    </div>
                </div>

                {/* --- MAIN DATA GRID --- */}
                <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg overflow-hidden transition-colors">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-center">
                                <tr>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-2 font-bold w-12">No</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold w-32">Tanggal</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold min-w-[300px]">Keterangan Transaksi</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold bg-slate-100 dark:bg-slate-800 w-40">
                                        Consumable Budget<br/><span className="text-[9px] font-medium text-slate-500">(locked)</span>
                                    </th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold w-40">Commitment</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold w-40">Actual</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold bg-slate-100 dark:bg-slate-800 w-40 leading-tight">
                                        Total Realisasi<br/><span className="text-[9px] font-medium text-slate-500">(Com + Act)</span>
                                    </th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold w-28">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white dark:bg-slate-900">
                                {transaksis.length > 0 ? transaksis.map((row, index) => (
                                    <tr key={row.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center text-slate-500 font-medium">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-center dark:text-slate-300">
                                            {new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 dark:text-slate-300">
                                            {row.keterangan}
                                        </td>

                                        {/* Kolom Anggaran Locked */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-medium bg-slate-50 dark:bg-slate-800/50 dark:text-slate-300">
                                            {formatRupiah(consumableBudget)}
                                        </td>

                                        {/* Commitment */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">
                                            {formatRupiah(row.nominal_commitment)}
                                        </td>

                                        {/* Actual */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right text-rose-600 dark:text-rose-400 font-bold">
                                            {formatRupiah(row.nominal_realisasi)}
                                        </td>

                                        {/* Total Realisasi Baris */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-black bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white">
                                            {formatRupiah(parseFloat(row.nominal_commitment) + parseFloat(row.nominal_realisasi))}
                                        </td>

                                        {/* Aksi */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleDelete(row.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-10 text-slate-500 italic">Tidak ada transaksi ditemukan untuk COA ini.</td>
                                    </tr>
                                )}
                            </tbody>

                            {/* FOOTER TOTAL */}
                            <tfoot className="bg-slate-100 dark:bg-slate-800 font-black text-slate-800 dark:text-slate-100">
                                <tr>
                                    <td colSpan="3" className="border border-slate-300 dark:border-slate-700 py-3 px-4 text-left tracking-widest uppercase">TOTAL REALISASI</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-3 text-right">-</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-3 text-right text-amber-600">{formatRupiah(totalCommitment)}</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-3 text-right text-rose-600">{formatRupiah(totalActual)}</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-3 text-right text-blue-600 bg-blue-50 dark:bg-blue-900/20">
                                        {formatRupiah(totalTerpakai)}
                                    </td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* --- BOTTOM ACTIONS --- */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <button
                        onClick={() => alert("Gunakan Form Input untuk menambah data")}
                        className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-transparent border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold rounded-lg transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Petunjuk Pengisian
                    </button>

                    <div className="flex space-x-3 w-full sm:w-auto">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 bg-slate-800 text-white font-bold rounded-lg shadow-md transition-transform hover:-translate-y-0.5"
                        >
                            Cetak PDF
                        </button>
                        <button
                            className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md shadow-blue-500/30 transition-transform hover:-translate-y-0.5"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>

                <div className="text-center mt-12 pb-6">
                    <p className="text-xs text-slate-500 font-medium">© {new Date().getFullYear()} PT Pelabuhan Indonesia (Persero) | SANGGARA System</p>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
