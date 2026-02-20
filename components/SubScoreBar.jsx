"use client";
import { useEffect, useRef, useState } from "react";

const MODALITY_META = {
    text: { label: "Text Engine", icon: "📝", color: "#00FFD1" },
    image: { label: "Image Engine", icon: "🖼️", color: "#3B82F6" },
    audio: { label: "Audio Engine", icon: "🎵", color: "#8B5CF6" },
    video: { label: "Video Engine", icon: "🎬", color: "#FFB800" },
    metadata: { label: "Metadata Scan", icon: "🧾", color: "#FF4E6A" },
};

export default function SubScoreBar({ modality, score }) {
    const [width, setWidth] = useState(0);
    const ref = useRef(null);
    const meta = MODALITY_META[modality] || { label: modality, icon: "⚙️", color: "#00FFD1" };
    const pct = Math.round(score * 100);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setTimeout(() => setWidth(pct), 150); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [pct]);

    return (
        <div ref={ref} className="group">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 13 }}>{meta.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: "#8B949E" }}>{meta.label}</span>
                </div>
                <span className="text-xs font-black" style={{ color: meta.color }}>{pct}%</span>
            </div>
            <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                {/* Glow bg */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{ width: `${width}%`, background: `${meta.color}30`, filter: "blur(3px)", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                />
                {/* Bar */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${meta.color}90, ${meta.color})`,
                        boxShadow: `0 0 8px ${meta.color}60`,
                    }}
                />
            </div>
        </div>
    );
}
