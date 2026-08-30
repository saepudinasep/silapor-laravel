import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        username: "",
        password: "",
        telp: "",
        role: "petugas",
    });

    function submit(e) {
        e.preventDefault();
        post(route("admin.petugas.store"));
    }

    return (
        <AppLayout title="Tambah Petugas" eyebrow="Administrator">
            <Head title="Tambah Petugas" />

            <div className="card" style={{ maxWidth: 480 }}>
                <div className="card-header">
                    <div className="card-title">Data Petugas Baru</div>
                </div>

                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="name">Nama Petugas</label>
                        <input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        {errors.name && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.name}
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
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Level</label>
                        <select
                            id="role"
                            className="form-select"
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                        >
                            <option value="petugas">petugas</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                            className="btn"
                            disabled={processing}
                            style={{ width: "auto" }}
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                        <Link
                            href={route("admin.petugas.index")}
                            className="btn secondary"
                            style={{ width: "auto" }}
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
