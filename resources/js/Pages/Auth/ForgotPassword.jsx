import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { alertSuccess } from "@/utils/swal";
import { useEffect } from "react";
import "../../../css/landing.css";

export default function ForgotPassword({ status }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    useEffect(() => {
        if (flash?.success) {
            alertSuccess(flash.success);
        }
    }, [flash]);

    function submit(e) {
        e.preventDefault();
        post(route("password.email"));
    }

    return (
        <div className="auth-shell">
            <Head title="Lupa Password" />
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

                <h1>Lupa Password</h1>
                <p className="subtitle">
                    Masukkan email yang terdaftar, kami akan kirimkan link untuk
                    membuat password baru.
                </p>

                {status && (
                    <div
                        className="mb-4 text-sm font-medium"
                        style={{ color: "var(--teal)" }}
                    >
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            autoFocus
                            required
                        />
                        {errors.email && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <button className="btn" disabled={processing}>
                        {processing ? "Mengirim..." : "Kirim Link Reset"}
                    </button>
                </form>

                <div className="switch-link">
                    <Link href={route("login")}>Kembali masuk</Link>
                </div>
            </div>
        </div>
    );
}
