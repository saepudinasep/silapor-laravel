<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetugasDashboardController extends Controller
{
    public function index(): Response
    {
        $pengaduans = Pengaduan::with('pelapor')
            ->latest('tgl_pengaduan')
            ->get();

        return Inertia::render('Dashboard/Petugas', [
            'pengaduans' => $pengaduans,
        ]);
    }
}
