import AppLayout from "@/Layouts/AppLayout";
import Chat from "@/Components/Chat";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

function PengaduanShow({ pengaduan }) {
    const [status, setStatus] = useState(pengaduan.status);

    function handleStatusChange(e) {
        const newStatus = e.target.value;
        setStatus(newStatus);
        router.put(route("petugas.pengaduan.updateStatus", pengaduan.id), {
            status: newStatus,
        });
    }

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

                {pengaduan.pelapor?.name && (
                    <p
                        style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            marginTop: 14,
                        }}
                    >
                        Pelapor:{" "}
                        <strong style={{ color: "var(--text)" }}>
                            {pengaduan.pelapor.name}
                        </strong>
                    </p>
                )}

                <div
                    className="form-group"
                    style={{ marginTop: 18, maxWidth: 220 }}
                >
                    <label htmlFor="status">Ubah Status</label>
                    <select
                        id="status"
                        className="form-select"
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <option value="baru">baru</option>
                        <option value="proses">proses</option>
                        <option value="selesai">selesai</option>
                    </select>
                </div>
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

PengaduanShow.layout = (page) => (
    <AppLayout title="Detail Pengaduan" eyebrow="Petugas">
        {page}
    </AppLayout>
);

export default PengaduanShow;
