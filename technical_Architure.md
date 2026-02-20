# 🏗️ VeraVision — Technical Architecture
### HackHive 2.0 | Cybersecurity Domain | PS3: AI-Generated Content & Deepfake Detection

---

## 🔷 System Overview

**VeraVision** is a multi-modal AI deepfake detection platform built on a modular, stateless, privacy-first architecture. Every media input is analyzed through dedicated AI engines, cross-verified via the **Cross-Modal Consistency Engine (CMCE)**, attributed to a likely AI source via **GAN Fingerprinting**, explained via an **XAI layer**, and finally scored for **viral misinformation risk** — all without retaining any user data.

---

## 1. High-Level Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client Layer"]
        UI["⚛️ React 18 + Vite\nWeb App / PWA"]
        WA["📱 WhatsApp Forward\nAnalyzer Mode"]
    end

    subgraph GATEWAY["🔌 API Gateway"]
        API["🐍 FastAPI Backend\nPython 3.11 + Uvicorn\nAsync REST API"]
        ROUTER{{"📦 Media Type\nRouter"}}
    end

    subgraph ENGINES["🤖 AI Detection Engines"]
        TE["📝 Text Engine\nRoBERTa-base-openai-detector\n+ Perplexity Scorer"]
        IE["🖼️ Image Engine\nEfficientNet-B4\nFaceForensics++ trained"]
        AE["🎵 Audio Engine\nWav2Vec 2.0\n+ Prosody Analyzer"]
        VE["🎬 Video Engine\nOpenCV Frame Sampler\n→ Image Engine per frame"]
        ME["🧾 Metadata Engine\nExifTool + Pillow\nEXIF / GPS / Compression"]
    end

    subgraph ADVANCED["🔬 Advanced Analysis Layer"]
        CMCE["🔗 Cross-Modal\nConsistency Engine\nChecks face↔voice↔text agreement"]
        GAN["🔬 GAN Source\nAttributor\nIdentifies which AI model created content"]
        VRS["📊 Viral Risk\nScorer\nNLP emotion + spread prediction"]
    end

    subgraph XAI["💡 Explainability Layer"]
        GCAM["🗺️ GradCAM\nImage Heatmaps"]
        SHAP["📉 SHAP\nText Token Importance"]
        LIME["🔦 LIME\nAudio Feature Attribution"]
        NLG["💬 NLG Breakdown\nPlain English + Hindi/Marathi"]
    end

    subgraph OUTPUT["📋 Result Aggregator"]
        AGG["⚖️ Score Aggregator\nWeighted Confidence %\nPer-modality sub-scores"]
        CERT["🔏 Authenticity\nWatermark Certifier\nCryptographic hash + QR"]
    end

    UI --> API
    WA --> API
    API --> ROUTER
    ROUTER --> TE & IE & AE & VE & ME
    TE & IE & AE & VE & ME --> CMCE
    CMCE --> GAN
    GAN --> VRS
    VRS --> GCAM & SHAP & LIME & NLG
    GCAM & SHAP & LIME & NLG --> AGG
    AGG --> CERT
    CERT --> UI
```

---

## 2. Request Lifecycle (Sequence Diagram)

```mermaid
sequenceDiagram
    actor User
    participant FE as ⚛️ React Frontend
    participant API as 🐍 FastAPI
    participant Router as 📦 Media Router
    participant Engines as 🤖 AI Engines
    participant CMCE as 🔗 CMCE
    participant GAN as 🔬 GAN Attributor
    participant XAI as 💡 XAI Layer
    participant Agg as ⚖️ Aggregator

    User->>FE: Upload file / paste text / WhatsApp forward
    FE->>API: POST /analyze (multipart/form-data)
    API->>Router: Detect media type
    Router->>Engines: Dispatch to relevant engine(s) in parallel
    par Parallel Analysis
        Engines-->>CMCE: Text features
        Engines-->>CMCE: Image features + GAN artifacts
        Engines-->>CMCE: Audio prosody features
        Engines-->>CMCE: Video frame scores + lip-sync delta
        Engines-->>CMCE: EXIF metadata flags
    end
    CMCE->>GAN: Cross-modal consistency score + raw features
    GAN->>XAI: Attribution label + confidence
    XAI->>Agg: Heatmap + SHAP values + NL explanation
    Agg->>FE: JSON { confidence, sub_scores, heatmap, indicators, gan_source, viral_risk, cert }
    FE->>User: Render dashboard (Confidence Dial + Heatmap + Breakdown)
```

---

## 3. Component Breakdown

### 3.1 Frontend (React 18 + Vite)

```mermaid
graph LR
    App["App.jsx"] --> Layout["Layout Component"]
    Layout --> Nav["Navbar\n(Logo + Links)"]
    Layout --> Pages["Page Router"]
    Pages --> Upload["📤 Upload Page\n- Drag & Drop Zone\n- File type selector\n- WhatsApp mode toggle"]
    Pages --> Result["📊 Results Page\n- Confidence Dial\n- Sub-score bars\n- Heatmap viewer\n- Indicator Breakdown\n- Viral Risk badge\n- GAN Source chip\n- Download Report btn"]
    Pages --> Verify["🔏 Verify Page\n- QR Code scanner\n- Authenticity cert lookup"]
    Pages --> Docs["📚 API Docs\n- TrustScore API info"]
    Upload -->|POST /analyze| API_CALL["API Call\n(axios + FormData)"]
