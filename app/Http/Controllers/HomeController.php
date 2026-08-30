<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $pengaduans = $request->user()
            ->pengaduans()
            ->latest('tgl_pengaduan')
            ->paginate(2)
            ->withQueryString();

        return Inertia::render('Home', [
            'pengaduans' => $pengaduans,
        ]);
    }
}
