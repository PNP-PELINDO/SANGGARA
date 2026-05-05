<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = auth()->user()->notifications();

        // 1. Filter Berdasarkan Jenis Aktivitas (create, update, delete)
        if ($request->filled('type') && $request->type !== 'all') {
            // Karena 'type' ada di dalam kolom JSON 'data', kita pakai whereJsonContains atau pencarian spesifik
            $query->where('data->type', $request->type);
        }

        // 2. Filter Berdasarkan Tanggal Spesifik
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // Tarik data dengan pagination dan bawa query string-nya
        $logs = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('ActivityLog/Index', [
            'logs' => $logs,
            'filters' => $request->only(['type', 'date']) // Kirim kembali filter aktif ke React
        ]);
    }
}
