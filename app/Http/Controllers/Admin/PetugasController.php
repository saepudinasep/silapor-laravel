<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PetugasController extends Controller
{
    /**
     * Daftar semua akun petugas & admin (bukan masyarakat).
     */
    public function index(): Response
    {
        $list = User::whereIn('role', [User::ROLE_ADMIN, User::ROLE_PETUGAS])
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'telp', 'role']);

        return Inertia::render('Admin/Petugas/Index', [
            'list' => $list,
            'totalAdmin' => $list->where('role', User::ROLE_ADMIN)->count(),
            'totalPetugas' => $list->where('role', User::ROLE_PETUGAS)->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Petugas/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'string', 'min:6'],
            'telp' => ['nullable', 'string', 'max:20'],
            'role' => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_PETUGAS])],
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['username'] . '@silapor.local',
            'password' => Hash::make($validated['password']),
            'telp' => $validated['telp'] ?? null,
            'role' => $validated['role'],
        ]);

        return redirect()
            ->route('admin.petugas.index')
            ->with('success', "{$validated['name']} berhasil didaftarkan.");
    }

    public function edit(User $user): Response
    {
        abort_unless(in_array($user->role, [User::ROLE_ADMIN, User::ROLE_PETUGAS], true), 404);

        return Inertia::render('Admin/Petugas/Edit', [
            'petugas' => $user->only(['id', 'name', 'username', 'telp', 'role']),
        ]);
    }

    /**
     * Username sengaja tidak bisa diubah, konsisten dengan project lama.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        abort_unless(in_array($user->role, [User::ROLE_ADMIN, User::ROLE_PETUGAS], true), 404);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'telp' => ['nullable', 'string', 'max:20'],
            'role' => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_PETUGAS])],
        ]);

        $user->update($validated);

        return redirect()
            ->route('admin.petugas.index')
            ->with('success', "{$user->name} berhasil diperbarui.");
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_unless(in_array($user->role, [User::ROLE_ADMIN, User::ROLE_PETUGAS], true), 404);

        $nama = $user->name;
        $user->delete();

        return back()->with('success', "{$nama} berhasil dihapus.");
    }

    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        abort_unless(in_array($user->role, [User::ROLE_ADMIN, User::ROLE_PETUGAS], true), 404);

        $request->validate([
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('success', "Password {$user->name} berhasil direset.");
    }
}
