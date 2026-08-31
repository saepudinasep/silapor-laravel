<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pengaduan extends Model
{
    use HasFactory;

    protected $table = 'pengaduan';

    /**
     * Status yang dikenal sistem.
     */
    public const STATUS_BARU = 'baru';
    public const STATUS_PROSES = 'proses';
    public const STATUS_SELESAI = 'selesai';

    protected $fillable = [
        'user_id',
        'tgl_pengaduan',
        'isi_laporan',
        'foto',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tgl_pengaduan' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------
    | Relasi
    |--------------------------------------------------------------------
    */

    /**
     * Pelapor (user dengan role masyarakat).
     */
    public function pelapor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Chat/percakapan terkait pengaduan ini — bisa dari masyarakat
     * (pelapor) maupun petugas/admin yang menangani.
     */
    public function pesans(): HasMany
    {
        return $this->hasMany(Pesan::class, 'pengaduan_id')->orderBy('created_at');
    }

    /*
    |--------------------------------------------------------------------
    | Scope
    |--------------------------------------------------------------------
    */

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }
}
