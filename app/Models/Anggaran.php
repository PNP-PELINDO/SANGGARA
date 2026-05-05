<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anggaran extends Model
{
    // Pastikan 'kategori' sudah dihapus dari sini
    protected $fillable = ['kode_coa', 'nama_item', 'original_budget', 'unreleased_persen'];

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class);
    }
}
