import AppLayout from "@/Layouts/AppLayout";
import Pagination from "@/Components/Pagination";
import { Head, router } from "@inertiajs/react";

const STATUS_TABS = [
    { key: "", label: "Semua" },
    { key: "baru", label: "Baru" },
    { key: "proses", label: "Proses" },
    { key: "selesai", label: "Selesai" },
];

function Petugas({ pengaduans, summary, filters }) {
    function handleFilter(status) {
        router.get(route("petugas.dashboard"), status ? { status } : {}, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="Dashboard Petugas" />

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-val">{summary.baru ?? 0}</div>
                    <div className="stat-label">Pengaduan Baru</div>
                </div>
                <div className="stat-card amber">
                    <div className="stat-val">{summary.proses ?? 0}</div>
                    <div className="stat-label">Sedang Diproses</div>
                </div>
                <div className="stat-card teal">
                    <div className="stat-val">{summary.selesai ?? 0}</div>
                    <div className="stat-label">Selesai</div>
                </div>
            </div>

            <div className="filter-bar">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        className={filters.status === tab.key ? "active" : ""}
                        onClick={() => handleFilter(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="card table-card">
                <div className="card-header">
                    <div className="card-title">
                        Daftar Pengaduan
                        <span
                            style={{
                                fontWeight: 400,
                                color: "var(--muted)",
                                marginLeft: 8,
                            }}
                        >
                            ({pengaduans.total} total)
                        </span>
                    </div>
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
                            {pengaduans.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            textAlign: "center",
                                            padding: 24,
                                            color: "var(--muted)",
                                        }}
                                    >
                                        Tidak ada pengaduan
                                    </td>
                                </tr>
                            )}
                            {pengaduans.data.map((p) => (
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

            <Pagination links={pengaduans.links} />
        </>
    );
}

Petugas.layout = (page) => (
    <AppLayout title="Dashboard" eyebrow="Ringkasan Pengaduan">
        {page}
    </AppLayout>
);

export default Petugas;
