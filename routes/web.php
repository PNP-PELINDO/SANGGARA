<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\MasterAnggaranController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\ActivityLogController; // <-- Tambahan untuk Log Aktivitas
use Illuminate\Support\Facades\Route;

// =====================================================================
// FASE 1: Akses & Autentikasi
// =====================================================================
// Langsung arahkan pengunjung ke halaman login (Aplikasi Internal)
Route::redirect('/', '/login');

// =====================================================================
// FASE 2: Pendaratan & Dashboard Utama
// =====================================================================
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// =====================================================================
// PROTECTED ROUTES (Harus Login)
// =====================================================================
Route::middleware('auth')->group(function () {

    // --- Route Profile Bawaan Laravel Breeze ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- MENU 1: MASTER ANGGARAN (Tabel Consolidated Sheet) ---
    Route::get('/master-anggaran', [MasterAnggaranController::class, 'index'])->name('master-anggaran.index');

    // --- FASE 5: Pelaporan & Ekspor Sheet ---
    // (PENTING: Route khusus 'export' harus berada di atas route berparameter)
    Route::get('/transaksi/export', [TransaksiController::class, 'export'])->name('transaksi.export');

    // --- MENU 2 & FASE 3-4: Manajemen Transaksi COA (Data Harian) ---
    Route::get('/transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');
    Route::post('/transaksi', [TransaksiController::class, 'store'])->name('transaksi.store');
    Route::put('/transaksi/{transaksi}', [TransaksiController::class, 'update'])->name('transaksi.update');
    Route::delete('/transaksi/{transaksi}', [TransaksiController::class, 'destroy'])->name('transaksi.destroy');

    // --- MENU ADMINISTRATOR: KELOLA USER ---
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // --- NOTIFIKASI SISTEM ---
    Route::post('/notifications/mark-read', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return redirect()->back();
    })->name('notifications.read');

    // --- AI ANALYST (GEMINI API) ---
    Route::post('/ai/analyze-budget', [AiController::class, 'analyzeBudget'])->name('ai.analyze');

    // --- LOG AKTIVITAS ---
    Route::get('/activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');

});

// Memuat route autentikasi bawaan Breeze (Login, Logout, Reset Password, dll)
require __DIR__.'/auth.php';
