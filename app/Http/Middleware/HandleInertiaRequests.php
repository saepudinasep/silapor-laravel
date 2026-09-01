<?php

namespace App\Http\Middleware;

use App\Models\Pengaduan;
use App\Models\Pesan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'notifications' => fn() => $this->notificationsFor($user),
        ];
    }

    private function notificationsFor(?User $user): ?array
    {
        if (! $user) {
            return null;
        }

        if ($user->role === User::ROLE_MASYARAKAT) {
            $baseQuery = Pesan::whereHas(
                'pengaduan',
                fn($q) => $q->where('user_id', $user->id)
            )
                ->where('user_id', '!=', $user->id)
                ->whereNull('dibaca_at');

            $latest = (clone $baseQuery)
                ->with('pengirim')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn(Pesan $p) => [
                    'id' => 'pesan-' . $p->id,
                    'judul' => $p->pengirim->name,
                    'isi' => $p->isi_pesan,
                    'waktu' => $p->created_at,
                    'url' => route('pengaduan.show', $p->pengaduan_id, false),
                ]);

            return [
                'count' => $baseQuery->count(),
                'latest' => $latest,
            ];
        }

        if (in_array($user->role, [User::ROLE_PETUGAS, User::ROLE_ADMIN], true)) {
            $pengaduanBaru = Pengaduan::where('status', Pengaduan::STATUS_BARU)
                ->with('pelapor')
                ->get()
                ->map(fn(Pengaduan $p) => [
                    'id' => 'pengaduan-' . $p->id,
                    'judul' => $p->pelapor?->name ?? 'Warga',
                    'isi' => $p->isi_laporan,
                    'waktu' => $p->tgl_pengaduan,
                    'url' => route('petugas.pengaduan.show', $p->id, false),
                ]);

            $pesanSusulan = Pesan::whereHas(
                'pengaduan',
                fn($q) => $q->where('status', '!=', Pengaduan::STATUS_BARU)
            )
                ->whereHas('pengirim', fn($q) => $q->where('role', User::ROLE_MASYARAKAT))
                ->whereNull('dibaca_at')
                ->with('pengirim')
                ->get()
                ->map(fn(Pesan $p) => [
                    'id' => 'pesan-' . $p->id,
                    'judul' => $p->pengirim->name,
                    'isi' => $p->isi_pesan,
                    'waktu' => $p->created_at,
                    'url' => route('petugas.pengaduan.show', $p->pengaduan_id, false),
                ]);

            $combined = $pengaduanBaru->concat($pesanSusulan)
                ->sortByDesc('waktu')
                ->values();

            return [
                'count' => $combined->count(),
                'latest' => $combined->take(5)->values(),
            ];
        }

        return null;
    }
}
