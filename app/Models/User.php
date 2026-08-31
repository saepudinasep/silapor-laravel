<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Role yang dikenal sistem.
     */

    public const ROLE_ADMIN = 'admin';
    public const ROLE_PETUGAS = 'petugas';
    public const ROLE_MASYARAKAT = 'masyarakat';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'role',
        'nik',
        'telp',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------
    | Relasi
    |--------------------------------------------------------------------
    */

    /**
     * Pengaduan yang dibuat user ini (kalau role = masyarakat).
     */
    public function pengaduans(): HasMany
    {
        return $this->hasMany(Pengaduan::class, 'user_id');
    }

    /**
     * Semua pesan chat yang PERNAH dikirim user ini — baik sebagai
     * masyarakat (pelapor) maupun sebagai petugas/admin yang menanggapi.
     */
    public function pesans(): HasMany
    {
        return $this->hasMany(Pesan::class, 'user_id');
    }

    /*
    |--------------------------------------------------------------------
    | Scope
    |--------------------------------------------------------------------
    */

    public function scopeMasyarakat($query)
    {
        return $query->where('role', self::ROLE_MASYARAKAT);
    }

    public function scopePetugas($query)
    {
        return $query->where('role', self::ROLE_PETUGAS);
    }

    public function scopeAdmin($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    /*
    |--------------------------------------------------------------------
    | Helper role
    |--------------------------------------------------------------------
    */

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isPetugas(): bool
    {
        return $this->role === self::ROLE_PETUGAS;
    }

    public function isMasyarakat(): bool
    {
        return $this->role === self::ROLE_MASYARAKAT;
    }

    /**
     * Route dashboard yang sesuai untuk role user ini.
     */
    public function dashboardRoute(): string
    {
        return match ($this->role) {
            self::ROLE_ADMIN => route('admin.dashboard'),
            self::ROLE_PETUGAS => route('petugas.dashboard'),
            self::ROLE_MASYARAKAT => route('home'),
            default => route('home'),
        };
    }
}
