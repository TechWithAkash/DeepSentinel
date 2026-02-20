# VeraVision — PPT Content
## HackHive 2.0 | Cybersecurity Domain | PS3: AI-Generated Content & Deepfake Detection
### Submission Deadline: February 22, 2026

> **Design:** Dark navy `#0D1117` · Cyan accent `#00D4AA` · Font: Inter/Poppins

---

## 🎞️ Slide 1 — Problem Statement

### DEFINE THE PROBLEM AND THE TARGET USERS

**The Problem:**
AI-generated content and deepfakes are becoming indistinguishable from reality. Synthetic images, cloned voices, and AI-written text are being used to spread misinformation, commit financial fraud, and destroy personal reputations — at massive scale. Ordinary users have no accessible, reliable tool to verify what they see or hear online.

**Root Causes:**
- AI generation tools (DALL·E, Stable Diffusion, ElevenLabs) are free and easy to use
- Deepfake quality has reached near-human levels in 2025
- Existing detection tools are single-modal, expert-only, or expensive
- There is no plain-language explanation of WHY content is suspicious

**Target Users:**

| User | Problem They Face |
|---|---|
| 🧑‍💼 Citizens | Share viral AI-generated political videos as truth — unknowingly |
| 📰 Journalists | Publish fabricated images, destroying credibility overnight |
| 🏢 Enterprises | Fall for voice-cloned CEO scam calls — crores lost |
| 🎓 Students & Educators | No tools to teach or practice digital media literacy |
| 🏦 Banks & Fintechs | Deepfake video KYC fraud — growing rapidly in India |

### WHY THE PROBLEM NEEDS A SOLUTION

| Statistic | Source |
|---|---|
| **61%** of people cannot identify AI-generated faces | MIT, 2025 |
| **$25 Billion** lost to deepfake fraud globally in 2024 | Deloitte |
| Deepfake creation grew **3,000%** since 2019 | Sensity AI |
| **500M+** Indian WhatsApp users exposed to AI misinformation daily | — |

The threat is not theoretical — it is active, growing, and harming real people now. Without accessible detection tools, the misinformation gap will only widen.

---

## 🎞️ Slide 2 — Proposed Solution

### DESCRIBE YOUR SOLUTION APPROACH

**VeraVision** is a multi-modal AI-powered content verification platform that detects AI-generated and deepfake content across text, images, audio, and video — and explains its findings in plain language.

**Elevator Pitch:**
> *"The only platform that tells you WHAT was faked, HOW it was faked, and WHO faked it — in your language."*

**Solution Pillars:**

| # | Pillar | Description |
|---|---|---|
| 1 | **Multi-Modal Detection** | Analyzes Text, Images, Audio & Video simultaneously in one platform |
| 2 | **Confidence Scoring** | Returns a % likelihood (e.g. "78% likely AI-generated") — not binary fake/real |
| 3 | **Indicator Breakdown** | Explains findings in plain English (and Hindi/Marathi) — no technical jargon |
| 4 | **Cross-Modal Consistency Engine** | Checks if face emotion, voice tone, lip-sync, and text all agree — catches contradictions |
| 5 | **GAN Source Attribution** | Identifies which AI model created the fake ("Made by Stable Diffusion XL") |
| 6 | **Authenticity Watermark** | Lets content creators generate cryptographic proof that their content is real |

### HOW IT SOLVES THE PROBLEM

| Gap in Existing Tools | How VeraVision Fixes It |
|---|---|
| Single modality only | Analyzes all 4 media types in one upload |
| Binary "Fake/Real" verdict | Confidence % + per-modality sub-scores |
| No explanation | Plain-English + vernacular Indicator Breakdown |
| No cross-checking | Cross-Modal Consistency Engine (CMCE) |
| Expert-only tools | Consumer-first PWA — anyone can use it |
| India-unaware | WhatsApp Forward Analyzer + Hindi/Marathi support |

**Privacy-First Guarantee:** Zero data storage. All analysis happens in-memory. No user data is ever retained.

---

## 🎞️ Slide 3 — Technical Approach & System Architecture

