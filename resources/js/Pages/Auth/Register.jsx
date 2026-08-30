import { Head, Link, useForm } from "@inertiajs/react";
import "../../../css/landing.css";

export default function Register() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        nik: "",
        nama: "",
        username: "",
        password: "",
        telp: "",
    });

    useEffect(() => {
        if (flash?.success) {
            alertSuccess(flash.success);
        }
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="auth-shell">
            <Head title="Daftar Akun" />
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

                <h1>Daftar Akun</h1>
                <p className="subtitle">
                    Buat akun untuk mulai melaporkan pengaduan
                </p>

                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="nik">NIK (16 digit)</label>
                        <input
                            id="nik"
                            value={data.nik}
                            maxLength={16}
                            onChange={(e) => setData("nik", e.target.value)}
                            required
                        />
                        {errors.nik && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.nik}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="nama">Nama Lengkap</label>
                        <input
                            id="nama"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                            required
                        />
                        {errors.nama && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.nama}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            value={data.username}
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
                        <label htmlFor="telp">No. Telepon</label>
                        <input
                            id="telp"
                            value={data.telp}
                            onChange={(e) => setData("telp", e.target.value)}
                        />
                        {errors.telp && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.telp}
                            </div>
                        )}
                    </div>

                    <button className="btn" disabled={processing}>
                        {processing ? "Memproses..." : "Daftar"}
                    </button>
                </form>

                <div className="switch-link">
                    Sudah punya akun? <Link href={route("login")}>Masuk</Link>
                </div>
            </div>
        </div>
    );
}
