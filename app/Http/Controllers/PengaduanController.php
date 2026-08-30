<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
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

        return redirect()
            ->route('home')
            ->with('success', 'Pengaduan terkirim, akan segera ditinjau petugas.');
    }

    /**
     * Detail 1 pengaduan, khusus untuk pemilik laporan.
     */
    public function show(Pengaduan $pengaduan, Request $request): Response
    {
        abort_unless($pengaduan->user_id === $request->user()?->id, 403);

        $pengaduan->load(['tanggapans.petugas']);

        return Inertia::render('Pengaduan/Show', [
            'pengaduan' => $pengaduan,
        ]);
    }
}