### LIST THE TOOLS AND TECHNOLOGIES USED

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion | Web UI / PWA |
| **Backend** | Python 3.11, FastAPI, Uvicorn | Async REST API |
| **Text Detection** | `roberta-base-openai-detector` (HuggingFace) | AI-written text classifier |
| **Image Detection** | EfficientNet-B4 (FaceForensics++ trained) | GAN artifact detection |
| **Audio Detection** | Wav2Vec 2.0 + Prosody Analyzer | Synthetic voice detection |
| **Video Detection** | OpenCV frame sampler → Image Engine | Frame-level deepfake analysis |
| **Metadata Analysis** | ExifTool + Pillow | EXIF, GPS, compression forensics |
| **XAI - Image** | pytorch-grad-cam (GradCAM) | Visual heatmap overlays |
| **XAI - Text** | SHAP | Token-level importance scoring |
| **XAI - Audio** | LIME | Feature attribution for audio |
| **GAN Attribution** | CNN noise fingerprint classifier | Source AI model identification |
| **Vernacular** | googletrans | Hindi & Marathi translations |
| **Containerization** | Docker + Railway/Render | Free-tier cloud deployment |

### EXPLAIN THE SYSTEM WORKFLOW

```
Step 1:  User uploads file (image / video / audio / text / WhatsApp forward)
            ↓
Step 2:  FastAPI Backend detects media type and routes to engines in PARALLEL:
         [Text Engine] [Image Engine] [Audio Engine] [Video Engine] [EXIF Engine]
            ↓
Step 3:  Cross-Modal Consistency Engine (CMCE)
         → Checks if face emotion ↔ voice tone ↔ transcript ↔ lip-sync all agree
            ↓
Step 4:  GAN Source Attributor
         → Identifies which AI model likely generated the content
            ↓
Step 5:  Explainability Layer
         → GradCAM heatmaps (image) · SHAP (text) · LIME (audio)
            ↓
Step 6:  Viral Risk Scorer + Vernacular Translator
            ↓
Step 7:  Result delivered to user:
         • Confidence % score
         • Per-modality sub-scores
         • Forensic heatmap
         • Indicator Breakdown (EN / HI / MR)
         • GAN Source label
         • Viral Risk badge
         • Optional: Authenticity Certificate (QR)
```

---

## 🎞️ Slide 4 — Feasibility and Viability

### EXPLAIN HOW THE SOLUTION CAN BE IMPLEMENTED

**Why It's Buildable in 12 Hours (Round 2):**

All AI engines use **pre-trained, open-source models** from HuggingFace — no custom training required. This gives production-level accuracy from day one.

**12-Hour Build Plan:**

| Phase | Hours | Tasks |
|---|---|---|
| Phase 1 — Core MVP | 0–5h | React UI + FastAPI + Text & Image engines |
| Phase 2 — XAI Layer | 5–8h | GradCAM heatmaps + Confidence Dial + Indicator Breakdown |
| Phase 3 — Advanced | 8–11h | GAN Attribution + WhatsApp Analyzer + Audio engine |
| Phase 4 — Polish | 11–12h | UI polish + demo recording + deployment |

**Model Accuracy Benchmarks:**

| Engine | Model | Accuracy |
|---|---|---|
| Text | RoBERTa OpenAI Detector | ~88% F1 |
| Image | EfficientNet-B4 (FaceForensics++) | ~91% AUC |
| Audio | Wav2Vec 2.0 (ASVspoof 2019) | ~85% EER |
| Video | Frame sampling + Image engine | ~89% AUC |

### JUSTIFY ITS PRACTICALITY AND SUSTAINABILITY

**Cost:** ₹0 deployment. Backend on Railway/Render free tier. Frontend on Vercel. All models are open-source.

**Scalability Path:**
- v1.0 (April 2026): Full audio + video + CMCE + WhatsApp Analyzer
- v2.0 (Mid 2026): Browser extension + TrustScore Public API
- v3.0 (Late 2026): C2PA Authenticity Standard integration

**Revenue Model for Sustainability:**
- 🆓 Free tier: 10 checks/day (individual users)
- 💼 Enterprise API: KYC fraud detection for banks & fintechs
- 🏛️ Government: Election body licensing for political deepfake detection
- 🎓 Education: Institutional licenses for media literacy programs

**Market Size:** $5.1 billion deepfake detection market by 2026 (MarketsandMarkets). India is the largest untapped segment.

---

## 🎞️ Slide 5 — Prototype

### SHOW THE WORKING MODEL OR DEMO

**What the Prototype Does:**

User uploads a suspicious image, video, or text → VeraVision returns within 10 seconds:

