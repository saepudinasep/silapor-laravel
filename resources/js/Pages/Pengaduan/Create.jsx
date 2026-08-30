import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        isi_laporan: "",
        foto: null,
    });
    const [fotoName, setFotoName] = useState("");

    function handleFileChange(e) {
        const file = e.target.files[0];
        setData("foto", file);
        setFotoName(file ? file.name : "");
    }

    function submit(e) {
        e.preventDefault();
        post(route("pengaduan.store"), {
            forceFormData: true,
        });
    }

    return (
        <AppLayout title="Buat Laporan" eyebrow="Masyarakat">
            <Head title="Buat Laporan" />

            <div className="card" style={{ maxWidth: 560 }}>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="isi_laporan">Isi Laporan</label>
                        <textarea
                            id="isi_laporan"
                            rows={6}
                            value={data.isi_laporan}
                            onChange={(e) =>
                                setData("isi_laporan", e.target.value)
                            }
                            placeholder="Jelaskan detail kejadian/pengaduan Anda..."
                            required
                        />
                        {errors.isi_laporan && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.isi_laporan}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Foto Bukti (opsional)</label>
                        <label className="file-drop" htmlFor="foto-input">
                            {fotoName ||
                                "Klik untuk pilih foto, atau seret file ke sini"}
                        </label>
                        <input
                            id="foto-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        {errors.foto && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.foto}
                            </div>
                        )}
                    </div>

                    <button className="btn" disabled={processing}>
                        {processing ? "Mengirim..." : "Kirim Pengaduan"}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
