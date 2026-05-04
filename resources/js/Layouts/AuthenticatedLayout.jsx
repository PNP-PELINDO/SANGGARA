import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    // Tarik properti global auth (termasuk notifikasi) dari Inertia
    const { auth } = usePage().props;
    const notifications = auth.notifications || [];

    // Default open on desktop, hidden on mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

    // Calendar & Notification States
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false); // State untuk Dropdown Notif

    // Fungsi Tandai Notif Dibaca
    const markAsRead = () => {
        if (notifications.length > 0) {
            router.post(route('notifications.read'), {}, { preserveScroll: true });
        }
    };

    // ==========================================
    // DARK MODE FIRST LOGIC
    // ==========================================
    // Inisialisasi state langsung dengan mengecek localStorage atau set default 'dark'
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('sanggara_theme');
            return storedTheme ? storedTheme : 'dark'; // Paksa 'dark' jika belum ada data
        }
        return 'dark';
    });

    // Terapkan class 'dark' ke <html> setiap kali state theme berubah
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('sanggara_theme', theme);
    }, [theme]);

    // Fungsi sederhana untuk Toggle Theme
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    // ==========================================

    // Auto-collapse sidebar on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Real-time Clock Update
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Formatters untuk Kalender
    const formatDate = (date) => new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    const formatTime = (date) => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex font-sans selection:bg-blue-500 selection:text-white overflow-hidden transition-colors duration-500">

            {/* --- SIDEBAR BACKDROP (Khusus Mobile) --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- RUANG KOSONG UNTUK MENDORONG KONTEN (Khusus Desktop) --- */}
            <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[280px]' : 'w-0'}`}></div>

            {/* --- SIDEBAR AREA --- */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0A101F] flex flex-col transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.8)] border-r border-white/5
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* 1. Header Branding */}
                <div className="h-24 flex-shrink-0 flex items-center justify-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Link href={route('dashboard')} className="flex flex-col items-center w-full relative z-10 transition-transform hover:scale-105">
                        <span className="font-black text-4xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                            SANGGARA
                        </span>
                        <div className="h-[3px] w-16 bg-blue-500 mt-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                    </Link>
                </div>

                {/* 2. Navigation Scroll Area */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-5 space-y-8 custom-scrollbar">
                    {/* Group: Core System */}
                    <div>
                        <SidebarGroupHeader label="Sistem Utama" />
                        <div className="space-y-2 mt-3">
                            <SidebarLink href={route('dashboard')} active={route().current('dashboard')} icon="dashboard" label="Dashboard" />
                            <SidebarLink href={route('master-anggaran.index')} active={route().current('master-anggaran.*')} icon="database" label="Master Anggaran" />
                            <SidebarLink href={route('transaksi.index')} active={route().current('transaksi.*')} icon="input" label="Input Transaksi" badge="Aktif" />
                        </div>
                    </div>

                    {/* Group: Data & Log */}
                    <div>
                        <SidebarGroupHeader label="Data & Aktivitas" />
                        <div className="space-y-2 mt-3">
                            <SidebarLink href={route('users.index')} active={route().current('users.*')} icon="users" label="Kelola User" />
                            <SidebarLink href="#" active={false} icon="log" label="Log Aktivitas" />
                        </div>
                    </div>
                </nav>

                {/* 3. Footer Settings & User */}
                <div className="flex-shrink-0 p-5 bg-black/30 border-t border-white/5">
                    <SidebarLink href={route('profile.edit')} active={route().current('profile.edit')} icon="settings" label="Pengaturan Sistem" className="mb-6" />

                    <div className="flex items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center font-black text-white shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                            {user.name.charAt(0)}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest truncate mt-0.5">Admin JM SDM</p>
                        </div>
                        <Link href={route('logout')} method="post" as="button" className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

                {/* Top Navbar */}
                <header className="h-24 flex-shrink-0 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 lg:px-10 z-30 transition-colors duration-500">

                    {/* Left: Togle Button & Page Header */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-white/10 mr-6 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all focus:outline-none"
                            title="Tampilkan/Sembunyikan Sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </button>

                        {header && <div className="hidden sm:block">{header}</div>}
                    </div>

                    {/* Right: Actions & Calendar */}
                    <div className="flex items-center space-x-3 lg:space-x-5">

                        {/* --- THEME TOGGLE BUTTON --- */}
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-amber-400 hover:text-blue-600 dark:hover:text-amber-300 transition-colors border border-slate-200 dark:border-white/10 shadow-sm"
                            title={`Beralih ke ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        >
                            {theme === 'light' ? (
                                // Icon Bulan (Mode Terang saat ini)
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            ) : (
                                // Icon Matahari (Mode Gelap saat ini)
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            )}
                        </button>

                        {/* WIDGET KALENDER */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                className="flex items-center space-x-3 p-2 lg:p-2.5 lg:pr-5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500/30 transition-all group shadow-sm"
                            >
                                <div className="w-10 h-10 bg-white dark:bg-slate-700/80 rounded-xl flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="hidden lg:flex flex-col text-left">
                                    <span className="text-sm font-black text-slate-800 dark:text-white leading-tight tracking-tight">{formatTime(currentTime)}</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{formatDate(currentTime).split(',')[0]}</span>
                                </div>
                            </button>

                            {/* POPUP KALENDER DETAIL */}
                            {isCalendarOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsCalendarOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-4 w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center relative overflow-hidden">
                                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                            <h4 className="text-6xl font-black mb-2 relative z-10">{currentTime.getDate()}</h4>
                                            <p className="text-sm font-bold text-blue-200 uppercase tracking-[0.2em] relative z-10">{currentTime.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900">
                                            <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{formatTime(currentTime)}</p>
                                            <p className="text-xs font-black text-slate-400 uppercase mt-3 tracking-widest">Waktu Indonesia Barat</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Notification Bell & Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="relative p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-slate-200 dark:border-white/10 shadow-sm"
                            >
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-slate-100 dark:border-slate-800"></span>
                                    </span>
                                )}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </button>

                            {/* Dropdown Panel */}
                            {isNotifOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                            <h4 className="font-black text-slate-800 dark:text-white">Notifikasi</h4>
                                            {notifications.length > 0 && (
                                                <button onClick={markAsRead} className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                                    Tandai Dibaca
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                                                    <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                                    <p className="text-sm font-medium">Belum ada notifikasi baru.</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {notifications.map((notif) => {
                                                        // Tentukan Ikon dan Warna berdasarkan "Type"
                                                        let icon, bgColor, textColor;
                                                        if (notif.data.type === 'create') {
                                                            bgColor = 'bg-emerald-100 dark:bg-emerald-500/20'; textColor = 'text-emerald-600 dark:text-emerald-400';
                                                            icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>;
                                                        } else if (notif.data.type === 'delete') {
                                                            bgColor = 'bg-red-100 dark:bg-red-500/20'; textColor = 'text-red-600 dark:text-red-400';
                                                            icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
                                                        } else if (notif.data.type === 'update') {
                                                            bgColor = 'bg-amber-100 dark:bg-amber-500/20'; textColor = 'text-amber-600 dark:text-amber-400';
                                                            icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
                                                        } else {
                                                            bgColor = 'bg-blue-100 dark:bg-blue-500/20'; textColor = 'text-blue-600 dark:text-blue-400';
                                                            icon = <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
                                                        }

                                                        return (
                                                            <div key={notif.id} className="p-4 flex items-start space-x-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor} ${textColor}`}>
                                                                    {icon}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{notif.data.message}</p>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Baru Saja</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </header>

                {/* Main Content Viewport */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10 relative bg-slate-50 dark:bg-[#0B1120] transition-colors duration-500">
                    {/* Decorative Background Blur */}
                    <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[40rem] h-[40rem] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] pointer-events-none transition-colors duration-500"></div>

                    <div className="relative z-10 w-full max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------
// KOMPONEN PENDUKUNG
// -----------------------------------------------------------------

function SidebarGroupHeader({ label }) {
    return (
        <div className="px-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500/80 mb-3">
            {label}
        </div>
    );
}

function SidebarLink({ href, active, icon, label, badge, className = '' }) {
    const icons = {
        dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>,
        database: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
        input: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
        sync: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
        log: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    };

    return (
        <Link
            href={href}
            className={`relative flex items-center p-4 rounded-2xl transition-all duration-300 group
            ${active
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${className}`}
        >
            <div className={`transition-transform duration-300 ${active ? 'scale-110 text-white' : 'group-hover:scale-110 group-hover:text-blue-400'}`}>
                {icons[icon]}
            </div>

            <span className="ml-4 font-bold text-sm whitespace-nowrap">
                {label}
            </span>

            {badge && (
                <span className="ml-auto px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/30">
                    {badge}
                </span>
            )}
        </Link>
    );
}
