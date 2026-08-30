import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const statusStyle = {
    baru: "bg-blue-100 text-blue-700",
    proses: "bg-yellow-100 text-yellow-700",
    selesai: "bg-green-100 text-green-700",
};

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                statusStyle[status] ?? "bg-gray-100 text-gray-700"
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <svg
                width="42"
                height="42"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mb-3 text-gray-400"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
            </svg>
            <p className="font-medium text-gray-900">Belum Ada Pengaduan</p>
            <p className="mt-1 text-sm text-gray-500">
                Klik tombol &quot;Laporan Baru&quot; untuk membuat laporan
                pertama Anda.
            </p>
        </div>
    );
}

export default function Home({ pengaduans }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pengaduan Saya
                </h2>
            }
        >
            <Head title="Pengaduan Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-4 sm:px-6 lg:px-8">
                    {pengaduans.length === 0 ? (
                        <EmptyState />
                    ) : (
                        pengaduans.map((p) => (
                            <Link
                                key={p.id}
                                // href={route("pengaduan.show", p.id)}
                                className="block rounded-lg bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <StatusBadge status={p.status} />
                                    <span className="text-xs text-gray-500">
                                        {new Date(
                                            p.tgl_pengaduan,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                                    {p.isi_laporan.length > 140
                                        ? p.isi_laporan.slice(0, 140) + "..."
                                        : p.isi_laporan}
                                </p>
                            </Link>
                        ))
                    )}
                </div>

                {/* Tombol mengambang, mirip FAB di project lama */}
                <Link
                    // href={route("pengaduan.create")}
                    className="fixed bottom-8 right-8 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-700"
                >
                    <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Laporan Baru
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
