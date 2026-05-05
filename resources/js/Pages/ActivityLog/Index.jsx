import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, logs, filters }) {
    // 1. State untuk Filter (Ambil dari props 'filters' jika ada)
    const [filterType, setFilterType] = useState(filters?.type || 'all');
    const [filterDate, setFilterDate] = useState(filters?.date || '');

    // 2. Fungsi untuk mengeksekusi Filter
    const applyFilters = (type, date) => {
        router.get(
            route('activity-log.index'),
            { type: type, date: date },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    // Handler saat Dropdown / Tanggal berubah
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setFilterType(newType);
        applyFilters(newType, filterDate);
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setFilterDate(newDate);
        applyFilters(filterType, newDate);
    };

    // Fungsi Reset Filter
    const resetFilters = () => {
        setFilterType('all');
        setFilterDate('');
        router.get(route('activity-log.index'));
    };

    // Helper: Format Tanggal ke format Indonesia
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                    <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Log Aktivitas</h2>
                </div>
            }
        >
            <Head title="Log Aktivitas" />

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 relative max-w-4xl mx-auto">

                {/* Header Action Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 text-center transition-colors">
                    <h3 className="font-black text-xl text-slate-800 dark:text-slate-100">Riwayat Aktivitas Sistem</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Merekam seluruh jejak aktivitas penambahan, perubahan, dan penghapusan data secara *real-time*.</p>
                </div>

                {/* --- BAGIAN BARU: FILTER BAR --- */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                    <div className="flex items-center space-x-2 w-full sm:w-auto text-slate-500 dark:text-slate-400 font-bold text-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        <span>Filter Log:</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        {/* Filter Tipe Aktivitas */}
                        <select
                            value={filterType}
                            onChange={handleTypeChange}
                            className="w-full sm:w-48 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors cursor-pointer"
                        >
                            <option value="all">Semua Aktivitas</option>
                            <option value="create">Penambahan Data Baru</option>
                            <option value="update">Perubahan Data</option>
                            <option value="delete">Penghapusan Data</option>
                        </select>

                        {/* Filter Tanggal */}
                        <input
                            type="date"
                            value={filterDate}
                            onChange={handleDateChange}
                            className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors cursor-pointer"
                        />

                        {/* Tombol Reset (Muncul jika ada filter aktif) */}
                        {(filterType !== 'all' || filterDate !== '') && (
                            <button
                                onClick={resetFilters}
                                className="w-full sm:w-auto px-4 py-2.5 text-sm font-bold text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 rounded-xl transition-colors whitespace-nowrap"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
                {/* --- END FILTER BAR --- */}

                {/* TIMELINE UI */}
                <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm rounded-[2rem] p-8 transition-colors">
                    {logs.data.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                                {(filterType !== 'all' || filterDate !== '') ? 'Tidak ada log yang sesuai filter' : 'Belum ada aktivitas'}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1">
                                {(filterType !== 'all' || filterDate !== '') ? 'Coba ubah atau reset filter Anda.' : 'Aktivitas sistem Anda akan muncul di sini.'}
                            </p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 md:ml-8 space-y-8">
                            {logs.data.map((log) => {
                                let icon, bgColor, borderColor, textColor;
                                const type = log.data.type || 'info';

                                if (type === 'create') {
                                    bgColor = 'bg-emerald-100 dark:bg-emerald-500/20'; borderColor = 'border-emerald-200 dark:border-emerald-500/30'; textColor = 'text-emerald-600 dark:text-emerald-400';
                                    icon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>;
                                } else if (type === 'delete') {
                                    bgColor = 'bg-red-100 dark:bg-red-500/20'; borderColor = 'border-red-200 dark:border-red-500/30'; textColor = 'text-red-600 dark:text-red-400';
                                    icon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
                                } else if (type === 'update') {
                                    bgColor = 'bg-amber-100 dark:bg-amber-500/20'; borderColor = 'border-amber-200 dark:border-amber-500/30'; textColor = 'text-amber-600 dark:text-amber-400';
                                    icon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
                                } else {
                                    bgColor = 'bg-blue-100 dark:bg-blue-500/20'; borderColor = 'border-blue-200 dark:border-blue-500/30'; textColor = 'text-blue-600 dark:text-blue-400';
                                    icon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
                                }

                                return (
                                    <div key={log.id} className="relative pl-8 md:pl-12 group">
                                        <div className={`absolute -left-[1.3rem] md:-left-[1.3rem] top-1 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${bgColor} ${textColor}`}>
                                            {icon}
                                        </div>

                                        <div className={`p-5 rounded-2xl border transition-all ${log.read_at ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-500/30 shadow-md shadow-blue-500/5'}`}>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    {!log.read_at && (
                                                        <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-full mb-2 border border-blue-200 dark:border-blue-500/30">Baru</span>
                                                    )}
                                                    <p className="text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                                                        {log.data.message}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-xs font-black uppercase tracking-wider text-slate-400 whitespace-nowrap mt-2 sm:mt-0">
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {formatDateTime(log.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {logs.links && logs.links.length > 3 && (
                        <div className="mt-10 flex flex-wrap justify-center gap-2">
                            {logs.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    preserveState
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                        link.active
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : !link.url
                                            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
                                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
