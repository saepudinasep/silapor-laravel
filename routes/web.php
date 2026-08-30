<?php

use App\Http\Controllers\Dashboard\AdminDashboardController;
use App\Http\Controllers\Dashboard\PetugasDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Models\Pengaduan;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $summary = [
        'total' => Pengaduan::count(),
        'baru' => Pengaduan::status(Pengaduan::STATUS_BARU)->count(),
        'proses' => Pengaduan::status(Pengaduan::STATUS_PROSES)->count(),
        'selesai' => Pengaduan::status(Pengaduan::STATUS_SELESAI)->count(),
    ];

    $recent = Pengaduan::with('pelapor')
        ->latest('tgl_pengaduan')
        ->take(6)
        ->get()
        ->map(fn($p) => [
            'id_pengaduan' => $p->id,
            'status' => $p->status,
            'tgl_pengaduan' => $p->tgl_pengaduan,
            'isi_laporan' => $p->isi_laporan,
            'pelapor' => $p->pelapor->name,
        ]);

    return Inertia::render('Welcome', [
        'summary' => $summary,
        'recent' => $recent,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::middleware(['auth', 'verified', 'role:masyarakat'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
});

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('dashboard/admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    });

Route::middleware(['auth', 'verified', 'role:petugas'])
    ->prefix('dashboard/petugas')
    ->name('petugas.')
    ->group(function () {
        Route::get('/', [PetugasDashboardController::class, 'index'])->name('dashboard');
    });
