"use client";
import { useEffect, useState } from "react";

export default function AnalysisLoader({ steps = [], onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        let total = 0;
        steps.forEach((step, i) => {
            setTimeout(() => {
                setCurrentStep(i + 1);
                if (i === steps.length - 1) {
                    setTimeout(() => { setDone(true); onComplete?.(); }, 600);
                }
            }, total + step.duration);
            total += step.duration;
        });
    }, []); // eslint-disable-line

    const progress = Math.round((currentStep / steps.length) * 100);

    return (
        <div className="flex flex-col items-center gap-6 py-12 px-6 max-w-lg mx-auto text-center">
            {/* Spinner rig */}
            <div className="relative w-24 h-24">
                {/* Outer ring */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        border: "1px solid rgba(0,255,209,0.1)",
                        animation: "spin-slow 12s linear infinite reverse",
                    }}
                />
                {/* Spinning ring */}
                <div
                    className="absolute inset-1 rounded-full"
                    style={{
                        border: "2px solid transparent",
                        borderTopColor: "#00FFD1",
                        borderRightColor: "rgba(0,255,209,0.3)",
                        animation: "spin-slow 3s linear infinite",
                    }}
                />
                {/* Inner glow */}
                <div
                    className="absolute inset-4 rounded-full flex items-center justify-center"
                    style={{
                        background: "radial-gradient(circle, rgba(0,255,209,0.12) 0%, transparent 70%)",
                        border: "1px solid rgba(0,255,209,0.15)",
                    }}
                >
                    <span style={{ fontSize: 26 }}>{done ? "✅" : "🔍"}</span>
                </div>
            </div>

            <div>
                <h3 className="font-black text-xl mb-1" style={{ color: "#E8EEFF" }}>
                    {done ? "Analysis Complete!" : "Scanning Content…"}
                </h3>
                <p className="text-sm" style={{ color: "#6B7A99" }}>
                    {done
                        ? "Preparing your forensic report…"
                        : `Running ${steps.length} AI detection engines in parallel`}
                </p>
            </div>

            {/* Progress bar */}
            <div className="w-full">
                <div className="flex justify-between text-xs mb-2">
                    <span style={{ color: "#6B7A99" }}>Progress</span>
                    <span className="font-bold" style={{ color: "#00FFD1" }}>{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full w-full relative overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    {/* Glow bg */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: "rgba(0,255,209,0.3)", filter: "blur(4px)" }}
                    />
                    {/* Bar */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                            background: "linear-gradient(90deg, #00C4A0, #00FFD1)",
                            boxShadow: "0 0 12px rgba(0,255,209,0.5)",
                        }}
                    />
                </div>
            </div>

            {/* Steps list */}
            <div className="w-full flex flex-col gap-1.5 text-left">
                {steps.map((step, i) => {
                    const isDone = i < currentStep;
                    const isActive = i === currentStep - 1;
                    return (
                        <div
                            key={step.id}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300"
                            style={{
                                background: isActive ? "rgba(0,255,209,0.06)" : "transparent",
                                border: `1px solid ${isActive ? "rgba(0,255,209,0.2)" : "transparent"}`,
                                opacity: i > currentStep ? 0.25 : 1,
                            }}
                        >
                            <span className="shrink-0" style={{ fontSize: 14, minWidth: 18 }}>
                                {isDone ? "✅" : isActive ? "⚡" : "○"}
                            </span>
                            <span
                                className="text-xs flex-1"
                                style={{ color: isDone ? "#00FFD1" : isActive ? "#E8EEFF" : "#6B7A99" }}
                            >
                                {step.label}
                            </span>
                            {isActive && (
                                <span className="text-xs font-bold animate-blink" style={{ color: "#00FFD1" }}>
                                    running
                                </span>
                            )}
                            {isDone && (
                                <span className="text-xs" style={{ color: "#00E87A" }}>done</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
