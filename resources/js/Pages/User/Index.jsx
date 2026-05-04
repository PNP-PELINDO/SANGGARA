import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Index({ auth, users }) {

    // ==========================================
    // STATE UNTUK FORM MODAL (TAMBAH/EDIT)
    // ==========================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // ==========================================
    // STATE UNTUK CUSTOM CONFIRMATION POPUP
    // ==========================================
    const [confirmPopup, setConfirmPopup] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: null,
        type: 'primary'
    });

    // Setup Form Inertia
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    // Buka Modal Tambah
    const openAddModal = () => {
        setIsEditMode(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Buka Modal Edit
    const openEditModal = (user) => {
        setIsEditMode(true);
        setEditId(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const closeConfirm = () => {
        setConfirmPopup({ ...confirmPopup, isOpen: false });
    };

    // ==========================================
    // TRIGGER KONFIRMASI SIMPAN
    // ==========================================
    const triggerSubmit = (e) => {
        e.preventDefault();

        setConfirmPopup({
            isOpen: true,
            title: isEditMode ? 'Konfirmasi Perubahan' : 'Konfirmasi User Baru',
            message: isEditMode
                ? 'Apakah Anda yakin ingin menyimpan perubahan data untuk user ini?'
                : 'Apakah Anda yakin ingin menambahkan user baru ini ke dalam sistem SANGGARA?',
            type: 'primary',
            action: () => {
                if (isEditMode) {
                    put(route('users.update', editId), {
                        onSuccess: () => { closeConfirm(); closeModal(); },
                    });
                } else {
                    post(route('users.store'), {
                        onSuccess: () => { closeConfirm(); closeModal(); },
                    });
                }
            }
        });
    };

    // ==========================================
    // TRIGGER KONFIRMASI HAPUS
    // ==========================================
    const triggerDelete = (id, name) => {
        setConfirmPopup({
            isOpen: true,
            title: 'Hapus Akses User?',
            message: `PERINGATAN: Anda akan mencabut akses sistem untuk user "${name}". Tindakan ini tidak dapat dibatalkan.`,
            type: 'danger',
            action: () => {
                router.delete(route('users.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => closeConfirm()
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                    <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Manajemen User</h2>
                </div>
            }
        >
            <Head title="Kelola User" />

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 relative">

                {/* Header Action Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-5 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Daftar Pengguna Sistem</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Kelola akses admin dan pengguna aplikasi SANGGARA.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        Tambah User Baru
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm rounded-lg overflow-hidden transition-colors">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="py-4 px-6 font-black uppercase tracking-wider text-xs">ID</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-wider text-xs">Nama Lengkap</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-wider text-xs">Email / Username</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-wider text-xs text-center">Status Role</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-wider text-xs text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-medium">
                                            #{String(user.id).padStart(3, '0')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                                            {user.email}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {user.id === 1 ? (
                                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase rounded-full border border-emerald-200 dark:border-emerald-500/30">Admin Utama</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase rounded-full border border-slate-200 dark:border-slate-700">Staff Unit</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center space-x-3">

                                                {/* Edit User (Bisa diedit oleh dirinya sendiri atau admin utama) */}
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" title="Edit Data">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>

                                                {/* Hapus User (Tidak bisa hapus diri sendiri DAN tidak bisa hapus Admin Utama ID:1) */}
                                                {(user.id !== auth.user.id && user.id !== 1) && (
                                                    <button
                                                        onClick={() => triggerDelete(user.id, user.name)}
                                                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                        title="Hapus Akses"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL POPUP FORM (TAMBAH / EDIT) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>

                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md mx-4 p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6">
                            {isEditMode ? 'Edit Data User' : 'Tambah User Baru'}
                        </h2>

                        <form onSubmit={triggerSubmit} className="space-y-4">
                            <div>
                                <InputLabel value="Nama Lengkap" className="text-slate-700 dark:text-slate-300" />
                                <TextInput
                                    type="text"
                                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel value="Email Pribadi" className="text-slate-700 dark:text-slate-300" />
                                <TextInput
                                    type="email"
                                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel
                                    value={isEditMode ? "Password Baru (Opsional)" : "Password Login"}
                                    className="text-slate-700 dark:text-slate-300"
                                />
                                <TextInput
                                    type="password"
                                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={!isEditMode}
                                    placeholder={isEditMode ? "Kosongkan jika tidak ingin ganti" : "Minimal 8 karakter"}
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30"
                                >
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL POPUP KONFIRMASI --- */}
            {confirmPopup.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={closeConfirm}></div>

                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm mx-4 p-6 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 text-center">

                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${confirmPopup.type === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                            {confirmPopup.type === 'danger' ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                            )}
                        </div>

                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{confirmPopup.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 px-2">{confirmPopup.message}</p>

                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={closeConfirm}
                                disabled={processing}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmPopup.action}
                                disabled={processing}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md flex items-center justify-center min-w-[120px] ${confirmPopup.type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
                            >
                                {processing ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    'Ya, Lanjutkan'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
