<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

class Tanggapan extends Model
{
    use HasFactory;

    protected $fillable = [
        'pengaduan_id',
        'petugas_id',
        'tgl_tanggapan',
        'tanggapan',
    ];


    protected function casts()
    {
        return [
            'tgl_tanggapan' => 'datetime',
        ];
    }

    /**
     * Relasi
     */
    public function pengaduan(): BelongsTo
    {
        return $this->belongsTo(Pengaduan::class, 'pengaduan_id');
    }

    /**
     * Petugas yang menanggapi (user dengan role petugas/admin)
     */
    public function petugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }
}
