import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function MasterAnggaran({ auth, dataAnggaran }) {
    // Helper Format Rupiah & Desimal
    const formatNumber = (angka) => new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(angka || 0);

    // ===============================================
    // STATE & INERTIA FORM UNTUK MODAL INPUT COA
    // ===============================================
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        kode_coa: '',
        nama_item: '',
        original_budget: '',
        unreleased_persen: '30', // Default awal sesuai standar Pelindo
    });

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const submitForm = (e) => {
        e.preventDefault();
        post(route('master-anggaran.store'), {
            onSuccess: () => closeModal(),
        });
    };

    // ===============================================
    // FUNGSI HAPUS DATA
    // ===============================================
    const handleDelete = (id, name) => {
        if (confirm(`⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus COA "${name}"? Seluruh data transaksi terkait COA ini akan ikut terhapus secara permanen.`)) {
            router.delete(route('master-anggaran.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const renderBadge = (status) => {
        let colorClass = '';
        if (status === 'Over') colorClass = 'bg-red-500 text-white shadow-red-500/30';
        else if (status === 'Warn') colorClass = 'bg-amber-500 text-white shadow-amber-500/30';
        else if (status === 'Safe') colorClass = 'bg-emerald-500 text-white shadow-emerald-500/30';
        else colorClass = 'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-300';

        return <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm ${colorClass}`}>{status}</span>;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                    <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Consolidated Master Sheet</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest hidden md:block">Real-time Budget Monitoring SANGGARA</p>
                </div>
            }
        >
            <Head title="Master Anggaran" />

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                {/* TOP BAR / INFO */}
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm p-4 flex justify-between items-center backdrop-blur-sm">
                    <div className="flex items-start space-x-3">
                        <div className="mt-1 relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Database Terkoneksi (Live)</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Kelola data COA Master dan Pagu Original Pelindo.</p>
                        </div>
                    </div>
                    <button
                        onClick={openModal}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all text-sm flex items-center group"
                    >
                        <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Setup COA Baru
                    </button>
                </div>

                {/* TABEL DATA MASTER */}
                <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-xs text-left border-collapse min-w-[1900px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-center">
                                <tr>
                                    <th colSpan="3" className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800">Funds Center / Item</th>
                                    <th colSpan="4" className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">Struktur Pagu Anggaran</th>
                                    <th colSpan="3" className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">Realisasi Harian</th>
                                    <th colSpan="3" className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300">Analisis Consumable Budget</th>
                                    <th colSpan="3" className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">Analisis 100% (Original)</th>
                                    <th rowSpan="2" className="border border-slate-300 dark:border-slate-700 py-3 px-3 font-black bg-slate-100 dark:bg-slate-800 w-20">Aksi</th>
                                </tr>
                                <tr>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-10">No.</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[120px]">Kode COA</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[180px]">Nama Item</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[130px]">Original Budget</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[100px]">Unreleased (%)</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[130px]">Unreleased (Rp)</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[130px] bg-blue-100/50 dark:bg-blue-900/30">Consumable Budget</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[120px]">Commitment</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[120px]">Actual</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[130px]">Total Realisasi</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[130px] bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-300">SISA Anggaran</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-20">% Terpakai</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-20">Status</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[130px] bg-purple-100/50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-300">SISA 100%</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-20">% 100%</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-20">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 align-middle">
                                {dataAnggaran && dataAnggaran.length > 0 ? (
                                    dataAnggaran.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center text-slate-500 dark:text-slate-400 font-bold">{String(row.no).padStart(2, '0')}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-semibold text-slate-600 dark:text-slate-300">{row.kodeCoa}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold text-slate-800 dark:text-slate-100">{row.itemName}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">{formatNumber(row.originalBudget)}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-center text-slate-700 dark:text-slate-300 font-bold">{row.unreleasedPersen}%</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right text-slate-500 dark:text-slate-400">{formatNumber(row.unreleasedRp)}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-black text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-900/10">{formatNumber(row.consumableBudget)}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-medium text-amber-600 dark:text-amber-400">{formatNumber(row.commitment)}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-medium text-rose-600 dark:text-rose-400">{formatNumber(row.actual)}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-bold text-slate-800 dark:text-slate-200">{formatNumber(row.realisasiTotal)}</td>
                                            <td className={`border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-black bg-emerald-50/20 dark:bg-emerald-900/10 ${row.sisaConsumable < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                {row.sisaConsumable < 0 ? `(${formatNumber(Math.abs(row.sisaConsumable))})` : formatNumber(row.sisaConsumable)}
                                            </td>
                                            <td className={`border border-slate-300 dark:border-slate-700 py-2 px-2 text-center font-bold ${row.persenConsumable > 100 ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>{row.persenConsumable}%</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center">{renderBadge(row.statusConsumable)}</td>
                                            <td className={`border border-slate-300 dark:border-slate-700 py-2 px-3 text-right font-black bg-purple-50/20 dark:bg-purple-900/10 ${row.sisa100 < 0 ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}`}>
                                                {row.sisa100 < 0 ? `(${formatNumber(Math.abs(row.sisa100))})` : formatNumber(row.sisa100)}
                                            </td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center font-bold text-slate-700 dark:text-slate-300">{row.persen100}%</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center">{renderBadge(row.status100)}</td>

                                            <td className="border border-slate-300 dark:border-slate-700 py-2 px-2 text-center">
                                                <button
                                                    onClick={() => handleDelete(row.id, row.itemName)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                    title="Hapus COA Master"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="17" className="text-center py-10 text-slate-500 font-medium text-sm italic">Belum ada data Master Anggaran tersimpan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* POPUP MODAL INPUT COA MASTER */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">Setup Master COA Baru</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Kode COA <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Contoh: 5020100000"
                                    value={data.kode_coa}
                                    onChange={e => setData('kode_coa', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                    required
                                />
                                {errors.kode_coa && <p className="text-red-500 text-xs mt-1 font-medium">{errors.kode_coa}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Nama Item / Keterangan <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Exp Bhn Bakar"
                                    value={data.nama_item}
                                    onChange={e => setData('nama_item', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Original Budget (Rp) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Pagu 100%"
                                        value={data.original_budget}
                                        onChange={e => setData('original_budget', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Unreleased (%)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={data.unreleased_persen}
                                            onChange={e => setData('unreleased_persen', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white pr-8 font-bold"
                                        />
                                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
                                    </div>
                                    <div className="flex space-x-1.5 mt-2">
                                        <button type="button" onClick={() => setData('unreleased_persen', '30')} className="text-[9px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20 font-black hover:bg-yellow-500 hover:text-white transition-all uppercase">Kunci 30%</button>
                                        <button type="button" onClick={() => setData('unreleased_persen', '50')} className="text-[9px] bg-amber-700/10 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-md border border-amber-700/20 font-black hover:bg-amber-700 hover:text-white transition-all uppercase">Kunci 50%</button>
                                        <button type="button" onClick={() => setData('unreleased_persen', '0')} className="text-[9px] bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-1 rounded-md border border-slate-200 dark:border-white/10 font-black hover:bg-slate-500 hover:text-white transition-all uppercase">Free 0%</button>
                                    </div>
                                </div>
                            </div>

                            {data.original_budget && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4 mt-2 shadow-inner transition-all">
                                    <p className="text-[10px] text-blue-800 dark:text-blue-300 font-black uppercase tracking-widest mb-3 border-b border-blue-200 dark:border-blue-800 pb-1">Review Kalkulasi:</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                                            <span>Dana Ditahan ({data.unreleased_persen || 0}%):</span>
                                            <span className="font-bold text-red-500">- {formatNumber((data.original_budget * (data.unreleased_persen || 0)) / 100)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-800 dark:text-white pt-2 border-t border-blue-200/50 dark:border-blue-800/50 items-center">
                                            <span className="font-black text-[10px] uppercase">Budget Release:</span>
                                            <span className="font-black text-emerald-600 text-base">{formatNumber(data.original_budget - ((data.original_budget * (data.unreleased_persen || 0)) / 100))}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={closeModal} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-2xl transition-all text-xs uppercase tracking-widest">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-blue-500/30">{processing ? 'Proses...' : 'Daftarkan COA'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