```

### 3.2 Backend (FastAPI)

```
POST /analyze          → Main analysis endpoint
POST /watermark        → Generate authenticity certificate
GET  /verify/{hash}    → Verify a watermarked content hash
GET  /health           → Health check
GET  /docs             → Swagger UI (auto-generated)
```

### 3.3 AI Engine Specifications

| Engine | Model | Dataset | Accuracy |
|---|---|---|---|
| **Text** | `roberta-base-openai-detector` (HuggingFace) | OpenWebText + GPT outputs | ~88% F1 |
| **Image** | EfficientNet-B4 fine-tuned | FaceForensics++ (1M+ manipulated frames) | ~91% AUC |
| **Audio** | Wav2Vec 2.0 + custom prosody head | ASVspoof 2019 dataset | ~85% EER |
| **Video** | Frame sampling → Image engine | FaceForensics++ video subset | ~89% AUC |
| **Metadata** | Rule-based EXIF analyzer | No ML — deterministic rules | ~100% rule accuracy |

### 3.4 GAN Source Attributor

```mermaid
graph LR
    Input["🖼️ Image / Text"] --> FP["CNN Fingerprint\nExtractor\n(noise residuals)"]
    FP --> Classifier["Multi-class\nClassifier"]
    Classifier --> Labels{{"Source Label"}}
    Labels --> SD["Stable Diffusion\n(XL / 1.5 / 2.0)"]
    Labels --> MJ["Midjourney\n(v4 / v5 / v6)"]
    Labels --> DE["DALL·E\n(2 / 3)"]
    Labels --> GPT["ChatGPT / Claude\n(text fingerprint)"]
    Labels --> UNK["Unknown / Human\n(no match)"]
```

### 3.5 Cross-Modal Consistency Engine (CMCE)

```mermaid
graph TB
    I1["😐 Face Emotion\n(FER model)"] --> Check
    I2["🗣️ Voice Emotion\n(SpeechBrain)"] --> Check
    I3["📝 Transcript Sentiment\n(VADER / RoBERTa)"] --> Check
    I4["👄 Lip Sync Score\n(SyncNet delta)"] --> Check
    I5["🧾 Metadata Flags\n(EXIF anomalies)"] --> Check
    Check{{"🔗 Consistency\nChecker"}}
    Check -->|All align| LOW["🟢 Low Consistency Risk\n(−0.1 to confidence score)"]
    Check -->|Some mismatch| MED["🟡 Medium Risk\n(+0.2 to confidence score)"]
    Check -->|Major mismatch| HIGH["🔴 High Consistency Risk\n(+0.4 to confidence score)"]
```

### 3.6 Explainability & Indicator Breakdown

```mermaid
graph LR
    IMG["Image Result"] --> GCAM["GradCAM\nHeatmap Overlay\n(suspicious regions highlighted)"]
    TXT["Text Result"] --> SHAP_["SHAP Token\nImportance\n(suspicious phrases highlighted)"]
    AUD["Audio Result"] --> LIME_["LIME Feature\nAttribution\n(frame-level anomaly graph)"]
    VID["Video Result"] --> TL["Timeline Scrubber\n(per-frame confidence graph)"]
    GCAM & SHAP_ & LIME_ & TL --> NLG_["NLG Template Engine\nIndicator → Plain English\n+ Hindi/Marathi translation"]
```

---

## 4. Data Flow & Privacy Architecture

```mermaid
flowchart LR
    A["👤 User Upload"] -->|HTTPS| B["🔌 FastAPI\nIn-memory only"]
    B -->|Temp file buffer| C["🤖 ML Engines\n(RAM only)"]
    C -->|Results computed| D["📋 JSON Response\nsent to client"]
    D --> E["⚛️ FE renders\nresults"]
    B -.->|"❌ NEVER written\nto disk or DB"| F["🗄️ Database\n(Does not exist)"]
    style F fill:#2d0000,color:#ff6b6b,stroke:#ff0000
    style B fill:#0d2137,color:#00d4aa,stroke:#00d4aa
```

**Privacy Guarantees:**
- ✅ Zero persistent storage — all analysis is in-memory
- ✅ No user accounts or login required
- ✅ Files are deleted from buffer immediately after response
- ✅ No analytics collected on content
- ✅ Fully self-hostable (Docker)

---

## 5. Deployment Architecture

```mermaid
graph TB
    subgraph DEV["🛠️ Development"]
        FE_DEV["React Dev Server\nlocalhost:5173"]
        BE_DEV["FastAPI Uvicorn\nlocalhost:8000"]
    end

    subgraph PROD["☁️ Production (Free Tier)"]
        FE_PROD["Vercel / Netlify\nStatic React Build"]
        BE_PROD["Railway / Render\nDocker Container\n(512MB RAM)"]
        CDN["Cloudflare CDN\n(Static assets)"]
    end

    subgraph CONTAINER["🐳 Docker Setup"]
        D1["FROM python:3.11-slim"]
        D2["COPY requirements.txt"]
        D3["RUN pip install (models cached)"]
        D4["EXPOSE 8000"]
        D5["CMD uvicorn main:app"]
    end

    FE_PROD --> BE_PROD
    CDN --> FE_PROD
