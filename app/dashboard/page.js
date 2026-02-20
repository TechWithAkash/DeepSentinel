"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ─── Mini Sparkline ────────────────────────────────────────── */
function Sparkline({ data, color }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const w = 80, h = 32, pad = 2;
    const pts = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = pad + ((max - v) / (max - min || 1)) * (h - pad * 2);
        return `${x},${y}`;
    });
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
            <polyline
                points={pts.join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

/* ─── SVG Donut Ring ────────────────────────────────────────── */
function Ring({ pct, color, size = 56, stroke = 5 }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct / 100)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 4px ${color})` }}
            />
        </svg>
    );
}

/* ─── Mini Bar Chart ────────────────────────────────────────── */
function BarChart({ data }) {
    const max = Math.max(...data.map((d) => d.val));
    return (
        <div className="flex items-end gap-1.5 h-16">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                        className="w-full rounded-t-sm transition-all duration-700 cursor-default"
                        title={`${d.label}: ${d.val}`}
                        style={{
                            height: `${(d.val / max) * 100}%`,
                            background: `linear-gradient(0deg, ${d.color}60, ${d.color})`,
                            boxShadow: `0 -2px 8px ${d.color}30`,
                            minHeight: 3,
                        }}
                    />
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#6B7A99", fontSize: 8 }}>{d.label}</span>
                </div>
            ))}
        </div>
    );
}

/* ─── Sidebar Nav Data ──────────────────────────────────────── */
const DASHBOARD_NAV = [
    { id: "overview", icon: "⊞", label: "Overview", badge: null },
    { id: "scans", icon: "🔍", label: "My Scans", badge: "12" },
    { id: "certificates", icon: "🔏", label: "Certificates", badge: null },
    { id: "api", icon: "🔌", label: "API Usage", badge: null },
    { id: "settings", icon: "⚙️", label: "Settings", badge: null },
];

const PLATFORM_NAV = [
    // { href: "/", icon: "🏠", label: "Home" },
    { href: "/analyze", icon: "🧬", label: "Analyze Content" },
    { href: "/results", icon: "📊", label: "Results" },
    { href: "/verify", icon: "🔐", label: "Verify / Certify" },
    { href: "/api-docs", icon: "📡", label: "API Docs" },
];

/* ─── Sidebar Component ─────────────────────────────────────── */
function Sidebar({ active, setActive, onLogout }) {
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div
                className="flex items-center gap-2.5 px-5 py-5"
                style={{ borderBottom: "1px solid rgba(0,255,209,0.07)" }}
            >
                <svg width="28" height="28" viewBox="0 0 72 72" fill="none">
                    <path
                        d="M36 4L8 16v20c0 16 11 28 28 32 17-4 28-16 28-32V16L36 4z"
                        stroke="#00FFD1" strokeWidth="1.5" fill="rgba(0,255,209,0.06)"
                    />
                    <circle cx="36" cy="33" r="9" fill="#00FFD1" opacity="0.9" />
                    <path d="M36 24L36 42M27 33L45 33" stroke="#030C18" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div>
                    <div className="font-black text-sm" style={{ color: "#E8EEFF" }}>VeraVision</div>
                    <div className="text-xs" style={{ color: "#6B7A99" }}>AI Truth Engine</div>
                </div>
                {/* Live dot */}
                <div className="ml-auto flex items-center gap-1">
                    <span
                        className="w-1.5 h-1.5 rounded-full animate-blink"
                        style={{ background: "#00E87A", boxShadow: "0 0 6px #00E87A" }}
                    />
                </div>
            </div>

            {/* User pill */}
            <div
                className="mx-4 my-4 p-3 rounded-xl flex items-center gap-3"
                style={{ background: "rgba(0,255,209,0.05)", border: "1px solid rgba(0,255,209,0.1)" }}
            >
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg, #00C4A0, #00FFD1)", color: "#030C18" }}
                >
                    A
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate" style={{ color: "#E8EEFF" }}>Akash Vishwakarma</div>
                    <div className="text-xs truncate" style={{ color: "#6B7A99" }}>akash@veravision.ai</div>
                </div>
                <span
                    className="text-xs px-1.5 py-0.5 rounded font-black shrink-0"
                    style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1", fontSize: 9 }}
                >
                    FREE
                </span>
            </div>

            {/* Scrollable nav */}
            <nav className="flex flex-col gap-0.5 px-3 flex-1" style={{ overflowY: "auto" }}>

                {/* ── Dashboard section ── */}
                <div
                    className="text-xs font-black uppercase tracking-widest px-3 pb-1 pt-1"
                    style={{ color: "#3A4560", letterSpacing: "0.1em" }}
                >
                    Dashboard
                </div>

                {DASHBOARD_NAV.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`sidebar-nav-item ${active === item.id ? "active" : ""}`}
                    >
                        <span style={{ fontSize: 14, minWidth: 18 }}>{item.icon}</span>
                        {item.label}
                        {item.badge && (
                            <span
                                className="ml-auto text-xs px-1.5 py-0.5 rounded font-black"
                                style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1", fontSize: 9 }}
                            >
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}

                {/* Divider */}
                <div className="my-3 mx-1" style={{ height: 1, background: "rgba(0,255,209,0.07)" }} />

                {/* ── Platform section ── */}
                <div
                    className="text-xs font-black uppercase tracking-widest px-3 pb-1"
                    style={{ color: "#3A4560", letterSpacing: "0.1em" }}
                >
                    Platform
                </div>

                {PLATFORM_NAV.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className="sidebar-nav-item">
                            <span style={{ fontSize: 14, minWidth: 18 }}>{item.icon}</span>
                            {item.label}
                            <span className="ml-auto text-xs" style={{ color: "#2A3550" }}>↗</span>
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Bottom CTA + logout */}
            <div
                className="px-3 pb-5 pt-4 flex flex-col gap-2"
                style={{ borderTop: "1px solid rgba(0,255,209,0.07)" }}
            >
                <Link href="/analyze">
                    <button className="btn-primary w-full py-2.5 text-xs">🔍 New Analysis</button>
                </Link>
                <button onClick={onLogout} className="btn-ghost w-full py-2.5 text-xs">⏻ Sign Out</button>
            </div>
        </aside>
    );
}

/* ─── Mock Data ─────────────────────────────────────────────── */
const RECENT_SCANS = [
    { id: "sc-001", name: "politician_video.mp4", type: "Video", verdict: "Deepfake", score: 92, risk: "CRITICAL", time: "2h ago", color: "#FF4E6A" },
    { id: "sc-002", name: "whatsapp_forward_img.jpg", type: "WhatsApp", verdict: "Manipulated", score: 83, risk: "HIGH", time: "5h ago", color: "#FF4E6A" },
    { id: "sc-003", name: "ceo_statement.mp3", type: "Audio", verdict: "Possibly Synthetic", score: 67, risk: "MEDIUM", time: "1d ago", color: "#FFB800" },
    { id: "sc-004", name: "product_photo.png", type: "Image", verdict: "Likely AI-Gen", score: 78, risk: "HIGH", time: "2d ago", color: "#FF4E6A" },
    { id: "sc-005", name: "press_release.txt", type: "Text", verdict: "AI-Written", score: 91, risk: "HIGH", time: "3d ago", color: "#FF4E6A" },
    { id: "sc-006", name: "product_photo_v2.jpg", type: "Image", verdict: "Authentic", score: 11, risk: "NONE", time: "5d ago", color: "#00E87A" },
];

const ACTIVITY = [
    { icon: "🔍", text: "Analyzed politician_video.mp4", sub: "92% deepfake confidence", time: "2h ago", color: "#FF4E6A" },
    { icon: "🔏", text: "Certificate issued for landscape.jpg", sub: "Hash: vv_auth_7a4f…", time: "6h ago", color: "#00E87A" },
    { icon: "📱", text: "WhatsApp forward flagged", sub: "Caption: FALSE claim", time: "1d ago", color: "#FFB800" },
    { icon: "🔌", text: "API key generated", sub: "vv_sk_live_…", time: "2d ago", color: "#3B82F6" },
    { icon: "🔍", text: "Analyzed ceo_statement.mp3", sub: "67% synthetic voice", time: "3d ago", color: "#FFB800" },
];

const WEEKLY = [
    { val: 5, label: "Mon", color: "#00FFD1" },
    { val: 12, label: "Tue", color: "#00FFD1" },
    { val: 8, label: "Wed", color: "#00FFD1" },
    { val: 19, label: "Thu", color: "#FF4E6A" },
    { val: 14, label: "Fri", color: "#00FFD1" },
    { val: 6, label: "Sat", color: "#00FFD1" },
    { val: 10, label: "Sun", color: "#00FFD1" },
];

const THREAT_DATA = [22, 35, 28, 54, 48, 61, 72, 58, 80, 72, 85, 78];

const STATS = [
    { label: "Total Scans", val: "74", delta: "+12 this week", icon: "🔍", color: "#00FFD1", spark: [3, 7, 5, 9, 12, 8, 14, 11, 16, 12] },
    { label: "Deepfakes Found", val: "38", delta: "51% detection rate", icon: "⚠️", color: "#FF4E6A", spark: [1, 3, 2, 5, 4, 6, 5, 8, 7, 9] },
    { label: "Certificates", val: "11", delta: "3 this month", icon: "🔏", color: "#00E87A", spark: [1, 1, 2, 2, 3, 3, 4, 5, 6, 7] },
    { label: "API Calls", val: "2,341", delta: "284 today", icon: "🔌", color: "#8B5CF6", spark: [50, 80, 120, 200, 150, 250, 200, 300, 280, 350] },
];

/* ─── Dashboard Page ────────────────────────────────────────── */
export default function DashboardPage() {
    const router = useRouter();
    const [active, setActive] = useState("overview");
    const [threatVal, setThreatVal] = useState(72);
    const [rings, setRings] = useState([0, 0, 0, 0]);

    // Animate rings in on mount
    useEffect(() => {
        const t = setTimeout(() => setRings([74, 91, 87, 22]), 350);
        return () => clearTimeout(t);
    }, []);

    // Live threat pulse
    useEffect(() => {
        const iv = setInterval(
            () => setThreatVal((v) => Math.max(55, Math.min(95, v + (Math.random() - 0.5) * 5))),
            3000
        );
        return () => clearInterval(iv);
    }, []);

    const onLogout = () => {
        localStorage.removeItem("vv_logged_in");
        router.push("/login");
    };

    const TYPE_ICON = { Video: "🎬", Audio: "🎵", Text: "📝", WhatsApp: "📱", Image: "🖼️" };

    return (
        <div className="flex min-h-screen" style={{ background: "var(--navy)" }}>
            <Sidebar active={active} setActive={setActive} onLogout={onLogout} />

            <main className="dashboard-main flex-1 bg-grid overflow-x-hidden">

                {/* ── Top bar ─────────────────────────────────────────── */}
                <div
                    className="sticky top-0 z-40 px-8 py-4 flex items-center justify-between"
                    style={{
                        background: "rgba(5,10,20,0.88)",
                        backdropFilter: "blur(20px)",
                        borderBottom: "1px solid rgba(0,255,209,0.06)",
                    }}
                >
                    <div>
                        <h1 className="font-black text-xl gradient-text">Dashboard</h1>
                        <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>
                            {new Date().toLocaleDateString("en-IN", {
                                weekday: "long", year: "numeric", month: "long", day: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Live threat bar */}
                        <div className="hidden md:flex items-center gap-3 glass px-4 py-2 rounded-xl">
                            <span className="status-live" />
                            <span className="text-xs font-bold" style={{ color: "#E8EEFF" }}>Global Threat</span>
                            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${threatVal}%`, background: "linear-gradient(90deg, #FFB800, #FF4E6A)" }}
                                />
                            </div>
                            <span className="text-xs font-black" style={{ color: "#FFB800" }}>{Math.round(threatVal)}%</span>
                        </div>
                        <Link href="/analyze">
                            <button className="btn-primary py-2 px-4 text-xs">+ New Scan</button>
                        </Link>
                    </div>
                </div>

                {/* ── Page Content ────────────────────────────────────── */}
                <div className="px-8 py-8">

                    {/* ═══ OVERVIEW ═══════════════════════════════════════ */}
                    {active === "overview" && (
                        <>
                            {/* Welcome banner */}
                            <div
                                className="relative rounded-2xl p-7 mb-8 overflow-hidden animate-fade-in"
                                style={{
                                    background: "linear-gradient(135deg, rgba(0,255,209,0.05) 0%, rgba(12,20,34,0.95) 100%)",
                                    border: "1px solid rgba(0,255,209,0.14)",
                                }}
                            >
                                <div className="hex-grid absolute inset-0 opacity-30 pointer-events-none" />
                                <div
                                    className="absolute left-0 right-0 h-px pointer-events-none"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, rgba(0,255,209,0.5), transparent)",
                                        animation: "scan-line 8s linear infinite",
                                        top: 0,
                                    }}
                                />
                                <div className="relative z-10 flex flex-wrap gap-6 items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="status-live" />
                                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#00E87A" }}>
                                                Active Session
                                            </span>
                                        </div>
                                        <h2 className="font-black text-2xl gradient-text">Good evening, Akash 👋</h2>
                                        <p className="text-sm mt-1" style={{ color: "#6B7A99" }}>
                                            You have <strong style={{ color: "#FFB800" }}>62 API calls</strong> remaining today.{" "}
                                            Your last scan was <strong style={{ color: "#00FFD1" }}>2 hours ago.</strong>
                                        </p>
                                    </div>
                                    {/* Health rings */}
                                    <div className="flex gap-4">
                                        {[
                                            { label: "Accuracy", pct: rings[0], color: "#00FFD1" },
                                            { label: "Uptime", pct: rings[1], color: "#00E87A" },
                                        ].map((r) => (
                                            <div key={r.label} className="text-center relative">
                                                <Ring pct={r.pct} color={r.color} size={64} stroke={5} />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="font-black text-xs" style={{ color: r.color }}>{r.pct}%</span>
                                                </div>
                                                <div className="text-xs mt-1" style={{ color: "#6B7A99" }}>{r.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Stat cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                                {STATS.map((s, i) => (
                                    <div
                                        key={s.label}
                                        className="stat-card animate-slide-up"
                                        style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#6B7A99" }}>
                                                    {s.label}
                                                </div>
                                                <div className="font-black text-3xl" style={{ color: s.color }}>{s.val}</div>
                                                <div className="text-xs mt-1" style={{ color: "#4B5568" }}>{s.delta}</div>
                                            </div>
                                            <div className="text-xl">{s.icon}</div>
                                        </div>
                                        <Sparkline data={s.spark} color={s.color} />
                                    </div>
                                ))}
                            </div>

                            {/* Middle row: weekly chart + activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                                {/* Weekly scans */}
                                <div
                                    className="lg:col-span-2 card p-6 rounded-2xl animate-slide-up"
                                    style={{ animationDelay: "0.2s", animationFillMode: "both" }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: "#E8EEFF" }}>📊 Scans This Week</h3>
                                            <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>74 total analyses · +12 from last week</p>
                                        </div>
                                        <div
                                            className="text-xs px-3 py-1 rounded-lg font-bold"
                                            style={{ background: "rgba(0,255,209,0.07)", color: "#00FFD1", border: "1px solid rgba(0,255,209,0.15)" }}
                                        >
                                            This week
                                        </div>
                                    </div>
                                    <BarChart data={WEEKLY} />

                                    {/* Type breakdown */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-5">
                                        {[
                                            { label: "Image", val: 28, color: "#00FFD1" },
                                            { label: "Video", val: 18, color: "#FF4E6A" },
                                            { label: "Audio", val: 9, color: "#8B5CF6" },
                                            { label: "Text", val: 12, color: "#3B82F6" },
                                            { label: "WhatsApp", val: 7, color: "#FFB800" },
                                        ].map((t) => (
                                            <div
                                                key={t.label}
                                                className="text-center p-3 rounded-xl"
                                                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,255,209,0.05)" }}
                                            >
                                                <div className="font-black text-lg" style={{ color: t.color }}>{t.val}</div>
                                                <div className="text-xs" style={{ color: "#6B7A99" }}>{t.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Activity feed */}
                                <div
                                    className="card p-5 rounded-2xl animate-slide-left"
                                    style={{ animationDelay: "0.25s", animationFillMode: "both" }}
                                >
                                    <h3 className="font-bold text-sm mb-4" style={{ color: "#E8EEFF" }}>⚡ Recent Activity</h3>
                                    <div className="space-y-1">
                                        {ACTIVITY.map((a, i) => (
                                            <div key={i} className="activity-item">
                                                <div
                                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0"
                                                    style={{ background: `${a.color}12`, border: `1px solid ${a.color}25` }}
                                                >
                                                    {a.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-semibold truncate" style={{ color: "#E8EEFF" }}>{a.text}</div>
                                                    <div className="text-xs truncate" style={{ color: "#6B7A99" }}>{a.sub}</div>
                                                </div>
                                                <div className="text-xs shrink-0" style={{ color: "#4B5568" }}>{a.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/verify">
                                        <button className="btn-outline w-full mt-4 text-xs py-2">View All Activity →</button>
                                    </Link>
                                </div>
                            </div>

                            {/* Threat intelligence */}
                            <div
                                className="card p-6 rounded-2xl animate-fade-in mb-8"
                                style={{ animationDelay: "0.3s", animationFillMode: "both" }}
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h3 className="font-bold text-sm" style={{ color: "#E8EEFF" }}>🌐 Global Threat Intelligence</h3>
                                        <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>Live deepfake prevalence by modality</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="status-live" />
                                        <span className="text-xs font-bold" style={{ color: "#00E87A" }}>LIVE</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Image Deepfakes", pct: rings[0], color: "#FF4E6A", icon: "🖼️" },
                                        { label: "Voice Clones", pct: rings[1], color: "#FFB800", icon: "🎵" },
                                        { label: "Video Deepfakes", pct: rings[2], color: "#8B5CF6", icon: "🎬" },
                                        { label: "AI-Written Text", pct: rings[3], color: "#3B82F6", icon: "📝" },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center gap-4 p-4 rounded-xl"
                                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,255,209,0.05)" }}
                                        >
                                            <div className="relative shrink-0">
                                                <Ring pct={item.pct} color={item.color} size={52} stroke={4} />
                                                <div className="absolute inset-0 flex items-center justify-center text-base">{item.icon}</div>
                                            </div>
                                            <div>
                                                <div className="font-black text-lg" style={{ color: item.color }}>{item.pct}%</div>
                                                <div className="text-xs" style={{ color: "#6B7A99", maxWidth: 80, lineHeight: 1.3 }}>{item.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Threat timeline */}
                                <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(0,255,209,0.05)" }}>
                                    <div className="text-xs mb-3 font-bold uppercase tracking-wider" style={{ color: "#6B7A99" }}>
                                        Threat trend (last 12 months)
                                    </div>
                                    <div className="flex items-end gap-1 h-16">
                                        {THREAT_DATA.map((v, i) => {
                                            const c = v > 70 ? "#FF4E6A" : v > 50 ? "#FFB800" : "#00FFD1";
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex-1 rounded-t transition-all duration-700 cursor-default"
                                                    title={`Month ${i + 1}: ${v}%`}
                                                    style={{ height: `${(v / 100) * 100}%`, background: `${c}70`, boxShadow: `0 -2px 6px ${c}30`, minHeight: 3 }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { href: "/analyze", icon: "🔍", title: "Analyze Content", sub: "Upload & detect fakes", color: "#00FFD1", bg: "rgba(0,255,209,0.05)" },
                                    { href: "/verify", icon: "🔏", title: "Issue Certificate", sub: "Prove content authenticity", color: "#00E87A", bg: "rgba(0,232,122,0.05)" },
                                    { href: "/api-docs", icon: "🔌", title: "TrustScore API", sub: "Integrate detection in your app", color: "#8B5CF6", bg: "rgba(139,92,246,0.05)" },
                                ].map((item) => (
                                    <Link key={item.href} href={item.href}>
                                        <div
                                            className="p-6 rounded-2xl text-center cursor-pointer transition-all hover:-translate-y-1"
                                            style={{ background: item.bg, border: `1px solid ${item.color}20` }}
                                        >
                                            <div style={{ fontSize: 32 }}>{item.icon}</div>
                                            <div className="font-bold text-sm mt-3 mb-1" style={{ color: "#E8EEFF" }}>{item.title}</div>
                                            <div className="text-xs" style={{ color: "#6B7A99" }}>{item.sub}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ═══ MY SCANS ════════════════════════════════════════ */}
                    {active === "scans" && (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-black text-2xl gradient-text">My Scans</h2>
                                <Link href="/analyze">
                                    <button className="btn-primary py-2.5 px-5 text-sm">+ New Scan</button>
                                </Link>
                            </div>

                            <div className="card rounded-2xl overflow-hidden">
                                {/* Table header */}
                                <div
                                    className="grid grid-cols-6 gap-4 px-6 py-3 text-xs font-black uppercase tracking-widest"
                                    style={{ background: "rgba(0,255,209,0.04)", color: "#6B7A99", borderBottom: "1px solid rgba(0,255,209,0.06)" }}
                                >
                                    <div className="col-span-2">File</div>
                                    <div>Type</div>
                                    <div>Verdict</div>
                                    <div>Risk</div>
                                    <div>Time</div>
                                </div>

                                {RECENT_SCANS.map((scan, i) => (
                                    <Link href="/results" key={scan.id}>
                                        <div
                                            className="grid grid-cols-6 gap-4 px-6 py-4 items-center transition-all cursor-pointer animate-slide-up"
                                            style={{ borderBottom: "1px solid rgba(0,255,209,0.04)", animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,255,209,0.02)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <div className="col-span-2 flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                                                    style={{ background: `${scan.color}12`, border: `1px solid ${scan.color}25` }}
                                                >
                                                    {TYPE_ICON[scan.type] || "📄"}
                                                </div>
                                                <span className="text-xs font-medium truncate" style={{ color: "#E8EEFF" }}>{scan.name}</span>
                                            </div>
                                            <div className="text-xs" style={{ color: "#6B7A99" }}>{scan.type}</div>
                                            <div className="text-xs font-bold" style={{ color: scan.color }}>{scan.verdict}</div>
                                            <div>
                                                <span
                                                    className="text-xs font-black px-2 py-0.5 rounded"
                                                    style={{
                                                        background:
                                                            scan.risk === "CRITICAL" ? "rgba(255,78,106,0.15)"
                                                                : scan.risk === "HIGH" ? "rgba(255,78,106,0.1)"
                                                                    : scan.risk === "MEDIUM" ? "rgba(255,184,0,0.1)"
                                                                        : "rgba(0,232,122,0.1)",
                                                        color:
                                                            scan.risk === "NONE" ? "#00E87A"
                                                                : scan.risk === "MEDIUM" ? "#FFB800"
                                                                    : "#FF4E6A",
                                                    }}
                                                >
                                                    {scan.risk}
                                                </span>
                                            </div>
                                            <div className="text-xs" style={{ color: "#4B5568" }}>{scan.time}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ PLACEHOLDER TABS ════════════════════════════════ */}
                    {(active === "certificates" || active === "api" || active === "settings") && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 animate-fade-in">
                            <div style={{ fontSize: 64 }}>
                                {active === "certificates" ? "🔏" : active === "api" ? "🔌" : "⚙️"}
                            </div>
                            <h2 className="font-black text-3xl gradient-text">
                                {active === "certificates" ? "Authenticity Certificates"
                                    : active === "api" ? "API Management"
                                        : "Account Settings"}
                            </h2>
                            <p className="text-sm text-center max-w-md" style={{ color: "#6B7A99", lineHeight: 1.7 }}>
                                {active === "certificates"
                                    ? "Issue and manage cryptographic authenticity certificates. C2PA v1.3 compatible, QR-verifiable."
                                    : active === "api"
                                        ? "Manage your API keys, view rate limits, and monitor usage across your integrations."
                                        : "Manage your profile, notification preferences, API quotas, and billing settings."}
                            </p>
                            <Link href={active === "certificates" ? "/verify" : active === "api" ? "/api-docs" : "#"}>
                                <button className="btn-primary px-8 py-3">
                                    {active === "certificates" ? "Go to Verify →"
                                        : active === "api" ? "View API Docs →"
                                            : "Edit Settings →"}
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
