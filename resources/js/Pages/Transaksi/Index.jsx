import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function Index({ auth, transaksis, anggarans, selectedId, consumableBudget, sisaAnggaranTerkini }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Setup Form menggunakan Inertia useForm (Sudah include rincian)
    const { data, setData, post, processing, errors, reset } = useForm({
        anggaran_id: selectedId,
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
        rincian: '', // Field Rincian Baru
        nominal_commitment: 0,
        nominal_realisasi: 0,
    });

    // Helper: Format Rupiah
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka || 0);
    };

    // ===============================================
    // LOGIKA RUNNING BALANCE (SALDO MENURUN)
    // ===============================================
    let currentBalance = consumableBudget;
    const computedRows = transaksis.map((item) => {
        const initial = currentBalance;
        const sisa = initial - parseFloat(item.nominal_commitment || 0) - parseFloat(item.nominal_realisasi || 0);

        const rowData = {
            ...item,
            anggaran_tampil: initial,
            sisa_anggaran: sisa
        };

        currentBalance = sisa; // Saldo sisa baris ini jadi modal baris berikutnya
        return rowData;
    });

    const handleFilterChange = (id) => {
        router.get(route('transaksi.index'), { anggaran_id: id }, { preserveState: true });
        setData('anggaran_id', id);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('transaksi.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            router.delete(route('transaksi.destroy', id));
        }
    };

    // Agregat Footer
    const totalCommitment = transaksis.reduce((acc, curr) => acc + parseFloat(curr.nominal_commitment || 0), 0);
    const totalActual = transaksis.reduce((acc, curr) => acc + parseFloat(curr.nominal_realisasi || 0), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-2xl text-slate-800 dark:text-white uppercase tracking-tighter">Monitoring Transaksi Harian</h2>}
        >
            <Head title="Transaksi Harian" />

            <div className="space-y-6 pb-20 animate-in fade-in duration-700">
                {/* --- STATS & FILTERS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Filter Anggaran (COA)</label>
                            <select
                                value={selectedId}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="w-full bg-transparent border-none p-0 font-bold text-slate-700 dark:text-white focus:ring-0 cursor-pointer text-sm"
                            >
                                {anggarans.map((ang) => (
                                    <option key={ang.id} value={ang.id} className="text-slate-800 dark:text-slate-900">{ang.kode_coa} - {ang.nama_item}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl shadow-sm border transition-all flex items-center space-x-4 ${currentBalance < 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20'}`}>
                        <div className={`p-3 rounded-xl ${currentBalance < 0 ? 'text-red-600 bg-red-100' : 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${currentBalance < 0 ? 'text-red-400' : 'text-emerald-500'}`}>Sisa Dana Akhir</label>
                            <span className={`text-xl font-black ${currentBalance < 0 ? 'text-red-700' : 'text-emerald-700 dark:text-emerald-400'}`}>{formatRp(currentBalance)}</span>
                        </div>
                    </div>
                </div>

                {/* --- TABLE (FORMAT EXCEL SANGGARA) --- */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[11px] text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 border-b border-slate-200 dark:border-slate-800 transition-colors uppercase font-black">
                                <tr>
                                    <th className="border border-slate-200 dark:border-slate-700 py-4 px-4 w-24">Tanggal</th>
                                    <th className="border border-slate-200 dark:border-slate-700 py-4 px-4">Keterangan</th>
                                    <th className="border border-slate-200 dark:border-slate-700 py-4 px-4 w-24 text-center">Rincian</th>
                                    <th className="border border-slate-200 dark:border-slate-700 py-4 px-4 text-right">Anggaran</th>
                                    <th className="border border-slate-200 dark:border-slate-700 py-4 px-4 text-right">Commitment</th>
                                    <th className="border border-slate-200 dark:border-slate-700 py-4 px-4 text-right">Actual</th>
                                    <th className="border border-slate-200 dark:border-slate-700 py-4 px-4 text-right bg-slate-100/50 dark:bg-slate-800">Sisa Anggaran</th>
                                    <th className="border border-slate-200 dark:border-slate-700 py-4 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {computedRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                                        <td className="border border-slate-200 dark:border-slate-700 py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                                            {new Date(row.tanggal).toLocaleDateString('id-ID', {day:'2-digit', month:'2-digit', year:'numeric'})}
                                        </td>
                                        <td className="border border-slate-200 dark:border-slate-700 py-3 px-4 text-slate-600 dark:text-slate-400">{row.keterangan}</td>
                                        <td className="border border-slate-200 dark:border-slate-700 py-3 px-4 font-black text-blue-500 text-center uppercase">{row.rincian || '-'}</td>
                                        <td className="border border-slate-200 dark:border-slate-700 py-3 px-4 text-right font-medium text-slate-500">{formatRp(row.anggaran_tampil)}</td>
                                        <td className="border border-slate-200 dark:border-slate-700 py-3 px-4 text-right font-bold text-amber-600">
                                            {row.nominal_commitment > 0 ? formatRp(row.nominal_commitment) : '-'}
                                        </td>
                                        <td className="border border-slate-200 dark:border-slate-700 py-3 px-4 text-right font-bold text-rose-600">
                                            {row.nominal_realisasi > 0 ? formatRp(row.nominal_realisasi) : '-'}
                                        </td>
                                        <td className={`border border-slate-200 dark:border-slate-700 py-3 px-4 text-right font-black bg-slate-50 dark:bg-slate-800/20 ${row.sisa_anggaran < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {formatRp(row.sisa_anggaran)}
                                        </td>
                                        <td className="border border-slate-200 dark:border-slate-700 py-3 px-4 text-center">
                                            <button onClick={() => handleDelete(row.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-900 text-white font-black text-xs">
                                <tr>
                                    <td colSpan="4" className="py-5 px-6 tracking-widest uppercase text-center border border-slate-700">Total Program Tahun 2025</td>
                                    <td className="py-5 px-4 text-right text-amber-400 border border-slate-700">{formatRp(totalCommitment)}</td>
                                    <td className="py-5 px-4 text-right text-rose-400 border border-slate-700">{formatRp(totalActual)}</td>
                                    <td className="py-5 px-4 text-right text-blue-400 border border-slate-700 bg-slate-950 font-black">{formatRp(currentBalance)}</td>
                                    <td className="border border-slate-700"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={openModal} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 transition-transform active:scale-95 flex items-center uppercase tracking-widest text-xs">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Tambah Data Harian
                    </button>
                </div>
            </div>

            {/* --- MODAL INPUT REALISASI SANGGARA --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-black text-xl text-slate-800 dark:text-white tracking-tighter uppercase">Input Realisasi Sanggara</h3>
                            <button onClick={closeModal} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Tanggal</label>
                                    <input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 font-bold focus:ring-blue-500 focus:border-blue-500 dark:text-white" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-blue-500 tracking-widest mb-2">Rincian (Misal: BBM)</label>
                                    <input type="text" value={data.rincian} onChange={e => setData('rincian', e.target.value)} placeholder="Contoh: BBM" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 font-bold focus:ring-blue-500 focus:border-blue-500 dark:text-white" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Keterangan / Deskripsi</label>
                                <textarea rows="2" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} placeholder="Contoh: Uang Muka BBM Kendaraan Ops Januari" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 font-bold focus:ring-blue-500 focus:border-blue-500 dark:text-white" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 text-amber-600">Nominal Commitment</label>
                                    <input type="number" value={data.nominal_commitment} onChange={e => setData('nominal_commitment', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 font-bold focus:ring-amber-500 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 text-rose-600">Nominal Actual</label>
                                    <input type="number" value={data.nominal_realisasi} onChange={e => setData('nominal_realisasi', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 font-bold focus:ring-rose-500 dark:text-white" />
                                </div>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Simulasi Sisa Saldo:</span>
                                    <span className={`font-black ${currentBalance - data.nominal_commitment - data.nominal_realisasi < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                                        {formatRp(currentBalance - data.nominal_commitment - data.nominal_realisasi)}
                                    </span>
                                </div>
                            </div>
                            <button type="submit" disabled={processing} className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest text-xs">
                                {processing ? 'Posting Data...' : 'Simpan Transaksi'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
