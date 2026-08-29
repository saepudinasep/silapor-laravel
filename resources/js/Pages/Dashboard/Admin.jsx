import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Admin({ stats }) {
    const cards = [
        { label: "Total Masyarakat", value: stats.total_masyarakat },
        { label: "Total Petugas", value: stats.total_petugas },
        { label: "Total Pengaduan", value: stats.total_pengaduan },
        { label: "Pengaduan Baru", value: stats.pengaduan_baru },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Admin
                </h2>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {cards.map((c) => (
                            <div
                                key={c.label}
                                className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg"
                            >
                                <p className="text-sm text-gray-500">
                                    {c.label}
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {c.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
