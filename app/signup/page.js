"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, Lock, AlertTriangle, Loader2, Rocket, Newspaper, Landmark, Building2, GraduationCap, Zap } from "lucide-react";

const Shield = () => (
    <svg width="38" height="38" viewBox="0 0 72 72" fill="none">
        <path d="M36 4L8 16v20c0 16 11 28 28 32 17-4 28-16 28-32V16L36 4z"
            stroke="#00FFD1" strokeWidth="1.5" fill="rgba(0,255,209,0.08)" />
        <circle cx="36" cy="33" r="10" fill="#00FFD1" opacity="0.9" />
        <path d="M36 23 L36 43 M26 33 L46 33" stroke="#030C18" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const PLANS = [
    { id: "free", label: "Free", price: "₹0/mo", desc: "100 analyses/day", color: "#00FFD1" },
    { id: "pro", label: "Pro", price: "₹499/mo", desc: "10K analyses/day + API", color: "#8B5CF6" },
];

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [org, setOrg] = useState("");
    const [usecase, setUsecase] = useState("");
    const [plan, setPlan] = useState("free");
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");

    const TOTAL = 3;
    const pct = Math.round((step / TOTAL) * 100);

    const nextStep = () => {
        setError("");
        if (step === 1) {
            if (!name.trim() || !email.trim() || !password.trim()) {
                setError("Please fill in all fields."); return;
            }
            if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
        }
        setStep((s) => Math.min(s + 1, TOTAL));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem("vv_logged_in", "demo");
            router.push("/dashboard");
        }, 1800);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{ background: "var(--navy2)" }}
        >
            <div className="absolute inset-0 bg-grid-dense" />
            <div className="scan-overlay" />

            {/* Glow blobs */}
            <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full blur-[120px] opacity-[0.07] pointer-events-none"
                style={{ background: "#8B5CF6" }} />
            <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full blur-[100px] opacity-[0.06] pointer-events-none"
                style={{ background: "#00FFD1" }} />

            <div className="w-full max-w-md relative z-10 animate-scale-in" style={{ animationFillMode: "both" }}>

                <Link href="/login">
                    <div className="flex items-center gap-2 mb-6 text-xs font-semibold" style={{ color: "#6B7A99" }}>
                        ← Already have an account?{" "}
                        <span style={{ color: "#00FFD1" }}>Sign In</span>
                    </div>
                </Link>

                <div className="auth-card p-8 relative">
                    {/* Scan line */}
                    <div
                        className="absolute left-0 right-0 h-px pointer-events-none"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,209,0.4), transparent)", animation: "scan-line 6s linear infinite", top: 0 }}
                    />

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <Shield />
                        <div>
                            <div className="font-black text-lg" style={{ color: "#E8EEFF" }}>Create Account</div>
                            <div className="text-xs" style={{ color: "#6B7A99" }}>Join the DRISHTI network</div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-xs mb-2">
                            {["Account", "Profile", "Plan"].map((label, i) => (
                                <span
                                    key={label}
                                    className="font-bold"
                                    style={{ color: step > i ? "#00FFD1" : step === i + 1 ? "#E8EEFF" : "#4B5568" }}
                                >
                                    {step > i ? "✓ " : ""}{label}
                                </span>
                            ))}
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, background: "linear-gradient(90deg, #00C4A0, #00FFD1)" }}
                            />
                        </div>
                        <div className="text-right text-xs mt-1 font-mono" style={{ color: "#6B7A99" }}>
                            Step {step} of {TOTAL}
                        </div>
                    </div>

                    {/* ── STEP 1: Account details ── */}
                    {step === 1 && (
                        <div className="space-y-4 animate-slide-up" style={{ animationFillMode: "both" }}>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "#6B7A99" }}>
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Akash Vishwakarma"
                                        className="input-dark pl-10"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6B7A99]"><User size={14} /></span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "#6B7A99" }}>
                                    Work Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="input-dark pl-10"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6B7A99]"><Mail size={14} /></span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "#6B7A99" }}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        className="input-dark pl-10 pr-12"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#6B7A99]"><Lock size={14} /></span>
                                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#6B7A99" }}>
                                        {showPwd ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {/* Strength indicator */}
                                {password.length > 0 && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((n) => (
                                                <div
                                                    key={n}
                                                    className="flex-1 h-1 rounded-full transition-all duration-300"
                                                    style={{
                                                        background: password.length >= n * 2
                                                            ? n <= 1 ? "#FF4E6A" : n <= 2 ? "#FFB800" : n <= 3 ? "#00E87A" : "#00FFD1"
                                                            : "rgba(255,255,255,0.06)"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-xs mt-1" style={{ color: "#6B7A99" }}>
                                            {password.length < 4 ? "Weak" : password.length < 8 ? "Fair" : password.length < 12 ? "Good" : "Strong"}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: Profile ── */}
                    {step === 2 && (
                        <div className="space-y-4 animate-slide-up" style={{ animationFillMode: "both" }}>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "#6B7A99" }}>
                                    Organisation / College (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={org}
                                    onChange={(e) => setOrg(e.target.value)}
                                    placeholder="e.g. DMCE / Times of India / CBI"
                                    className="input-dark"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: "#6B7A99" }}>
                                    Primary Use Case
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: "journalism", label: "Journalism", icon: <Newspaper size={18} />, desc: "Verifying news" },
                                        { id: "govt", label: "Government", icon: <Landmark size={18} />, desc: "Combating misinfo" },
                                        { id: "personal", label: "Personal", icon: <User size={18} />, desc: "Self protection" },
                                        { id: "enterprise", label: "Enterprise", icon: <Building2 size={18} />, desc: "KYC / Fraud detect" },
                                        { id: "education", label: "Education", icon: <GraduationCap size={18} />, desc: "Research / Study" },
                                        { id: "developer", label: "Developer", icon: <Zap size={18} />, desc: "API integration" },
                                    ].map((u) => (
                                        <button
                                            key={u.id}
                                            type="button"
                                            onClick={() => setUsecase(u.id)}
                                            className="p-3 rounded-xl text-left transition-all"
                                            style={{
                                                background: usecase === u.id ? "rgba(0,255,209,0.08)" : "rgba(255,255,255,0.02)",
                                                border: `1px solid ${usecase === u.id ? "rgba(0,255,209,0.3)" : "rgba(0,255,209,0.07)"}`,
                                            }}
                                        >
                                            <div className="text-sm font-semibold flex items-center gap-2">{u.icon} {u.label}</div>
                                            <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{u.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Plan ── */}
                    {step === 3 && (
                        <div className="space-y-4 animate-slide-up" style={{ animationFillMode: "both" }}>
                            <div className="text-sm mb-1" style={{ color: "#6B7A99" }}>
                                Choose your plan — you can upgrade anytime.
                            </div>
                            {PLANS.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPlan(p.id)}
                                    className="w-full p-5 rounded-xl text-left transition-all"
                                    style={{
                                        background: plan === p.id ? `${p.color}08` : "rgba(255,255,255,0.02)",
                                        border: `1.5px solid ${plan === p.id ? `${p.color}40` : "rgba(0,255,209,0.07)"}`,
                                        boxShadow: plan === p.id ? `0 0 30px ${p.color}10` : "none",
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-black text-base" style={{ color: plan === p.id ? p.color : "#E8EEFF" }}>{p.label}</span>
                                        <span className="font-black" style={{ color: p.color }}>{p.price}</span>
                                    </div>
                                    <div className="text-xs" style={{ color: "#6B7A99" }}>{p.desc}</div>
                                    {plan === p.id && (
                                        <div className="mt-2 text-xs font-bold" style={{ color: p.color }}>✓ Selected</div>
                                    )}
                                </button>
                            ))}

                            {/* Terms */}
                            <p className="text-xs mt-4" style={{ color: "#4B5568" }}>
                                By creating an account you agree to our{" "}
                                <span style={{ color: "#00FFD1" }}>Terms of Service</span> and{" "}
                                <span style={{ color: "#00FFD1" }}>Privacy Policy</span>.
                            </p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div
                            className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm animate-slide-up"
                            style={{ background: "rgba(255,78,106,0.08)", border: "1px solid rgba(255,78,106,0.2)", color: "#FF4E6A" }}
                        >
                            <AlertTriangle size={14} /> {error}
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex gap-3 mt-8">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep((s) => s - 1)}
                                className="btn-ghost flex-1 py-3"
                            >
                                ← Back
                            </button>
                        )}

                        {step < TOTAL ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="btn-primary flex-1 py-3.5"
                                style={{ fontSize: 14 }}
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="btn-primary flex-1 py-3.5"
                                disabled={loading}
                                style={{ fontSize: 14, opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <Loader2 size={16} className="animate-spin" /> Creating account…
                                    </span>
                                ) : <span className="flex items-center justify-center gap-2"><Rocket size={16} /> Launch Dashboard</span>}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: "#3A4560" }}>
                    <Lock size={14} /> 256-bit encrypted · SOC 2 compliant
                </div>
            </div>
        </div>
    );
}