```
✅ Confidence Score:      78% likely AI-Generated
✅ GAN Source:            Stable Diffusion XL (71% confidence)
✅ Forensic Heatmap:      Highlighted suspicious pixel regions
✅ Indicator Breakdown:
   • "Unnatural eye blinking cadence detected"
   • "GAN noise fingerprint in background pixels"
   • "No EXIF camera metadata — typical of AI images"
✅ Viral Risk:            HIGH spread potential detected
✅ Vernacular Mode:       Results available in Hindi
```

### HIGHLIGHT KEY FEATURES IMPLEMENTED

| # | Feature | Status | Description |
|---|---|---|---|
| 1 | **Confidence Dial** | ✅ MVP | Animated % gauge — not binary fake/real |
| 2 | **Text AI Detection** | ✅ MVP | RoBERTa model via HuggingFace API |
| 3 | **Image Detection** | ✅ MVP | EfficientNet-B4 + FaceForensics++ |
| 4 | **Forensic Heatmap** | ✅ MVP | GradCAM visual overlay on images |
| 5 | **Indicator Breakdown** | ✅ MVP | Plain-English explanation of findings |
| 6 | **GAN Source Attribution** | ✅ MVP | CNN noise fingerprint → model label |
| 7 | **Metadata Forensics** | ✅ MVP | EXIF / GPS / compression anomaly detection |
| 8 | **WhatsApp Forward Analyzer** | 🔜 v1.0 | Image + caption claim verified together |
| 9 | **Audio Detection** | 🔜 v1.0 | Wav2Vec 2.0 voice synthesis detection |
| 10 | **Hindi / Marathi Mode** | 🔜 v1.0 | Vernacular indicator breakdowns |
| 11 | **Authenticity Watermark** | 🔮 v2.0 | Cryptographic proof of content authenticity |
| 12 | **Browser Extension** | 🔮 v2.0 | Real-time analysis while browsing |

**Prototype Tech Stack:**
- Frontend: `React 18 + Vite + TailwindCSS`
- Backend: `Python 3.11 + FastAPI`
- Deployment: `Docker + Railway (free tier)`
- Demo URL: *(Live demo to be shown on event day)*

---

## 🎞️ Slide 6 — References

### DATASETS USED

| Dataset | Description | Link |
|---|---|---|
| FaceForensics++ | 1M+ manipulated video frames for deepfake training | github.com/ondyari/FaceForensics |
| DFDC (Facebook AI) | Deepfake Detection Challenge dataset | kaggle.com/c/deepfake-detection-challenge |
| ASVspoof 2019 | Audio synthetic speech detection dataset | datashare.ed.ac.uk |

### AI MODELS & FRAMEWORKS

| Model / Library | Source | Purpose |
|---|---|---|
| `roberta-base-openai-detector` | HuggingFace | AI text detection |
| `facebook/wav2vec2-base` | HuggingFace / Meta AI | Audio deepfake detection |
| EfficientNet-B4 | Google Brain / TensorFlow Hub | Image deepfake detection |
| pytorch-grad-cam | github.com/jacobgil/pytorch-grad-cam | GradCAM heatmaps |
| SHAP | shap.readthedocs.io | Explainable AI (text) |
| LIME | github.com/marcotcr/lime | Explainable AI (audio) |

### RESEARCH PAPERS

- Rössler et al. — *FaceForensics++: Learning to Detect Manipulated Facial Images* (ICCV 2019) — arxiv.org/abs/1901.08971
- Baevski et al. — *Wav2Vec 2.0: A Framework for Self-Supervised Learning of Speech* (NeurIPS 2020) — arxiv.org/abs/2006.11477
- Tan & Le — *EfficientNet: Rethinking Model Scaling for CNNs* (ICML 2019) — arxiv.org/abs/1905.02175
- Selvaraju et al. — *Grad-CAM: Visual Explanations from Deep Networks* (ICCV 2017) — arxiv.org/abs/1610.02391

### STANDARDS & ADDITIONAL LINKS

- **C2PA Standard** (Content Provenance & Authenticity) — c2pa.org
- **Sensity AI Deepfake Threat Report 2024** — sensity.ai/reports
- **HackHive 2.0 Problem Statement** — DMCE Airoli, SHAIDS Committee

---

*VeraVision — See Through the Fake. Trust What's Real.*
*HackHive 2.0 · DMCE Airoli · Cybersecurity Domain · PS3*
