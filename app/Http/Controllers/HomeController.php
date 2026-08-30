<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', '');

        $query = $request->user()->pengaduans()->latest('tgl_pengaduan');

        if ($status !== '') {
            $query->where('status', $status);
        }

        $pengaduans = $query->paginate(10)->withQueryString();

        return Inertia::render('Home', [
            'pengaduans' => $pengaduans,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }
}
