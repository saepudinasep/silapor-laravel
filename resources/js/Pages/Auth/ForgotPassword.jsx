import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import "../../../css/landing.css";

export default function ForgotPassword() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        as_role: "masyarakat",
        identifier: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (flash?.success) {
            alertSuccess(flash.success);
        }
    }, [flash]);

    function submit(e) {
        e.preventDefault();
        post(route("password.email"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
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
                    Verifikasi identitas Anda, lalu buat password baru
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 18,
                        background: "rgba(255,255,255,0.05)",
                        padding: 4,
                        borderRadius: 10,
                    }}
                >
                    <button
                        type="button"
                        className={
                            data.as_role === "masyarakat"
                                ? "btn"
                                : "btn secondary"
                        }
                        style={{ flex: 1, width: "auto" }}
                        onClick={() => setData("as_role", "masyarakat")}
                    >
                        Masyarakat
                    </button>
                    <button
                        type="button"
                        className={
                            data.as_role === "petugas" ? "btn" : "btn secondary"
                        }
                        style={{ flex: 1, width: "auto" }}
                        onClick={() => setData("as_role", "petugas")}
                    >
                        Petugas / Admin
                    </button>
                </div>

                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="identifier">
                            {data.as_role === "masyarakat"
                                ? "NIK (16 digit)"
                                : "Username"}
                        </label>
                        <input
                            id="identifier"
                            value={data.identifier}
                            maxLength={
                                data.as_role === "masyarakat" ? 16 : undefined
                            }
                            onChange={(e) =>
                                setData("identifier", e.target.value)
                            }
                            required
                        />
                        {errors.identifier && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.identifier}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password Baru</label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        {errors.password && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirmation">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                    </div>

                    <button className="btn" disabled={processing}>
                        {processing ? "Memproses..." : "Reset Password"}
                    </button>
                </form>

                <div className="switch-link">
                    Sudah ingat password?{" "}
                    <Link href={route("login")}>Kembali masuk</Link>
                </div>
            </div>
        </div>
    );
}
