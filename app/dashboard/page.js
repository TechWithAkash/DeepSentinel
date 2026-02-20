"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import AppLayout from "../../components/AppLayout";
import {
    Activity, ShieldCheck, Webhook, Settings, Image as ImageIcon,
    Film, Music, FileText, Smartphone, Search, AlertTriangle,
    CheckCircle2, Play, Copy, ExternalLink, KeySquare, ShieldAlert,
    Eye, EyeOff, Lock, BarChart2, Zap
} from "lucide-react";

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
    { icon: <Search size={16} />, text: "Analyzed politician_video.mp4", sub: "92% deepfake confidence", time: "2h ago", color: "#FF4E6A" },
    { icon: <ShieldCheck size={16} />, text: "Certificate issued for landscape.jpg", sub: "Hash: vv_auth_7a4f…", time: "6h ago", color: "#00E87A" },
    { icon: <Smartphone size={16} />, text: "WhatsApp forward flagged", sub: "Caption: FALSE claim", time: "1d ago", color: "#FFB800" },
    { icon: <Webhook size={16} />, text: "API key generated", sub: "vv_sk_live_…", time: "2d ago", color: "#3B82F6" },
    { icon: <Search size={16} />, text: "Analyzed ceo_statement.mp3", sub: "67% synthetic voice", time: "3d ago", color: "#FFB800" },
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
    { label: "Total Scans", val: "74", delta: "+12 this week", icon: <Search size={24} />, color: "#00FFD1", spark: [3, 7, 5, 9, 12, 8, 14, 11, 16, 12] },
    { label: "Deepfakes Found", val: "38", delta: "51% detection rate", icon: <AlertTriangle size={24} />, color: "#FF4E6A", spark: [1, 3, 2, 5, 4, 6, 5, 8, 7, 9] },
    { label: "Certificates", val: "11", delta: "3 this month", icon: <ShieldCheck size={24} />, color: "#00E87A", spark: [1, 1, 2, 2, 3, 3, 4, 5, 6, 7] },
    { label: "API Calls", val: "2,341", delta: "284 today", icon: <Webhook size={24} />, color: "#8B5CF6", spark: [50, 80, 120, 200, 150, 250, 200, 300, 280, 350] },
];

