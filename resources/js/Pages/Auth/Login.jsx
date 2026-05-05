import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

/**
 * SANGGARA - Premium Enterprise Login Portal
 * PT Pelindo Regional 2 Teluk Bayur
 */

export default function Login({ status, canResetPassword }) {
    const [isMounted, setIsMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // State untuk Animasi Welcome & Info Modal
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        setIsMounted(true);
        return () => reset('password');
    }, []);

    const submit = (e) => {
        e.preventDefault();

        // 1. Munculkan Animasi Welcome saat tombol diklik
        setShowWelcome(true);

        post(route('login'), {
            // 2. Jika gagal (password salah dll), tutup animasi agar user bisa coba lagi
            onFinish: () => setShowWelcome(false),
        });
    };

    return (
        <div className="h-screen w-full flex overflow-hidden bg-slate-900 font-sans selection:bg-blue-500 selection:text-white relative">
            <Head title="Portal Internal SANGGARA" />

            {/* --- INLINE STYLES UNTUK ANIMASI KHUSUS --- */}
            <style>{`
                @keyframes slideLoad {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-slide-load {
                    animation: slideLoad 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>

            {/* =========================================================
                WELCOME ANIMATION OVERLAY (MUNCUL SAAT LOGIN)
            ========================================================= */}
            <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${showWelcome ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                {/* Background Gelap dengan Blur Ekstrem */}
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"></div>

                {/* Konten Animasi */}
                <div className={`relative z-10 flex flex-col items-center transform transition-transform duration-1000 ${showWelcome ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>

                    {/* Ring Spinner & Logo */}
                    <div className="relative w-28 h-28 mb-8">
                        <div className="absolute inset-0 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-r-4 border-l-4 border-emerald-400 rounded-full animate-[spin_2s_linear_reverse]"></div>
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 rounded-full m-4 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                            <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                    </div>

                    {/* Teks Sambutan */}
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-4 drop-shadow-lg">
                        Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 animate-pulse">Back</span>
                    </h2>

                    <p className="text-blue-200/80 font-medium tracking-[0.3em] uppercase text-xs animate-pulse">
                        Authenticating Administrator Data...
                    </p>

                    {/* Cyberpunk Loading Bar */}
                    <div className="w-64 h-1 bg-slate-800 rounded-full mt-10 overflow-hidden relative shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-emerald-400 rounded-full animate-slide-load"></div>
                    </div>
                </div>
            </div>

            {/* --- BAGIAN KIRI: BRANDING & VISUAL --- */}
            <section className="relative hidden lg:flex lg:w-[60%] h-full overflow-hidden shadow-2xl z-10">
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-[15000ms] ease-linear ${isMounted ? 'scale-110' : 'scale-100'}`}
                    style={{ backgroundImage: "url('/login1.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-blue-900/40" />

                {/* PEMISAH LENGKUNG (CURVED DIVIDER) */}
                <div className="absolute inset-y-0 right-0 w-32 text-slate-900 z-20 translate-x-[1px] pointer-events-none">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
                        <path d="M0 0 C 100 30, 100 70, 0 100 L 100 100 L 100 0 Z" />
                    </svg>
                </div>

                <div className="relative z-10 w-full h-full flex flex-col justify-between p-20 pr-32">
                    <div className={`transition-all duration-1000 delay-100 ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                        <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-fit shadow-lg">
                            <img src="/pelindo.png" alt="Logo Pelindo" className="h-12 w-auto filter brightness-0 invert" />
                            <div className="h-10 w-[1px] bg-white/20"></div>
                            <div className="text-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-300">Regional 2</p>
                                <p className="text-sm font-semibold italic text-slate-200">Teluk Bayur</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-2xl">
                        <div className={`space-y-4 transition-all duration-1000 delay-300 ${isMounted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                            <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">Official Portal</span>
                                <div className="h-[2px] w-12 bg-blue-500/50"></div>
                            </div>
                            <h1 className="text-8xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
                                SANG<span className="text-blue-500">GARA</span>
                            </h1>
                            <h2 className="text-3xl font-light text-blue-100/80 tracking-wide mt-2">
                                Sistem Anggaran & Realisasi Terintegrasi
                            </h2>
                            <div className="mt-8 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full"></div>
                                <p className="text-lg text-slate-300/90 leading-relaxed font-light italic pl-6">
                                    "Mengoptimalkan monitoring anggaran dengan akurasi data real-time demi efisiensi operasional pelabuhan."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`flex items-end justify-between transition-all duration-1000 delay-500 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="text-slate-400 text-[10px] tracking-widest font-bold uppercase">
                            Maintenance by IT Department &copy; {new Date().getFullYear()}
                        </div>
                        <div className="flex space-x-2 items-center">
                            <span className="text-xs text-slate-400 mr-2">Sistem Aktif</span>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            </section>

            {/* --- BAGIAN KANAN: AUTH FORM --- */}
            <section className="w-full lg:w-[40%] h-full flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-slate-900 relative z-20">
                <div className="lg:hidden absolute inset-0 bg-[url('/login1.jpg')] bg-cover bg-center opacity-10"></div>

                <div className={`w-full max-w-md relative z-10 transition-all duration-1000 delay-200 ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <div className="bg-slate-900/50 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-10 rounded-[2.5rem] border border-white/5 lg:border-none shadow-2xl lg:shadow-none">

                        <div className="lg:hidden mb-10 flex justify-center">
                            <img src="/pelindo.png" alt="Logo" className="h-10 w-auto brightness-0 invert" />
                        </div>

                        <header className="mb-10 flex items-start justify-between">
                            <div>
                                <h3 className="text-4xl font-black text-white mb-2 tracking-tight">Sign In</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="h-1 w-6 bg-blue-500 rounded-full"></div>
                                    <p className="text-slate-400 text-sm font-medium">Administrator Access Portal</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsInfoOpen(true)}
                                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-lg group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                title="Informasi Sistem"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </button>
                        </header>

                        {status && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold flex items-center animate-bounce">
                                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2 group">
                                <InputLabel htmlFor="email" value="Email Address" className="text-slate-300 text-xs uppercase tracking-widest font-bold ml-1" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-inner"
                                        autoComplete="username"
                                        isFocused={true}
                                        placeholder="nama@pelindo.co.id"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2 text-xs font-semibold text-red-400" />
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center ml-1">
                                    <InputLabel htmlFor="password" value="Password" className="text-slate-300 text-xs uppercase tracking-widest font-bold" />
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-[10px] text-blue-500 hover:text-blue-400 uppercase font-bold tracking-tighter transition-colors">
                                            Lupa Password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="block w-full pl-12 pr-12 py-4 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-inner"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.888-6.888m4.242-4.242L21 3" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2 text-xs font-semibold text-red-400" />
                            </div>

                            <div className="flex items-center pt-2">
                                <label className="flex items-center cursor-pointer group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 shadow-sm"
                                    />
                                    <span className="ms-3 text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors select-none">Ingat sesi login saya</span>
                                </label>
                            </div>

                            <div className="pt-6">
                                <PrimaryButton
                                    className="w-full h-14 flex justify-center items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0_10px_25px_rgba(37,99,235,0.3)] transform transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:transform-none border border-blue-500/50"
                                    disabled={processing}
                                >
                                    MASUK SEKARANG
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* =========================================================
                POP-UP (MODAL) INFORMASI SISTEM SANGGARA
            ========================================================= */}
            {isInfoOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
                        onClick={() => setIsInfoOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-lg bg-slate-900/90 backdrop-blur-2xl border border-slate-700 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400"></div>

                        <div className="p-8 sm:p-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white">Info Sistem</h4>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest">SANGGARA V2.0</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsInfoOpen(false)}
                                    className="p-2 bg-slate-800 rounded-full text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
                                <p>
                                    <strong className="text-white font-bold">Sistem Anggaran dan Realisasi (SANGGARA)</strong> adalah platform internal yang didesain khusus untuk mengelola master data anggaran operasional.
                                </p>

                                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                    <h5 className="text-blue-400 font-bold mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        Bantuan & Hak Akses
                                    </h5>
                                    <ul className="space-y-2 text-slate-400">
                                        <li className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            Jika Anda lupa kredensial login, harap menghubungi Divisi SDM / IT Support.
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            Sistem ini hanya dapat diakses oleh Administrator dengan role "Admin JM SDM".
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                                <button
                                    onClick={() => setIsInfoOpen(false)}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                >
                                    Tutup Pesan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
