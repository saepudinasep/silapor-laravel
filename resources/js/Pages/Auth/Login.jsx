import { Head, Link, useForm } from "@inertiajs/react";
import "../../../css/landing.css";
import Checkbox from "@/Components/Checkbox";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="auth-shell">
            <Head title="Log In" />
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

                <h1>Masuk</h1>
                <p className="subtitle">
                    Login untuk membuat laporan, atau mengelola & menanggapi
                    pengaduan (petugas/admin)
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
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            required
                        />
                        {errors.username && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.username}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
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

                    <div className="mt-4 mb-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-400">
                                Ingat Saya
                            </span>
                        </label>
                    </div>

                    <button className="btn" disabled={processing}>
                        {processing ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <div className="switch-link">
                    Belum punya akun?{" "}
                    <Link href={route("register")}>Daftar di sini</Link>
                    {canResetPassword && (
                        <>
                            <br />
                            <Link href={route("password.request")}>
                                Lupa password?
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
