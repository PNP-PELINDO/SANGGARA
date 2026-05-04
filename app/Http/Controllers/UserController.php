<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Notifications\ActivityNotification;
use Illuminate\Support\Facades\Notification; // <-- Wajib import ini untuk kirim ke banyak user

class UserController extends Controller
{
    // READ: Menampilkan daftar user
    public function index()
    {
        $users = User::latest()->get();
        return Inertia::render('User/Index', [
            'users' => $users
        ]);
    }

    // CREATE: Menyimpan user baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => 'required|string|min:8',
        ]);

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // --- TRIGGER NOTIFIKASI KE SEMUA USER (Kecuali yang sedang login) ---
        $usersToNotify = User::where('id', '!=', auth()->id())->get();
        Notification::send($usersToNotify, new ActivityNotification(
            auth()->user()->name . " telah menambahkan user baru: " . $request->name,
            'create'
        ));

        return redirect()->back();
    }

    // UPDATE: Menyimpan perubahan data user
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // --- TRIGGER NOTIFIKASI KE SEMUA USER ---
        $usersToNotify = User::where('id', '!=', auth()->id())->get();
        Notification::send($usersToNotify, new ActivityNotification(
            auth()->user()->name . " telah mengedit data user: " . $request->name,
            'update'
        ));

        return redirect()->back();
    }

    // DELETE: Menghapus user
    public function destroy(User $user)
    {
        // PROTEKSI KEAMANAN BACKEND: Jangan izinkan siapapun menghapus Admin Utama (ID 1)
        if ($user->id === 1) {
            return redirect()->back();
        }

        $namaUserDihapus = $user->name;

        $user->delete();

        // --- TRIGGER NOTIFIKASI KE SEMUA USER ---
        $usersToNotify = User::where('id', '!=', auth()->id())->get();
        Notification::send($usersToNotify, new ActivityNotification(
            auth()->user()->name . " telah mencabut akses user: " . $namaUserDihapus,
            'delete'
        ));

        return redirect()->back();
    }
}
