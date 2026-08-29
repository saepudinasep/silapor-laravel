<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $pengaduan = $request->user()
            ->pengaduans()
            ->latest('tgl_pengaduan')
            ->get();

        return Inertia::render('Home', [
            'pengaduan' => $pengaduan,
        ]);
    }
}
