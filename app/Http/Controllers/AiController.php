<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    public function analyzeBudget(Request $request)
    {
        // Data dari Dashboard
        $dataAnggaran = $request->input('agregat', [
            'total_anggaran' => 0,
            'total_realisasi' => 0,
            'persentase' => 0
        ]);

        $prompt = "Kamu adalah 'SANGGARA AI', analis keuangan PT Pelindo. Berikan 1 paragraf singkat (max 3 kalimat) insight tajam dari data ini: Total Rp " . number_format($dataAnggaran['total_anggaran'], 0, ',', '.') . ", Realisasi Rp " . number_format($dataAnggaran['total_realisasi'], 0, ',', '.') . " (" . $dataAnggaran['persentase'] . "%).";

        $apiKey = env('GEMINI_API_KEY');

        // KONTEN PERBAIKAN: Gunakan v1beta dan pastikan model name tepat
        // Untuk beberapa tier, gemini-1.5-flash hanya bisa diakses via v1beta
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

        try {
            $response = Http::withOptions([
                'verify' => false, // Tetap bypass SSL untuk Linux Mint lokal
                'timeout' => 30,
            ])->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            $result = $response->json();

            // Jika respons sukses
            if ($response->successful() && isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                return response()->json([
                    'success' => true,
                    'insight' => trim($result['candidates'][0]['content']['parts'][0]['text'])
                ]);
            }

            // Tangkap pesan error spesifik dari Google
            $errorMessage = $result['error']['message'] ?? 'Respons AI tidak valid.';
            Log::error('Gemini API Error Detail: ' . json_encode($result));

            return response()->json([
                'success' => false,
                'message' => 'Google AI: ' . $errorMessage
            ], 500);

        } catch (\Exception $e) {
            Log::error('AI System Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'System Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
