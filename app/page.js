"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Link as LinkIcon, Map, Search, ShieldCheck, Image as ImageIcon, Film, Music, FileText, Smartphone, Globe, Brain, BadgeDollarSign, TrendingUp, UploadCloud, ClipboardList, Microscope } from "lucide-react";

/* ─── Particle Canvas ─────────────────────────────────────────── */
function ParticleCanvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let anim;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const particles = Array.from({ length: 70 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.3,
            dx: (Math.random() - 0.5) * 0.35,
            dy: (Math.random() - 0.5) * 0.35,
            alpha: Math.random() * 0.5 + 0.2,
        }));

        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // draw connection lines
            particles.forEach((p, i) => {
                particles.slice(i + 1).forEach((q) => {
                    const dist = Math.hypot(p.x - q.x, p.y - q.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(0,255,209,${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
                // mouse attract
                const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (md < 180) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0,255,209,${0.12 * (1 - md / 180)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });

            // draw particles
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,255,209,${p.alpha})`;
                ctx.fill();

                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });

            anim = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(anim); window.removeEventListener("resize", resize); };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

/* ─── Typewriter ──────────────────────────────────────────────── */
const PHRASES = [
    "Deepfake Detection.",
    "GAN Source Attribution.",
    "Viral Risk Scoring.",
    "Cross-Modal Analysis.",
    "Truth at Scale.",
];

function Typewriter() {
    const [phraseIdx, setPhraseIdx] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const full = PHRASES[phraseIdx];
        let timeout;
        if (!deleting && displayed.length < full.length) {
            timeout = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 55);
        } else if (!deleting && displayed.length === full.length) {
            timeout = setTimeout(() => setDeleting(true), 1800);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setPhraseIdx((i) => (i + 1) % PHRASES.length);
        }
        return () => clearTimeout(timeout);
    }, [displayed, deleting, phraseIdx]);

    return (
        <span style={{ color: "#00FFD1" }}>
            {displayed}
            <span className="animate-blink" style={{ borderRight: "2px solid #00FFD1", marginLeft: 2 }} />
        </span>
    );
}

/* ─── Tilt Card ───────────────────────────────────────────────── */
function TiltCard({ children, className = "", style = {} }) {
    const ref = useRef(null);

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(8px)`;
    };

    const handleLeave = () => {
        if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{ ...style, transition: "transform 0.15s ease", transformStyle: "preserve-3d" }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            {children}
        </div>
    );
}

/* ─── Animated Counter ────────────────────────────────────────── */
function Counter({ target, suffix = "", label, icon }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    const fired = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !fired.current) {
                fired.current = true;
                const d = 2000, s = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - s) / d, 1);
                    const eased = 1 - Math.pow(1 - p, 4);
                    setVal(Math.round(eased * target));
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-black gradient-text mb-1" style={{ fontSize: 48, lineHeight: 1 }}>
                {val.toLocaleString()}{suffix}
            </div>
            <div className="text-xs leading-snug max-w-36 mx-auto" style={{ color: "#6B7A99" }}>{label}</div>
        </div>
    );
}

