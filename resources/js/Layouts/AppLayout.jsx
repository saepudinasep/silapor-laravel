import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { alertError, alertSuccess, confirmAction } from "@/utils/swal";
import "../../css/landing.css";

const ICONS = {
    dashboard: (
        <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    plus: (
        <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
            />
        </svg>
    ),
    users: (
        <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
        </svg>
    ),
    report: (
        <svg
            width="16"
            height="16"
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
    ),
    logout: (
        <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25"
            />
        </svg>
    ),
    settings: (
        <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.216.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.369-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    ),
    menu: (
        <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
        </svg>
    ),
    close: (
        <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    ),
    bell: (
        <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.311 6.022c1.733.64 3.56 1.085 5.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
        </svg>
    ),
};

/**
 * `match` berisi pola nama route (bukan path) yang bikin item ini
 * ke-highlight aktif — dicek lewat Ziggy `route().current(pattern)`,
 * yang support wildcard "*".
 */
function navItemsForRole(role) {
    if (role === "masyarakat") {
        return [
            {
                label: "Utama",
                items: [
                    {
                        href: route("home", undefined, false),
                        match: ["home", "pengaduan.show"],
                        icon: "dashboard",
                        label: "Pengaduan Saya",
                    },
                    {
                        href: route("pengaduan.create", undefined, false),
                        match: ["pengaduan.create"],
                        icon: "plus",
                        label: "Buat Pengaduan",
                    },
                ],
            },
            {
                label: "Akun",
                items: [
                    {
                        href: route("profile.edit", undefined, false),
                        match: ["profile.edit"],
                        icon: "settings",
                        label: "Pengaturan",
                    },
                ],
            },
        ];
    }

    if (role === "admin") {
        return [
            {
                label: "Utama",
                items: [
                    {
                        href: route("admin.dashboard", undefined, false),
                        match: ["admin.dashboard"],
                        icon: "dashboard",
                        label: "Dashboard",
                    },
                    {
                        href: route("admin.petugas.index", undefined, false),
                        match: ["admin.petugas.*"],
                        icon: "users",
                        label: "Data Pengguna",
                    },
                    {
                        href: route("laporan.index", undefined, false),
                        match: ["laporan.index"],
                        icon: "report",
                        label: "Generate Laporan",
                    },
                ],
            },
            {
                label: "Akun",
                items: [
                    {
                        href: route("profile.edit", undefined, false),
                        match: ["profile.edit"],
                        icon: "settings",
                        label: "Pengaturan",
                    },
                ],
            },
        ];
    }

    // petugas
    return [
        {
            label: "Utama",
            items: [
                {
                    href: route("petugas.dashboard", undefined, false),
                    match: ["petugas.dashboard", "petugas.pengaduan.show"],
                    icon: "dashboard",
                    label: "Dashboard",
                },
                {
                    href: route("laporan.index", undefined, false),
                    match: ["laporan.index"],
                    icon: "report",
                    label: "Generate Laporan",
                },
            ],
        },
        {
            label: "Akun",
            items: [
                {
                    href: route("profile.edit", undefined, false),
                    match: ["profile.edit"],
                    icon: "settings",
                    label: "Pengaturan",
                },
            ],
        },
    ];
}

/** True kalau nama route saat ini cocok salah satu pola di `patterns`. */
function isActive(patterns) {
    return patterns.some((pattern) => route().current(pattern));
}

function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return new Date(iso).toLocaleDateString("id-ID");
}

/** Ke mana tombol "Lihat semua" ngarah, sesuai role. */
function dashboardHrefForRole(role) {
    if (role === "admin") return route("admin.dashboard", undefined, false);
    if (role === "petugas") return route("petugas.dashboard", undefined, false);
    return route("home", undefined, false);
}

