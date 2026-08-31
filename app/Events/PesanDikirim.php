<?php

namespace App\Events;

use App\Models\Pesan;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Pakai ShouldBroadcastNow (bukan ShouldBroadcast) supaya broadcast
 * langsung terkirim ke Reverb saat itu juga, tanpa perlu queue worker
 * (php artisan queue:work) jalan terus di background.
 */
class PesanDikirim implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Pesan $pesan)
    {
        $this->pesan->loadMissing('pengirim');
    }

    /**
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('pengaduan.' . $this->pesan->pengaduan_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'pesan.baru';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->pesan->id,
            'pengaduan_id' => $this->pesan->pengaduan_id,
            'isi_pesan' => $this->pesan->isi_pesan,
            'created_at' => $this->pesan->created_at,
            'pengirim' => [
                'id' => $this->pesan->pengirim->id,
                'name' => $this->pesan->pengirim->name,
                'role' => $this->pesan->pengirim->role,
            ],
        ];
    }
}
