import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

/**
 * SANGGARA - Executive Dashboard
 * Designed for High-Level Monitoring
 */

export default function Dashboard({ auth, agregat, big_four }) {

    // Helper: Format angka ke Rupiah yang rapi
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

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

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* --- SECTION 1: AGGREGATOR CARDS (Fase 2 Flowchart) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card: Total Anggaran */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Anggaran Master</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{formatRupiah(agregat.total_anggaran)}</h3>
                        </div>
                    </div>

                    {/* Card: Realisasi (COA) */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Realisasi</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{formatRupiah(agregat.total_realisasi)}</h3>
                        </div>
                    </div>

                    {/* Alert Card: Status Budget */}
                    <div className={`p-8 rounded-3xl shadow-xl relative overflow-hidden transition-all duration-500 ${agregat.persentase > 80 ? 'bg-red-600 shadow-red-500/20' : 'bg-slate-900 dark:bg-blue-600 shadow-blue-500/20'}`}>
                        <div className="absolute right-0 top-0 p-4 opacity-20">
                            <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-black text-white/70 uppercase tracking-[0.2em] mb-2">Monitor Peringatan</p>
                            <h3 className="text-3xl font-black text-white mb-4">{agregat.status}</h3>
                            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-white h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    style={{ width: `${Math.min(agregat.persentase, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-white/80 text-sm mt-3 font-bold">Pemakaian: {agregat.persentase}% dari total pagu</p>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: PRIORITY CARD (THE BIG 4) --- */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
                    <header className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Priority Card: The Big 4</h3>
                            <p className="text-sm text-slate-500">Mata anggaran dengan prioritas monitoring tertinggi</p>
                        </div>
                        <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl text-xs font-bold text-slate-500">
                            Fase 2: Visualisasi
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {big_four.map((item) => (
                            <div key={item.id} className="group cursor-default">
                                <div className="flex justify-between items-end mb-3">
                                    <h4 className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{item.nama_item}</h4>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pagu Master</span>
                                </div>
                                <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group-hover:border-blue-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/5">
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{formatRupiah(item.total_anggaran)}</p>

                                    {/* Mini Progress Bar Decoration */}
                                    <div className="mt-4 flex items-center space-x-2">
                                        <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full w-1/3 opacity-50"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 tracking-tighter italic">No Data yet</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SECTION 3: QUICK ACTIONS / NAVIGATION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white flex items-center justify-between group cursor-pointer overflow-hidden relative">
                        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 group-hover:scale-125 transition-transform duration-700">
                            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-xl font-black mb-2">Manajemen COA</h4>
                            <p className="text-blue-100 text-sm max-w-xs">Mulai menginput realisasi harian dan lakukan auto-kalkulasi master.</p>
                            <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-50 transition-colors">
                                Ke Menu Transaksi
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer overflow-hidden relative border border-slate-200 dark:border-white/5">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Generate Report</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Ekspor seluruh data anggaran dan realisasi ke format Excel (XLSX).</p>
                            <button className="mt-6 px-6 py-3 bg-slate-800 dark:bg-blue-600 text-white font-bold rounded-xl text-xs hover:opacity-90 transition-opacity">
                                Download Laporan
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
