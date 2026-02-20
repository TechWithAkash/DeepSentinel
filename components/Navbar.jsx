"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ShieldLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L4 7v9c0 7 5 12 12 14 7-2 12-7 12-14V7L16 2z" stroke="#00FFD1" strokeWidth="1.5" fill="none" />
        <path d="M16 2L4 7v9c0 7 5 12 12 14 7-2 12-7 12-14V7L16 2z" fill="rgba(0,255,209,0.08)" />
        <circle cx="16" cy="15" r="4" fill="#00FFD1" opacity="0.9" />
        <path d="M16 11 L16 19 M12 15 L20 15" stroke="#040810" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/analyze", label: "Analyze" },
    { href: "/verify", label: "Verify" },
    { href: "/api-docs", label: "API Docs" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 glass"
            style={{ borderBottom: "1px solid rgba(0,255,209,0.1)" }}
        >
            {/* Top accent line */}
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #00FFD1, transparent)" }} />

            <div className="max-w-7xl mx-auto px-5 h-15 flex items-center justify-between" style={{ height: 60 }}>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="transition-transform duration-200 group-hover:scale-105">
                        <ShieldLogo />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-black text-base tracking-tight" style={{ color: "#00FFD1" }}>
                            VeraVision
                        </span>
                        <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: "rgba(0,255,209,0.5)" }}>
                            AI Truth Engine
                        </span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{ color: isActive ? "#00FFD1" : "#6B7A99" }}
                            >
                                {isActive && (
                                    <span
                                        className="absolute inset-0 rounded-lg"
                                        style={{ background: "rgba(0,255,209,0.07)", border: "1px solid rgba(0,255,209,0.18)" }}
                                    />
                                )}
                                <span className="relative z-10">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Live indicator */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: "#00E87A" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-blink" style={{ backgroundColor: "#00E87A" }} />
                        LIVE
                    </div>
                    <Link href="/analyze">
                        <button className="btn-primary text-sm py-2 px-5">
                            Try Demo →
                        </button>
                    </Link>
                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden btn-ghost py-1.5 px-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden px-5 pb-4 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(0,255,209,0.08)" }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="px-4 py-2.5 rounded-lg text-sm font-medium"
                            style={{ color: pathname === link.href ? "#00FFD1" : "#6B7A99", background: pathname === link.href ? "rgba(0,255,209,0.06)" : "transparent" }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
