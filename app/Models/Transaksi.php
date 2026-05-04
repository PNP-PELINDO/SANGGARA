<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    // Tambahkan property $fillable untuk mengizinkan mass assignment
    protected $fillable = [
        'anggaran_id',
        'tanggal',
        'keterangan',
        'nominal_realisasi',
    ];

    // Hubungan ke model Anggaran
    public function anggaran()
    {
        return $this->belongsTo(Anggaran::class);
    }
}
