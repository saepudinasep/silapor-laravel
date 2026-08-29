<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Pengaduan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'total_masyarakat' => User::masyarakat()->count(),
                'total_petugas' => User::petugas()->count(),
                'total_pengaduan' => Pengaduan::count(),
                'pengaduan_baru' => Pengaduan::status(Pengaduan::STATUS_BARU)->count(),
            ],
        ]);
    }
}
