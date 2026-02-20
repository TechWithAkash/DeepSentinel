"use client";

import { Zap, Flame, TrendingUp, AlertTriangle, CheckCircle2, Radio } from "lucide-react";

const LEVELS = {
    "Extreme Viral Risk": { color: "#FF4E6A", bg: "rgba(255,78,106,0.1)", icon: <Zap size={28} />, tier: "EXTREME" },
    "Critical Viral Risk": { color: "#FF4E6A", bg: "rgba(255,78,106,0.1)", icon: <Flame size={28} />, tier: "CRITICAL" },
    "High Spread Potential": { color: "#FFB800", bg: "rgba(255,184,0,0.1)", icon: <TrendingUp size={28} />, tier: "HIGH" },
    "Moderate Spread Potential": { color: "#FFB800", bg: "rgba(255,184,0,0.08)", icon: <AlertTriangle size={28} />, tier: "MODERATE" },
    "Low Spread Potential": { color: "#00E87A", bg: "rgba(0,232,122,0.08)", icon: <CheckCircle2 size={28} />, tier: "LOW" },
};

export default function ViralRiskBadge({ label, score }) {
    const meta = LEVELS[label] || LEVELS["High Spread Potential"];
    const pct = Math.round((score || 0.5) * 100);

    return (
        <div
            className="rounded-2xl p-5"
            style={{ background: meta.bg, border: `1px solid ${meta.color}35` }}
        >
            <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3" style={{ color: meta.color, opacity: 0.7 }}>
                <Radio size={14} /> Misinformation Risk Score
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="shrink-0">{meta.icon}</span>
                    <div>
                        <div className="font-black text-sm" style={{ color: meta.color }}>{label}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                                className="text-xs font-black px-2 py-0.5 rounded"
                                style={{ background: `${meta.color}20`, color: meta.color, letterSpacing: "0.06em" }}
                            >
                                {meta.tier}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-black leading-none" style={{ fontSize: 36, color: meta.color }}>{pct}</div>
                    <div className="text-xs" style={{ color: "#6B7A99" }}>/100</div>
                </div>
            </div>

            {/* Risk bar */}
            <div className="mt-4 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${meta.color}60, ${meta.color})`,
                        boxShadow: `0 0 10px ${meta.color}50`,
                    }}
                />
            </div>

            <div className="flex justify-between text-xs mt-2" style={{ color: "#6B7A99" }}>
                <span>Low Risk</span>
                <span>Extreme Risk</span>
            </div>
        </div>
    );
}