/* ─── Dashboard Page ────────────────────────────────────────── */
export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-grid" />}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const active = searchParams.get("tab") || "overview";
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

    const TYPE_ICON = {
        Video: <Film size={16} />,
        Audio: <Music size={16} />,
        Text: <FileText size={16} />,
        WhatsApp: <Smartphone size={16} />,
        Image: <ImageIcon size={16} />
    };

    return (
        <AppLayout>
            <main className="flex-1 bg-grid overflow-x-hidden min-h-screen">

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
                                            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "#E8EEFF" }}>
                                                <BarChart2 size={16} /> Scans This Week
                                            </h3>
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
                                    <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "#E8EEFF" }}>
                                        <Zap size={16} /> Recent Activity
                                    </h3>
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
                                        <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "#E8EEFF" }}>
                                            <Activity size={18} color="#E8EEFF" /> Global Threat Intelligence
                                        </h3>
                                        <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>Live deepfake prevalence by modality</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="status-live" />
                                        <span className="text-xs font-bold" style={{ color: "#00E87A" }}>LIVE</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Image Deepfakes", pct: rings[0], color: "#FF4E6A", icon: <ImageIcon size={20} /> },
                                        { label: "Voice Clones", pct: rings[1], color: "#FFB800", icon: <Music size={20} /> },
                                        { label: "Video Deepfakes", pct: rings[2], color: "#8B5CF6", icon: <Film size={20} /> },
                                        { label: "AI-Written Text", pct: rings[3], color: "#3B82F6", icon: <FileText size={20} /> },
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
                                    { href: "/analyze", icon: <Search size={32} />, title: "Analyze Content", sub: "Upload & detect fakes", color: "#00FFD1", bg: "rgba(0,255,209,0.05)" },
                                    { href: "/verify", icon: <ShieldCheck size={32} />, title: "Issue Certificate", sub: "Prove content authenticity", color: "#00E87A", bg: "rgba(0,232,122,0.05)" },
                                    { href: "/api-docs", icon: <Webhook size={32} />, title: "TrustScore API", sub: "Integrate detection in your app", color: "#8B5CF6", bg: "rgba(139,92,246,0.05)" },
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

                    {/* ═══ CERTIFICATES ════════════════════════════════════════ */}
                    {active === "certificates" && (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-black text-2xl gradient-text">Authenticity Certificates</h2>
                                <Link href="/verify">
                                    <button className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
                                        <Lock size={16} /> Issue New Certificate
                                    </button>
                                </Link>
                            </div>

                            <div className="card rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(0,232,122,0.1)]">
                                        <ShieldCheck size={20} color="#00E87A" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold" style={{ color: "#E8EEFF" }}>Immutable Content Registry</h3>
                                        <p className="text-xs mt-1" style={{ color: "#6B7A99" }}>11 items secured by cryptographic hashing.</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {["landscape_original.jpg", "ceo_statement_raw.wav", "press_release_v1.pdf"].map((file, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ border: "1px solid rgba(0,255,209,0.08)", background: "rgba(255,255,255,0.02)" }}>
                                            <div className="font-mono text-xs px-2 py-1 rounded bg-[rgba(0,255,209,0.05)] text-[var(--cyan)]">vv_auth_7a4f...</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold truncate text-[var(--text-primary)]">{file}</div>
                                                <div className="text-xs text-[var(--text-secondary)]">Mar {12 - i}, 2026 • SHA-256</div>
                                            </div>
                                            <button className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,255,209,0.2)] hover:bg-[rgba(0,255,209,0.1)] transition-colors">
                                                <ExternalLink size={12} /> View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ API USAGE ════════════════════════════════════════ */}
                    {active === "api" && (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-black text-2xl gradient-text">API Usage</h2>
                                <Link href="/api-docs">
                                    <button className="btn-outline py-2.5 px-5 text-sm flex items-center gap-2">
                                        <Webhook size={16} /> API Docs
                                    </button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="card rounded-2xl p-6">
                                    <h3 className="font-bold text-sm mb-4" style={{ color: "#E8EEFF" }}>Daily Quota (Free Tier)</h3>
                                    <div className="flex items-end justify-between mb-2">
                                        <div className="font-black text-3xl" style={{ color: "#00FFD1" }}>38 <span className="text-sm font-normal text-[var(--text-secondary)]">/ 100 calls</span></div>
                                    </div>
                                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div className="h-full bg-[var(--cyan)]" style={{ width: "38%" }} />
                                    </div>
                                </div>
                                <div className="card rounded-2xl p-6">
                                    <h3 className="font-bold text-sm mb-4" style={{ color: "#E8EEFF" }}>Active API Key</h3>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-[rgba(0,255,209,0.15)] bg-[rgba(0,255,209,0.03)] font-mono text-xs">
                                        <span className="text-[var(--text-primary)] tracking-wide">vv_sk_demo_••••••••••••</span>
                                        <div className="flex items-center gap-2">
                                            <button className="text-[var(--text-secondary)] hover:text-[var(--cyan)] transition-colors"><Eye size={16} /></button>
                                            <button className="text-[var(--text-secondary)] hover:text-[var(--cyan)] transition-colors"><Copy size={16} /></button>
                                        </div>
                                    </div>
                                    <button className="text-xs text-[var(--red)] underline mt-4 hover:opacity-80">Revoke key...</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ SETTINGS ════════════════════════════════════════ */}
                    {active === "settings" && (
                        <div className="animate-fade-in">
                            <h2 className="font-black text-2xl gradient-text mb-6">Account Settings</h2>

                            <div className="card rounded-2xl p-6 max-w-2xl mb-6">
                                <h3 className="font-bold text-sm mb-5 pb-3 border-b border-[rgba(0,255,209,0.1)] flex items-center gap-2" style={{ color: "#E8EEFF" }}>
                                    <Settings size={16} /> Preferences
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-[var(--text-primary)]">Email Notifications</div>
                                            <div className="text-xs text-[var(--text-secondary)]">Alerts for critical deepfake detections</div>
                                        </div>
                                        <div className="w-11 h-6 bg-[rgba(0,255,209,0.2)] rounded-full relative cursor-pointer border border-[rgba(0,255,209,0.3)]">
                                            <div className="w-4 h-4 rounded-full bg-[var(--cyan)] absolute top-0.5 right-1" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-[var(--text-primary)]">Strict Strict Matching</div>
                                            <div className="text-xs text-[var(--text-secondary)]">Requires 95% confidence on API checks</div>
                                        </div>
                                        <div className="w-11 h-6 bg-[rgba(255,255,255,0.1)] rounded-full relative cursor-pointer">
                                            <div className="w-4 h-4 rounded-full bg-[var(--text-secondary)] absolute top-0.5 left-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-ghost text-sm text-[var(--red)] border border-[rgba(255,78,106,0.3)] hover:bg-[rgba(255,78,106,0.1)]">Delete Account</button>
                        </div>
                    )}
                </div>
            </main>
        </AppLayout>
    );
}
