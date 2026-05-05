<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $fillable = ['anggaran_id', 'tanggal', 'keterangan', 'nominal_commitment', 'nominal_realisasi'];

    // Satu Transaksi MILIK SATU Anggaran
    public function anggaran()
    {
        return $this->belongsTo(Anggaran::class);
    }
}
