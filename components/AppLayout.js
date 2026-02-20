"use client";
import AppSidebar from "./AppSidebar";

/**
 * Wraps any authenticated page with the shared sidebar layout.
 * Usage: <AppLayout>{children}</AppLayout>
 */
export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen" style={{ background: "var(--navy)" }}>
            <AppSidebar />
            {/* 240px = sidebar width (matches .sidebar CSS) */}
            <div className="flex-1" style={{ marginLeft: 240 }}>
                {children}
            </div>
        </div>
    );
}
