<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesan', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pengaduan_id')
                ->constrained('pengaduan')
                ->onDelete('cascade');

            // Pengirim pesan — bisa masyarakat (pelapor) ATAU petugas/admin,
            // dua-duanya sama-sama nunjuk ke tabel users.
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->text('isi_pesan');

            $table->timestamps();

            $table->index('pengaduan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesan');
    }
};
