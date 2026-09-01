import AppLayout from "@/Layouts/AppLayout";
import Pagination from "@/Components/Pagination";
import { alertError, confirmAction, promptInput } from "@/utils/swal";
import { Head, Link, router } from "@inertiajs/react";

function Index({ list, totalAdmin, totalPetugas }) {
    async function handleDelete(id, nama) {
        const confirmed = await confirmAction({
            title: "Hapus akun ini?",
            text: `Akun "${nama}" akan dihapus permanen dan tidak bisa dikembalikan.`,
            confirmText: "Ya, hapus",
            danger: true,
        });

        if (!confirmed) return;

        router.delete(route("admin.petugas.destroy", id));
    }

    async function handleResetPassword(id, nama) {
        const newPassword = await promptInput({
            title: `Reset Password: ${nama}`,
            inputLabel: "Password baru (minimal 6 karakter)",
            inputType: "password",
            confirmText: "Simpan",
        });

        if (!newPassword) return;

        if (newPassword.length < 6) {
            alertError("Password terlalu pendek", "Minimal 6 karakter.");
            return;
        }

        router.put(route("admin.petugas.resetPassword", id), {
            password: newPassword,
        });
    }

    return (
        <>
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
                    <div className="card-title">
                        Daftar Pengguna
                        <span
                            style={{
                                fontWeight: 400,
                                color: "var(--muted)",
                                marginLeft: 8,
                            }}
                        >
                            ({list.total} total)
                        </span>
                    </div>
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
                            {list.data.length === 0 && (
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
                            {list.data.map((p) => (
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

            <Pagination links={list.links} />
        </>
    );
}

Index.layout = (page) => (
    <AppLayout title="Manajemen Pengguna" eyebrow="Administrator">
        {page}
    </AppLayout>
);

export default Index;
