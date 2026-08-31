<?php

namespace App\Console\Commands;

use App\Events\StatusPengaduanDiubah;
use App\Models\Pengaduan;
use App\Models\User;
use Illuminate\Console\Command;

class AutoCloseStalePengaduan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pengaduan:auto-close';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tutup otomatis pengaduan berstatus "proses" yang sudah 24 jam tidak dibalas masyarakat sejak pesan terakhir dari petugas/admin';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $closed = 0;

        Pengaduan::where('status', Pengaduan::STATUS_PROSES)
            ->chunkById(100, function ($pengaduans) use (&$closed) {
                foreach ($pengaduans as $pengaduan) {
                    $lastPesan = $pengaduan->pesans()->with('pengirim')->latest()->first();

                    if (! $lastPesan) {
                        continue;
                    }

                    $lastFromPetugas = $lastPesan->pengirim?->role !== User::ROLE_MASYARAKAT;
                    $isStale = $lastPesan->created_at->lt(now()->subDay());

                    if ($lastFromPetugas && $isStale) {
                        $pengaduan->update(['status' => Pengaduan::STATUS_SELESAI]);
                        broadcast(new StatusPengaduanDiubah($pengaduan));
                        $closed++;
                    }
                }
            });

        $this->info("{$closed} pengaduan otomatis ditutup.");

        return self::SUCCESS;
    }
}
