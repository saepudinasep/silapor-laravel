import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";

export default function PengaduanShow({ pengaduan }) {
    const { data, setData, post, processing, reset } = useForm({
        tanggapan: "",
    });

    function submitTanggapan(e) {
        e.preventDefault();
        post(route("petugas.pengaduan.tanggapan.store", pengaduan.id), {
            onSuccess: () => reset("tanggapan"),
        });
    }

    function handleStatusChange(e) {
        router.put(route("petugas.pengaduan.updateStatus", pengaduan.id), {
            status: e.target.value,
        });
    }

    return (
        <AppLayout title="Detail Pengaduan" eyebrow="Petugas">
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
                        value={pengaduan.status}
                        onChange={handleStatusChange}
                    >
                        <option value="baru">baru</option>
                        <option value="proses">proses</option>
                        <option value="selesai">selesai</option>
                    </select>
                </div>
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

                <form onSubmit={submitTanggapan} style={{ marginTop: 18 }}>
                    <div className="form-group">
                        <label htmlFor="tanggapan">Tulis Tanggapan</label>
                        <textarea
                            id="tanggapan"
                            rows={3}
                            value={data.tanggapan}
                            onChange={(e) =>
                                setData("tanggapan", e.target.value)
                            }
                            required
                        />
                    </div>
                    <button className="btn" disabled={processing}>
                        {processing ? "Mengirim..." : "Kirim Tanggapan"}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
