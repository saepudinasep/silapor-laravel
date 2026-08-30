<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    /**
     * Tampilkan form lupa password.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Verifikasi identitas (NIK untuk masyarakat, username untuk
     * petugas/admin) lalu langsung set password baru. Tidak ada token
     * atau link email sama sekali, karena sistem ini tidak punya kanal
     * email/SMS yang beneran bisa dipakai.
     */
    public function store(Request $request): RedirectResponse
    {
        $asMasyarakat = $request->input('as_role') === 'masyarakat';

        $validated = $request->validate([
            'as_role' => ['required', Rule::in(['masyarakat', 'petugas'])],
            'identifier' => $asMasyarakat
                ? ['required', 'string', 'regex:/^[0-9]{16}$/']
                : ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ], [
            'identifier.regex' => 'NIK harus berupa 16 digit angka.',
        ]);

        $user = $asMasyarakat
            ? User::where('role', User::ROLE_MASYARAKAT)
            ->where('nik', $validated['identifier'])
            ->first()
            : User::whereIn('role', [User::ROLE_PETUGAS, User::ROLE_ADMIN])
            ->where('username', $validated['identifier'])
            ->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'identifier' => $asMasyarakat
                    ? 'NIK tidak ditemukan.'
                    : 'Username tidak ditemukan.',
            ]);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return redirect()
            ->route('login')
            ->with('success', 'Password berhasil direset, silakan masuk dengan password baru.');
    }
}
