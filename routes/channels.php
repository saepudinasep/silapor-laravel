<?php

use App\Models\Pengaduan;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('pengaduan.{pengaduanId}', function (User $user, int $pengaduanId) {
    $pengaduan = Pengaduan::find($pengaduanId);

    if (! $pengaduan) {
        return false;
    }

    // Petugas/admin boleh akses chat pengaduan manapun.
    if (in_array($user->role, [User::ROLE_PETUGAS, User::ROLE_ADMIN], true)) {
        return true;
    }

    // Masyarakat cuma boleh akses chat pengaduan miliknya sendiri.
    return $pengaduan->user_id === $user->id;
});


Broadcast::channel('petugas-notifikasi', function (User $user) {
    return in_array($user->role, [User::ROLE_PETUGAS, User::ROLE_ADMIN], true);
});
