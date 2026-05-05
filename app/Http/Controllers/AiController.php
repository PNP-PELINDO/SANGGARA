<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    /**
     * Analisis budget menggunakan OpenRouter AI (FREE, tanpa kartu)
     * Versi Final: Bahasa Indonesia + Profesional + Fallback Model
     */
    public function analyzeBudget(Request $request)
    {
        // 1. Ambil data dari request
        $dataAnggaran = $request->input('agregat', [
            'total_anggaran' => 0,
            'total_realisasi' => 0,
            'persentase' => 0
        ]);

        // 2. Format angka
        $totalAnggaran = number_format($dataAnggaran['total_anggaran'], 0, ',', '.');
        $totalRealisasi = number_format($dataAnggaran['total_realisasi'], 0, ',', '.');
        $persentase = $dataAnggaran['persentase'];

        // 3. Prompt (DIPAKSA BAHASA INDONESIA)
        $prompt = "Kamu adalah SANGGARA AI, analis keuangan PT Pelindo Regional 2 Teluk Bayur. "
                . "WAJIB gunakan Bahasa Indonesia formal dan jangan gunakan Bahasa Inggris sama sekali. "
                . "Gunakan gaya bahasa seperti laporan resmi perusahaan (BUMN). "
                . "Berikan insight profesional maksimal 3 kalimat dari data berikut: "
                . "Total Anggaran Rp {$totalAnggaran}, "
                . "Realisasi Rp {$totalRealisasi}, "
                . "Persentase {$persentase}%.";

        $apiKey = env('OPENROUTER_API_KEY');

        // 4. Model fallback (biar anti error)
        $models = [
            'meta-llama/llama-3-8b-instruct',
            'openchat/openchat-7b',
            'gryphe/mythomist-7b'
        ];

        try {
            foreach ($models as $model) {

                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'HTTP-Referer' => 'http://localhost',
                    'X-Title' => 'Sanggara AI'
                ])->timeout(30)
                  ->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model' => $model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Kamu adalah analis keuangan profesional yang selalu menggunakan Bahasa Indonesia formal.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt
                        ]
                    ],
                    'temperature' => 0.6,
                    'max_tokens' => 300
                ]);

                $result = $response->json();

                // 5. Jika sukses
                if ($response->successful() && isset($result['choices'][0]['message']['content'])) {
                    return response()->json([
                        'success' => true,
                        'model_used' => $model,
                        'insight' => trim($result['choices'][0]['message']['content'])
                    ]);
                }

                // Log jika model gagal
                Log::warning("Model gagal: {$model}", $result ?? []);
            }

            // 6. Jika semua model gagal
            return response()->json([
                'success' => false,
                'message' => 'Semua model AI tidak memberikan respons'
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
