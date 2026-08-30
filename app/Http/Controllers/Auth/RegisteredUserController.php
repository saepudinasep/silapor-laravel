<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nik' => [
                'required',
                'string',
                'regex:/^[0-9]{16}$/',
                'unique:' . User::class,
            ],
            'nama' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'string', Rules\Password::defaults()],
            'telp' => ['nullable', 'string', 'max:20'],
        ], [
            'nik.regex' => 'NIK harus berupa 16 digit angka.',
        ]);

        $user = User::create([
            'nik' => $request->nik,
            'name' => $request->nama,
            'username' => $request->username,
            'email' => $request->username . '@gmail.com',
            'password' => Hash::make($request->password),
            'telp' => $request->telp,
            'role' => User::ROLE_MASYARAKAT,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('home', absolute: false));
    }
}
