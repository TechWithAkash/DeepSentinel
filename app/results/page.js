"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ConfidenceDial from "../../components/ConfidenceDial";
import GanSourceChip from "../../components/GanSourceChip";
import HeatmapViewer from "../../components/HeatmapViewer";
import IndicatorBreakdown from "../../components/IndicatorBreakdown";
import SubScoreBar from "../../components/SubScoreBar";
import ViralRiskBadge from "../../components/ViralRiskBadge";
import AppLayout from "../../components/AppLayout";
import { MOCK_RESULTS } from "../../lib/mockData";
import {
    AlertTriangle, CheckCircle2, FileText, Smartphone,
    X, Target, BarChart2, ShieldCheck, RefreshCw, Webhook, Timer, Link as LinkIcon
} from "lucide-react";

const VERDICT_META = {
    red: { bg: "rgba(255,78,106,0.08)", border: "rgba(255,78,106,0.25)", color: "#FF4E6A", icon: <AlertTriangle size={32} />, glow: "rgba(255,78,106,0.15)" },
    yellow: { bg: "rgba(255,184,0,0.08)", border: "rgba(255,184,0,0.25)", color: "#FFB800", icon: <AlertTriangle size={32} />, glow: "rgba(255,184,0,0.12)" },
    green: { bg: "rgba(0,232,122,0.08)", border: "rgba(0,232,122,0.25)", color: "#00E87A", icon: <CheckCircle2 size={32} />, glow: "rgba(0,232,122,0.12)" },
};
const CMCE_COLORS = {
    CRITICAL: "#FF4E6A", HIGH: "#FFB800", MEDIUM: "#FFB800", LOW: "#00E87A",
};

