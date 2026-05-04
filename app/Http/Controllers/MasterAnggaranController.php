<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; // Jangan lupa import Inertia

class MasterAnggaranController extends Controller
{
    public function index()
    {
        // Perhatikan huruf besar M, A, dan I
        return Inertia::render('MasterAnggaran/Index');
    }
}
