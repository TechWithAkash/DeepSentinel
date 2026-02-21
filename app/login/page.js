"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Target, Mail, Lock, AlertTriangle, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

/* ─── Matrix Rain ──────────────────────────────────────────────── */
function MatrixRain() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const cols = Math.floor(canvas.width / 16);
        const drops = Array(cols).fill(1);
        const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";

        const draw = () => {
            ctx.fillStyle = "rgba(5,10,20,0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0,255,209,0.18)";
            ctx.font = "13px monospace";

            drops.forEach((y, i) => {
                const ch = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(ch, i * 16, y * 16);
                if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        };

        const interval = setInterval(draw, 55);
        return () => clearInterval(interval);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-40"
            style={{ borderRadius: "inherit" }}
        />
    );
}

/* ─── Shield Logo ──────────────────────────────────────────────── */
const Shield = () => (
    <svg width="38" height="38" viewBox="0 0 72 72" fill="none">
        <path d="M36 4L8 16v20c0 16 11 28 28 32 17-4 28-16 28-32V16L36 4z"
            stroke="#00FFD1" strokeWidth="1.5" fill="rgba(0,255,209,0.08)" />
        <circle cx="36" cy="33" r="10" fill="#00FFD1" opacity="0.9" />
        <path d="M36 23 L36 43 M26 33 L46 33" stroke="#030C18" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

/* ─── Scanning line decoration ─────────────────────────────────── */
function ScanLine() {
    return (
        <div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
                background: "linear-gradient(90deg, transparent, rgba(0,255,209,0.5), transparent)",
                animation: "scan-line 6s linear infinite",
                top: 0,
            }}
        />
    );
}

const DEMO = { email: "demo@drishti.ai", password: "deepfake2026" };

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [demoFill, setDemoFill] = useState(false);

    const fillDemo = () => {
        setDemoFill(true);
        setEmail(DEMO.email);
        setPassword(DEMO.password);
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) { setError("Please fill in all fields."); return; }

        setLoading(true);
        setTimeout(() => {
            if (email === DEMO.email && password === DEMO.password) {
                localStorage.setItem("vv_logged_in", "demo");
                router.push("/dashboard");
            } else {
                setLoading(false);
                setError("Invalid credentials. Try the demo account below.");
            }
        }, 1500);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{ background: "var(--navy2)" }}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-grid-dense" />
            <div className="scan-overlay" />

            {/* Glow blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
                style={{ background: "#00FFD1" }} />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-[100px] opacity-08 pointer-events-none"
                style={{ background: "#7C3AED" }} />

            <div className="w-full max-w-md relative z-10 animate-scale-in" style={{ animationFillMode: "both" }}>

                {/* Back to home */}
                <Link href="/">
                    <div className="flex items-center gap-2 mb-6 text-xs font-semibold transition-colors" style={{ color: "#6B7A99" }}>
                        <ArrowLeft size={14} /> Back to DRISHTI
                    </div>
                </Link>

                <div className="auth-card p-8 relative">
                    <ScanLine />

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <Shield />
                        <div>
                            <div className="font-black text-lg" style={{ color: "#E8EEFF" }}>Welcome back</div>
                            <div className="text-xs" style={{ color: "#6B7A99" }}>Sign in to your DRISHTI account</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="status-live" />
                            <span className="text-xs font-bold" style={{ color: "#00E87A" }}>LIVE</span>
                        </div>
                    </div>

                    {/* Demo credentials banner */}
                    <button
                        onClick={fillDemo}
                        className="w-full mb-6 p-4 rounded-xl text-left transition-all group relative overflow-hidden"
                        style={{
                            background: demoFill ? "rgba(0,255,209,0.08)" : "rgba(0,255,209,0.04)",
                            border: `1px solid ${demoFill ? "rgba(0,255,209,0.35)" : "rgba(0,255,209,0.15)"}`,
                        }}
                    >
                        <MatrixRain />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: "#00FFD1" }}>
                                    <Target size={16} /> Demo Account
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: "rgba(0,255,209,0.15)", color: "#00FFD1" }}>
                                    Click to fill
                                </span>
                            </div>
                            <div className="font-mono text-xs space-y-1" style={{ color: "#8B949E" }}>
                                <div><span style={{ color: "#6B7A99" }}>email:</span>    <span style={{ color: "#00FFD1" }}>{DEMO.email}</span></div>
                                <div><span style={{ color: "#6B7A99" }}>password:</span> <span style={{ color: "#00FFD1" }}>{DEMO.password}</span></div>
                            </div>
                        </div>
                    </button>

                    {/* OR divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px" style={{ background: "rgba(0,255,209,0.08)" }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4B5568" }}>or sign in manually</span>
                        <div className="flex-1 h-px" style={{ background: "rgba(0,255,209,0.08)" }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "#6B7A99" }}>
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="input-dark pl-10"
                                    required
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6B7A99]"><Mail size={16} /></span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6B7A99" }}>
                                    Password
                                </label>
                                <button type="button" className="text-xs" style={{ color: "#00FFD1" }}>
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="input-dark pl-10 pr-10"
                                    required
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6B7A99]"><Lock size={16} /></span>
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                                    style={{ color: "#6B7A99" }}
                                >
                                    {showPwd ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm animate-slide-up"
                                style={{ background: "rgba(255,78,106,0.08)", border: "1px solid rgba(255,78,106,0.2)", color: "#FF4E6A" }}
                            >
                                <AlertTriangle size={14} /> {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn-primary w-full py-3.5 mt-2"
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1, fontSize: 15 }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    Authenticating…
                                </span>
                            ) : <span className="flex items-center justify-center gap-2"><ShieldCheck size={16} /> Sign In → Dashboard</span>}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(0,255,209,0.07)" }}>
                        <p className="text-sm text-center" style={{ color: "#6B7A99" }}>
                            No account?{" "}
                            <Link href="/signup">
                                <span className="font-bold transition-colors" style={{ color: "#00FFD1" }}>
                                    Create one — it&apos;s free →
                                </span>
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security note */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: "#3A4560" }}>
                    <Lock size={14} /> 256-bit encrypted · Zero data logs · SOC 2 compliant
                </div>
            </div>
        </div>
    );
}
