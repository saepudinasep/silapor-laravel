import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function Show({ pengaduan }) {
    return (
        <AppLayout title="Detail Pengaduan" eyebrow="Masyarakat">
            <Head title="Detail Pengaduan" />

            <div className="card" style={{ maxWidth: 640 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 8,
                    }}
                >
                    <span className={`badge ${pengaduan.status}`}>
                        <span className="badge-dot"></span>
                        {pengaduan.status}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        {new Date(pengaduan.tgl_pengaduan).toLocaleString(
                            "id-ID",
                        )}
                    </span>
                </div>

                <p style={{ marginTop: 16, fontSize: 13.5, lineHeight: 1.65 }}>
                    {pengaduan.isi_laporan}
                </p>

                {pengaduan.foto && (
                    <img
                        className="foto-preview"
                        src={`/storage/${pengaduan.foto}`}
                        alt="Bukti pengaduan"
                    />
                )}
            </div>

            <div className="card" style={{ maxWidth: 640 }}>
                <div className="card-header">
                    <div className="card-title">Tanggapan</div>
                </div>

                {pengaduan.tanggapans.length === 0 && (
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>
                        Belum ada tanggapan dari petugas.
                    </p>
                )}

                {pengaduan.tanggapans.map((t) => (
                    <div key={t.id} className="tanggapan-item">
                        <div>{t.tanggapan}</div>
                        <div className="meta">
                            {t.petugas?.name ?? "Petugas"} ·{" "}
                            {new Date(t.tgl_tanggapan).toLocaleString("id-ID")}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
