import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

/**
 * SANGGARA - Professional Login Portal
 * PT Pelindo Regional 2 Teluk Bayur
 */

export default function Login({ status, canResetPassword }) {
    const [isMounted, setIsMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        post(route('login'));
    };

    return (
        <div className="h-screen w-full flex overflow-hidden bg-slate-950 font-sans selection:bg-blue-500 selection:text-white">
            <Head title="Portal Internal SANGGARA" />

            {/* --- BAGIAN KIRI: BRANDING & VISUAL --- */}
            <section className="relative hidden lg:flex lg:w-3/5 h-full overflow-hidden shadow-2xl">
                {/* Background Image dengan Zoom Effect */}
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${isMounted ? 'scale-110' : 'scale-100'}`}
                    style={{ backgroundImage: "url('/login1.jpg')" }}
                />

                {/* Overlay Gradien Ganda (Lebih Gelap untuk Kontras) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-blue-900/40" />

                {/* Konten Internal Panel Kiri */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-20">
                    {/* Top Section: Logo */}
                    <div className={`transition-all duration-1000 delay-100 ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-fit">
                            <img src="/pelindo.png" alt="Logo Pelindo" className="h-12 w-auto filter brightness-0 invert" />
                            <div className="h-10 w-[1px] bg-white/30"></div>
                            <div className="text-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-300">Regional 2</p>
                                <p className="text-sm font-semibold italic">Teluk Bayur</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Main Titles */}
                    <div className="max-w-2xl">
                        <div className={`space-y-4 transition-all duration-1000 delay-300 ${isMounted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                            <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/50">Official Portal</span>
                                <div className="h-[2px] w-12 bg-blue-500/50"></div>
                            </div>
                            <h1 className="text-8xl font-black text-white leading-none tracking-tighter">
                                SANG<span className="text-blue-500">GARA</span>
                            </h1>
                            <h2 className="text-3xl font-light text-blue-100/80 tracking-wide">
                                Sistem Anggaran & Realisasi Terintegrasi
                            </h2>
                            <p className="text-lg text-slate-300/90 leading-relaxed font-light mt-6 italic border-l-2 border-blue-500 pl-6">
                                "Mengoptimalkan monitoring anggaran dengan akurasi data real-time demi efisiensi operasional."
                            </p>
                        </div>
                    </div>

                    {/* Bottom Section: Footer Info */}
                    <div className={`flex items-end justify-between transition-all duration-1000 delay-500 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="text-slate-400 text-xs tracking-widest font-medium uppercase">
                            Maintenance by IT Department &copy; {new Date().getFullYear()}
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
                        </div>
                    </div>
                </div>

                {/* Animated Light Beam */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            </section>

            {/* --- BAGIAN KANAN: AUTH FORM --- */}
            <section className="w-full lg:w-2/5 h-full flex items-center justify-center p-8 sm:p-16 bg-slate-900 lg:bg-slate-950 relative">
                {/* Background Decor (Only Mobile) */}
                <div className="lg:hidden absolute inset-0 bg-[url('/login1.jpg')] bg-cover bg-center opacity-20"></div>

                <div className={`w-full max-w-md relative z-10 transition-all duration-1000 delay-200 ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                    {/* Card Container */}
                    <div className="bg-slate-900/50 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-10 rounded-3xl border border-white/5 lg:border-none shadow-2xl lg:shadow-none">

                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-10 flex justify-center">
                            <img src="/pelindo.png" alt="Logo" className="h-10 w-auto brightness-0 invert" />
                        </div>

                        {/* Form Header */}
                        <header className="mb-12">
                            <h3 className="text-4xl font-bold text-white mb-3">Sign In</h3>
                            <div className="flex items-center space-x-2">
                                <div className="h-1 w-8 bg-blue-500 rounded-full"></div>
                                <p className="text-slate-400 text-sm font-medium">Administrator Access Portal</p>
                            </div>
                        </header>

                        {status && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-7">
                            {/* Email Input */}
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
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                                        autoComplete="username"
                                        isFocused={true}
                                        placeholder="nama@pelindo.co.id"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2 text-xs font-semibold text-red-400" />
                            </div>

                            {/* Password Input */}
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
                                        className="block w-full pl-12 pr-12 py-4 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
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

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                                />
                                <span className="ms-2 text-sm text-slate-400 font-medium select-none">Ingat sesi saya di perangkat ini</span>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <PrimaryButton
                                    className="w-full h-14 flex justify-center items-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-600/20 transform transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        "Akses Dashboard"
                                    )}
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* External Support Link */}
                        <div className="mt-12 text-center">
                            <p className="text-slate-500 text-xs">
                                Butuh bantuan akses? <a href="#" className="text-blue-500 hover:underline font-bold">Hubungi IT Support</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/**
 * CSS Animation (Paste di resources/css/app.css jika perlu custom)
 * @keyframes pulse {
 *   0%, 100% { opacity: 0.2; transform: scale(1); }
 *   50% { opacity: 0.3; transform: scale(1.05); }
 * }
 */
