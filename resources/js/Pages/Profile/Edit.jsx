import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";

function ProfileInfoCard() {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            name: user.name,
            telp: user.telp ?? "",
        });

    function submit(e) {
        e.preventDefault();
        patch(route("profile.update"), { preserveScroll: true });
    }

    return (
        <div className="card" style={{ maxWidth: 520 }}>
            <div className="card-header">
                <div className="card-title">Informasi Akun</div>
            </div>

            <form onSubmit={submit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        value={user.username}
                        disabled
                        title="Username tidak bisa diubah"
                    />
                </div>

                {user.role === "masyarakat" && (
                    <div className="form-group">
                        <label htmlFor="nik">NIK</label>
                        <input
                            id="nik"
                            value={user.nik ?? "-"}
                            disabled
                            title="NIK tidak bisa diubah"
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="name">Nama Lengkap</label>
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
                    <label htmlFor="telp">No. Telepon</label>
                    <input
                        id="telp"
                        value={data.telp}
                        onChange={(e) => setData("telp", e.target.value)}
                    />
                    {errors.telp && (
                        <div
                            className="mt-1 text-sm"
                            style={{ color: "#ef4444" }}
                        >
                            {errors.telp}
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                        className="btn"
                        disabled={processing}
                        style={{ width: "auto" }}
                    >
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                    {recentlySuccessful && (
                        <span style={{ fontSize: 12.5, color: "var(--teal)" }}>
                            Tersimpan.
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}

function UpdatePasswordCard() {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    function submit(e) {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    }

    return (
        <div className="card" style={{ maxWidth: 520 }}>
            <div className="card-header">
                <div className="card-title">Ubah Password</div>
            </div>

            <form onSubmit={submit}>
                <div className="form-group">
                    <label htmlFor="current_password">Password Saat Ini</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        autoComplete="current-password"
                    />
                    {errors.current_password && (
                        <div
                            className="mt-1 text-sm"
                            style={{ color: "#ef4444" }}
                        >
                            {errors.current_password}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password Baru</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <div
                            className="mt-1 text-sm"
                            style={{ color: "#ef4444" }}
                        >
                            {errors.password}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password_confirmation">
                        Konfirmasi Password Baru
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <div
                            className="mt-1 text-sm"
                            style={{ color: "#ef4444" }}
                        >
                            {errors.password_confirmation}
                        </div>
                    )}
                </div>

                <button
                    className="btn"
                    disabled={processing}
                    style={{ width: "auto" }}
                >
                    {processing ? "Menyimpan..." : "Ubah Password"}
                </button>
            </form>
        </div>
    );
}

function DeleteAccountCard() {
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        password: "",
    });

    function submit(e) {
        e.preventDefault();
        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => setConfirming(false),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    }

    return (
        <div className="card" style={{ maxWidth: 520, borderColor: "#fecaca" }}>
            <div className="card-header">
                <div className="card-title" style={{ color: "#ef4444" }}>
                    Hapus Akun
                </div>
            </div>

            <p
                style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    marginBottom: 16,
                }}
            >
                Setelah akun dihapus, semua data terkait akan hilang permanen
                dan tidak bisa dikembalikan.
            </p>

            {!confirming ? (
                <button
                    className="btn danger"
                    style={{ width: "auto" }}
                    onClick={() => setConfirming(true)}
                >
                    Hapus Akun Saya
                </button>
            ) : (
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="delete_password">
                            Masukkan Password untuk Konfirmasi
                        </label>
                        <input
                            id="delete_password"
                            ref={passwordInput}
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        {errors.password && (
                            <div
                                className="mt-1 text-sm"
                                style={{ color: "#ef4444" }}
                            >
                                {errors.password}
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            className="btn danger"
                            disabled={processing}
                            style={{ width: "auto" }}
                        >
                            {processing ? "Menghapus..." : "Ya, Hapus Permanen"}
                        </button>
                        <button
                            type="button"
                            className="btn secondary"
                            style={{ width: "auto" }}
                            onClick={() => setConfirming(false)}
                        >
                            Batal
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function Edit() {
    return (
        <>
            <Head title="Pengaturan Akun" />

            <ProfileInfoCard />
            <UpdatePasswordCard />
            <DeleteAccountCard />
        </>
    );
}

Edit.layout = (page) => (
    <AppLayout title="Pengaturan Akun" eyebrow="Akun Saya">
        {page}
    </AppLayout>
);

export default Edit;
