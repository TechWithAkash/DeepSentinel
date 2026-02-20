"use client";

const GAN_SOURCES = {
    "Stable Diffusion XL": { color: "#8B5CF6", icon: "🎨", category: "Image Gen" },
    "DeepFaceLab": { color: "#FF4E6A", icon: "🎭", category: "Face Swap" },
    "ElevenLabs TTS": { color: "#FFB800", icon: "🔊", category: "Voice Cloning" },
    "GPT-4 / ChatGPT": { color: "#00E87A", icon: "🤖", category: "Text Gen" },
    "Midjourney v6": { color: "#3B82F6", icon: "🖼️", category: "Image Gen" },
    "DALL·E 3": { color: "#F59E0B", icon: "✨", category: "Image Gen" },
    "Image Editing Software": { color: "#6B7280", icon: "✂️", category: "Manipulation" },
};

export default function GanSourceChip({ source, confidence }) {
    const meta = GAN_SOURCES[source] || { color: "#8B949E", icon: "🤖", category: "Unknown" };
    const pct = Math.round((confidence || 0.7) * 100);

    return (
        <div
            className="rounded-2xl p-5"
            style={{ background: `${meta.color}0D`, border: `1px solid ${meta.color}35` }}
        >
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: meta.color, opacity: 0.7 }}>
                🔬 GAN Source Attribution
            </div>
            <div className="flex items-center gap-3">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
                >
                    {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-black text-base leading-tight" style={{ color: meta.color }}>
                        {source}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>
                        Category: {meta.category}
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="font-black text-xl" style={{ color: meta.color }}>{pct}%</div>
                    <div className="text-xs" style={{ color: "#6B7A99" }}>match</div>
                </div>
            </div>

            {/* Confidence bar */}
            <div className="mt-4 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}60, ${meta.color})`, boxShadow: `0 0 8px ${meta.color}50` }}
                />
            </div>
        </div>
    );
}
