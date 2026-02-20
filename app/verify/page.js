"use client";
import { useState } from "react";
import { CERT_MOCK } from "../../lib/mockData";

function QRMock({ data }) {
    const cells = Array.from({ length: 121 }, (_, i) => {
        const seed = (i * 13 + data.charCodeAt(i % data.length) * 7 + i % 11) % 10;
        // Force corner finder patterns
        const row = Math.floor(i / 11), col = i % 11;
        if ((row < 3 && col < 3) || (row < 3 && col > 7) || (row > 7 && col < 3)) return true;
        return seed > 4;
    });
    return (
        <div className="inline-grid p-3 rounded-xl" style={{ gridTemplateColumns: "repeat(11, 1fr)", background: "#fff", gap: 2 }}>
            {cells.map((filled, i) => (
                <div key={i} className="rounded-sm" style={{ width: 10, height: 10, background: filled ? "#050B14" : "#fff" }} />
            ))}
        </div>
    );
}

export default function VerifyPage() {
    const [mode, setMode] = useState("create");
    const [creating, setCreating] = useState(false);
    const [cert, setCert] = useState(null);
    const [verifyInput, setVerifyInput] = useState("");
    const [verifyResult, setVerifyResult] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleCreate = (file) => {
        setCreating(true);
        setTimeout(() => {
            setCreating(false);
            setCert({ ...CERT_MOCK, file_name: file?.name || "my_photo.jpg", issued_at: new Date().toISOString() });
        }, 2400);
    };

    const handleVerify = () => {
        if (!verifyInput.trim()) return;
        setTimeout(() => {
            setVerifyResult(verifyInput.startsWith("vv_auth") ? "valid" : "invalid");
        }, 900);
    };

    return (
        <div className="min-h-screen bg-grid px-6 py-14">
            {/* Glow */}
            <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none" style={{ background: "#00E87A" }} />

            <div className="max-w-2xl mx-auto relative z-10">
                <div className="text-center mb-12 animate-slide-up">
                    <span
                        className="inline-block text-xs uppercase tracking-widest font-bold mb-4 px-3 py-1 rounded-full"
                        style={{ color: "#00E87A", background: "rgba(0,232,122,0.07)", border: "1px solid rgba(0,232,122,0.2)" }}
                    >
                        Authenticity Network
                    </span>
                    <h1 className="font-black text-4xl mb-3 gradient-text">Verify & Certify</h1>
                    <p className="text-sm" style={{ color: "#6B7A99" }}>
                        Proof that your content is real — or verify someone else&apos;s content.
                    </p>
                </div>

                {/* Mode toggle */}
                <div
                    className="flex rounded-xl p-1 mb-8"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,255,209,0.1)" }}
                >
                    {[
                        { id: "create", icon: "🔏", label: "Create Certificate" },
                        { id: "verify", icon: "🔍", label: "Verify Hash" },
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => { setMode(m.id); setCert(null); setVerifyResult(null); }}
                            className="flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                            style={{
                                background: mode === m.id ? "rgba(0,255,209,0.09)" : "transparent",
                                color: mode === m.id ? "#00FFD1" : "#6B7A99",
                                border: mode === m.id ? "1px solid rgba(0,255,209,0.22)" : "1px solid transparent",
                            }}
                        >
                            <span>{m.icon}</span>{m.label}
                        </button>
                    ))}
                </div>

                {/* ── CREATE MODE ── */}
                {mode === "create" && (
                    <div className="card p-8 rounded-2xl animate-fade-in">
                        {!cert ? (
                            <>
                                <h3 className="font-bold text-lg mb-2" style={{ color: "#E8EEFF" }}>
                                    Generate Authenticity Certificate
                                </h3>
                                <p className="text-sm mb-7" style={{ color: "#6B7A99" }}>
                                    Upload your original file. VeraVision generates a cryptographic hash and issues a C2PA-compatible certificate you can share publicly.
                                </p>

                                {/* File drop */}
                                <label
                                    htmlFor="cert-upload"
                                    className="flex flex-col items-center gap-3 py-10 rounded-xl cursor-pointer transition-all relative overflow-hidden"
                                    style={{
                                        border: `1.5px dashed ${selectedFile ? "rgba(0,232,122,0.4)" : "rgba(0,255,209,0.2)"}`,
                                        background: selectedFile ? "rgba(0,232,122,0.04)" : "rgba(255,255,255,0.02)",
                                    }}
                                >
                                    {/* Corner marks */}
                                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 opacity-40" style={{ borderColor: "#00FFD1" }} />
                                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 opacity-40" style={{ borderColor: "#00FFD1" }} />
                                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 opacity-40" style={{ borderColor: "#00FFD1" }} />
                                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 opacity-40" style={{ borderColor: "#00FFD1" }} />

                                    <span style={{ fontSize: 40 }}>{selectedFile ? "✅" : "📁"}</span>
                                    {selectedFile ? (
                                        <div className="text-center">
                                            <div className="font-semibold text-sm" style={{ color: "#E8EEFF" }}>{selectedFile.name}</div>
                                            <div className="text-xs mt-1 font-bold" style={{ color: "#00E87A" }}>File selected</div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="font-semibold text-sm" style={{ color: "#E8EEFF" }}>Drop your original file</div>
                                            <div className="text-xs mt-1" style={{ color: "#6B7A99" }}>Any media type accepted</div>
                                        </div>
                                    )}
                                </label>
                                <input id="cert-upload" type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />

                                <button
                                    className="btn-primary w-full mt-5 py-3.5"
                                    onClick={() => handleCreate(selectedFile)}
                                    disabled={!selectedFile || creating}
                                    style={{ opacity: selectedFile && !creating ? 1 : 0.4 }}
                                >
                                    {creating ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span style={{ display: "inline-block", animation: "spin-slow 1s linear infinite" }}>⚙️</span>
                                            Generating certificate…
                                        </span>
                                    ) : "🔏 Generate Certificate"}
                                </button>

                                <div className="text-center mt-4">
                                    <button
                                        className="text-xs" style={{ color: "#6B7A99", textDecoration: "underline" }}
                                        onClick={() => {
                                            setSelectedFile({ name: "my_original_photo.jpg" });
                                            handleCreate({ name: "my_original_photo.jpg" });
                                        }}
                                    >
                                        → Use demo sample
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* Certificate display */
                            <div className="animate-fade-in">
                                <div className="text-center mb-6">
                                    <div className="text-3xl mb-2">✅</div>
                                    <h3 className="font-black text-xl" style={{ color: "#00E87A" }}>Certificate Issued!</h3>
                                    <p className="text-sm mt-1" style={{ color: "#6B7A99" }}>Your content is now verifiably authentic on our network.</p>
                                </div>

                                {/* Cert card */}
                                <div
                                    className="rounded-2xl p-6"
                                    style={{
                                        background: "linear-gradient(135deg, #0F1520, #141D2E)",
                                        border: "1.5px solid rgba(0,232,122,0.3)",
                                        boxShadow: "0 0 40px rgba(0,232,122,0.08)",
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(0,232,122,0.1)" }}>🔏</div>
                                        <div>
                                            <div className="font-bold text-sm" style={{ color: "#E8EEFF" }}>VeraVision Authenticity Certificate</div>
                                            <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{cert.standard}</div>
                                        </div>
                                        <div className="ml-auto text-xs px-2 py-1 rounded font-black uppercase tracking-wider" style={{ background: "rgba(0,232,122,0.1)", color: "#00E87A", border: "1px solid rgba(0,232,122,0.25)" }}>
                                            VERIFIED
                                        </div>
                                    </div>

                                    <div className="flex gap-5 items-start">
                                        <QRMock data={cert.hash} />
                                        <div className="flex-1 flex flex-col gap-2 text-xs">
                                            <div><span style={{ color: "#6B7A99" }}>File:</span> <span className="font-medium" style={{ color: "#E8EEFF" }}>{cert.file_name}</span></div>
                                            <div><span style={{ color: "#6B7A99" }}>Issued:</span> <span className="font-medium" style={{ color: "#E8EEFF" }}>{new Date(cert.issued_at).toLocaleString()}</span></div>
                                            <div><span style={{ color: "#6B7A99" }}>Network:</span> <span className="font-medium" style={{ color: "#E8EEFF" }}>{cert.platform}</span></div>
                                            <div className="mt-2">
                                                <div style={{ color: "#6B7A99", marginBottom: 4 }}>Auth Hash:</div>
                                                <div
                                                    className="font-mono break-all rounded-lg px-2.5 py-2"
                                                    style={{ color: "#00FFD1", fontSize: 11, background: "rgba(0,255,209,0.05)", border: "1px solid rgba(0,255,209,0.1)" }}
                                                >
                                                    {cert.hash}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-outline w-full mt-4" onClick={() => { setCert(null); setSelectedFile(null); }}>
                                    Generate Another
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── VERIFY MODE ── */}
                {mode === "verify" && (
                    <div className="card p-8 rounded-2xl animate-fade-in">
                        <h3 className="font-bold text-lg mb-2" style={{ color: "#E8EEFF" }}>
                            Verify Content Authenticity
                        </h3>
                        <p className="text-sm mb-7" style={{ color: "#6B7A99" }}>
                            Paste a VeraVision authentication hash from a piece of content to verify it&apos;s genuine and unmodified.
                        </p>

                        <label className="text-xs font-bold mb-2 block uppercase tracking-wider" style={{ color: "#6B7A99" }}>
                            Authentication Hash
                        </label>
                        <input
                            className="input-dark font-mono"
                            placeholder="vv_auth_7a4f2b1c9e8d3a6f0b5c2d1e…"
                            value={verifyInput}
                            onChange={(e) => { setVerifyInput(e.target.value); setVerifyResult(null); }}
                        />

                        <button className="btn-primary w-full mt-4 py-3" onClick={handleVerify} disabled={!verifyInput.trim()} style={{ opacity: verifyInput.trim() ? 1 : 0.4 }}>
                            🔍 Verify Hash
                        </button>

                        <div className="text-center mt-3">
                            <button
                                className="text-xs" style={{ color: "#6B7A99", textDecoration: "underline" }}
                                onClick={() => setVerifyInput(CERT_MOCK.hash)}
                            >
                                → Try the real certificate hash
                            </button>
                        </div>

                        {verifyResult && (
                            <div
                                className="mt-7 p-6 rounded-2xl text-center animate-slide-up"
                                style={{
                                    background: verifyResult === "valid" ? "rgba(0,232,122,0.08)" : "rgba(255,78,106,0.08)",
                                    border: `1px solid ${verifyResult === "valid" ? "rgba(0,232,122,0.3)" : "rgba(255,78,106,0.3)"}`,
                                    boxShadow: `0 0 40px ${verifyResult === "valid" ? "rgba(0,232,122,0.08)" : "rgba(255,78,106,0.08)"}`,
                                }}
                            >
                                <div style={{ fontSize: 44 }}>{verifyResult === "valid" ? "✅" : "❌"}</div>
                                <div className="font-black text-xl mt-3" style={{ color: verifyResult === "valid" ? "#00E87A" : "#FF4E6A" }}>
                                    {verifyResult === "valid" ? "Content Verified!" : "Hash Not Found"}
                                </div>
                                <div className="text-sm mt-2" style={{ color: "#6B7A99", maxWidth: 340, margin: "8px auto 0" }}>
                                    {verifyResult === "valid"
                                        ? "This content was certified on the VeraVision Authenticity Network and has not been tampered with."
                                        : "This hash does not match any certificate in our network. The content may be unverified or modified."}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
