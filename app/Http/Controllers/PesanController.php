<?php

namespace App\Http\Controllers;

use App\Events\PesanDikirim;
use App\Models\Pengaduan;
use App\Models\User;
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

        if ($user->role === User::ROLE_MASYARAKAT) {
            if ($pengaduan->status === Pengaduan::STATUS_SELESAI) {
                $pengaduan->update(['status' => Pengaduan::STATUS_PROSES]);
            }
        } else {
            if ($pengaduan->status === Pengaduan::STATUS_BARU) {
                $pengaduan->update(['status' => Pengaduan::STATUS_PROSES]);
            }
        }

        broadcast(new PesanDikirim($pesan));

        return back();
    }
}
