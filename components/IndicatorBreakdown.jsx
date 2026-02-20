"use client";
import { useState } from "react";
import { Ban, AlertTriangle, Info, Search } from "lucide-react";

const SEVERITY_META = {
    high: { color: "#FF4E6A", bg: "rgba(255,78,106,0.07)", icon: <Ban size={16} />, label: "HIGH" },
    medium: { color: "#FFB800", bg: "rgba(255,184,0,0.07)", icon: <AlertTriangle size={16} />, label: "MED" },
    low: { color: "#6B7A99", bg: "rgba(107,122,153,0.07)", icon: <Info size={16} />, label: "LOW" },
};

export default function IndicatorBreakdown({ indicators = { en: [], hi: [] } }) {
    const [lang, setLang] = useState("en");
    const items = indicators[lang] || [];

    const highCount = items.filter(i => i.severity === "high").length;
    const medCount = items.filter(i => i.severity === "medium").length;

    return (
        <div className="card p-5 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "#E8EEFF" }}>
                        <Search size={16} /> Indicator Breakdown
                    </h3>
                    <div className="flex gap-3 mt-1.5">
                        <span className="text-xs font-bold" style={{ color: "#FF4E6A" }}>
                            {highCount} High
                        </span>
                        <span className="text-xs font-bold" style={{ color: "#FFB800" }}>
                            {medCount} Medium
                        </span>
                    </div>
                </div>

                {/* Language toggle */}
                <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,255,209,0.15)" }}>
                    {["en", "hi"].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className="px-3.5 py-1.5 text-xs font-bold transition-all duration-200"
                            style={{
                                background: lang === l ? "rgba(0,255,209,0.12)" : "transparent",
                                color: lang === l ? "#00FFD1" : "#6B7A99",
                            }}
                        >
                            {l === "en" ? "EN" : "हि"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Indicators */}
            <div className="flex flex-col gap-2">
                {items.map((item, i) => {
                    const meta = SEVERITY_META[item.severity] || SEVERITY_META.low;
                    return (
                        <div
                            key={i}
                            className="flex items-start gap-3 rounded-xl px-3.5 py-3 animate-fade-in"
                            style={{
                                background: meta.bg,
                                border: `1px solid ${meta.color}20`,
                                animationDelay: `${i * 60}ms`,
                                animationFillMode: "both",
                            }}
                        >
                            <span className="shrink-0 mt-0.5">{meta.icon}</span>
                            <span className="text-xs leading-relaxed flex-1" style={{ color: "#C5CDE8" }}>
                                {item.text}
                            </span>
                            <span
                                className="text-xs font-black shrink-0 px-1.5 py-0.5 rounded"
                                style={{ background: `${meta.color}18`, color: meta.color, letterSpacing: "0.04em" }}
                            >
                                {meta.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <p className="text-xs flex items-center gap-2" style={{ color: "#4B5568" }}>
                    <AlertTriangle size={14} /> Probabilistic analysis. Not absolute proof. Cross-verify important content independently.
                </p>
            </div>
        </div>
    );
}
