<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

class Pesan extends Model
{
    use HasFactory;

    protected $table = 'pesan';

    protected $fillable = [
        'pengaduan_id',
        'user_id',
        'isi_pesan',
        'dibaca_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'dibaca_at' => 'datetime',
        ];
    }


    /*
    |--------------------------------------------------------------------
    | Relasi
    |--------------------------------------------------------------------
    */

    public function pengaduan(): BelongsTo
    {
        return $this->belongsTo(Pengaduan::class, 'pengaduan_id');
    }

    /**
     * Pengirim pesan — bisa masyarakat (pelapor) atau petugas/admin.
     */
    public function pengirim(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
