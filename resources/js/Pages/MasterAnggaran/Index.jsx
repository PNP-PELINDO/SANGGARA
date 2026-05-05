import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function MasterAnggaran({ auth, dataAnggaran }) {
    // Format angka ke format Rupiah standar Indonesia
    const formatNumber = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);

    const renderBadge = (status) => {
        let colorClass = '';
        if (status === 'Over' || status === 'Red') colorClass = 'bg-red-500 text-white';
        else if (status === 'Warn') colorClass = 'bg-amber-500 text-white';
        else if (status === 'Safe') colorClass = 'bg-emerald-500 text-white';
        else colorClass = 'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-300';

        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase shadow-sm ${colorClass}`}>
                {status}
            </span>
        );
    };

    const isNegativeOrAlert = (val) => typeof val === 'number' && val < 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                    <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Consolidated Master Sheet</h2>
                </div>
            }
        >
            <Head title="Master Anggaran" />

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                {/* TOP BAR */}
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm p-4 flex flex-col md:flex-row justify-between items-center backdrop-blur-sm">
                    <div className="flex items-start space-x-3 mb-4 md:mb-0">
                        <div className="mt-1 relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Terhubung ke Database Lokal</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Live Data SANGGARA</p>
                        </div>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all text-sm group">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah COA Baru
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-center">
                                <tr>
                                    <th colSpan="3" className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold">Identity</th>
                                    <th colSpan="3" className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold">Pagu Anggaran</th>
                                    <th colSpan="3" className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold">Realisasi Riil</th>
                                    <th colSpan="2" className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold">Analisis 70%</th>
                                    <th colSpan="2" className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold">Analisis 100%</th>
                                    <th rowSpan="2" className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold bg-slate-50 dark:bg-slate-800/80 w-24">Aksi</th>
                                </tr>
                                <tr>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-10">No.</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[120px]">Item Name</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[150px]">Description</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[100px]">Total Pagu</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[100px]">Awal</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[100px]">Revisi</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[90px]">Hutang<br/>Vendor</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[100px]">Sisa<br/>Kontrak</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold min-w-[100px]">Uang<br/>Muka</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-16">%<br/>Terpakai</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-20">Status<br/>Alert</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-16">%<br/>Terpakai</th>
                                    <th className="border border-slate-300 dark:border-slate-700 py-2 px-2 font-bold w-20">Status<br/>Alert</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900">
                                {dataAnggaran && dataAnggaran.length > 0 ? (
                                    dataAnggaran.map((row, index) => (
                                        <tr key={row.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-2 text-center text-slate-500 dark:text-slate-400 font-medium">
                                                {String(row.no).padStart(2, '0')}
                                            </td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-3 font-bold text-slate-700 dark:text-slate-200">{row.itemName}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-3 text-slate-500 dark:text-slate-400">{row.description}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-3 text-right font-semibold text-slate-800 dark:text-slate-300">{formatNumber(row.totalPagu)}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-3 text-right text-slate-600 dark:text-slate-400">{formatNumber(row.awal)}</td>
                                            <td className={`border border-slate-300 dark:border-slate-700 py-1.5 px-3 text-right ${isNegativeOrAlert(row.revisi) ? 'bg-red-200/60 text-red-800' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {formatNumber(row.revisi)}
                                            </td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-3 text-right font-medium text-red-600 dark:text-red-400">
                                                {formatNumber(row.hutangVendor)}
                                            </td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-3 text-right text-slate-600 dark:text-slate-400">
                                                {formatNumber(row.sisaKontrak)}
                                            </td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-3 text-right font-medium text-amber-600 dark:text-amber-400">
                                                {formatNumber(row.uangMuka)}
                                            </td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-2 text-center font-bold text-slate-700 dark:text-slate-300">{row.terpakai70}%</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-2 text-center">{renderBadge(row.status70)}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-2 text-center font-bold text-slate-700 dark:text-slate-300">{row.terpakai100}%</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-2 text-center">{renderBadge(row.status100)}</td>
                                            <td className="border border-slate-300 dark:border-slate-700 py-1.5 px-2 text-center">
                                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold text-[10px] uppercase">Detail</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="14" className="text-center py-8 text-slate-500 font-medium">
                                            Belum ada data Master Anggaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
