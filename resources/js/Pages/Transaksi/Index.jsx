import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function Index({ auth, transaksis, anggarans, selectedId, consumableBudget, sisaAnggaranTerkini }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State untuk Pop-up Konfirmasi Delete
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    // 1. Setup Form
    const { data, setData, post, processing, errors, reset } = useForm({
        anggaran_id: selectedId,
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
        rincian: '',
        nominal_commitment: 0,
        nominal_realisasi: 0,
    });

    // Helper: Format Rupiah untuk Tampilan Tabel
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka || 0);
    };

    // Helper: Format angka dengan titik otomatis saat ngetik (Tanpa Rp)
    const formatNumberOnly = (angka) => {
        if (!angka) return '';
        return new Intl.NumberFormat('id-ID').format(angka);
    };

    // Handler untuk Input Rupiah (Hanya menerima angka, membuang huruf/titik)
    const handleCurrencyChange = (field, value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setData(field, numericValue ? parseInt(numericValue, 10) : 0);
    };

    // Handler untuk Tombol Jalan Pintas (Quick Add)
    const addAmount = (field, amount) => {
        setData(field, (Number(data[field]) || 0) + amount);
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

        currentBalance = sisa;
        return rowData;
    });

    // Agregat Footer
    const totalCommitment = transaksis.reduce((acc, curr) => acc + parseFloat(curr.nominal_commitment || 0), 0);
    const totalActual = transaksis.reduce((acc, curr) => acc + parseFloat(curr.nominal_realisasi || 0), 0);

    // ===============================================
    // HANDLERS (FILTER, MODALS, DELETE)
    // ===============================================
    const handleFilterChange = (id) => {
        router.get(route('transaksi.index'), { anggaran_id: id }, { preserveState: true });
        setData('anggaran_id', id);
    };

    const openModal = () => {
        document.body.style.overflow = 'hidden';
        setIsModalOpen(true);
    };

    const closeModal = () => {
        document.body.style.overflow = 'unset';
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('transaksi.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const triggerDelete = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = () => {
        router.delete(route('transaksi.destroy', deleteModal.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ show: false, id: null })
        });
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, id: null });
    };

    // ===============================================
    // FUNGSI EXPORT KE EXCEL / SPREADSHEET (CSV)
    // ===============================================
    const handleExport = () => {
        if (!computedRows || computedRows.length === 0) {
            alert('Tidak ada data transaksi untuk di-export pada COA ini.');
            return;
        }

        // 1. Definisi Header Excel
        const headers = [
            'No',
            'Tanggal',
            'Keterangan',
            'Rincian (Item)',
            'Sisa Anggaran Awal (Rp)',
            'Commitment (Rp)',
            'Actual (Rp)',
            'Sisa Anggaran Akhir (Rp)'
        ];

        // 2. Mapping Data dari state ComputedRows
        const rows = computedRows.map((row, index) => [
            index + 1,
            row.tanggal,
            `"${row.keterangan}"`, // Kutip agar aman jika ada koma di kalimat
            `"${row.rincian || '-'}"`,
            row.anggaran_tampil,
            row.nominal_commitment,
            row.nominal_realisasi,
            row.sisa_anggaran
        ]);

        // Tambahkan baris Total di paling bawah
        rows.push([
            '', '', '"TOTAL AKUMULASI TRANSAKSI"', '', '',
            totalCommitment,
            totalActual,
            currentBalance
        ]);

        // 3. Gabungkan Header dan Baris CSV
        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        // 4. Proses Download
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Transaksi_Harian_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl md:text-2xl text-slate-800 dark:text-white uppercase tracking-tighter">Monitoring Transaksi</h2>}
        >
            <Head title="Transaksi Harian" />

            <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* --- STATS & FILTERS (TOP CARDS) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Filter Card */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-900/80 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center space-x-4 md:space-x-5 transition-all hover:shadow-md">
                        <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        </div>
                        <div className="flex-1 w-full overflow-hidden">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Program Anggaran</label>
                            <select
                                value={selectedId}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-4 py-2.5 font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs md:text-sm transition-all truncate"
                            >
                                {anggarans.map((ang) => (
                                    <option key={ang.id} value={ang.id}>{ang.kode_coa} - {ang.nama_item}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sisa Saldo Card */}
                    <div className={`p-5 md:p-6 rounded-3xl shadow-sm border transition-all flex items-center space-x-4 md:space-x-5 hover:shadow-md ${
                        currentBalance < 0
                        ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-500/20'
                        : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-500/20'
                    }`}>
                        <div className={`p-3 md:p-4 rounded-2xl ${
                            currentBalance < 0
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        }`}>
                            {currentBalance < 0 ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </div>
                        <div>
                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${
                                currentBalance < 0 ? 'text-rose-500' : 'text-emerald-500'
                            }`}>
                                {currentBalance < 0 ? 'Overbudget' : 'Sisa Dana Aman'}
                            </label>
                            <span className={`text-xl md:text-2xl font-black tabular-nums tracking-tight ${
                                currentBalance < 0 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                            }`}>
                                {formatRp(currentBalance)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- DATA TABLE --- */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left whitespace-nowrap">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="py-4 px-5 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Tanggal</th>
                                    <th className="py-4 px-5 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Keterangan</th>
                                    <th className="py-4 px-5 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] text-center">Rincian</th>
                                    <th className="py-4 px-5 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] text-right">Anggaran</th>
                                    <th className="py-4 px-5 font-black text-amber-500 uppercase tracking-widest text-[10px] text-right bg-amber-50/30 dark:bg-amber-900/10">Commitment</th>
                                    <th className="py-4 px-5 font-black text-blue-500 uppercase tracking-widest text-[10px] text-right bg-blue-50/30 dark:bg-blue-900/10">Actual</th>
                                    <th className="py-4 px-5 font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[10px] text-right bg-slate-100/50 dark:bg-slate-800/80">Sisa Anggaran</th>
                                    <th className="py-4 px-5 font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] text-center w-16">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {computedRows.length > 0 ? computedRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                                        <td className="py-4 px-5 font-bold text-slate-700 dark:text-slate-300">
                                            {new Date(row.tanggal).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}
                                        </td>
                                        <td className="py-4 px-5 text-slate-600 dark:text-slate-400 whitespace-normal min-w-[200px]">
                                            {row.keterangan}
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-3 rounded-md font-bold text-[10px] uppercase tracking-wider">
                                                {row.rincian || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-right font-medium text-slate-500 tabular-nums">
                                            {formatRp(row.anggaran_tampil)}
                                        </td>
                                        <td className="py-4 px-5 text-right font-bold text-amber-600 dark:text-amber-500 tabular-nums bg-amber-50/10 dark:bg-amber-900/5">
                                            {row.nominal_commitment > 0 ? formatRp(row.nominal_commitment) : '-'}
                                        </td>
                                        <td className="py-4 px-5 text-right font-bold text-blue-600 dark:text-blue-400 tabular-nums bg-blue-50/10 dark:bg-blue-900/5">
                                            {row.nominal_realisasi > 0 ? formatRp(row.nominal_realisasi) : '-'}
                                        </td>
                                        <td className={`py-4 px-5 text-right font-black tabular-nums ${
                                            row.sisa_anggaran < 0
                                            ? 'text-rose-600 bg-rose-50/50 dark:bg-rose-900/10 dark:text-rose-400'
                                            : 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10 dark:text-emerald-400'
                                        }`}>
                                            {formatRp(row.sisa_anggaran)}
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            {/* UPDATE: Menggunakan Pop-up Custom Delete */}
                                            <button
                                                onClick={() => triggerDelete(row.id)}
                                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                                                title="Hapus Transaksi"
                                            >
                                                <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium italic">
                                            Belum ada transaksi di program ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-900 dark:bg-slate-950 text-white font-black text-xs border-t-4 border-blue-500">
                                <tr>
                                    <td colSpan="4" className="py-5 px-6 tracking-widest uppercase text-right">TOTAL AKUMULASI</td>
                                    <td className="py-5 px-5 text-right text-amber-400 tabular-nums">{formatRp(totalCommitment)}</td>
                                    <td className="py-5 px-5 text-right text-blue-400 tabular-nums">{formatRp(totalActual)}</td>
                                    <td className={`py-5 px-5 text-right tabular-nums bg-white/5 ${currentBalance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {formatRp(currentBalance)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* TOMBOL ACTION BAWAH (EXPORT & TAMBAH) */}
                <div className="flex flex-col sm:flex-row justify-end pt-2 gap-3">
                    <button onClick={handleExport} className="px-6 py-4 md:px-8 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all active:scale-95 flex items-center justify-center tracking-widest text-xs border border-emerald-500/50 uppercase">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Export Excel
                    </button>

                    <button onClick={openModal} className="px-6 py-4 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-[0_10px_25px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center justify-center tracking-widest text-xs border border-blue-500/50 uppercase">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Tulis Transaksi Baru
                    </button>
                </div>
            </div>

            {/* =========================================================
                MODAL INPUT REALISASI (DESAIN PERSEGI PANJANG - MELEBAR)
            ========================================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
                        <div className="fixed inset-0" onClick={closeModal}></div>

                        <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/80 text-left align-middle transition-all">
                            <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-emerald-400"></div>

                            <div className="px-6 md:px-8 py-5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-10">
                                <div>
                                    <h3 className="font-black text-lg md:text-xl text-slate-800 dark:text-white tracking-tighter uppercase">Entry Data Cepat</h3>
                                    <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-0.5">Sistem Anggaran Realisasi</p>
                                </div>
                                <button onClick={closeModal} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 rounded-full transition-colors text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500">
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/50 relative z-10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Tanggal</label>
                                                <input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} className="w-full bg-white dark:bg-slate-800 border-none shadow-sm rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 dark:text-white transition-all cursor-pointer text-sm" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Rincian Item</label>
                                                <input type="text" value={data.rincian} onChange={e => setData('rincian', e.target.value)} placeholder="Misal: BBM" className="w-full bg-white dark:bg-slate-800 border-none shadow-sm rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 dark:text-white transition-all text-sm" required />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Keterangan Pengeluaran</label>
                                            <textarea rows="5" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} placeholder="Tuliskan deskripsi pengeluaran secara jelas..." className="w-full bg-white dark:bg-slate-800 border-none shadow-sm rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 dark:text-white transition-all resize-none text-sm leading-relaxed" required />
                                        </div>
                                    </div>

                                    <div className="space-y-5 flex flex-col justify-between">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="group bg-amber-50/50 dark:bg-amber-900/10 p-3.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                                                <label className="block text-[10px] font-black uppercase text-amber-500 tracking-widest mb-2">Commitment</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={data.nominal_commitment === 0 ? '' : formatNumberOnly(data.nominal_commitment)}
                                                        onChange={e => handleCurrencyChange('nominal_commitment', e.target.value)}
                                                        placeholder="0"
                                                        className="w-full bg-white dark:bg-slate-800 border-none shadow-sm rounded-lg pl-9 pr-3 py-2.5 font-black focus:ring-2 focus:ring-amber-500 text-amber-600 dark:text-amber-500 transition-all text-sm tracking-tight"
                                                    />
                                                </div>
                                                <div className="flex gap-1.5 mt-2">
                                                    <button type="button" onClick={() => addAmount('nominal_commitment', 1000000)} className="flex-1 text-[9px] font-bold text-slate-500 bg-white dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-600 py-1.5 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">+1Jt</button>
                                                    <button type="button" onClick={() => addAmount('nominal_commitment', 5000000)} className="flex-1 text-[9px] font-bold text-slate-500 bg-white dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-600 py-1.5 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">+5Jt</button>
                                                    <button type="button" onClick={() => setData('nominal_commitment', 0)} className="flex-1 text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 py-1.5 rounded-md transition-colors">Reset</button>
                                                </div>
                                            </div>

                                            <div className="group bg-blue-50/50 dark:bg-blue-900/10 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                                <label className="block text-[10px] font-black uppercase text-blue-500 tracking-widest mb-2">Actual</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={data.nominal_realisasi === 0 ? '' : formatNumberOnly(data.nominal_realisasi)}
                                                        onChange={e => handleCurrencyChange('nominal_realisasi', e.target.value)}
                                                        placeholder="0"
                                                        className="w-full bg-white dark:bg-slate-800 border-none shadow-sm rounded-lg pl-9 pr-3 py-2.5 font-black focus:ring-2 focus:ring-blue-500 text-blue-600 dark:text-blue-400 transition-all text-sm tracking-tight"
                                                    />
                                                </div>
                                                <div className="flex gap-1.5 mt-2">
                                                    <button type="button" onClick={() => addAmount('nominal_realisasi', 1000000)} className="flex-1 text-[9px] font-bold text-slate-500 bg-white dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-600 py-1.5 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">+1Jt</button>
                                                    <button type="button" onClick={() => addAmount('nominal_realisasi', 5000000)} className="flex-1 text-[9px] font-bold text-slate-500 bg-white dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-600 py-1.5 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">+5Jt</button>
                                                    <button type="button" onClick={() => setData('nominal_realisasi', 0)} className="flex-1 text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 py-1.5 rounded-md transition-colors">Reset</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-xl border transition-colors ${
                                            currentBalance - data.nominal_commitment - data.nominal_realisasi < 0
                                            ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-500/30'
                                            : 'bg-slate-900 border-slate-800 dark:bg-slate-950'
                                        }`}>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                    currentBalance - data.nominal_commitment - data.nominal_realisasi < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
                                                }`}>
                                                    Sisa Saldo:
                                                </span>
                                                <span className={`text-lg md:text-xl font-black tabular-nums ${
                                                    currentBalance - data.nominal_commitment - data.nominal_realisasi < 0
                                                    ? 'text-rose-600 dark:text-rose-400'
                                                    : 'text-emerald-400'
                                                }`}>
                                                    {formatRp(currentBalance - data.nominal_commitment - data.nominal_realisasi)}
                                                </span>
                                            </div>
                                        </div>

                                        <button type="submit" disabled={processing} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 uppercase tracking-widest text-xs flex justify-center items-center">
                                            {processing ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : 'Posting Realisasi'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* =======================================================
                POPUP KONFIRMASI HAPUS DATA (CUSTOM MODAL)
            ======================================================= */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-500/20 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="font-black text-2xl text-slate-800 dark:text-white uppercase tracking-tighter">Konfirmasi Hapus</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Apakah Anda yakin ingin menghapus data transaksi ini?
                            </p>
                            <p className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-500/10 p-2.5 rounded-lg mt-2">
                                Saldo akan otomatis dikembalikan (direkalkulasi) dan data tidak dapat dipulihkan!
                            </p>

                            <div className="flex space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                                <button onClick={cancelDelete} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-2xl transition-all text-xs uppercase tracking-widest">
                                    Batal
                                </button>
                                <button onClick={confirmDelete} className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-rose-500/30">
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