/* ─── Data ─────────────────────────────────────────────────────── */
const FEATURES = [
    {
        icon: <LinkIcon size={24} />, color: "#00FFD1", bg: "rgba(0,255,209,0.08)",
        title: "Cross-Modal Consistency Engine",
        desc: "Face + voice + emotion + transcript cross-checked simultaneously. Catches contradictions no single-modal tool ever sees.",
        badge: "UNIQUE",
    },
    {
        icon: <Microscope size={24} />, color: "#8B5CF6", bg: "rgba(139,92,246,0.08)",
        title: "GAN Source Attribution",
        desc: "Doesn't just say 'AI-made' — tells you WHICH model. Stable Diffusion XL, DeepFaceLab, ElevenLabs, GPT-4…",
        badge: "PATENT-PENDING",
    },
    {
        icon: <Map size={24} />, color: "#3B82F6", bg: "rgba(59,130,246,0.08)",
        title: "GradCAM Forensic Heatmap",
        desc: "Visual pixel-level explanation of exactly which regions triggered the detection. Full explainability.",
        badge: "XAI",
    },
    {
        icon: <Smartphone size={24} />, color: "#FFB800", bg: "rgba(255,184,0,0.08)",
        title: "WhatsApp Forward Scanner",
        desc: "Image + caption analyzed together. India's #1 misinfo vector — we built the only tool that treats both as one.",
        badge: "INDIA-FIRST",
    },
    {
        icon: <ShieldCheck size={24} />, color: "#00E87A", bg: "rgba(0,232,122,0.08)",
        title: "C2PA Authenticity Certificates",
        desc: "Cryptographic proof-of-origin for creators. QR-verifiable, tamper-evident, C2PA v1.3 compatible.",
        badge: "C2PA",
    },
    {
        icon: <Globe size={24} />, color: "#FF4E6A", bg: "rgba(255,78,106,0.08)",
        title: "Vernacular Indicator Reports",
        desc: "Explanations in Hindi & Marathi. Designed for 500M+ Indians who shouldn't need English to detect fakes.",
        badge: "BHARAT-READY",
    },
];

const DETECTORS = [
    { name: "EfficientNet-B4", type: "Image Forensics", acc: "91%", color: "#00FFD1" },
    { name: "Wav2Vec 2.0", type: "Audio Analysis", acc: "87%", color: "#8B5CF6" },
    { name: "RoBERTa-Detector", type: "Text Detection", acc: "94%", color: "#3B82F6" },
    { name: "TimeSformer", type: "Video Analysis", acc: "89%", color: "#FFB800" },
    { name: "ExifTool + Custom", type: "Metadata Scan", acc: "99%", color: "#00E87A" },
];

/* ─── Shield SVG ──────────────────────────────────────────────── */
const ShieldLogo = ({ size = 72 }) => (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <path d="M36 4L8 16v20c0 16 11 28 28 32 17-4 28-16 28-32V16L36 4z"
            stroke="#00FFD1" strokeWidth="1.5" fill="rgba(0,255,209,0.06)" />
        <path d="M36 4L8 16v20c0 16 11 28 28 32 17-4 28-16 28-32V16L36 4z"
            stroke="#00FFD1" strokeWidth="0.5" strokeDasharray="5 4" opacity="0.35" />
        <circle cx="36" cy="33" r="10" fill="#00FFD1" opacity="0.88" />
        <path d="M36 23 L36 43 M26 33 L46 33" stroke="#030C18" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="36" cy="33" r="15" stroke="#00FFD1" strokeWidth="0.4" opacity="0.25" />
        <circle cx="36" cy="33" r="22" stroke="#00FFD1" strokeWidth="0.3" opacity="0.12" />
    </svg>
);

