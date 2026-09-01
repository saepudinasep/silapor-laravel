<?php

namespace App\Http\Controllers;

use App\Events\NotifikasiDiperbarui;
use App\Models\Pengaduan;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaduanController extends Controller
{
    /**
     * Form buat laporan baru.
     */
    public function create(): Response
    {
        return Inertia::render('Pengaduan/Create');
    }

    /**
     * Simpan laporan baru milik masyarakat yang login.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'isi_laporan' => ['required', 'string'],
            'foto' => ['nullable', 'image', 'max:2048'],
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('pengaduan', 'public');
        }

        $request->user()->pengaduans()->create([
            'tgl_pengaduan' => now(),
            'isi_laporan' => $validated['isi_laporan'],
            'foto' => $fotoPath,
            'status' => Pengaduan::STATUS_BARU,
        ]);

        broadcast(new NotifikasiDiperbarui([
            new PrivateChannel('petugas-notifikasi'),
        ]));

        return redirect()
            ->route('home')
            ->with('success', 'Pengaduan terkirim, akan segera ditinjau petugas.');
    }

    /**
     * Detail 1 pengaduan, khusus untuk pemilik laporan.
     */
    public function show(Request $request, Pengaduan $pengaduan): Response
    {
        $user = $request->user();

        abort_unless($pengaduan->user_id === $user?->id, 403);

        $this->markPesanDibaca($pengaduan, $user->id);

        $pengaduan->load(['pesans.pengirim']);

        return Inertia::render('Pengaduan/Show', [
            'pengaduan' => $pengaduan,
        ]);
    }

    public function markRead(Request $request, Pengaduan $pengaduan): RedirectResponse
    {
        $user = $request->user();

        abort_unless($pengaduan->user_id === $user?->id, 403);

        $this->markPesanDibaca($pengaduan, $user->id);

        return back();
    }

    private function markPesanDibaca(Pengaduan $pengaduan, int $userId): void
    {
        $pengaduan->pesans()
            ->where('user_id', '!=', $userId)
            ->whereNull('dibaca_at')
            ->update(['dibaca_at' => now()]);
    }
}