```

---

## 6. Tech Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React | 18.x | UI framework |
| **Build Tool** | Vite | 5.x | Fast dev + build |
| **Styling** | TailwindCSS | 3.x | Utility-first CSS |
| **Animation** | Framer Motion | 11.x | Confidence dial, transitions |
| **Charts** | Chart.js + react-chartjs-2 | 4.x | Sub-score bars, timeline |
| **Backend** | FastAPI | 0.110+ | Async REST API |
| **Server** | Uvicorn | 0.27+ | ASGI server |
| **ML Framework** | PyTorch | 2.2+ | Model inference |
| **NLP** | HuggingFace Transformers | 4.38+ | RoBERTa, Wav2Vec |
| **Computer Vision** | OpenCV | 4.9+ | Video frame sampling |
| **Image Processing** | Pillow | 10.x | Image handling + EXIF |
| **XAI - Image** | pytorch-grad-cam | 1.5+ | GradCAM heatmaps |
| **XAI - Text** | SHAP | 0.45+ | Token importance |
| **Metadata** | ExifRead / Pillow | - | EXIF forensics |
| **PDF Reports** | FPDF2 | 2.7+ | Downloadable report |
| **Translation** | googletrans | 4.0 | Hindi/Marathi mode |
| **Containerization** | Docker | 24.x | Reproducible deploy |

---

## 7. API Specification

### `POST /analyze`

**Request:**
```json
{
  "file": "<multipart binary>",
  "media_type": "image | video | audio | text",
  "mode": "standard | whatsapp | watermark-verify",
  "language": "en | hi | mr"
}
```

**Response:**
```json
{
  "confidence_score": 0.78,
  "verdict": "Likely AI-Generated",
  "sub_scores": {
    "text": 0.82,
    "image": 0.74,
    "audio": 0.71,
    "video": 0.68,
    "metadata": 0.90
  },
  "cmce_risk": "HIGH",
  "gan_source": "Stable Diffusion XL",
  "gan_confidence": 0.71,
  "viral_risk_score": 0.65,
  "viral_risk_label": "High Spread Potential",
  "indicators": [
    "Unnatural eye blinking cadence detected",
    "GAN fingerprint artifacts found in background pixels",
    "No EXIF camera metadata present — typical of AI-generated images",
    "Emotional tone mismatch between face and voice detected"
  ],
  "indicators_hi": [
    "आँखों की असामान्य पलक झपकाने की लय पाई गई",
    "पृष्ठभूमि पिक्सल में GAN फिंगरप्रिंट आर्टिफेक्ट मिले"
  ],
  "heatmap_url": "/results/heatmap_abc123.png",
  "timeline": [
    { "timestamp": "00:04", "score": 0.91 },
    { "timestamp": "00:07", "score": 0.87 }
  ],
  "processing_time_ms": 2340
}
```

---

## 8. Folder Structure

```
veravision/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfidenceDial.jsx      ← Animated gauge
│   │   │   ├── HeatmapViewer.jsx       ← GradCAM overlay
│   │   │   ├── IndicatorBreakdown.jsx  ← Plain English panel
│   │   │   ├── TimelineScrubber.jsx    ← Video timeline
│   │   │   ├── UploadZone.jsx          ← Drag & drop
│   │   │   └── VernacularToggle.jsx    ← Hindi/Marathi switch
│   │   ├── pages/
│   │   │   ├── Analyze.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Verify.jsx
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── main.py                     ← FastAPI app entry
│   ├── routers/
│   │   ├── analyze.py              ← /analyze endpoint
│   │   ├── watermark.py            ← /watermark endpoint
│   │   └── verify.py               ← /verify endpoint
│   ├── engines/
│   │   ├── text_engine.py          ← RoBERTa inference
│   │   ├── image_engine.py         ← EfficientNet inference
│   │   ├── audio_engine.py         ← Wav2Vec inference
│   │   ├── video_engine.py         ← OpenCV + frame engine
│   │   └── metadata_engine.py      ← EXIF forensics
│   ├── modules/
│   │   ├── cmce.py                 ← Cross-Modal Consistency Engine
│   │   ├── gan_attributor.py       ← GAN source attribution
│   │   ├── viral_scorer.py         ← Viral risk scoring
│   │   ├── xai/
│   │   │   ├── gradcam.py          ← Image heatmaps
│   │   │   ├── shap_text.py        ← Text SHAP
│   │   │   └── lime_audio.py       ← Audio LIME
│   │   └── vernacular.py           ← Hindi/Marathi translation
│   ├── utils/
│   │   ├── report_generator.py     ← PDF report
│   │   └── watermark_crypto.py     ← Authenticity cert
│   └── requirements.txt
│
└── Dockerfile
```
