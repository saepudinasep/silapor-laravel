<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Event::listen(Registered::class, SendEmailVerificationNotification::class);

        // Custom isi email verifikasi.
        VerifyEmail::toMailUsing(function (User $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Verifikasi Alamat Email Anda — SiLapor')
                ->greeting('Halo, ' . $notifiable->name . '!')
                ->line('Terima kasih sudah mendaftar di SiLapor, kanal resmi pengaduan masyarakat.')
                ->line('Klik tombol di bawah untuk memverifikasi alamat email Anda sebelum mulai membuat laporan.')
                ->action('Verifikasi Email Saya', $url)
                ->line('Kalau Anda tidak merasa mendaftar akun ini, abaikan saja email ini.')
                ->salutation('Salam, Tim SiLapor');
        });

        // Custom isi email reset password.
        ResetPassword::toMailUsing(function (User $notifiable, string $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            return (new MailMessage)
                ->subject('Permintaan Reset Password — SiLapor')
                ->greeting('Halo, ' . $notifiable->name . '!')
                ->line('Kami menerima permintaan untuk mereset password akun SiLapor Anda.')
                ->action('Buat Password Baru', $url)
                ->line('Link ini akan kedaluwarsa dalam 60 menit.')
                ->line('Kalau Anda tidak meminta reset password, abaikan saja email ini — password Anda tidak akan berubah.')
                ->salutation('Salam, Tim SiLapor');
        });
    }
}
