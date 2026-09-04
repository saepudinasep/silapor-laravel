import { Head, Link, useForm } from "@inertiajs/react";
import "../../../css/landing.css";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    function resend(e) {
        e.preventDefault();
        post(route("verification.send"));
    }

    return (
        <div className="auth-shell">
            <Head title="Verifikasi Email" />
            <div className="hero-bg"></div>

            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="auth-logo-text">SiLapor</div>
                        <div className="auth-logo-sub">
                            Pengaduan Masyarakat
                        </div>
                    </div>
                </div>

                <h1>Verifikasi Email Anda</h1>
                <p className="subtitle">
                    Terima kasih sudah mendaftar! Sebelum bisa membuat
                    pengaduan, mohon klik link verifikasi yang sudah kami kirim
                    ke email Anda. Tidak menerima email? Kami bisa kirim ulang.
                </p>

                {status === "verification-link-sent" && (
                    <div
                        className="mb-4 text-sm font-medium"
                        style={{ color: "var(--teal)" }}
                    >
                        Link verifikasi baru sudah dikirim ke alamat email yang
                        Anda daftarkan.
                    </div>
                )}

                <form onSubmit={resend}>
                    <button className="btn" disabled={processing}>
                        {processing
                            ? "Mengirim..."
                            : "Kirim Ulang Email Verifikasi"}
                    </button>
                </form>

                <div className="switch-link">
                    <Link href={route("logout")} method="post" as="button">
                        Keluar
                    </Link>
                </div>
            </div>
        </div>
    );
}
