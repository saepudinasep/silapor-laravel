import AppLayout from "@/Layouts/AppLayout";
import { alertError } from "@/utils/swal";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ pengaduans, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [status, setStatus] = useState(filters.status);
    const [loading, setLoading] = useState(false);

    function handleGenerate(e) {
        e.preventDefault();
        setLoading(true);
        router.get(
            route("laporan.index"),
            { start_date: startDate, end_date: endDate, status },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setLoading(false),
            },
        );
    }

    function buildRows() {
        return pengaduans.map((p, i) => [
            i + 1,
            new Date(p.tgl_pengaduan).toLocaleDateString("id-ID"),
            p.pelapor?.name || "-",
            p.isi_laporan.length > 80
                ? p.isi_laporan.slice(0, 80) + "..."
                : p.isi_laporan,
            p.status,
        ]);
    }

    async function handleExportPDF() {
        if (pengaduans.length === 0) {
            alertError(
                "Tidak ada data",
                'Klik "Tampilkan" dahulu untuk memuat data sesuai filter',
            );
            return;
        }

        const { default: jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");

        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text("Laporan Rekap Pengaduan Masyarakat", 14, 16);
        doc.setFontSize(10);
        doc.text(
            `Periode: ${startDate} s/d ${endDate}${status ? `  ·  Status: ${status}` : ""}`,
            14,
            22,
        );

        autoTable(doc, {
            startY: 28,
            head: [["No", "Tanggal", "Pelapor", "Isi Laporan", "Status"]],
            body: buildRows(),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 106, 94] },
        });

        doc.save(`laporan-pengaduan_${startDate}_${endDate}.pdf`);
    }

    async function handleExportExcel() {
        if (pengaduans.length === 0) {
            alertError(
                "Tidak ada data",
                'Klik "Tampilkan" dahulu untuk memuat data sesuai filter',
            );
            return;
        }

        const XLSX = await import("xlsx");

        const rows = pengaduans.map((p, i) => ({
            No: i + 1,
            Tanggal: new Date(p.tgl_pengaduan).toLocaleDateString("id-ID"),
            Pelapor: p.pelapor?.name || "-",
            "Isi Laporan": p.isi_laporan,
            Status: p.status,
        }));

        const ws = XLSX.utils.json_to_sheet(rows);
        ws["!cols"] = [
            { wch: 5 },
            { wch: 12 },
            { wch: 22 },
            { wch: 60 },
            { wch: 10 },
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rekap Pengaduan");
        XLSX.writeFile(wb, `laporan-pengaduan_${startDate}_${endDate}.xlsx`);
    }

    return (
        <AppLayout title="Generate Laporan" eyebrow="Rekap & Ekspor">
            <Head title="Generate Laporan" />

            <div className="card" style={{ maxWidth: 720 }}>
                <div className="card-header">
                    <div className="card-title">Filter Laporan</div>
                </div>

                <form onSubmit={handleGenerate} className="filter-grid">
                    <div className="form-group">
                        <label>Dari Tanggal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Sampai Tanggal</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="baru">Baru</option>
                            <option value="proses">Proses</option>
                            <option value="selesai">Selesai</option>
                        </select>
                    </div>
                    <div
                        className="form-group full"
                        style={{ gridColumn: "1 / -1" }}
                    >
                        <button
                            className="btn"
                            disabled={loading}
                            style={{ width: "auto" }}
                        >
                            {loading ? "Memuat..." : "Tampilkan"}
                        </button>
                    </div>
                </form>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 16,
                    flexWrap: "wrap",
                }}
            >
                <button
                    className="btn secondary"
                    style={{ width: "auto" }}
                    onClick={handleExportPDF}
                >
                    <svg
                        width="15"
                        height="15"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                    </svg>
                    Export PDF
                </button>
                <button
                    className="btn secondary"
                    style={{ width: "auto" }}
                    onClick={handleExportExcel}
                >
                    <svg
                        width="15"
                        height="15"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                    </svg>
                    Export Excel
                </button>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 12.5,
                        color: "var(--muted)",
                    }}
                >
                    {pengaduans.length} laporan ditemukan
                </span>
            </div>

            <div className="card table-card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Pelapor</th>
                                <th>Isi Laporan</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pengaduans.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        style={{
                                            textAlign: "center",
                                            padding: 24,
                                            color: "var(--muted)",
                                        }}
                                    >
                                        Tidak ada data pada rentang & filter ini
                                    </td>
                                </tr>
                            )}
                            {pengaduans.map((p) => (
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
                                    <td>{p.pelapor?.name || "-"}</td>
                                    <td>
                                        {p.isi_laporan.length > 90
                                            ? p.isi_laporan.slice(0, 90) + "..."
                                            : p.isi_laporan}
                                    </td>
                                    <td>
                                        <span className={`badge ${p.status}`}>
                                            <span className="badge-dot"></span>
                                            {p.status}
                                        </span>
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
