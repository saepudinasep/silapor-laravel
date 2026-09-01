import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

function Admin({ stats, recentPengaduan }) {
    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-val">{stats.total_masyarakat}</div>
                    <div className="stat-label">Total Masyarakat</div>
                </div>
                <div className="stat-card">
                    <div className="stat-val">{stats.total_petugas}</div>
                    <div className="stat-label">Total Petugas</div>
                </div>
                <div className="stat-card teal">
                    <div className="stat-val">{stats.total_pengaduan}</div>
                    <div className="stat-label">Total Pengaduan</div>
                </div>
                <div className="stat-card amber">
                    <div className="stat-val">{stats.pengaduan_baru}</div>
                    <div className="stat-label">Pengaduan Baru</div>
                </div>
            </div>

            <div className="card table-card">
                <div
                    className="card-header"
                    style={{
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 10,
                    }}
                >
                    <div className="card-title">
                        Aktivitas Pengaduan Terbaru
                    </div>
                    <Link
                        href={route("laporan.index")}
                        className="btn btn-small secondary"
                        style={{ width: "auto" }}
                    >
                        Lihat Semua Laporan
                    </Link>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Pelapor</th>
                                <th>Isi Laporan</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPengaduan.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            textAlign: "center",
                                            padding: 24,
                                            color: "var(--muted)",
                                        }}
                                    >
                                        Belum ada pengaduan masuk
                                    </td>
                                </tr>
                            )}
                            {recentPengaduan.map((p) => (
                                <tr key={p.id}>
                                    <td
                                        style={{
                                            whiteSpace: "nowrap",
                                            color: "var(--muted)",
                                        }}
                                    >
                                        {new Date(
                                            p.tgl_pengaduan,
                                        ).toLocaleDateString("id-ID")}
                                    </td>
                                    <td>{p.pelapor?.name ?? "-"}</td>
                                    <td>
                                        {p.isi_laporan.length > 60
                                            ? p.isi_laporan.slice(0, 60) + "..."
                                            : p.isi_laporan}
                                    </td>
                                    <td>
                                        <span className={`badge ${p.status}`}>
                                            <span className="badge-dot"></span>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        <a
                                            href={route(
                                                "petugas.pengaduan.show",
                                                p.id,
                                            )}
                                            className="btn btn-small secondary"
                                        >
                                            Detail
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Admin.layout = (page) => (
    <AppLayout title="Dashboard" eyebrow="Ringkasan Sistem">
        {page}
    </AppLayout>
);

export default Admin;
