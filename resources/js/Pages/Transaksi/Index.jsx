import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth }) {
    // State sementara untuk mensimulasikan data dari mockup (karena backend belum ada kolom baru)
    const [transaksis, setTransaksis] = useState(mockData);

    // Helper: Format angka ke Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka || 0);
    };

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
                        {/* Filter Kategori */}
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Pilih Kategori</span>
                            <select className="w-full sm:w-auto bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer transition-colors">
                                <option>Exp Bhn Bakar</option>
                                <option>Exp Perjalanan Dinas</option>
                            </select>
                        </div>
                        {/* Filter Bulan */}
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">Bulan/Tahun</span>
                            <select className="w-full sm:w-auto bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer transition-colors">
                                <option>Februari 2024</option>
                                <option>Maret 2024</option>
                            </select>
                        </div>
                    </div>

                    {/* Indikator Sisa Anggaran */}
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-5 py-2.5 rounded-xl shadow-sm flex items-center w-full md:w-auto justify-center transition-colors">
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mr-3">Sisa Anggaran Terkini:</span>
                        <span className="text-base font-black text-emerald-700 dark:text-emerald-400">Rp 160.440.000</span>
                    </div>
                </div>

                {/* --- MAIN DATA GRID (SPREADSHEET STYLE) --- */}
                <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg overflow-hidden transition-colors">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                            {/* HEADER */}
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-center transition-colors">
                                <tr>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-2 font-bold w-12">No</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold w-24">Tanggal</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold min-w-[200px]">Keterangan</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold min-w-[150px]">Rincian</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold bg-slate-100 dark:bg-slate-800 w-32 leading-tight">
                                        Anggaran<br/><span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">(locked)</span>
                                    </th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold w-36">Commitment</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold w-36">Actual</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold bg-slate-100 dark:bg-slate-800 w-32 leading-tight">
                                        Sisa Anggaran<br/><span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">(locked)</span>
                                    </th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-bold w-28">Aksi</th>
                                </tr>
                            </thead>

                            {/* BODY */}
                            <tbody className="bg-white dark:bg-slate-900 transition-colors">
                                {transaksis.map((row, index) => (
                                    <tr key={row.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center text-slate-500 dark:text-slate-400 font-medium">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-slate-700 dark:text-slate-300 text-center">
                                            {row.tanggal}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-slate-700 dark:text-slate-300">
                                            {row.keterangan}
                                        </td>
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-slate-700 dark:text-slate-300">
                                            {row.rincian}
                                        </td>

                                        {/* Locked Column: Anggaran */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/50">
                                            {formatRupiah(row.anggaran)}
                                        </td>

                                        {/* Editable Cell: Commitment */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-1 px-1.5 align-middle group-hover:bg-white dark:group-hover:bg-slate-900">
                                            <div className="relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">Rp</span>
                                                <input
                                                    type="text"
                                                    defaultValue={row.commitment.toLocaleString('id-ID')}
                                                    className="w-full pl-7 pr-2 py-1.5 text-right text-xs border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-transparent dark:bg-transparent text-slate-800 dark:text-white transition-all font-bold"
                                                />
                                            </div>
                                        </td>

                                        {/* Editable Cell: Actual */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-1 px-1.5 align-middle group-hover:bg-white dark:group-hover:bg-slate-900">
                                            <div className="relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">Rp</span>
                                                <input
                                                    type="text"
                                                    defaultValue={row.actual.toLocaleString('id-ID')}
                                                    className="w-full pl-7 pr-2 py-1.5 text-right text-xs border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-transparent dark:bg-transparent text-slate-800 dark:text-white transition-all font-bold"
                                                />
                                            </div>
                                        </td>

                                        {/* Locked Column: Sisa Anggaran */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/50">
                                            {formatRupiah(row.sisa)}
                                        </td>

                                        {/* Aksi */}
                                        <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center">
                                            <div className="flex justify-center space-x-2 text-slate-400 dark:text-slate-500">
                                                <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors" title="View"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                                                <button className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors" title="Edit"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                <button className="hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Delete"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            {/* FOOTER (TOTAL) */}
                            <tfoot className="bg-slate-100 dark:bg-slate-800 font-black text-slate-800 dark:text-slate-100 transition-colors">
                                <tr>
                                    <td colSpan="4" className="border border-slate-300 dark:border-slate-700 py-3 px-4 text-left tracking-widest">TOTAL</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-3 text-right">Rp 12.000.000</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-3 text-right">Rp 11.800.000</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-3 text-right">Rp 11.800.000</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-3 text-right text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10">Rp 160.440.000</td>
                                    <td className="border border-slate-300 dark:border-slate-700 py-3 px-2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* --- BOTTOM ACTIONS --- */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <button className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-transparent border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold rounded-lg transition-colors shadow-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Tambah Baris Baru
                    </button>

                    <button className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-lg shadow-md shadow-blue-500/30 transition-transform hover:-translate-y-0.5">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        Simpan Perubahan
                    </button>
                </div>

                {/* --- FOOTER COPYRIGHT --- */}
                <div className="text-center mt-12 pb-6">
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">© {new Date().getFullYear()} PT Pelabuhan Indonesia (Persero) | Semua Hak Dilindungi</p>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

// =====================================================================
// DUMMY DATA (Replikasi Akurat dari Mockup Halaman Data Transaksi)
// =====================================================================
const mockData = [
    { id: 1, tanggal: '01-Feb-2024', keterangan: 'Pengisian BBM Kendaraan Operasional', rincian: '20 unit kendaraan', anggaran: 12000000, commitment: 11800000, actual: 11800000, sisa: 200000 },
    { id: 2, tanggal: '01-Feb-2024', keterangan: 'Pengisian BBM Kendaraan Operasional', rincian: '20 unit kendaraan', anggaran: 2000000, commitment: 1800000, actual: 1800000, sisa: 100000 },
    { id: 3, tanggal: '01-Feb-2024', keterangan: 'Pengisian BBM Kendaraan Operasional', rincian: '10 unit kendaraan', anggaran: 3000000, commitment: 3000000, actual: 3000000, sisa: 200000 },
    { id: 4, tanggal: '01-Feb-2024', keterangan: 'Pengisian BBM Kendaraan', rincian: '20 unit kendaraan', anggaran: 6000000, commitment: 5000000, actual: 5000000, sisa: 240000 },
    { id: 5, tanggal: '01-Feb-2024', keterangan: 'Pengisian BBM Kendaraan', rincian: '10 unit kendaraan', anggaran: 2000000, commitment: 1800000, actual: 2000000, sisa: 180000 },
    { id: 6, tanggal: '01-Feb-2024', keterangan: 'Pengisian BBM Kendaraan', rincian: '20 unit kendaraan', anggaran: 2000000, commitment: 2000000, actual: 2000000, sisa: 180000 },
    { id: 7, tanggal: '01-Feb-2024', keterangan: 'Pengisian BBM Kendaraan', rincian: '20 unit kendaraan', anggaran: 1300000, commitment: 1300000, actual: 1300000, sisa: 1380000 },
];
