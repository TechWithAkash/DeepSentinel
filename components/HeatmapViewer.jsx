"use client";
import { useState } from "react";

export default function HeatmapViewer({ zones = [], fileType = "image" }) {
    const [hovered, setHovered] = useState(null);

    const mockImage =
        fileType === "video"
            ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&q=80"
            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80";

    return (
        <div className="card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-sm" style={{ color: "#E8EEFF" }}>
                        🗺️ Forensic Heatmap
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>GradCAM activation overlay</p>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="text-xs px-2.5 py-1 rounded-lg font-bold animate-blink"
                        style={{ background: "rgba(255,78,106,0.12)", color: "#FF4E6A", border: "1px solid rgba(255,78,106,0.3)" }}
                    >
                        ● GradCAM Active
                    </span>
                </div>
            </div>

            {/* Image + overlays container */}
            <div
                className="relative rounded-xl overflow-hidden"
                style={{ aspectRatio: "16/9", background: "#050A12" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={mockImage}
                    alt="Analysis subject"
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.65 }}
                />

                {/* Heatmap tint overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse at 35% 30%, rgba(255,78,106,0.28) 0%, transparent 55%)",
                            "radial-gradient(ellipse at 70% 65%, rgba(255,184,0,0.18) 0%, transparent 40%)",
                            "radial-gradient(ellipse at 20% 75%, rgba(255,78,106,0.15) 0%, transparent 35%)",
                        ].join(", "),
                    }}
                />

                {/* Scan line animation */}
                <div
                    className="absolute left-0 right-0 h-0.5 pointer-events-none"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(0,255,209,0.6), transparent)",
                        animation: "scan-line 4s linear infinite",
                        top: 0,
                    }}
                />

                {/* Zone highlights */}
                {zones.map((zone, i) => (
                    <div
                        key={i}
                        className="absolute cursor-pointer transition-all duration-200"
                        style={{
                            top: zone.top, left: zone.left, width: zone.width, height: zone.height,
                            border: `1.5px solid rgba(255,78,106,${hovered === i ? 1 : 0.6})`,
                            background: `rgba(255,78,106,${hovered === i ? 0.22 : 0.06})`,
                            borderRadius: 6,
                            boxShadow: hovered === i ? "0 0 16px rgba(255,78,106,0.5), inset 0 0 16px rgba(255,78,106,0.1)" : "none",
                        }}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {hovered === i && (
                            <div
                                className="absolute -top-8 left-0 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap z-10"
                                style={{ background: "#FF4E6A", color: "#fff", boxShadow: "0 4px 12px rgba(255,78,106,0.4)" }}
                            >
                                ⚠ {zone.label}
                            </div>
                        )}
                        {/* Corner markers */}
                        <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t border-l border-red-400 opacity-70" />
                        <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t border-r border-red-400 opacity-70" />
                        <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b border-l border-red-400 opacity-70" />
                        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b border-r border-red-400 opacity-70" />
                    </div>
                ))}

                {/* Legend */}
                <div
                    className="absolute bottom-3 left-3 text-xs px-2.5 py-1.5 rounded-lg glass"
                    style={{ color: "#E8EEFF" }}
                >
                    🔴 {zones.length} suspicious region{zones.length !== 1 ? "s" : ""} detected
                </div>

                {/* Grid overlay lines */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                        backgroundImage: "linear-gradient(rgba(0,255,209,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,209,0.5) 1px, transparent 1px)",
                        backgroundSize: "25% 25%",
                    }}
                />
            </div>

            <p className="mt-3 text-xs" style={{ color: "#6B7A99" }}>
                Hover over highlighted zones to inspect what triggered the AI detection.
            </p>
        </div>
    );
}
