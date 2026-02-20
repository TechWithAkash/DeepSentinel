"use client";
import { useEffect, useRef, useState } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 62;
const ARC_RATIO = 0.75;
const ARC_LENGTH = CIRCUMFERENCE * ARC_RATIO;

function getColor(score) {
    if (score < 0.4) return "#00E87A";
    if (score < 0.65) return "#FFB800";
    return "#FF4E6A";
}
function getLabel(score) {
    if (score < 0.4) return "Likely Real";
    if (score < 0.65) return "Uncertain";
    return "Likely Fake";
}

export default function ConfidenceDial({ score = 0.78 }) {
    const [displayed, setDisplayed] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        let frame;
        const duration = 1800;
        const start = performance.now();
        const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setDisplayed(eased * score);
            if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [started, score]);

    const fillLength = ARC_LENGTH * displayed;
    const color = getColor(displayed);
    const pct = Math.round(displayed * 100);

    return (
        <div ref={ref} className="flex flex-col items-center gap-4">
            <div className="relative" style={{ width: 190, height: 190 }}>
                {/* Outer ring decoration */}
                <svg width="190" height="190" viewBox="0 0 190 190" className="absolute inset-0">
                    <circle cx="95" cy="95" r="88" fill="none" stroke="rgba(0,255,209,0.04)" strokeWidth="1" />
                    <circle cx="95" cy="95" r="75" fill="none" stroke="rgba(0,255,209,0.04)" strokeWidth="1" />
                </svg>

                {/* Main dial */}
                <svg width="190" height="190" viewBox="0 0 190 190" style={{ transform: "rotate(135deg)" }}>
                    {/* Track */}
                    <circle cx="95" cy="95" r="62"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
                    />
                    {/* Glow layer */}
                    <circle cx="95" cy="95" r="62"
                        fill="none"
                        stroke={color}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${fillLength} ${CIRCUMFERENCE - fillLength}`}
                        style={{ filter: `blur(8px)`, opacity: 0.35, transition: "stroke 0.5s" }}
                    />
                    {/* Main fill */}
                    <circle cx="95" cy="95" r="62"
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${fillLength} ${CIRCUMFERENCE - fillLength}`}
                        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke 0.5s" }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-center">
                        <div
                            className="font-black leading-none"
                            style={{ fontSize: 42, color, textShadow: `0 0 20px ${color}60` }}
                        >
                            {pct}%
                        </div>
                        <div className="text-xs mt-1.5 font-bold uppercase tracking-widest" style={{ color: "#6B7A99" }}>
                            AI Likelihood
                        </div>
                    </div>
                </div>
            </div>

            {/* Verdict label */}
            <div
                className="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider"
                style={{ background: `${color}15`, color, border: `1px solid ${color}40` }}
            >
                {getLabel(score)}
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs" style={{ color: "#6B7A99" }}>
                <span style={{ color: "#00E87A" }}>● Real</span>
                <span style={{ color: "#FFB800" }}>● Uncertain</span>
                <span style={{ color: "#FF4E6A" }}>● Fake</span>
            </div>
        </div>
    );
}
