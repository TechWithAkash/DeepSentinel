"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AnalysisLoader from "../../components/AnalysisLoader";
import UploadZone from "../../components/UploadZone";
import {
    ANALYSIS_STEPS,
    ANALYSIS_STEPS_TEXT,
    ANALYSIS_STEPS_VIDEO,
} from "../../lib/mockData";

const TABS = [
    { id: "image", icon: "🖼️", label: "Image", desc: "JPG, PNG, WEBP" },
    { id: "video", icon: "🎬", label: "Video", desc: "MP4, MOV, AVI" },
    { id: "audio", icon: "🎵", label: "Audio", desc: "MP3, WAV, M4A" },
    { id: "text", icon: "📝", label: "Text", desc: "TXT, PDF, DOCX" },
    { id: "whatsapp", icon: "📱", label: "WhatsApp", desc: "Forward scan" },
];

function getSteps(tab) {
    if (tab === "video") return ANALYSIS_STEPS_VIDEO;
    if (tab === "text") return ANALYSIS_STEPS_TEXT;
    return ANALYSIS_STEPS;
}

export default function AnalyzePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("image");
    const [selectedFile, setSelectedFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnalyze = () => {
        if (!selectedFile) return;
        localStorage.setItem("veravision_result_type", activeTab);
        localStorage.setItem("veravision_file_name", selectedFile.name);
        setAnalyzing(true);
    };

    return (
        <div className="min-h-screen bg-grid px-6 py-14">
            {/* Glow blob */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04] pointer-events-none" style={{ background: "#00FFD1" }} />

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12 animate-slide-up">
                    <span className="inline-block text-xs uppercase tracking-widest font-bold mb-4 px-3 py-1 rounded-full"
                        style={{ color: "#00FFD1", background: "rgba(0,255,209,0.07)", border: "1px solid rgba(0,255,209,0.2)" }}>
                        Detection Suite
                    </span>
                    <h1 className="font-black text-4xl mb-3 gradient-text">Analyze Content</h1>
                    <p className="text-sm" style={{ color: "#6B7A99", maxWidth: 400, margin: "0 auto" }}>
                        VeraVision&apos;s AI engines analyze your file in seconds.
                        <span style={{ color: "#00FFD1" }}> Zero data stored. Fully private.</span>
                    </p>
                </div>

                {!analyzing ? (
                    <div
                        className="card p-8 rounded-2xl animate-slide-up"
                        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                    >
                        {/* Tab strip */}
                        <div className="grid grid-cols-5 gap-1 mb-7 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,255,209,0.08)" }}>
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveTab(tab.id); setSelectedFile(null); }}
                                        className="flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-semibold transition-all duration-200"
                                        style={{
                                            background: isActive ? "rgba(0,255,209,0.1)" : "transparent",
                                            color: isActive ? "#00FFD1" : "#6B7A99",
                                            border: isActive ? "1px solid rgba(0,255,209,0.22)" : "1px solid transparent",
                                        }}
                                    >
                                        <span style={{ fontSize: 20 }}>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Description for active tab */}
                        <p className="text-xs mb-5 font-mono" style={{ color: "rgba(0,255,209,0.5)" }}>
                            &gt; Selected engine:{" "}
                            <span style={{ color: "#00FFD1" }}>
                                {activeTab.toUpperCase()}_DETECTION_v2.1
                            </span>
                        </p>

                        <UploadZone activeTab={activeTab} onFileSelect={setSelectedFile} />

                        {/* Privacy note */}
                        <div className="flex items-center gap-2 mt-5 text-xs" style={{ color: "#4B5568" }}>
                            <span style={{ color: "#00FFD1" }}>🔒</span>
                            Files are analyzed in memory and never stored on our servers.
                        </div>

                        {/* Analyze button */}
                        <button
                            className="btn-primary w-full mt-5 py-3.5"
                            onClick={handleAnalyze}
                            disabled={!selectedFile}
                            style={{ opacity: selectedFile ? 1 : 0.35, cursor: selectedFile ? "pointer" : "not-allowed", fontSize: 15 }}
                        >
                            {selectedFile ? "🔍 Run Analysis →" : "Select a file to continue"}
                        </button>

                        {/* Demo shortcut */}
                        <div className="text-center mt-4">
                            <button
                                className="text-xs"
                                style={{ color: "#6B7A99", textDecoration: "underline" }}
                                onClick={() => {
                                    localStorage.setItem("veravision_result_type", activeTab);
                                    localStorage.setItem("veravision_file_name", `demo_${activeTab}_sample`);
                                    setSelectedFile({ name: `demo_${activeTab}_sample` });
                                    setAnalyzing(true);
                                }}
                            >
                                → Use demo sample instead
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card rounded-2xl animate-fade-in">
                        <AnalysisLoader steps={getSteps(activeTab)} onComplete={() => router.push("/results")} />
                    </div>
                )}

                {/* Stats row */}
                {!analyzing && (
                    <div
                        className="grid grid-cols-3 gap-4 mt-6 animate-fade-in"
                        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
                    >
                        {[
                            { icon: "⚡", val: "< 10s", sub: "Analysis time" },
                            { icon: "🎯", val: "91%", sub: "Accuracy (Image)" },
                            { icon: "🔒", val: "0 KB", sub: "Data stored" },
                        ].map((s) => (
                            <div key={s.val} className="card p-4 rounded-xl text-center">
                                <div style={{ fontSize: 22 }}>{s.icon}</div>
                                <div className="font-black text-lg mt-1" style={{ color: "#00FFD1" }}>{s.val}</div>
                                <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
