import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ auth, agregat, big_four }) {
    const [aiInsight, setAiInsight] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // --- STATE UNTUK INFO MODAL ---
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        description: '',
        formula: ''
    });

    const openInfo = (title, description, formula) => {
        setInfoModal({ isOpen: true, title, description, formula });
    };

    const closeInfo = () => {
        setInfoModal({ ...infoModal, isOpen: false });
    };
    // ------------------------------

    // Helper: Format angka ke Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka || 0);
    };

    // Fungsi Panggil AI
    const fetchAiAnalysis = async () => {
        setIsAiLoading(true);
        setAiInsight(null);
        try {
            const response = await axios.post(route('ai.analyze'), { agregat, big_four });
            if (response.data.success) {
                setAiInsight(response.data.insight);
            } else {
                setAiInsight("Gagal: " + response.data.message);
            }
        } catch (error) {
            const realError = error.response?.data?.message || error.message || "Terjadi kesalahan sistem.";
            setAiInsight(`System Error: ${realError}`);
        } finally {
            setIsAiLoading(false);
        }
    };

    // Data Mapping untuk Chart
    const chartData = big_four.map(item => ({
        name: item.nama_item.substring(0, 15) + '...',
        Anggaran: item.total_anggaran || 0,
        Terpakai: (item.total_commitment || 0) + (item.total_actual || 0),
        Sisa: item.total_anggaran - ((item.total_commitment || 0) + (item.total_actual || 0))
    }));

    // Data Agregat Aman
    const dataAgregat = {
        master: agregat.total_anggaran || 0,
        commitment: agregat.total_commitment || 0,
        actual: agregat.total_actual || agregat.total_realisasi || 0,
        sisa: (agregat.total_anggaran || 0) - ((agregat.total_commitment || 0) + (agregat.total_actual || agregat.total_realisasi || 0))
    };

    // Komponen Tombol Info (Reusable)
    const InfoButton = ({ onClick, className = "absolute top-4 right-4" }) => (
        <button
            onClick={onClick}
            className={`text-slate-300 hover:text-blue-500 dark:text-slate-600 dark:hover:text-blue-400 transition-colors z-20 ${className}`}
            title="Lihat Penjelasan & Rumus"
        >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col">
                    <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Executive Dashboard</h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Analisis Anggaran Real-Time SANGGARA</p>
                </div>
            }
        >
            <Head title="Executive Dashboard" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">

                {/* --- SECTION 1: 4 AGGREGATOR CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {/* Card 1: Master Budget */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
                        <InfoButton onClick={() => openInfo(
                            "Anggaran Master",
                            "Merupakan total pagu / plafon anggaran global yang dialokasikan untuk seluruh kegiatan selama satu tahun anggaran berjalan.",
                            "Σ (Seluruh Pagu COA)"
                        )} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">Anggaran Master</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white relative z-10">{formatRupiah(dataAgregat.master)}</h3>
                    </div>

                    {/* Card 2: Commitment */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
                        <InfoButton onClick={() => openInfo(
                            "Total Commitment",
                            "Dana yang sudah dialokasikan, dipesan, atau dibooking (contoh: Uang Muka, PO ke Vendor) namun pembayarannya belum terealisasi secara penuh/riil.",
                            "Σ (Transaksi berstatus Commitment)"
                        )} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">Total Commitment</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white relative z-10">{formatRupiah(dataAgregat.commitment)}</h3>
                    </div>

                    {/* Card 3: Actual */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
                        <InfoButton onClick={() => openInfo(
                            "Total Actual",
                            "Dana yang sudah benar-benar dibayarkan atau realisasi riil (Contoh: SP2D cair, Invoice Lunas). Ini menjadi beban pengeluaran tetap.",
                            "Σ (Transaksi berstatus Actual / Realisasi Riil)"
                        )} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">Total Actual</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white relative z-10">{formatRupiah(dataAgregat.actual)}</h3>
                    </div>

                    {/* Card 4: Sisa Anggaran */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
                        <InfoButton onClick={() => openInfo(
                            "Sisa Anggaran (Consumable)",
                            "Sisa dana yang masih tersedia dan aman untuk digunakan atau dianggarkan pada kegiatan selanjutnya.",
                            "Anggaran Master - (Total Commitment + Total Actual)"
                        )} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">Sisa Anggaran</p>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 relative z-10">{formatRupiah(dataAgregat.sisa)}</h3>
                    </div>
                </div>

                {/* --- SECTION 2: CHART & AI INSIGHT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Visualisasi Bar Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative">
                        <div className="flex items-center space-x-3 mb-6">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Visualisasi Serapan Anggaran</h3>
                            <InfoButton className="relative text-slate-400 hover:text-blue-500" onClick={() => openInfo(
                                "Visualisasi Serapan (Bar Chart)",
                                "Grafik ini membandingkan proporsi dana yang sudah terpakai (Commitment + Actual) melawan Sisa Anggaran pada setiap kategori The Big 4.",
                                "Merah = Terpakai | Hijau = Sisa Available"
                            )} />
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="name" tick={{fontSize: 10}} stroke="#64748b" />
                                    <YAxis tick={{fontSize: 10}} stroke="#64748b" tickFormatter={(value) => `Rp${value / 1000000}M`} />
                                    <Tooltip formatter={(value) => formatRupiah(value)} contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="Terpakai" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} name="Terpakai (Com+Act)" />
                                    <Bar dataKey="Sisa" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Sisa Anggaran" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="p-8 rounded-3xl shadow-xl relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-indigo-600 to-purple-800 shadow-purple-500/30 text-white flex flex-col justify-between">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11h-1.562l-1.071-2.143a.5.5 0 0 0-.895 0L14.402 11H13a1 1 0 0 0 0 2h1.402l1.07 2.143a.5.5 0 0 0 .896 0L17.438 13H19a1 1 0 0 0 0-2zm-6.236-4.59-1.928-3.856a1 1 0 0 0-1.788 0L7.118 6.41H5a1 1 0 0 0 0 2h2.118l1.93 3.856a1 1 0 0 0 1.788 0L12.764 8.41H15a1 1 0 0 0 0-2h-2.236zM5 15H3a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2H7v-2a1 1 0 0 0-2 0v2z"/></svg>
                        </div>
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-100"></span>
                                </span>
                                <p className="text-xs font-black text-white/80 uppercase tracking-[0.2em]">Sanggara AI Analyst</p>
                            </div>
                            {isAiLoading ? (
                                <div className="animate-pulse space-y-2 mt-4"><div className="h-4 bg-white/20 rounded w-full"></div><div className="h-4 bg-white/20 rounded w-5/6"></div></div>
                            ) : aiInsight ? (
                                <p className="text-sm font-medium leading-relaxed mt-2">"{aiInsight}"</p>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-black mb-1 leading-tight">Butuh Analisis Cepat?</h3>
                                    <p className="text-xs text-white/70">Klik tombol di bawah untuk meminta AI menganalisis data anggaran.</p>
                                </div>
                            )}
                        </div>
                        <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
                            <button onClick={fetchAiAnalysis} disabled={isAiLoading} className="w-full flex items-center justify-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all">
                                {isAiLoading ? 'Sedang Berpikir...' : 'Generate AI Insight'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: PRIORITY CARD (THE BIG 4) --- */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-10 shadow-sm relative">
                    <header className="flex items-center justify-between mb-10">
                        <div className="flex items-center space-x-3">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Priority Card: The Big 4</h3>
                                <p className="text-sm text-slate-500">Monitoring Sisa Anggaran (Available Budget)</p>
                            </div>
                            <InfoButton className="relative text-slate-400 hover:text-blue-500 mb-4" onClick={() => openInfo(
                                "Persentase Terpakai",
                                "Bar persentase menunjukkan rasio pemakaian (Commitment + Actual) terhadap Pagu Anggaran Master. Jika pemakaian melebihi batas toleransi (contoh: 80%), bar akan berubah menjadi merah.",
                                "(Terpakai / Pagu Anggaran Master) x 100%"
                            )} />
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {big_four.map((item) => {
                            const terpakai = (item.total_commitment || 0) + (item.total_actual || 0);
                            const persenTerpakai = item.total_anggaran > 0 ? (terpakai / item.total_anggaran) * 100 : 0;
                            const sisa = item.total_anggaran - terpakai;

                            return (
                                <div key={item.id} className="group cursor-default">
                                    <div className="flex justify-between items-end mb-3">
                                        <h4 className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 truncate max-w-[150px]" title={item.nama_item}>{item.nama_item}</h4>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Sisa</span>
                                    </div>
                                    <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group-hover:border-blue-500/30 transition-all">
                                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatRupiah(sisa)}</p>
                                        <div className="mt-4">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                                <span>Terpakai {persenTerpakai.toFixed(1)}%</span>
                                                <span>Pagu: {formatRupiah(item.total_anggaran)}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-1000 ${persenTerpakai > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${persenTerpakai}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- SECTION 4: QUICK ACTIONS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Link href={route('transaksi.index')} className="bg-blue-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-between group overflow-hidden relative min-h-[160px]">
                        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 group-hover:scale-125 transition-transform duration-700">
                            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-xl font-black mb-2">Input Transaksi (Ledger)</h4>
                            <p className="text-blue-100 text-sm max-w-xs">Mulai menginput Commitment atau Actual harian.</p>
                        </div>
                    </Link>
                    <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between group overflow-hidden relative border border-slate-200 dark:border-white/5 min-h-[160px]">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">Generate Report</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Ekspor seluruh data anggaran dan realisasi ke Excel.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- POP-UP MODAL INFORMASI & RUMUS --- */}
            {infoModal.isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                    onClick={closeInfo}
                >
                    <div
                        className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 relative"
                        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup jika isinya diklik
                    >
                        {/* Tombol Close silang */}
                        <button
                            onClick={closeInfo}
                            className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>

                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                            {infoModal.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {infoModal.description}
                        </p>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rumus Kalkulasi Sistem:</p>
                            <code className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {infoModal.formula}
                            </code>
                        </div>

                        <button
                            onClick={closeInfo}
                            className="w-full mt-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3 rounded-xl transition-colors text-sm"
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
