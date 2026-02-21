"use client";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";

const ENDPOINTS = [
    {
        method: "POST",
        path: "/v1/analyze",
        label: "Analyze Content",
        desc: "Submit any media for multi-modal AI detection. Returns confidence scores, indicators, GAN source attribution, and viral risk.",
        params: [
            { name: "file", type: "File", req: true, desc: "The media file to analyze (image, video, audio, text)" },
            { name: "type", type: "string", req: false, desc: "Media type hint: image | video | audio | text | whatsapp" },
            { name: "language", type: "string", req: false, desc: "Response language: en | hi | mr" },
        ],
        example_request: `curl -X POST https://api.drishti.ai/v1/analyze \\
  -H "Authorization: Bearer vv_sk_demo_7a4f2b1c" \\
  -F "file=@suspicious_image.jpg" \\
  -F "type=image"`,
        example_response: `{
  "request_id": "req_8f4a2b1c",
  "status": "complete",
  "processing_ms": 2340,
  "overall_confidence": 0.78,
  "verdict": "Likely AI-Generated",
  "sub_scores": {
    "image": 0.81,
    "metadata": 0.94
  },
  "gan_source": {
    "model": "Stable Diffusion XL",
    "confidence": 0.71
  },
  "viral_risk": {
    "score": 0.72,
    "label": "High Spread Potential"
  },
  "indicators": [
    { "severity": "high", "text": "GAN noise fingerprint detected" },
    { "severity": "high", "text": "EXIF metadata absent" }
  ]
}`,
    },
    {
        method: "GET",
        path: "/v1/analyze/:request_id",
        label: "Get Analysis Result",
        desc: "Poll the status and result of a previously submitted analysis request by ID.",
        params: [
            { name: "request_id", type: "string", req: true, desc: "The request ID returned from /v1/analyze" },
        ],
        example_request: `curl https://api.drishti.ai/v1/analyze/req_8f4a2b1c \\
  -H "Authorization: Bearer vv_sk_demo_7a4f2b1c"`,
        example_response: `{
  "request_id": "req_8f4a2b1c",
  "status": "complete",
  "overall_confidence": 0.78,
  "verdict": "Likely AI-Generated"
}`,
    },
    {
        method: "POST",
        path: "/v1/certify",
        label: "Issue Authenticity Certificate",
        desc: "Generate a C2PA-compatible authenticity certificate with a cryptographic hash for original content.",
        params: [
            { name: "file", type: "File", req: true, desc: "The original file to certify" },
        ],
        example_request: `curl -X POST https://api.drishti.ai/v1/certify \\
  -H "Authorization: Bearer vv_sk_demo_7a4f2b1c" \\
  -F "file=@my_original.jpg"`,
        example_response: `{
  "certificate_id": "cert_7a4f2b1c",
  "hash": "vv_auth_7a4f2b1c9e8d3a6f0b5c2d1e4f7a8b9c",
  "issued_at": "2026-02-20T22:03:30.000Z",
  "qr_url": "https://verify.drishti.ai/cert_7a4f2b1c",
  "c2pa_compatible": true
}`,
    },
    {
        method: "GET",
        path: "/v1/verify/:hash",
        label: "Verify Certificate Hash",
        desc: "Check if a DRISHTI authentication hash is valid and return the associated certificate metadata.",
        params: [
            { name: "hash", type: "string", req: true, desc: "The vv_auth_... hash to verify" },
        ],
        example_request: `curl https://api.drishti.ai/v1/verify/vv_auth_7a4f2b1c \\
  -H "Authorization: Bearer vv_sk_demo_7a4f2b1c"`,
        example_response: `{
  "valid": true,
  "certificate": {
    "file_name": "original_photo.jpg",
    "issued_at": "2026-02-20T22:03:30.000Z",
    "issuer": "DRISHTI Authenticity Network"
  }
}`,
    },
];

const METHOD_STYLE = {
    POST: { bg: "rgba(0,255,209,0.1)", color: "#00FFD1", border: "rgba(0,255,209,0.3)" },
    GET: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", border: "rgba(59,130,246,0.3)" },
};