function NotificationBell({ notifications, role }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Polling ringan — cek notifikasi baru tiap 20 detik tanpa reload halaman.
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["notifications"],
                preserveScroll: true,
                preserveState: true,
            });
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    if (!notifications) return null;

    const { count, latest } = notifications;
    const title = role === "masyarakat" ? "Balasan Petugas" : "Pengaduan Baru";
    const emptyText =
        role === "masyarakat"
            ? "Belum ada balasan baru."
            : "Tidak ada pengaduan baru.";

    return (
        <div ref={wrapperRef} style={{ position: "relative" }}>
            <button
                className="topbar-btn"
                onClick={() => setOpen((v) => !v)}
                style={{ position: "relative" }}
                aria-label="Notifikasi"
            >
                {ICONS.bell}
                {count > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            background: "var(--rose)",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            minWidth: 16,
                            height: 16,
                            borderRadius: 999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 3px",
                        }}
                    >
                        {count > 9 ? "9+" : count}
                    </span>
                )}
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        width: 320,
                        maxWidth: "90vw",
                        background: "var(--navy-card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                        zIndex: 50,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid var(--border)",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--text)",
                        }}
                    >
                        {title} {count > 0 && `(${count})`}
                    </div>

                    {latest.length === 0 && (
                        <div
                            style={{
                                padding: 20,
                                fontSize: 12.5,
                                color: "var(--muted)",
                                textAlign: "center",
                            }}
                        >
                            {emptyText}
                        </div>
                    )}

                    {latest.map((n) => (
                        <Link
                            key={n.id}
                            href={n.url}
                            onClick={() => setOpen(false)}
                            style={{
                                display: "block",
                                padding: "12px 16px",
                                borderBottom: "1px solid var(--border)",
                                textDecoration: "none",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 8,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 12.5,
                                        fontWeight: 600,
                                        color: "var(--text)",
                                    }}
                                >
                                    {n.judul}
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: "var(--muted)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {timeAgo(n.waktu)}
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "var(--muted)",
                                    marginTop: 4,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {n.isi}
                            </div>
                        </Link>
                    ))}

                    {count > 0 && (
                        <Link
                            href={dashboardHrefForRole(role)}
                            onClick={() => setOpen(false)}
                            style={{
                                display: "block",
                                textAlign: "center",
                                padding: "10px 16px",
                                fontSize: 12.5,
                                color: "var(--teal)",
                                fontWeight: 600,
                            }}
                        >
                            Lihat semua
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AppLayout({ title, eyebrow, children }) {
    const { auth, flash, notifications } = usePage().props;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
    }, [currentUrl]);

    useEffect(() => {
        if (flash?.success) {
            alertSuccess(flash.success);
        }
        if (flash?.error) {
            alertError("Gagal", flash.error);
        }
    }, [flash]);

    async function handleLogout() {
        const confirmed = await confirmAction({
            title: "Keluar dari akun?",
            text: "Anda perlu login kembali untuk mengakses SiLapor.",
            confirmText: "Ya, keluar",
            icon: "question",
        });

        if (!confirmed) return;

        router.post(route("logout"));
    }

    const user = auth.user;
    const role = user?.role;
    const sections = navItemsForRole(role);
    const displayName = user?.name ?? "Pengguna";
    const initial = displayName.charAt(0).toUpperCase();
    const roleLabel =
        role === "masyarakat"
            ? "Masyarakat"
            : role === "admin"
              ? "Administrator"
              : "Petugas";

    return (
        <div className="app-shell">
            <div className="hero-bg"></div>

            {sidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <aside className={`sidebar${sidebarOpen ? " mobile-open" : ""}`}>
                <div className="sidebar-logo">
                    <div className="logo-mark">
                        <div className="logo-icon">
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="logo-text">SiLapor</div>
                            <div className="logo-sub">Pengaduan Masyarakat</div>
                        </div>
                    </div>
                </div>

                {sections.map((section) => (
                    <div className="sidebar-section" key={section.label}>
                        <div className="sidebar-label">{section.label}</div>
                        {section.items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`nav-item${isActive(item.match) ? " active" : ""}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {ICONS[item.icon]}
                                {item.label}
                            </Link>
                        ))}
                    </div>
                ))}

                <div
                    className="sidebar-divider"
                    style={{ marginTop: "auto" }}
                ></div>
                <div className="sidebar-user">
                    <div className="user-avatar">{initial}</div>
                    <div>
                        <div className="user-name">{displayName}</div>
                        <div className="user-role">{roleLabel}</div>
                    </div>
                </div>
            </aside>

            <main className="main">
                <div className="topbar">
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen((v) => !v)}
                        aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}
                    >
                        {sidebarOpen ? ICONS.close : ICONS.menu}
                    </button>
                    <span className="topbar-title">{title}</span>
                    <div className="topbar-spacer"></div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <NotificationBell
                            notifications={notifications}
                            role={role}
                        />
                        <button className="topbar-btn" onClick={handleLogout}>
                            {ICONS.logout}{" "}
                            <span className="topbar-btn-label">Keluar</span>
                        </button>
                    </div>
                </div>

                <div className="content">
                    {(eyebrow || title) && (
                        <div className="page-header">
                            {eyebrow && (
                                <div className="page-eyebrow">{eyebrow}</div>
                            )}
                            <h1 className="page-title">{title}</h1>
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
