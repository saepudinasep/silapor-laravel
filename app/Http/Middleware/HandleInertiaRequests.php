<?php

namespace App\Http\Middleware;

use App\Models\Pengaduan;
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
        if (! $user || ! in_array($user->role, [User::ROLE_PETUGAS, User::ROLE_ADMIN], true)) {
            return null;
        }

        $latest = Pengaduan::with('pelapor')
            ->where('status', Pengaduan::STATUS_BARU)
            ->latest('tgl_pengaduan')
            ->take(5)
            ->get()
            ->map(fn(Pengaduan $p) => [
                'id' => $p->id,
                'pelapor' => $p->pelapor?->name ?? 'Warga',
                'isi_laporan' => $p->isi_laporan,
                'tgl_pengaduan' => $p->tgl_pengaduan,
            ]);

        return [
            'count' => Pengaduan::where('status', Pengaduan::STATUS_BARU)->count(),
            'latest' => $latest,
        ];
    }
}