export default function ApiDocsPage() {
    const [openIdx, setOpenIdx] = useState(0);
    const [tab, setTab] = useState("request");
    const ep = ENDPOINTS[openIdx];

    return (
        <AppLayout>
            <div className="min-h-screen bg-grid px-6 py-14">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 animate-slide-up">
                        <span
                            className="inline-block text-xs uppercase tracking-widest font-bold mb-4 px-3 py-1 rounded-full"
                            style={{ color: "#3B82F6", background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)" }}
                        >
                            TrustScore API
                        </span>
                        <h1 className="font-black text-4xl mb-3 gradient-text">API Documentation</h1>
                        <p className="text-sm" style={{ color: "#6B7A99", maxWidth: 440, margin: "0 auto" }}>
                            Integrate DRISHTI&apos;s detection engine into your product with 3 lines of code.
                            RESTful API with structured JSON responses.
                        </p>
                    </div>

                    {/* API Key strip */}
                    <div
                        className="card p-5 rounded-2xl mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up"
                        style={{ animationDelay: "0.05s", animationFillMode: "both" }}
                    >
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#6B7A99" }}>Base URL</div>
                            <code className="font-mono text-xs" style={{ color: "#00FFD1" }}>api.drishti.ai</code>
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#6B7A99" }}>Demo Key</div>
                            <code className="font-mono text-xs" style={{ color: "#FFB800" }}>vv_sk_demo_7a4f2b1c</code>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2.5 py-1 rounded-lg font-bold" style={{ background: "rgba(0,255,209,0.07)", color: "#00FFD1", border: "1px solid rgba(0,255,209,0.18)" }}>
                                100 req/day free
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold" style={{ color: "#00E87A" }}>
                                <span className="status-live" />Operational
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                        {/* Endpoint list */}
                        <div className="flex flex-col gap-2">
                            {ENDPOINTS.map((e, i) => {
                                const ms = METHOD_STYLE[e.method];
                                return (
                                    <button
                                        key={i}
                                        onClick={() => { setOpenIdx(i); setTab("request"); }}
                                        className="text-left p-4 rounded-xl transition-all"
                                        style={{
                                            background: openIdx === i ? "rgba(0,255,209,0.05)" : "rgba(15,21,32,0.8)",
                                            border: openIdx === i ? "1px solid rgba(0,255,209,0.22)" : "1px solid rgba(0,255,209,0.07)",
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span
                                                className="text-xs font-black px-2 py-0.5 rounded"
                                                style={{ background: ms.bg, color: ms.color, border: `1px solid ${ms.border}` }}
                                            >
                                                {e.method}
                                            </span>
                                        </div>
                                        <div className="font-mono text-xs mb-1" style={{ color: "#6B7A99" }}>{e.path}</div>
                                        <div className="text-xs font-bold" style={{ color: openIdx === i ? "#00FFD1" : "#E8EEFF" }}>{e.label}</div>
                                    </button>
                                );
                            })}

                            {/* Pricing tiers */}
                            <div className="mt-3 card p-4 rounded-xl">
                                <div className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "#6B7A99" }}>Pricing Tiers</div>
                                {[
                                    { label: "Free", calls: "100/day", color: "#00E87A" },
                                    { label: "Startup", calls: "10K/day", color: "#00FFD1" },
                                    { label: "Enterprise", calls: "Unlimited", color: "#FFB800" },
                                ].map((tier) => (
                                    <div
                                        key={tier.label}
                                        className="flex items-center justify-between py-2"
                                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                                    >
                                        <span className="text-xs" style={{ color: "#E8EEFF" }}>{tier.label}</span>
                                        <span className="text-xs font-black" style={{ color: tier.color }}>{tier.calls}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Endpoint detail */}
                        <div className="lg:col-span-2 card p-6 rounded-2xl">
                            {/* Endpoint label */}
                            <div className="flex items-start gap-3 mb-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span
                                            className="text-xs font-black px-2 py-0.5 rounded"
                                            style={{ background: METHOD_STYLE[ep.method].bg, color: METHOD_STYLE[ep.method].color, border: `1px solid ${METHOD_STYLE[ep.method].border}` }}
                                        >
                                            {ep.method}
                                        </span>
                                        <code className="font-mono text-sm" style={{ color: "#00FFD1" }}>{ep.path}</code>
                                    </div>
                                    <p className="text-xs" style={{ color: "#6B7A99" }}>{ep.desc}</p>
                                </div>
                            </div>

                            {/* Parameters table */}
                            <div className="mb-5">
                                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#6B7A99" }}>
                                    Parameters
                                </div>
                                <div
                                    className="rounded-xl overflow-hidden"
                                    style={{ border: "1px solid rgba(0,255,209,0.08)" }}
                                >
                                    {ep.params.map((param, i) => (
                                        <div
                                            key={param.name}
                                            className="grid grid-cols-4 gap-2 px-4 py-2.5 text-xs items-center"
                                            style={{
                                                borderBottom: i < ep.params.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                                background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                                            }}
                                        >
                                            <code className="font-mono font-bold" style={{ color: "#E8EEFF" }}>{param.name}</code>
                                            <span style={{ color: "#8B5CF6" }}>{param.type}</span>
                                            <span
                                                className="text-xs font-bold px-1.5 py-0.5 rounded w-fit"
                                                style={{
                                                    background: param.req ? "rgba(255,78,106,0.1)" : "rgba(107,122,153,0.1)",
                                                    color: param.req ? "#FF4E6A" : "#6B7A99",
                                                }}
                                            >
                                                {param.req ? "required" : "optional"}
                                            </span>
                                            <span style={{ color: "#6B7A99" }}>{param.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Code tabs */}
                            <div className="flex rounded-lg overflow-hidden mb-3 w-fit" style={{ border: "1px solid rgba(0,255,209,0.12)" }}>
                                {["request", "response"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className="px-4 py-2 text-xs font-bold capitalize transition-all"
                                        style={{
                                            background: tab === t ? "rgba(0,255,209,0.1)" : "transparent",
                                            color: tab === t ? "#00FFD1" : "#6B7A99",
                                        }}
                                    >
                                        {t === "request" ? "cURL Request" : "JSON Response"}
                                    </button>
                                ))}
                            </div>

                            {/* Code block */}
                            <div className="relative">
                                <pre
                                    className="code-block overflow-x-auto"
                                    style={{ maxHeight: 260, lineHeight: 1.7 }}
                                >
                                    {tab === "request" ? ep.example_request : ep.example_response}
                                </pre>
                                {/* Copy hint */}
                                <div className="absolute top-3 right-3 text-xs font-mono opacity-30" style={{ color: "#00FFD1" }}>
                                    {tab === "request" ? "bash" : "json"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
