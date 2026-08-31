<?php

namespace App\Http\Controllers;

use App\Events\NotifikasiDiperbarui;
use App\Events\PesanDikirim;
use App\Events\StatusPengaduanDiubah;
use App\Models\Pengaduan;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PesanController extends Controller
{
    public function store(Request $request, Pengaduan $pengaduan): RedirectResponse
    {
        $user = $request->user();

        if ($user->role === User::ROLE_MASYARAKAT) {
            abort_unless($pengaduan->user_id === $user->id, 403);
        }

        $request->validate([
            'isi_pesan' => ['required', 'string'],
        ]);

        $pesan = $pengaduan->pesans()->create([
            'user_id' => $user->id,
            'isi_pesan' => $request->isi_pesan,
        ]);

        $statusBerubah = false;

        if ($user->role === User::ROLE_MASYARAKAT) {
            if ($pengaduan->status === Pengaduan::STATUS_SELESAI) {
                $pengaduan->update(['status' => Pengaduan::STATUS_PROSES]);
                $statusBerubah = true;
            }
        } else {
            if ($pengaduan->status === Pengaduan::STATUS_BARU) {
                $pengaduan->update(['status' => Pengaduan::STATUS_PROSES]);
                $statusBerubah = true;
            }
        }

        broadcast(new PesanDikirim($pesan));

        if ($statusBerubah) {
            broadcast(new StatusPengaduanDiubah($pengaduan));
        }

        // Petugas/admin kirim pesan → ping lonceng notifikasi masyarakat
        // pemilik pengaduan ini, biar update instan tanpa nunggu polling.
        if ($user->role !== User::ROLE_MASYARAKAT) {
            broadcast(new NotifikasiDiperbarui([
                new PrivateChannel('App.Models.User.' . $pengaduan->user_id),
            ]));
        }

        return back();
    }
}
