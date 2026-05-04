import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">

            {/* --- SIDEBAR AREA --- */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out shadow-2xl border-r border-white/5
                ${isSidebarOpen ? 'w-72' : 'w-20'}`}
            >
                {/* Logo & Branding */}
                <div className="h-20 flex items-center px-6 bg-slate-950/50 border-b border-white/5 overflow-hidden">
                    <img src="/pelindo.png" alt="Logo" className="h-8 w-auto min-w-[32px] brightness-0 invert" />
                    <span className={`ml-4 font-black text-xl tracking-tighter text-white transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        SANGGARA
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-2 mt-4">
                    <SidebarLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                        icon="dashboard"
                        label="Dashboard Utama"
                        isOpen={isSidebarOpen}
                    />

                    <div className={`pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ${!isSidebarOpen && 'hidden'}`}>
                        Manajemen Anggaran
                    </div>

                    <SidebarLink
                        href={route('transaksi.index')}
                        active={route().current('transaksi.index')}
                        icon="table"
                        label="Transaksi Cau-cau"
                        isOpen={isSidebarOpen}
                    />

                    <SidebarLink
                        href={route('transaksi.export')}
                        active={route().current('transaksi.export')}
                        icon="report"
                        label="Laporan & Ekspor"
                        isOpen={isSidebarOpen}
                    />
                </nav>

                {/* Footer Sidebar / User Info */}
                <div className="absolute bottom-0 w-full p-4 bg-slate-950/30 border-t border-white/5">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
                            {user.name.charAt(0)}
                        </div>
                        <div className={`ml-3 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <Link href={route('logout')} method="post" as="button" className="text-xs text-red-400 hover:text-red-300">
                                Sign Out
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 z-40">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </button>
                        {header && <div className="ml-6">{header}</div>}
                    </div>
                </header>

                {/* Main Content Viewport */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

// Komponen Kecil untuk Navigasi Sidebar
function SidebarLink({ href, active, icon, label, isOpen }) {
    const icons = {
        dashboard: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>,
        table: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        report: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    };

    return (
        <Link
            href={href}
            className={`flex items-center p-3 rounded-xl transition-all duration-200 group
            ${active
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'hover:bg-white/5 hover:text-white'}`}
        >
            <div className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                {icons[icon]}
            </div>
            <span className={`ml-4 font-medium transition-all duration-300 ${isOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'}`}>
                {label}
            </span>
        </Link>
    );
}
