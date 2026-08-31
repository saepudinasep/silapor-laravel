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
            )->where('user_id', '!=', $user->id);

            $latest = (clone $baseQuery)
                ->with('pengirim')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn(Pesan $p) => [
                    'id' => $p->id,
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
            $baseQuery = Pengaduan::where('status', Pengaduan::STATUS_BARU);

            $latest = (clone $baseQuery)
                ->with('pelapor')
                ->latest('tgl_pengaduan')
                ->take(5)
                ->get()
                ->map(fn(Pengaduan $p) => [
                    'id' => $p->id,
                    'judul' => $p->pelapor?->name ?? 'Warga',
                    'isi' => $p->isi_laporan,
                    'waktu' => $p->tgl_pengaduan,
                    'url' => route('petugas.pengaduan.show', $p->id, false),
                ]);

            return [
                'count' => $baseQuery->count(),
                'latest' => $latest,
            ];
        }

        return null;
    }
}
