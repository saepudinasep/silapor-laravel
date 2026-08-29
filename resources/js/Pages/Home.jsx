import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Home({ pengaduans }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pengaduan Saya
                </h2>
            }
        >
            <Head title="Home" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {pengaduans.length === 0 ? (
                            <p className="text-gray-500">
                                Belum ada pengaduan yang kamu buat.
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {pengaduans.map((p) => (
                                    <li key={p.id} className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {p.isi_laporan}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(
                                                        p.tgl_pengaduan,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                    )}
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-gray-700">
                                                {p.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
