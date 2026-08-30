<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function index(Request $request): Response
    {
        $startDate = $request->query('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', now()->toDateString());
        $status = $request->query('status', '');

        $query = Pengaduan::with('pelapor')
            ->whereDate('tgl_pengaduan', '>=', $startDate)
            ->whereDate('tgl_pengaduan', '<=', $endDate);

        if ($status !== '') {
            $query->where('status', $status);
        }

        $pengaduans = $query->latest('tgl_pengaduan')->get();

        return Inertia::render('Laporan/Index', [
            'pengaduans' => $pengaduans,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status,
            ],
        ]);
    }
}
