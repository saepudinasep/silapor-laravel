<?php

namespace App\Http\Controllers\Petugas;

use App\Events\StatusPengaduanDiubah;
use App\Http\Controllers\Controller;
use App\Models\Pengaduan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaduanController extends Controller
{
    public function show(Pengaduan $pengaduan): Response
    {
        $this->markPesanDibaca($pengaduan);

        $pengaduan->load(['pelapor', 'pesans.pengirim']);

        return Inertia::render('Petugas/PengaduanShow', [
            'pengaduan' => $pengaduan,
        ]);
    }

    /**
     * Endpoint ringan buat mark-as-read TANPA reload halaman — dipanggil
     * dari Chat.jsx tiap ada pesan baru masuk real-time selagi petugas
     * lagi standby di halaman detail ini.
     */
    public function markRead(Pengaduan $pengaduan): RedirectResponse
    {
        $this->markPesanDibaca($pengaduan);

        return back();
    }

    /**
     * Ubah status pengaduan manual (baru/proses/selesai).
     */
    public function updateStatus(Request $request, Pengaduan $pengaduan): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:baru,proses,selesai'],
        ]);

        $pengaduan->update(['status' => $request->status]);

        broadcast(new StatusPengaduanDiubah($pengaduan));

        return back()->with('success', "Status diperbarui: {$request->status}");
    }

    private function markPesanDibaca(Pengaduan $pengaduan): void
    {
        $pengaduan->pesans()
            ->whereHas('pengirim', fn($q) => $q->where('role', \App\Models\User::ROLE_MASYARAKAT))
            ->whereNull('dibaca_at')
            ->update(['dibaca_at' => now()]);
    }

    /**
     * Kirim tanggapan baru. Status otomatis pindah ke 'proses'
     * kalau sebelumnya masih 'baru' (meniru perilaku sistem lama).
     */
    public function storeTanggapan(Request $request, Pengaduan $pengaduan): RedirectResponse
    {
        $request->validate([
            'tanggapan' => ['required', 'string'],
        ]);

        $pengaduan->tanggapans()->create([
            'petugas_id' => $request->user()->id,
            'tgl_tanggapan' => now(),
            'tanggapan' => $request->tanggapan,
        ]);

        if ($pengaduan->status === Pengaduan::STATUS_BARU) {
            $pengaduan->update(['status' => Pengaduan::STATUS_PROSES]);
        }

        return back()->with('success', 'Tanggapan terkirim, status pengaduan otomatis diperbarui.');
    }
}
