import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ list, totalAdmin, totalPetugas }) {
    function handleDelete(id, nama) {
        if (
            !window.confirm(
                `Akun "${nama}" akan dihapus permanen dan tidak bisa dikembalikan. Lanjutkan?`,
            )
        ) {
            return;
        }
        router.delete(route("admin.petugas.destroy", id));
    }

    function handleResetPassword(id, nama) {
        const newPassword = window.prompt(
            `Password baru untuk ${nama} (minimal 6 karakter):`,
        );
        if (!newPassword) return;

        router.put(route("admin.petugas.resetPassword", id), {
            password: newPassword,
        });
    }

    return (
        <AppLayout title="Manajemen Pengguna" eyebrow="Administrator">
            <Head title="Manajemen Pengguna" />

            <div className="stats-row cols-2">
                <div className="stat-card rose">
                    <div className="stat-val">{totalAdmin}</div>
                    <div className="stat-label">Administrator</div>
                </div>
                <div className="stat-card amber">
                    <div className="stat-val">{totalPetugas}</div>
                    <div className="stat-label">Petugas</div>
                </div>
            </div>

            <div className="card table-card">
                <div
                    className="card-header"
                    style={{
                        padding: "18px 22px",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 10,
                    }}
                >
                    <div className="card-title">Daftar Pengguna</div>
                    <Link
                        href={route("admin.petugas.create")}
                        className="btn"
                        style={{ width: "auto" }}
                    >
                        + Tambah Petugas
                    </Link>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Username</th>
                                <th>Telp</th>
                                <th>Level</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            textAlign: "center",
                                            padding: 24,
                                            color: "var(--muted)",
                                        }}
                                    >
                                        Belum ada pengguna
                                    </td>
                                </tr>
                            )}
                            {list.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.username}</td>
                                    <td>{p.telp || "-"}</td>
                                    <td>
                                        <span className={`role-pill ${p.role}`}>
                                            {p.role}
                                        </span>
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <Link
                                            href={route(
                                                "admin.petugas.edit",
                                                p.id,
                                            )}
                                            className="btn btn-small secondary"
                                            style={{ marginRight: 6 }}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-small secondary"
                                            style={{ marginRight: 6 }}
                                            onClick={() =>
                                                handleResetPassword(
                                                    p.id,
                                                    p.name,
                                                )
                                            }
                                        >
                                            Reset Password
                                        </button>
                                        <button
                                            className="btn btn-small danger"
                                            onClick={() =>
                                                handleDelete(p.id, p.name)
                                            }
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
