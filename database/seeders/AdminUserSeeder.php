<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $username = env('SEED_ADMIN_USERNAME');
        $password = env('SEED_ADMIN_PASSWORD');

        if (User::where('username', $username)->exists()) {
            $this->command->info("akun admin '{$username}' sudah ada, seeding dilewati");
            return;
        }

        User::create([
            'name' => 'Administrator',
            'username' => $username,
            'email' => $username . '@gmail.com',
            'password' => Hash::make($password),
            'role' => User::ROLE_ADMIN,
        ]);

        $this->command->info("akun admin berhasil dibuat: {$username}/{$password}");
    }
}
