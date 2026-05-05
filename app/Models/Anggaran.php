<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anggaran extends Model
{
    protected $fillable = ['kode_coa', 'nama_item', 'total_anggaran', 'kategori'];

    // Satu Anggaran punya BANYAK Transaksi
    public function transaksis()
    {
        return $this->hasMany(Transaksi::class);
    }
}
