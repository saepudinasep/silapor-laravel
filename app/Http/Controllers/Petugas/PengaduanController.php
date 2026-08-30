<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Pengaduan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaduanController extends Controller
{
    /**
     * Detail pengaduan, boleh diakses semua petugas/admin (bukan cuma pemilik).
     */
    public function show(Pengaduan $pengaduan): Response
    {
        $pengaduan->load(['pelapor', 'tanggapans.petugas']);

        return Inertia::render('Petugas/PengaduanShow', [
            'pengaduan' => $pengaduan,
        ]);
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

        return back()->with('success', "Status diperbarui: {$request->status}");
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
