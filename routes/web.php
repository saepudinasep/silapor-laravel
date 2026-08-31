<?php

use App\Http\Controllers\Dashboard\AdminDashboardController;
use App\Http\Controllers\Dashboard\PetugasDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PengaduanController;
use App\Http\Controllers\Petugas\PengaduanController as PetugasPengaduanController;
use App\Http\Controllers\Admin\PetugasController as AdminPetugasController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PesanController;
use App\Http\Controllers\ProfileController;
use App\Models\Pengaduan;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        /** @var User $user */
        $user = Auth::user();

        return redirect($user->dashboardRoute());
    }

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

Route::middleware(['auth', 'verified', 'role:masyarakat'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    Route::get('/pengaduan/create', [PengaduanController::class, 'create'])->name('pengaduan.create');
    Route::post('/pengaduan', [PengaduanController::class, 'store'])->name('pengaduan.store');
    Route::get('/pengaduan/{pengaduan}', [PengaduanController::class, 'show'])->name('pengaduan.show');
});

Route::middleware(['auth', 'verified', 'role:petugas,admin'])
    ->prefix('petugas/pengaduan')
    ->name('petugas.pengaduan.')
    ->group(function () {
        Route::get('/{pengaduan}', [PetugasPengaduanController::class, 'show'])->name('show');
        Route::put('/{pengaduan}/status', [PetugasPengaduanController::class, 'updateStatus'])->name('updateStatus');
        // Route::post('/{pengaduan}/tanggapan', [PetugasPengaduanController::class, 'storeTanggapan'])->name('tanggapan.store');
    });

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin/petugas')
    ->name('admin.petugas.')
    ->group(function () {
        Route::get('/', [AdminPetugasController::class, 'index'])->name('index');
        Route::get('/baru', [AdminPetugasController::class, 'create'])->name('create');
        Route::post('/', [AdminPetugasController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [AdminPetugasController::class, 'edit'])->name('edit');
        Route::put('/{user}', [AdminPetugasController::class, 'update'])->name('update');
        Route::delete('/{user}', [AdminPetugasController::class, 'destroy'])->name('destroy');
        Route::put('/{user}/reset-password', [AdminPetugasController::class, 'resetPassword'])->name('resetPassword');
    });

// pindah ke sini, group terpisah, TANPA prefix/name
Route::middleware(['auth', 'verified', 'role:petugas,admin'])->group(function () {
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
});

Route::middleware(['auth', 'verified'])
    ->post('/pengaduan/{pengaduan}/pesan', [PesanController::class, 'store'])
    ->name('pesan.store');
