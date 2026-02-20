"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
    LayoutDashboard,
    Search,
    ShieldCheck,
    Webhook,
    Settings,
    Beaker,
    BarChart3,
    KeySquare,
    BookOpenText,
    LogOut,
} from "lucide-react";

const DASHBOARD_NAV = [
    { id: "overview", href: "/dashboard?tab=overview", icon: <LayoutDashboard size={16} />, label: "Overview", badge: null },
    { id: "scans", href: "/dashboard?tab=scans", icon: <Search size={16} />, label: "My Scans", badge: "12" },
    { id: "certificates", href: "/dashboard?tab=certificates", icon: <ShieldCheck size={16} />, label: "Certificates", badge: null },
    { id: "api", href: "/dashboard?tab=api", icon: <Webhook size={16} />, label: "API Usage", badge: null },
    { id: "settings", href: "/dashboard?tab=settings", icon: <Settings size={16} />, label: "Settings", badge: null },
];

const PLATFORM_NAV = [
    { href: "/analyze", icon: <Beaker size={16} />, label: "Analyze Content" },
    { href: "/results", icon: <BarChart3 size={16} />, label: "Results" },
    { href: "/verify", icon: <KeySquare size={16} />, label: "Verify / Certify" },
    { href: "/api-docs", icon: <BookOpenText size={16} />, label: "API Docs" },
];

export default function AppSidebar() {
    return (
        <Suspense fallback={<div className="sidebar" />}>
            <SidebarContent />
        </Suspense>
    );
}

function SidebarContent() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "overview";

    const onLogout = () => {
        if (typeof localStorage !== "undefined") localStorage.removeItem("vv_logged_in");
        router.push("/login");
    };

    const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");

    return (
        <aside className="sidebar" style={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50 }}>
            {/* ── Logo ── */}
            <div
                className="flex items-center gap-2.5 px-5 py-5"
                style={{ borderBottom: "1px solid rgba(0,255,209,0.07)" }}
            >
                <svg width="28" height="28" viewBox="0 0 72 72" fill="none">
                    <path d="M36 4L8 16v20c0 16 11 28 28 32 17-4 28-16 28-32V16L36 4z"
                        stroke="#00FFD1" strokeWidth="1.5" fill="rgba(0,255,209,0.06)" />
                    <circle cx="36" cy="33" r="9" fill="#00FFD1" opacity="0.9" />
                    <path d="M36 24L36 42M27 33L45 33" stroke="#030C18" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div>
                    <div className="font-black text-sm" style={{ color: "#E8EEFF" }}>VeraVision</div>
                    <div className="text-xs" style={{ color: "#6B7A99" }}>AI Truth Engine</div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-blink"
                        style={{ background: "#00E87A", boxShadow: "0 0 6px #00E87A" }} />
                </div>
            </div>

            {/* ── User pill ── */}
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
                <span className="text-xs px-1.5 py-0.5 rounded font-black shrink-0"
                    style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1", fontSize: 9 }}>
                    FREE
                </span>
            </div>

            {/* ── Scrollable nav ── */}
            <nav className="flex flex-col gap-0.5 px-3 flex-1" style={{ overflowY: "auto" }}>

                {/* Dashboard section */}
                <div className="text-xs font-black uppercase tracking-widest px-3 pb-1 pt-1"
                    style={{ color: "#3A4560", letterSpacing: "0.1em" }}>
                    Dashboard
                </div>

                {DASHBOARD_NAV.map((item) => {
                    const active = pathname === "/dashboard" && currentTab === item.id;
                    return (
                        <Link key={item.id} href={item.href}>
                            <div className={`sidebar-nav-item ${active ? "active" : ""}`}>
                                <span style={{ fontSize: 14, minWidth: 18 }}>{item.icon}</span>
                                {item.label}
                                {item.badge && (
                                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-black"
                                        style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1", fontSize: 9 }}>
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}

                {/* Divider */}
                <div className="my-3 mx-1" style={{ height: 1, background: "rgba(0,255,209,0.07)" }} />

                {/* Platform section */}
                <div className="text-xs font-black uppercase tracking-widest px-3 pb-1"
                    style={{ color: "#3A4560", letterSpacing: "0.1em" }}>
                    Platform
                </div>

                {PLATFORM_NAV.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <div className={`sidebar-nav-item ${isActive(item.href) ? "active" : ""}`}>
                            <span style={{ fontSize: 14, minWidth: 18 }}>{item.icon}</span>
                            {item.label}
                            <span className="ml-auto text-xs" style={{ color: isActive(item.href) ? "#00FFD1" : "#2A3550" }}>↗</span>
                        </div>
                    </Link>
                ))}
            </nav>

            {/* ── Bottom CTA + logout ── */}
            <div className="px-3 pb-5 pt-4 flex flex-col gap-2"
                style={{ borderTop: "1px solid rgba(0,255,209,0.07)" }}>
                <Link href="/analyze">
                    <button className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                        <Search size={14} /> New Analysis
                    </button>
                </Link>
                <button onClick={onLogout} className="btn-ghost w-full py-2.5 text-xs flex items-center justify-center gap-2">
                    <LogOut size={14} /> Sign Out
                </button>
            </div>
        </aside>
    );
}
