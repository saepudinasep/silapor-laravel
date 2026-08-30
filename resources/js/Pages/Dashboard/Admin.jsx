import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function Admin({ stats }) {
    return (
        <AppLayout title="Dashboard" eyebrow="Ringkasan Sistem">
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
                <div className="card-header">
                    <div className="card-title">Aktivitas</div>
                </div>
                <div
                    style={{
                        padding: 20,
                        fontSize: 13.5,
                        color: "var(--muted)",
                    }}
                >
                    Data pengguna, laporan, dan pengelolaan petugas akan
                    ditambahkan di sini.
                </div>
            </div>
        </AppLayout>
    );
}
