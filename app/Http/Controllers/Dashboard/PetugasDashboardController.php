<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetugasDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', '');

        $query = Pengaduan::with('pelapor')->latest('tgl_pengaduan');

        if ($status !== '') {
            $query->where('status', $status);
        }

        $pengaduans = $query->paginate(10)->withQueryString();

        return Inertia::render('Dashboard/Petugas', [
            'pengaduans' => $pengaduans,
            'summary' => [
                'baru' => Pengaduan::status(Pengaduan::STATUS_BARU)->count(),
                'proses' => Pengaduan::status(Pengaduan::STATUS_PROSES)->count(),
                'selesai' => Pengaduan::status(Pengaduan::STATUS_SELESAI)->count(),
            ],
            'filters' => [
                'status' => $status,
            ],
        ]);
    }
}
