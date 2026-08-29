import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Petugas({ pengaduans }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Petugas
                </h2>
            }
        >
            <Head title="Dashboard Petugas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {pengaduans.length === 0 ? (
                            <p className="text-gray-500">
                                Belum ada pengaduan masuk.
                            </p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                            Pelapor
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                            Isi Laporan
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {pengaduans.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-3 py-2">
                                                {p.pelapor?.name}
                                            </td>
                                            <td className="px-3 py-2">
                                                {p.isi_laporan}
                                            </td>
                                            <td className="px-3 py-2">
                                                {p.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
