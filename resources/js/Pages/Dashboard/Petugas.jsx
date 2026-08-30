import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

const STATUS_TABS = [
    { key: "", label: "Semua" },
    { key: "baru", label: "Baru" },
    { key: "proses", label: "Proses" },
    { key: "selesai", label: "Selesai" },
];

export default function Petugas({ pengaduans, summary }) {
    const [activeStatus, setActiveStatus] = useState("");

    const filtered = activeStatus
        ? pengaduans.filter((p) => p.status === activeStatus)
        : pengaduans;

    return (
        <AppLayout title="Dashboard" eyebrow="Ringkasan Pengaduan">
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
                        className={activeStatus === tab.key ? "active" : ""}
                        onClick={() => setActiveStatus(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="card table-card">
                <div className="card-header">
                    <div className="card-title">Daftar Pengaduan</div>
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
                            {filtered.length === 0 && (
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
                            {filtered.map((p) => (
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
                                        {/* TODO: ganti ke route('pengaduan.respond', p.id)
                                            begitu halaman tanggapan petugas sudah dibuat */}
                                        <a
                                            href="#"
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
        </AppLayout>
    );
}