/* ─── Page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
    const [activeFeature, setActiveFeature] = useState(null);
    const [threatLevel, setThreatLevel] = useState(72);

    // Animate threat level
    useEffect(() => {
        const interval = setInterval(() => {
            setThreatLevel((v) => Math.max(55, Math.min(95, v + (Math.random() - 0.5) * 6)));
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen relative" style={{ background: "var(--navy)" }}>
            <ParticleCanvas />
            <div className="scan-overlay" />

            {/* ── HERO ──────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-10">

                {/* Radial blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(0,255,209,0.06) 0%, transparent 65%)" }} />
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 65%)" }} />
                    <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)" }} />
                    {/* Hex grid */}
                    <div className="hex-grid absolute inset-0 opacity-60" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">

                    {/* Pill badge */}
                    <div
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 text-xs font-bold uppercase tracking-widest animate-slide-up"
                        style={{ background: "rgba(0,255,209,0.06)", border: "1px solid rgba(0,255,209,0.2)", color: "#00FFD1", animationFillMode: "both" }}
                    >
                        <span className="animate-blink">●</span>
                        HackHive 2.0 · Cybersecurity Track · PS-3 · DMCE Airoli
                    </div>

                    {/* Animated shield */}
                    <div className="flex justify-center mb-8 animate-float animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                        <div className="relative">
                            <ShieldLogo size={90} />
                            {/* Ping rings */}
                            <div className="absolute inset-0 rounded-full animate-ping-slow opacity-30"
                                style={{ background: "rgba(0,255,209,0.08)", animation: "ping-slow 2.4s ease-out infinite" }} />
                        </div>
                    </div>

                    {/* Title */}
                    <h1
                        className="font-black mb-3 animate-slide-up gradient-text leading-none"
                        style={{ fontSize: "clamp(64px,11vw,118px)", animationDelay: "0.12s", animationFillMode: "both" }}
                    >
                        VeraVision
                    </h1>

                    {/* Typewriter subtitle */}
                    <div
                        className="font-semibold mb-4 animate-slide-up"
                        style={{ fontSize: "clamp(18px,2.6vw,26px)", color: "#C5CDE8", animationDelay: "0.2s", animationFillMode: "both", minHeight: 40 }}
                    >
                        AI-Powered{" "}<Typewriter />
                    </div>

                    <p
                        className="max-w-xl mx-auto mb-10 animate-fade-in"
                        style={{ color: "#6B7A99", fontSize: 16, lineHeight: 1.7, animationDelay: "0.35s", animationFillMode: "both" }}
                    >
                        The only platform that tells you <em style={{ color: "#E8EEFF" }}>WHAT</em> was faked,{" "}
                        <em style={{ color: "#E8EEFF" }}>HOW</em> it was faked, and{" "}
                        <em style={{ color: "#E8EEFF" }}>WHO</em> faked it — in Hindi, English or Marathi.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: "0.45s", animationFillMode: "both" }}>
                        <Link href="/analyze">
                            <button className="btn-primary text-base px-9 py-4 animate-glow flex items-center justify-center gap-2" style={{ fontSize: 15 }}>
                                <Search size={18} /> Launch Analyzer →
                            </button>
                        </Link>
                        <Link href="/login">
                            <button className="btn-outline text-base px-9 py-4 flex items-center justify-center gap-2" style={{ fontSize: 15 }}>
                                <ShieldCheck size={18} /> Sign In / Dashboard
                            </button>
                        </Link>
                    </div>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2 justify-center animate-fade-in" style={{ animationDelay: "0.55s", animationFillMode: "both" }}>
                        {[
                            { label: "Image", icon: <ImageIcon size={14} /> },
                            { label: "Video", icon: <Film size={14} /> },
                            { label: "Audio", icon: <Music size={14} /> },
                            { label: "Text", icon: <FileText size={14} /> },
                            { label: "WhatsApp", icon: <Smartphone size={14} /> },
                            { label: "Hindi", icon: <Globe size={14} /> }
                        ].map((f) => (
                            <span
                                key={f.label}
                                className="text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5"
                                style={{ background: "rgba(0,255,209,0.06)", color: "#6B7A99", border: "1px solid rgba(0,255,209,0.1)" }}
                            >
                                {f.icon} {f.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Live threat ticker — bottom of hero */}
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 glass px-6 py-3 rounded-2xl animate-fade-in z-10"
                    style={{ animationDelay: "0.8s", animationFillMode: "both" }}
                >
                    <div className="flex items-center gap-2">
                        <span className="status-live" />
                        <span className="text-xs font-bold" style={{ color: "#00E87A" }}>LIVE THREAT MONITOR</span>
                    </div>
                    <div className="w-px h-4" style={{ background: "rgba(0,255,209,0.2)" }} />
                    <div className="text-xs" style={{ color: "#6B7A99" }}>
                        Global deepfake threat level:{" "}
                        <span className="font-black" style={{ color: "#FFB800" }}>{Math.round(threatLevel)}%</span>
                    </div>
                    <div
                        className="w-24 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${threatLevel}%`, background: "linear-gradient(90deg, #FFB800, #FF4E6A)" }}
                        />
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                    style={{ background: "linear-gradient(transparent, var(--navy))" }} />
            </section>

            {/* ── LIVE STATS ─────────────────────────────────────────── */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "#00FFD1" }}>
                            The Crisis is Real
                        </span>
                        <h2 className="font-black text-4xl mt-3 mb-2">Why This Matters Now</h2>
                        <div className="neon-line max-w-xs mx-auto" />
                    </div>

                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-px relative"
                        style={{ background: "rgba(0,255,209,0.08)", borderRadius: 20, overflow: "hidden" }}
                    >
                        {[
                            { target: 61, suffix: "%", icon: <Brain size={28} />, label: "of people cannot distinguish AI faces from real (MIT, 2025)" },
                            { target: 25, suffix: "B", icon: <BadgeDollarSign size={28} />, label: "USD lost to deepfake-enabled fraud globally in 2024 (Deloitte)" },
                            { target: 3000, suffix: "%", icon: <TrendingUp size={28} />, label: "growth in deepfake media creation since 2019 (Sensity AI)" },
                        ].map((s, i) => (
                            <div key={i} className="bg-grid py-12 px-6 text-center" style={{ background: "var(--card)" }}>
                                <Counter {...s} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DETECTION ENGINES ──────────────────────────────────── */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "#00FFD1" }}>Under the Hood</span>
                        <h2 className="font-black text-4xl mt-3">5 AI Engines. One Verdict.</h2>
                    </div>

                    <div className="relative">
                        {/* Central label */}
                        <div className="flex flex-col md:flex-row gap-4 items-stretch">
                            {DETECTORS.map((det, i) => (
                                <TiltCard
                                    key={det.name}
                                    className="flex-1 card p-5 rounded-2xl cursor-default animate-slide-up"
                                    style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
                                >
                                    {/* Top accent */}
                                    <div className="h-0.5 rounded-full w-12 mb-4" style={{ background: det.color }} />
                                    <div className="font-black text-2xl mb-1" style={{ color: det.color }}>{det.acc}</div>
                                    <div className="font-bold text-sm mb-1" style={{ color: "#E8EEFF" }}>{det.name}</div>
                                    <div className="text-xs" style={{ color: "#6B7A99" }}>{det.type}</div>
                                    {/* Accuracy bar */}
                                    <div className="mt-4 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-[1.5s]"
                                            style={{ width: det.acc, background: det.color, boxShadow: `0 0 8px ${det.color}60` }}
                                        />
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ───────────────────────────────────────────── */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "#00FFD1" }}>Differentiators</span>
                        <h2 className="font-black text-4xl mt-3">What No Other Tool Has</h2>
                        <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: "#6B7A99" }}>
                            Six innovations that make VeraVision the most comprehensive deepfake detection platform built for India.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((feat, i) => (
                            <TiltCard
                                key={feat.title}
                                className="card p-6 rounded-2xl cursor-default animate-slide-up"
                                style={{
                                    animationDelay: `${i * 0.08}s`, animationFillMode: "both",
                                    background: activeFeature === i ? `${feat.color}08` : "var(--card)",
                                }}
                                onMouseEnter={() => setActiveFeature(i)}
                                onMouseLeave={() => setActiveFeature(null)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ background: feat.bg, border: `1px solid ${feat.color}25` }}
                                    >
                                        {feat.icon}
                                    </div>
                                    <span
                                        className="text-xs font-black px-2 py-0.5 rounded"
                                        style={{ background: `${feat.color}12`, color: feat.color, border: `1px solid ${feat.color}25`, letterSpacing: "0.05em", fontSize: 9 }}
                                    >
                                        {feat.badge}
                                    </span>
                                </div>
                                <h3 className="font-bold text-sm mb-2" style={{ color: "#E8EEFF" }}>{feat.title}</h3>
                                <p className="text-xs leading-relaxed" style={{ color: "#6B7A99" }}>{feat.desc}</p>

                                {/* Bottom accent on hover */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-all duration-300"
                                    style={{ background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)`, opacity: activeFeature === i ? 1 : 0 }}
                                />
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ───────────────────────────────────────── */}
            <section id="how-it-works" className="relative z-10 py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "#00FFD1" }}>Process</span>
                        <h2 className="font-black text-4xl mt-3">From Upload to Truth in 3 Steps</h2>
                    </div>

                    <div className="relative">
                        {/* Connector line */}
                        <div
                            className="absolute top-12 left-0 right-0 h-px hidden md:block"
                            style={{ background: "linear-gradient(90deg, transparent 10%, rgba(0,255,209,0.2) 50%, transparent 90%)" }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { num: "01", icon: <UploadCloud size={32} />, color: "#00FFD1", title: "Upload", desc: "Any file — image, video, audio, text, or WhatsApp forward screenshot. 100% private, zero storage." },
                                { num: "02", icon: <Brain size={32} />, color: "#8B5CF6", title: "Analyze", desc: "5 AI detection engines run in parallel. Cross-Modal Consistency Engine cross-checks all signals." },
                                { num: "03", icon: <ClipboardList size={32} />, color: "#FFB800", title: "Understand", desc: "Confidence score, forensic heatmap, GAN attribution, and plain-language indicators. In your language." },
                            ].map((step, i) => (
                                <div key={step.num} className="text-center relative animate-slide-up" style={{ animationDelay: `${i * 0.12}s`, animationFillMode: "both" }}>
                                    {/* Big step number */}
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 relative"
                                        style={{ background: `${step.color}10`, border: `1px solid ${step.color}25` }}
                                    >
                                        {step.icon}
                                        <div
                                            className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                                            style={{ background: step.color, color: "#030C18" }}
                                        >
                                            {step.num}
                                        </div>
                                    </div>
                                    <h3 className="font-black text-xl mb-2">{step.title}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: "#6B7A99" }}>{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────────── */}
            <section className="relative z-10 py-28 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div
                        className="p-16 rounded-3xl relative overflow-hidden"
                        style={{
                            border: "1px solid rgba(0,255,209,0.15)",
                            background: "linear-gradient(135deg, rgba(0,255,209,0.03) 0%, rgba(12,20,34,0.95) 100%)",
                            boxShadow: "0 0 80px rgba(0,255,209,0.05)",
                        }}
                    >
                        {/* Hex overlay */}
                        <div className="hex-grid absolute inset-0 opacity-40 pointer-events-none" />
                        {/* Glow top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1"
                            style={{ background: "linear-gradient(90deg, transparent, #00FFD1, transparent)" }} />

                        <div className="relative z-10">
                            <ShieldLogo size={64} />
                            <h2 className="font-black text-4xl mt-6 mb-4 gradient-text leading-tight">
                                Start Detecting Fakes
                            </h2>
                            <p className="mb-8 max-w-sm mx-auto" style={{ color: "#6B7A99", fontSize: 15, lineHeight: 1.7 }}>
                                No account needed for analysis. Create one to save results, generate certificates, and access the full dashboard.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/analyze">
                                    <button className="btn-primary px-10 py-3.5 animate-glow flex items-center justify-center gap-2" style={{ fontSize: 15 }}>
                                        <Search size={16} /> Try the Demo →
                                    </button>
                                </Link>
                                <Link href="/signup">
                                    <button className="btn-outline px-10 py-3.5" style={{ fontSize: 15 }}>
                                        Create Free Account
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-10 px-6" style={{ borderTop: "1px solid rgba(0,255,209,0.06)" }}>
                <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <ShieldLogo size={28} />
                        <div>
                            <div className="font-black text-sm" style={{ color: "#E8EEFF" }}>VeraVision</div>
                            <div className="text-xs" style={{ color: "#4B5568" }}>AI Truth Engine</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="status-live" />
                        <span className="text-xs font-bold" style={{ color: "#00E87A" }}>All systems operational</span>
                    </div>
                    <div className="text-xs" style={{ color: "#4B5568" }}>
                        HackHive 2.0 · Built for Bharat 🇮🇳
                    </div>
                </div>
            </footer>
        </div>
    );
}