export default function ResultsPage() {
    const [result, setResult] = useState(null);
    const [fileName, setFileName] = useState("analyzed_file");
    const [reportSaved, setReportSaved] = useState(false);

    useEffect(() => {
        const type = localStorage.getItem("veravision_result_type") || "image";
        const name = localStorage.getItem("veravision_file_name") || "uploaded_file";
        setResult(MOCK_RESULTS[type] || MOCK_RESULTS.image);
        setFileName(name);
    }, []);

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="w-12 h-12 rounded-full mx-auto mb-4"
                        style={{ border: "2px solid rgba(0,255,209,0.15)", borderTopColor: "#00FFD1", animation: "spin-slow 1s linear infinite" }}
                    />
                    <p style={{ color: "#6B7A99" }}>Loading analysis…</p>
                </div>
            </div>
        );
    }

    const vMeta = VERDICT_META[result.verdict_color] || VERDICT_META.red;
    const subScoreEntries = Object.entries(result.sub_scores).filter(([, v]) => v !== null);

    return (
        <AppLayout>
            <div className="min-h-screen bg-grid px-4 py-12">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-8 animate-slide-up">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "#00FFD1" }}>
                                    Analysis Complete
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,255,209,0.08)", color: "#6B7A99", fontFamily: "monospace" }}>
                                    {result.processing_time_ms}ms
                                </span>
                            </div>
                            <h1 className="font-black text-3xl gradient-text">Results Dashboard</h1>
                            <p className="text-xs mt-1.5 font-mono" style={{ color: "#6B7A99" }}>
                                &gt; {fileName}
                            </p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                className="btn-ghost text-sm flex items-center gap-2"
                                onClick={() => { setReportSaved(true); setTimeout(() => setReportSaved(false), 2500); }}
                            >
                                {reportSaved ? <><CheckCircle2 size={16} /> Saved!</> : <><FileText size={16} /> Export Report</>}
                            </button>
                            <Link href="/analyze">
                                <button className="btn-outline text-sm py-2 px-4 flex items-center gap-2"><RefreshCw size={16} /> Analyze Another</button>
                            </Link>
                        </div>
                    </div>

                    {/* Verdict Banner */}
                    <div
                        className="rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-4 animate-slide-up relative overflow-hidden"
                        style={{
                            background: vMeta.bg,
                            border: `1px solid ${vMeta.border}`,
                            boxShadow: `0 0 40px ${vMeta.glow}`,
                            animationDelay: "0.05s", animationFillMode: "both",
                        }}
                    >
                        {/* Glow blob */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl pointer-events-none" style={{ background: `${vMeta.color}20` }} />

                        <span style={{ fontSize: 40 }}>{vMeta.icon}</span>
                        <div className="flex-1 relative z-10">
                            <div className="font-black text-2xl" style={{ color: vMeta.color }}>{result.verdict}</div>
                            <div className="text-sm mt-0.5" style={{ color: "#6B7A99" }}>
                                Overall AI-generation likelihood:{" "}
                                <strong style={{ color: vMeta.color }}>{Math.round(result.overall_confidence * 100)}%</strong>
                                {" "}confidence
                            </div>
                        </div>
                        {/* CMCE badge */}
                        <div
                            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider relative z-10"
                            style={{
                                background: `${CMCE_COLORS[result.cmce_risk]}14`,
                                color: CMCE_COLORS[result.cmce_risk],
                                border: `1px solid ${CMCE_COLORS[result.cmce_risk]}35`,
                            }}
                        >
                            <LinkIcon size={14} className="inline mr-1" /> CMCE: {result.cmce_risk}
                        </div>
                    </div>

                    {/* WhatsApp caption banner */}
                    {result.file_type === "whatsapp" && result.caption_verdict && (
                        <div
                            className="rounded-2xl p-5 mb-6 animate-fade-in"
                            style={{ background: "rgba(255,78,106,0.07)", border: "1px solid rgba(255,78,106,0.22)" }}
                        >
                            <div className="text-xs font-black mb-2 uppercase tracking-wider flex items-center gap-2" style={{ color: "#FF4E6A" }}>
                                <Smartphone size={16} /> Caption Claim Verification
                            </div>
                            <div className="text-sm mb-2" style={{ color: "#C5CDE8" }}>
                                Claim: <em>&quot;{result.caption_claim}&quot;</em>
                            </div>
                            <div className="font-bold text-sm flex items-center gap-2" style={{ color: "#FF4E6A" }}>
                                <X size={16} /> {result.caption_verdict}
                            </div>
                        </div>
                    )}

                    {/* Main grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left column */}
                        <div className="flex flex-col gap-5 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>

                            {/* Confidence Dial */}
                            <div className="card p-6 rounded-2xl flex flex-col items-center">
                                <div className="flex items-center justify-between w-full mb-4">
                                    <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "#E8EEFF" }}>
                                        <Target size={16} /> Confidence Score
                                    </h3>
                                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "rgba(0,255,209,0.07)", color: "#00FFD1" }}>
                                        LIVE
                                    </span>
                                </div>
                                <ConfidenceDial score={result.overall_confidence} />
                            </div>

                            {/* Sub-scores */}
                            {subScoreEntries.length > 0 && (
                                <div className="card p-5 rounded-2xl">
                                    <h3 className="font-bold text-sm mb-5 flex items-center gap-2" style={{ color: "#E8EEFF" }}>
                                        <BarChart2 size={16} /> Per-Modality Scores
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {subScoreEntries.map(([key, val]) => (
                                            <SubScoreBar key={key} modality={key} score={val} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* GAN Source */}
                            <GanSourceChip source={result.gan_source} confidence={result.gan_confidence} />

                            {/* Viral Risk */}
                            <ViralRiskBadge label={result.viral_risk_label} score={result.viral_risk_score} />
                        </div>

                        {/* Right 2/3 column */}
                        <div className="lg:col-span-2 flex flex-col gap-5 animate-slide-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>

                            {/* Heatmap */}
                            {result.heatmap_zones?.length > 0 && (
                                <HeatmapViewer zones={result.heatmap_zones} fileType={result.file_type} />
                            )}

                            {/* CMCE detail */}
                            <div className="card p-5 rounded-2xl">
                                <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "#E8EEFF" }}>
                                    <LinkIcon size={16} /> Cross-Modal Consistency Engine
                                </h3>
                                <div
                                    className="p-3 rounded-xl text-sm leading-relaxed"
                                    style={{ background: "rgba(0,0,0,0.3)", color: "#8B949E", fontFamily: "monospace", fontSize: 12, border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    &gt; {result.cmce_detail}
                                </div>
                            </div>

                            {/* Indicator breakdown */}
                            <IndicatorBreakdown indicators={result.indicators} />

                            {/* Video timeline */}
                            {result.timeline?.length > 0 && (
                                <div className="card p-5 rounded-2xl">
                                    <h3 className="font-bold text-sm mb-4" style={{ color: "#E8EEFF" }}>
                                        ⏱️ Deepfake Probability Timeline
                                    </h3>
                                    <div className="flex items-end gap-1 h-28">
                                        {result.timeline.map((point, i) => {
                                            const color = point.score > 0.75 ? "#FF4E6A" : point.score > 0.5 ? "#FFB800" : "#00E87A";
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                                                    <div
                                                        className="w-full rounded-t transition-all duration-200 group-hover:opacity-100"
                                                        style={{
                                                            height: `${point.score * 100}%`,
                                                            background: `linear-gradient(0deg, ${color}80, ${color})`,
                                                            opacity: 0.75,
                                                            boxShadow: `0 -2px 8px ${color}40`,
                                                        }}
                                                        title={`${point.time}: ${Math.round(point.score * 100)}%`}
                                                    />
                                                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#6B7A99", fontSize: 9 }}>
                                                        {point.time}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between text-xs mt-2" style={{ color: "#4B5568" }}>
                                        <span>0:00</span>
                                        <span style={{ color: "#FF4E6A" }}>▲ Peak deepfake: 00:04–00:06s</span>
                                        <span>{result.timeline[result.timeline.length - 1]?.time}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom action cards */}
                    <div
                        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in"
                        style={{ animationDelay: "0.3s", animationFillMode: "both" }}
                    >
                        {[
                            { href: "/verify", icon: <ShieldCheck size={28} />, title: "Get Authenticity Certificate", sub: "Prove your content is real", color: "#00E87A" },
                            { href: "/analyze", icon: <RefreshCw size={28} />, title: "Analyze Another File", sub: "Upload a new file", color: "#00FFD1" },
                            { href: "/api-docs", icon: <Webhook size={28} />, title: "Integrate via API", sub: "TrustScore API docs", color: "#8B5CF6" },
                        ].map((item) => (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className="card p-5 rounded-2xl text-center cursor-pointer transition-all"
                                    style={{ borderColor: "rgba(0,255,209,0.09)" }}
                                >
                                    <div style={{ fontSize: 28 }}>{item.icon}</div>
                                    <div className="font-bold text-sm mt-2" style={{ color: "#E8EEFF" }}>{item.title}</div>
                                    <div className="text-xs mt-1" style={{ color: "#6B7A99" }}>{item.sub}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
