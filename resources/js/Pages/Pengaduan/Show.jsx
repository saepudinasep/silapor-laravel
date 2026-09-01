import AppLayout from "@/Layouts/AppLayout";
import Chat from "@/Components/Chat";
import { Head } from "@inertiajs/react";
import { useState } from "react";

function Show({ pengaduan }) {
    const [status, setStatus] = useState(pengaduan.status);

    return (
        <>
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
                    <span className={`badge ${status}`}>
                        <span className="badge-dot"></span>
                        {status}
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

            <Chat
                pengaduanId={pengaduan.id}
                initialMessages={pengaduan.pesans}
                sendUrl={route("pesan.store", pengaduan.id)}
                onStatusChange={setStatus}
            />
        </>
    );
}

Show.layout = (page) => (
    <AppLayout title="Detail Pengaduan" eyebrow="Masyarakat">
        {page}
    </AppLayout>
);

export default Show;
