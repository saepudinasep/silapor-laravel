import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";

function Edit({ petugas }) {
    const { data, setData, put, processing, errors } = useForm({
        name: petugas.name,
        telp: petugas.telp ?? "",
        role: petugas.role,
    });

    function submit(e) {
        e.preventDefault();
        put(route("admin.petugas.update", petugas.id));
    }

    return (
        <>
            <Head title="Edit Petugas" />

            <div className="card" style={{ maxWidth: 480 }}>
                <div className="card-header">
                    <div className="card-title">Ubah Data Petugas</div>
                </div>

                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="name">Nama Petugas</label>
                        <input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        {errors.name && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            value={petugas.username}
                            disabled
                            title="Username tidak bisa diubah"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telp">No. Telepon</label>
                        <input
                            id="telp"
                            value={data.telp}
                            onChange={(e) => setData("telp", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Level</label>
                        <select
                            id="role"
                            className="form-select"
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                        >
                            <option value="petugas">petugas</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                            className="btn"
                            disabled={processing}
                            style={{ width: "auto" }}
                        >
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                        <Link
                            href={route("admin.petugas.index")}
                            className="btn secondary"
                            style={{ width: "auto" }}
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => (
    <AppLayout title="Edit Petugas" eyebrow="Administrator">
        {page}
    </AppLayout>
);

export default Edit;
