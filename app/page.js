"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link as LinkIcon, Map, Search, ShieldCheck, Image as ImageIcon, Film, Music, FileText, Smartphone, Globe, Brain, BadgeDollarSign, TrendingUp, UploadCloud, ClipboardList, Microscope, ArrowRight, Zap, Play, Activity } from "lucide-react";

/* ─── Particle Canvas ─── */
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

        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.5 + 0.1,
        }));

        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                particles.slice(i + 1).forEach((q) => {
                    const dist = Math.hypot(p.x - q.x, p.y - q.y);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(0, 255, 209, ${0.1 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                });
                const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (md < 200) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 255, 209, ${0.2 * (1 - md / 200)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });

            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 209, ${p.alpha})`;
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

/* ─── Typewriter ─── */
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
            timeout = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 60);
        } else if (!deleting && displayed.length === full.length) {
            timeout = setTimeout(() => setDeleting(true), 2000);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setPhraseIdx((i) => (i + 1) % PHRASES.length);
        }
        return () => clearTimeout(timeout);
    }, [displayed, deleting, phraseIdx]);

    return (
        <span style={{ color: "#00FFD1", textShadow: "0 0 20px rgba(0,255,209,0.3)" }}>
            {displayed}
            <span className="animate-blink" style={{ borderRight: "3px solid #00FFD1", marginLeft: 4 }} />
        </span>
    );
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "", label, icon, delay = 0 }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    const fired = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !fired.current) {
                fired.current = true;
                setTimeout(() => {
                    const d = 2500, s = performance.now();
                    const tick = (now) => {
                        const p = Math.min((now - s) / d, 1);
                        const eased = 1 - Math.pow(1 - p, 4);
                        setVal(Math.round(eased * target));
                        if (p < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }, delay * 1000);
            }
        }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target, delay]);

    return (
        <div ref={ref} className="text-center group">
            <div className="flex justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "rgba(0,255,209,0.05)", border: "1px solid rgba(0,255,209,0.15)", color: "#00FFD1" }}>
                    {icon}
                </div>
            </div>
            <div className="font-black gradient-text mb-2" style={{ fontSize: 48, lineHeight: 1.1 }}>
                {val.toLocaleString()}{suffix}
            </div>
            <div className="text-sm leading-snug max-w-44 mx-auto font-medium" style={{ color: "#8B949E" }}>{label}</div>
        </div>
    );
}

/* ─── Data ─── */
const FEATURES = [
    { icon: <LinkIcon size={24} />, color: "#00FFD1", title: "Cross-Modal Consistency Engine", desc: "Face + voice + emotion + transcript cross-checked simultaneously. Catches contradictions no single-modal tool ever sees.", badge: "UNIQUE", },
    { icon: <Microscope size={24} />, color: "#8B5CF6", title: "GAN Source Attribution", desc: "Doesn't just say 'AI-made' — tells you WHICH model. Stable Diffusion XL, DeepFaceLab, ElevenLabs, GPT-4…", badge: "PATENT-PENDING", },
    { icon: <Map size={24} />, color: "#3B82F6", title: "GradCAM Forensic Heatmap", desc: "Visual pixel-level explanation of exactly which regions triggered the detection. Full explainability.", badge: "XAI", },
    { icon: <Smartphone size={24} />, color: "#FFB800", title: "WhatsApp Forward Scanner", desc: "Image + caption analyzed together. India's #1 misinfo vector — we built the only tool that treats both as one.", badge: "INDIA-FIRST", },
    { icon: <ShieldCheck size={24} />, color: "#00E87A", title: "C2PA Authenticity Certificates", desc: "Cryptographic proof-of-origin for creators. QR-verifiable, tamper-evident, C2PA v1.3 compatible.", badge: "C2PA", },
    { icon: <Globe size={24} />, color: "#FF4E6A", title: "Vernacular Indicator Reports", desc: "Explanations in Hindi & Marathi. Designed for 500M+ Indians who shouldn't need English to detect fakes.", badge: "BHARAT-READY", },
];

const DETECTORS = [
    { name: "EfficientNet-B4", type: "Image Forensics", acc: "91%", color: "#00FFD1" },
    { name: "Wav2Vec 2.0", type: "Audio Analysis", acc: "87%", color: "#8B5CF6" },
    { name: "RoBERTa-Detector", type: "Text Detection", acc: "94%", color: "#3B82F6" },
    { name: "TimeSformer", type: "Video Analysis", acc: "89%", color: "#FFB800" },
    { name: "ExifTool + Custom", type: "Metadata Scan", acc: "99%", color: "#00E87A" },
];

const ShieldLogo = ({ size = 72 }) => (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <path d="M36 4L8 16v20c0 16 11 28 28 32 17-4 28-16 28-32V16L36 4z" stroke="#00FFD1" strokeWidth="1.5" fill="rgba(0,255,209,0.06)" />
        <path d="M36 4L8 16v20c0 16 11 28 28 32 17-4 28-16 28-32V16L36 4z" stroke="#00FFD1" strokeWidth="0.5" strokeDasharray="5 4" opacity="0.45" />
        <circle cx="36" cy="33" r="10" fill="#00FFD1" opacity="0.95" />
        <path d="M36 23 L36 43 M26 33 L46 33" stroke="#030C18" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="36" cy="33" r="18" stroke="#00FFD1" strokeWidth="0.6" opacity="0.3" />
        <circle cx="36" cy="33" r="26" stroke="#00FFD1" strokeWidth="0.4" opacity="0.15" />
    </svg>
);

/* ─── Animation Variants ─── */
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
    const [threatLevel, setThreatLevel] = useState(72);

    useEffect(() => {
        const interval = setInterval(() => {
            setThreatLevel((v) => Math.max(55, Math.min(95, v + (Math.random() - 0.5) * 8)));
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen relative font-sans text-white overflow-hidden" style={{ background: "var(--navy)" }}>
            <ParticleCanvas />
            <div className="scan-overlay opacity-30 pointer-events-none" />

            {/* Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(0,255,209,0.06) 0%, transparent 60%)" }} />
                <div className="absolute top-[40%] -left-32 w-[600px] h-[600px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)" }} />
                <div className="absolute bottom-[10%] -right-32 w-[600px] h-[600px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 60%)" }} />
                <div className="hex-grid absolute inset-0 opacity-40 mix-blend-overlay" />
            </div>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-32 z-10">
                <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Typography */}
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6 text-xs font-bold uppercase tracking-widest cursor-default"
                            style={{ background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.3)", color: "#00FFD1", boxShadow: "0 0 20px rgba(0,255,209,0.15)" }}
                        >
                            <span className="animate-blink w-2 h-2 rounded-full bg-[#00FFD1]" />
                            Enterprise Grade Engine
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="flex items-center justify-center lg:justify-start gap-4 mb-4"
                        >
                            <ShieldLogo size={56} />
                            <h1
                                className="font-black leading-none tracking-tight gradient-text"
                                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                            >
                                VeraVision
                            </h1>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="font-black mb-4 leading-[1.1] tracking-tight"
                            style={{ fontSize: "clamp(3rem, 5.5vw, 4.5rem)" }}
                        >
                            <span className="text-white">Unmask</span> the Fake.<br />
                            <span className="text-[#8B949E]">Secure the Truth.</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="font-semibold mb-8 text-xl md:text-2xl"
                            style={{ color: "#C5CDE8", minHeight: "40px" }}
                        >
                            AI-Powered <Typewriter />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-[#8B949E] text-base md:text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            The most advanced multi-modal deepfake detection engine built to analyze images, video, audio, and metadata simultaneously with verifiable C2PA authenticity.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12"
                        >
                            <Link href="/analyze">
                                <button className="btn-primary text-base px-8 py-4 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ boxShadow: "0 0 30px rgba(0,255,209,0.3)" }}>
                                    <Search size={18} /> Launch Analyzer
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="btn-outline text-base px-8 py-4 flex items-center gap-2 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)]">
                                    <ShieldCheck size={18} /> Sign In
                                </button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-2 justify-center lg:justify-start"
                        >
                            {[
                                { label: "Image", icon: <ImageIcon size={14} /> },
                                { label: "Video", icon: <Film size={14} /> },
                                { label: "Audio", icon: <Music size={14} /> },
                                { label: "Text", icon: <FileText size={14} /> },
                                { label: "WhatsApp", icon: <Smartphone size={14} /> },
                                { label: "Hindi", icon: <Globe size={14} /> }
                            ].map((f) => (
                                <span key={f.label} className="text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 border border-[#3A4560] bg-[#141D2E] text-[#8B949E] shadow-sm transform transition hover:border-[#00FFD1] hover:text-[#00FFD1]">
                                    {f.icon} {f.label}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Interactive Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="hidden lg:flex justify-center relative perspective-1000"
                    >
                        <motion.div
                            animate={{ y: [-10, 10, -10], rotateX: [2, -2, 2], rotateY: [-2, 2, -2] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full max-w-md relative"
                        >
                            {/* Glow behind card */}
                            <div className="absolute inset-0 bg-[#00FFD1] blur-[100px] opacity-20" />

                            <div className="relative rounded-3xl p-1 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(0,255,209,0.5), rgba(0,0,0,0.8) 40%, rgba(139,92,246,0.3))" }}>
                                <div className="bg-[#0A101C] rounded-[22px] p-6 h-full flex flex-col relative z-10 backdrop-blur-xl border border-[rgba(255,255,255,0.05)] shadow-2xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldLogo size={32} />
                                            <span className="font-bold tracking-wide">Analysis Report</span>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[rgba(255,78,106,0.15)] text-[#FF4E6A] border border-[rgba(255,78,106,0.3)]">CRITICAL RISK</span>
                                    </div>

                                    <div className="flex justify-center mb-6 relative">
                                        <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-[#FF4E6A] relative shadow-[0_0_30px_rgba(255,78,106,0.4)]">
                                            <span className="text-4xl font-black text-[#FF4E6A]">98<span className="text-xl">%</span></span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 py-4 border-t border-[rgba(255,255,255,0.05)]">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#8B949E] flex items-center gap-2"><ImageIcon size={14} /> Image Forensics</span>
                                            <span className="text-[#00E87A] font-mono">Authentic</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#8B949E] flex items-center gap-2"><Music size={14} /> Audio Clone</span>
                                            <span className="text-[#FF4E6A] font-mono">Deepfake</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#8B949E] flex items-center gap-2"><Activity size={14} /> CMCE Verify</span>
                                            <span className="text-[#FFB800] font-mono">Contradiction</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 rounded-xl bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)]">
                                        <span className="text-[#8B5CF6] text-xs font-bold flex items-center gap-2 mb-1"><Microscope size={14} /> SOURCE ATTRIBUTION</span>
                                        <span className="text-white text-sm font-medium">ElevenLabs Voice Synthesizer v2</span>
                                    </div>

                                    {/* Scan line effect inside card */}
                                    <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
                                        <motion.div
                                            animate={{ top: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF4E6A] to-transparent absolute shadow-[0_0_15px_#FF4E6A]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Live Threat Bar Absolute */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-[rgba(15,22,35,0.7)] backdrop-blur-md px-6 py-3 rounded-full border border-[rgba(255,255,255,0.08)] shadow-[0_0_40px_rgba(0,0,0,0.5)] z-20"
                >
                    <div className="flex items-center gap-2">
                        <span className="status-live" />
                        <span className="text-xs font-bold text-[#00E87A] tracking-widest uppercase">Live Threat Network</span>
                    </div>
                    <div className="hidden md:block w-px h-4 bg-[rgba(255,255,255,0.1)]" />
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-[#8B949E]">Global Deepfake Threat Level:</span>
                        <span className="font-black text-[#FFB800]">{Math.round(threatLevel)}%</span>
                        <div className="w-24 md:w-32 h-2 rounded-full overflow-hidden bg-[rgba(255,255,255,0.08)]">
                            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#FFB800] to-[#FF4E6A]" style={{ width: `${threatLevel}%` }} transition={{ type: "spring" }} />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── LIVE STATS ── */}
            <section className="relative z-10 py-24 px-6 border-t border-[rgba(255,255,255,0.02)] bg-[rgba(5,10,20,0.4)]">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp} className="text-center mb-16"
                    >
                        <span className="text-xs uppercase tracking-widest font-bold text-[#00FFD1]">The Crisis is Real</span>
                        <h2 className="font-black text-4xl mt-3 mb-6">Why Architecture Matters Now</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#00FFD1] to-transparent mx-auto" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        <Counter target={61} suffix="%" icon={<Brain size={32} />} label="of humans fail to distinguish AI faces from real ones (MIT, 2025)" delay={0} />
                        <Counter target={25} suffix="B" icon={<BadgeDollarSign size={32} />} label="USD lost to deepfake-enabled fraud globally in 2024 (Deloitte)" delay={0.2} />
                        <Counter target={300} suffix="%" icon={<TrendingUp size={32} />} label="annual growth rate in deepfake media creation (Sensity AI)" delay={0.4} />
                    </div>
                </div>
            </section>

            {/* ── ENGINES ── */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#8B5CF6]">Proprietary Technology</span>
                        <h2 className="font-black text-4xl mt-3">5 Core Engines. One Verdict.</h2>
                        <p className="mt-4 text-[#8B949E] max-w-2xl mx-auto">We don't rely on a single model. VeraVision parallel-processes your files through modal-specific detectors, merging the confidence scores to virtually eliminate false positives.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
                    >
                        {DETECTORS.map((det, i) => (
                            <motion.div
                                key={det.name} variants={fadeInUp}
                                className="bg-[rgba(15,22,35,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] p-6 rounded-2xl hover:border-[rgba(255,255,255,0.15)] transition-all group"
                            >
                                <div className="h-1 w-12 rounded-full mb-6 transition-all group-hover:w-full" style={{ background: det.color, boxShadow: `0 0 10px ${det.color}` }} />
                                <div className="font-black text-3xl mb-1" style={{ color: det.color }}>{det.acc}</div>
                                <div className="font-bold text-base mb-1 text-white">{det.name}</div>
                                <div className="text-sm text-[#8B949E]">{det.type}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="relative z-10 py-24 px-6 border-t border-[rgba(255,255,255,0.03)] bg-[rgba(0,0,0,0.2)]">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#00FFD1]">Differentiators</span>
                        <h2 className="font-black text-4xl mt-3 mb-4">What Sets VeraVision Apart</h2>
                        <p className="text-base text-[#8B949E] max-w-xl mx-auto">Six unique innovations making this the most comprehensive deepfake detection platform built natively for India & beyond.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {FEATURES.map((feat, i) => (
                            <motion.div
                                key={feat.title} variants={fadeInUp}
                                className="group relative bg-[#0A101C] rounded-2xl p-8 border border-[#141D2E] overflow-hidden hover:border-[rgba(0,255,209,0.3)] hover:shadow-[0_0_30px_rgba(0,255,209,0.05)] transition-all duration-300"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ background: feat.color }} />

                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: feat.bg, color: feat.color, border: `1px solid ${feat.color}30` }}>
                                        {feat.icon}
                                    </div>
                                    <span className="text-[10px] font-black px-2.5 py-1 rounded tracking-wider uppercase" style={{ background: `${feat.color}15`, color: feat.color, border: `1px solid ${feat.color}30` }}>
                                        {feat.badge}
                                    </span>
                                </div>
                                <h3 className="font-bold text-xl mb-3 text-[#E8EEFF]">{feat.title}</h3>
                                <p className="text-[#8B949E] text-sm leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">The Workflow</span>
                        <h2 className="font-black text-4xl mt-3">From Upload to Truth in 3 Steps</h2>
                    </motion.div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-[rgba(255,255,255,0.05)]" />

                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
                        >
                            {[
                                { num: "01", icon: <UploadCloud size={40} />, color: "#00FFD1", title: "Secure Upload", desc: "Instantly upload any media type—video, audio, text, image, or WhatsApp forward. End-to-end encrypted; zero file storage policy." },
                                { num: "02", icon: <Brain size={40} />, color: "#8B5CF6", title: "Parallel Analysis", desc: "Data routes through 5 dedicated neural layers while the Cross-Modal Engine compares visual cues with auditory nuances simultaneously." },
                                { num: "03", icon: <ClipboardList size={40} />, color: "#FFB800", title: "Truth Delivered", desc: "Receive a deterministic score, deep forensic visualization, and clear vernacular summaries to make final editorial or security decisions." }
                            ].map((step, i) => (
                                <motion.div key={step.num} variants={fadeInUp} className="relative z-10">
                                    <div className="w-24 h-24 mx-auto rounded-3xl mb-8 flex items-center justify-center bg-[#070D18] border-2 shadow-2xl relative" style={{ borderColor: `${step.color}40`, boxShadow: `0 0 30px ${step.color}20` }}>
                                        <div style={{ color: step.color }}>{step.icon}</div>
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs" style={{ background: step.color, color: "#000" }}>{step.num}</div>
                                    </div>
                                    <h3 className="font-black text-2xl mb-3 text-white">{step.title}</h3>
                                    <p className="text-[#8B949E] leading-relaxed max-w-xs mx-auto text-sm">{step.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 py-32 px-6">
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                    className="max-w-4xl mx-auto"
                >
                    <div className="rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden bg-[#0A101C] border border-[#141D2E] shadow-[0_0_80px_rgba(0,255,209,0.05)]">
                        <div className="absolute inset-0 bg-grid-dense opacity-30 mix-blend-overlay" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#00FFD1] to-transparent" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FFD1] rounded-full blur-[150px] opacity-10 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <ShieldLogo size={80} />
                            <h2 className="font-black text-4xl md:text-5xl lg:text-6xl mt-8 mb-6 text-white leading-tight">
                                Protect Your Narrative.
                            </h2>
                            <p className="text-[#8B949E] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                                Join the network of journalists, enterprises, and creators securing absolute truth in the digital era.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
                                <Link href="/analyze" className="w-full sm:w-auto">
                                    <button className="btn-primary w-full sm:w-auto px-10 py-4 text-base flex items-center justify-center gap-3">
                                        <Play fill="currentColor" size={16} /> Try Live Demo
                                    </button>
                                </Link>
                                <Link href="/signup" className="w-full sm:w-auto">
                                    <button className="btn-outline w-full sm:w-auto px-10 py-4 text-base flex items-center justify-center gap-3 text-white hover:bg-[rgba(255,255,255,0.05)]">
                                        Create Free Account <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 py-12 px-6 border-t border-[rgba(255,255,255,0.05)] bg-[#050A14]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <ShieldLogo size={32} />
                        <div>
                            <div className="font-black text-lg text-white">VeraVision</div>
                            <div className="text-xs text-[#00FFD1]">Next-Gen Content Authenticity</div>
                        </div>
                    </div>
                    <div className="text-center md:text-right text-xs text-[#6B7A99] max-w-xs">
                        Built for India. Powered by Open Source Models & Proprietary Cross-Modal Tech.
                        © {new Date().getFullYear()} VeraVision. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
