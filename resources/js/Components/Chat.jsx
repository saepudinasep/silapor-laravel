import { router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

export default function Chat({
    pengaduanId,
    initialMessages,
    sendUrl,
    onStatusChange,
}) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        const channel = window.Echo.private(`pengaduan.${pengaduanId}`);

        channel.listen(".pesan.baru", (e) => {
            setMessages((prev) =>
                prev.some((m) => m.id === e.id) ? prev : [...prev, e],
            );
        });

        channel.listen(".status.diubah", (e) => {
            onStatusChange?.(e.status);
        });

        return () => {
            window.Echo.leave(`pengaduan.${pengaduanId}`);
        };
    }, [pengaduanId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function handleSend(e) {
        e.preventDefault();
        if (!text.trim()) return;

        setSending(true);
        router.post(
            sendUrl,
            { isi_pesan: text },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setText(""),
                onFinish: () => setSending(false),
            },
        );
    }

    return (
        <div className="card" style={{ maxWidth: 640 }}>
            <div className="card-header">
                <div className="card-title">Percakapan</div>
            </div>

            <div
                style={{
                    maxHeight: 360,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    padding: "4px 2px",
                }}
            >
                {messages.length === 0 && (
                    <p
                        style={{
                            fontSize: 13,
                            color: "var(--muted)",
                            textAlign: "center",
                            padding: "20px 0",
                        }}
                    >
                        Belum ada percakapan. Mulai chat di bawah.
                    </p>
                )}

                {messages.map((m) => {
                    const isMine = m.pengirim.id === auth.user.id;
                    return (
                        <div
                            key={m.id}
                            style={{
                                alignSelf: isMine ? "flex-end" : "flex-start",
                                maxWidth: "75%",
                            }}
                        >
                            <div
                                style={{
                                    background: isMine
                                        ? "var(--teal)"
                                        : "rgba(255,255,255,0.06)",
                                    color: isMine ? "#04231f" : "var(--text)",
                                    borderRadius: 14,
                                    borderBottomRightRadius: isMine ? 4 : 14,
                                    borderBottomLeftRadius: isMine ? 14 : 4,
                                    padding: "8px 12px",
                                    fontSize: 13,
                                    lineHeight: 1.5,
                                }}
                            >
                                {!isMine && (
                                    <div
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            marginBottom: 2,
                                            opacity: 0.8,
                                        }}
                                    >
                                        {m.pengirim.name}
                                    </div>
                                )}
                                {m.isi_pesan}
                            </div>
                            <div
                                style={{
                                    fontSize: 10.5,
                                    color: "var(--muted)",
                                    marginTop: 3,
                                    textAlign: isMine ? "right" : "left",
                                }}
                            >
                                {new Date(m.created_at).toLocaleTimeString(
                                    "id-ID",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef}></div>
            </div>

            <form
                onSubmit={handleSend}
                style={{ display: "flex", gap: 8, marginTop: 14 }}
            >
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tulis pesan..."
                    style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "10px 12px",
                        color: "var(--text)",
                        fontSize: 13,
                    }}
                />
                <button
                    className="btn"
                    style={{ width: "auto" }}
                    disabled={sending}
                >
                    Kirim
                </button>
            </form>
        </div>
    );
}
