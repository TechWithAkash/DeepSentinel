"use client";
import { useCallback, useState } from "react";

const FILE_TYPES = {
    image: { accept: "image/*", icon: "🖼️", label: "Image", ext: "JPG · PNG · WEBP · GIF" },
    video: { accept: "video/*", icon: "🎬", label: "Video", ext: "MP4 · MOV · AVI · MKV" },
    audio: { accept: "audio/*", icon: "🎵", label: "Audio", ext: "MP3 · WAV · M4A · OGG" },
    text: { accept: ".txt,.pdf,.docx", icon: "📝", label: "Text", ext: "TXT · PDF · DOCX" },
    whatsapp: { accept: "image/*", icon: "📱", label: "WhatsApp", ext: "Screenshot · JPG · PNG" },
};

export default function UploadZone({ activeTab, onFileSelect }) {
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState(null);
    const meta = FILE_TYPES[activeTab] || FILE_TYPES.image;

    const handleFile = useCallback((file) => {
        if (!file) return;
        setFileName(file.name);
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
        onFileSelect(file);
    }, [onFileSelect]);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    return (
        <div>
            <label
                htmlFor="file-upload"
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className="flex flex-col items-center justify-center cursor-pointer rounded-2xl transition-all duration-300 relative overflow-hidden"
                style={{
                    minHeight: 220,
                    border: `1.5px dashed ${dragging ? "#00FFD1" : "rgba(0,255,209,0.2)"}`,
                    background: dragging
                        ? "rgba(0,255,209,0.04)"
                        : "linear-gradient(135deg, rgba(15,21,32,0.8) 0%, rgba(20,29,46,0.5) 100%)",
                    boxShadow: dragging ? "0 0 30px rgba(0,255,209,0.15), inset 0 0 30px rgba(0,255,209,0.03)" : "none",
                }}
            >
                {/* Corner decorations */}
                {!preview && (
                    <>
                        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl-sm opacity-30" style={{ borderColor: "#00FFD1" }} />
                        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 rounded-tr-sm opacity-30" style={{ borderColor: "#00FFD1" }} />
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 rounded-bl-sm opacity-30" style={{ borderColor: "#00FFD1" }} />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br-sm opacity-30" style={{ borderColor: "#00FFD1" }} />
                    </>
                )}

                {preview ? (
                    <div className="relative w-full h-52 rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 flex items-end justify-center pb-3">
                            <span className="text-xs glass px-3 py-1 rounded-full" style={{ color: "#E8EEFF" }}>
                                ✓ {fileName}
                            </span>
                        </div>
                    </div>
                ) : fileName ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                            style={{ background: "rgba(0,255,209,0.1)", border: "1px solid rgba(0,255,209,0.2)" }}
                        >
                            {meta.icon}
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-sm" style={{ color: "#E8EEFF" }}>{fileName}</div>
                            <div className="text-xs mt-1 font-bold" style={{ color: "#00FFD1" }}>✓ File ready for analysis</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-8 px-6 text-center">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-float"
                            style={{ background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.15)" }}
                        >
                            {meta.icon}
                        </div>
                        <div>
                            <p className="font-semibold text-base" style={{ color: "#E8EEFF" }}>
                                Drop your {meta.label} here
                            </p>
                            <p className="text-sm mt-1" style={{ color: "#6B7A99" }}>or click to browse files</p>
                        </div>
                        <div
                            className="text-xs px-4 py-1.5 rounded-full font-mono"
                            style={{ background: "rgba(0,255,209,0.06)", color: "#00FFD1", border: "1px solid rgba(0,255,209,0.15)" }}
                        >
                            {meta.ext}
                        </div>
                    </div>
                )}
            </label>
            <input id="file-upload" type="file" accept={meta.accept} className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) handleFile(f); }} />

            {/* WhatsApp caption input */}
            {activeTab === "whatsapp" && (
                <div className="mt-4">
                    <label className="text-xs font-bold mb-2 block uppercase tracking-wider" style={{ color: "#6B7A99" }}>
                        📋 Paste Caption / Text Claim from the Forward
                    </label>
                    <textarea
                        className="input-dark resize-none"
                        rows={3}
                        placeholder="e.g. 'PM announces free electricity for all from Jan 2026…'"
                    />
                </div>
            )}
        </div>
    );
}
