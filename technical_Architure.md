# DeepSentinel — Technical Architecture Document

**Version:** 1.0.0
**Status:** Prototype Development
**Project:** HackHive 2.0 — Domain 2: Cybersecurity, PS-3
**Classification:** Internal / Development Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture Principles](#3-architecture-principles)
4. [Component Architecture](#4-component-architecture)
   - 4.1 [Frontend — React Web App](#41-frontend--react-web-app)
   - 4.2 [Backend — FastAPI Server](#42-backend--fastapi-server)
   - 4.3 [Detection Engine — AI/ML Core](#43-detection-engine--aiml-core)
   - 4.4 [Chrome Extension](#44-chrome-extension)
   - 4.5 [Database & Caching Layer](#45-database--caching-layer)
5. [Detection Modules — Deep Dive](#5-detection-modules--deep-dive)
   - 5.1 [Text Detection](#51-text-detection)
   - 5.2 [Image Deepfake Detection](#52-image-deepfake-detection)
   - 5.3 [Audio Clone Detection](#53-audio-clone-detection)
   - 5.4 [Video Analysis Pipeline](#54-video-analysis-pipeline)
   - 5.5 [Confidence Fusion Engine](#55-confidence-fusion-engine)
6. [API Contract](#6-api-contract)
7. [Data Models & Schema](#7-data-models--schema)
8. [Project File Structure](#8-project-file-structure)
9. [Environment & Configuration](#9-environment--configuration)
10. [Prototype Build Plan](#10-prototype-build-plan)
11. [Security & Ethics Layer](#11-security--ethics-layer)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Performance Targets](#13-performance-targets)
14. [Known Limitations & Trade-offs](#14-known-limitations--trade-offs)

---

## 1. Executive Summary

**DeepSentinel** is a multi-modal AI-generated content and deepfake detection platform designed for non-expert users. It accepts text, image, audio, and video inputs, runs them through specialized AI detection pipelines, and returns a **probabilistic confidence score** alongside a plain-English **Indicator Breakdown** — never a binary real/fake verdict.

**Core differentiator:** Unlike single-modal tools (e.g., GPTZero for text, Deepware for video), DeepSentinel processes all four media types through a **unified analysis session** using a weighted fusion engine, delivering one coherent, explainable result.

**Elevator pitch:** *"One upload. Three modalities. Zero guesswork."*

---

## 2. System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                │
│                                                                │
│   ┌──────────────────┐         ┌──────────────────────────┐   │
│   │  React Web App   │         │   Chrome Extension (MV3)  │   │
│   │  (deepsentinel.ai│         │   Right-click any media   │   │
│   │   /analyze)      │         │   on any webpage          │   │
│   └────────┬─────────┘         └────────────┬─────────────┘   │
└────────────┼──────────────────────────────  ┼ ────────────────┘
             │ HTTPS/REST                      │ HTTPS/REST
             ▼                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                           │
│                                                                │
│  ┌──────────────┐  ┌────────────────┐  ┌───────────────────┐  │
│  │ /api/analyze │  │ /api/status    │  │ /api/report/:id   │  │
│  │ (file upload)│  │ (job polling)  │  │ (PDF export)      │  │
│  └──────┬───────┘  └───────┬────────┘  └─────────┬─────────┘  │
│         │                  │                      │            │
│  ┌──────▼──────────────────▼──────────────────────▼─────────┐ │
│  │                   Job Queue (Redis/Celery)               │ │
│  └──────────────────────────┬──────────────────────────────┘ │
└─────────────────────────────┼──────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                    Detection Engine (Workers)                   │
│                                                                 │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐ │
│  │ Text Module │ │ Image Module │ │ Audio Module │ │ Video  │ │
│  │ (RoBERTa)  │ │(EfficientNet)│ │ (Wav2Vec2)  │ │Module  │ │
│  └──────┬──────┘ └──────┬───────┘ └──────┬───────┘ └───┬────┘ │
│         │               │                │             │       │
│  ┌──────▼───────────────▼────────────────▼─────────────▼─────┐ │
│  │               Confidence Fusion Engine                    │ │
│  │         (Weighted Ensemble + Indicator Extractor)         │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                   ▼
    ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
    │  PostgreSQL │  │  Redis Cache │  │  S3 / Local  │
    │  (results,  │  │  (job state, │  │  Storage     │
    │   audit log)│  │   sessions)  │  │  (uploads)   │
    └─────────────┘  └──────────────┘  └──────────────┘
```

---

## 3. Architecture Principles

| Principle | Decision | Rationale |
|---|---|---|
| **API-first** | All logic exposed via REST | Enables web app, Chrome ext., and future mobile clients from one backend |
| **Async processing** | Celery + Redis task queue | AI inference is slow (2–15s); never block HTTP requests |
| **Modular detection** | Each modality = independent worker | Add/swap models without touching other modules |
| **Probabilistic output** | Confidence score 0–100%, never binary | Aligns with PS requirement; reduces false accusation risk |
| **Explainability first** | Every score paired with indicators | Non-expert users must understand WHY |
| **Ethics by design** | Rate limiting + usage audit log | Prevents weaponization; PS mandates responsible use |
| **Prototype pragmatism** | Pre-trained models only, no custom training | Ship a working demo in days, not months |

---

## 4. Component Architecture

### 4.1 Frontend — React Web App

**Stack:** React 18 + Vite + Tailwind CSS + Axios + Recharts

**Key screens:**

```
/ (Landing)
  └── /analyze          ← Main upload + results page
        ├── FileUploadZone (drag-drop, multi-type)
        ├── AnalysisProgress (polling job status)
        ├── ConfidenceMeter (animated gauge 0–100%)
        ├── IndicatorBreakdown (expandable cards)
        └── ReportExport (PDF download button)
```

**State management:** React Context + `useReducer` (no Redux for prototype speed)

**Upload flow:**
```
User drops file
  → validate type/size client-side (max 50MB)
  → POST /api/analyze  (multipart/form-data)
  → receive { job_id }
  → poll GET /api/status/{job_id}  every 2s
  → on COMPLETE → render results
```

**Environment variable:**
```
VITE_API_BASE_URL=http://localhost:8000
```

---

### 4.2 Backend — FastAPI Server

**Stack:** Python 3.11 + FastAPI + Celery + Uvicorn

**Responsibilities:**
- Receive and validate file uploads
- Enqueue detection jobs
- Return job status and results
- Serve PDF reports
- Rate limiting and audit logging

**File:** `backend/main.py`

```python
# Core routes
POST   /api/analyze          → enqueue job, return job_id
GET    /api/status/{job_id}  → return job state + partial results
GET    /api/report/{job_id}  → return PDF report (ReportLab)
GET    /api/health           → liveness probe

# CORS: allow localhost:5173 (Vite dev), extension origins
# Max file size: 50MB (configurable via env)
# Rate limit: 10 requests/min per IP (via slowapi)
```

**Middleware stack (order matters):**
```
Request → CORS → Rate Limiter → File Validator → Route Handler → Response
```

---

### 4.3 Detection Engine — AI/ML Core

**Stack:** Python + PyTorch + HuggingFace Transformers + ONNX Runtime

**Worker model:** Celery workers pull jobs from Redis queue

```python
# Each job triggers this orchestrator:
def run_analysis(job_id: str, file_path: str, media_type: str):
    results = {}
    
    if media_type == "text":
        results["text"] = TextDetector().analyze(file_path)
    
    elif media_type in ["image", "jpg", "png"]:
        results["image"] = ImageDetector().analyze(file_path)
    
    elif media_type in ["mp3", "wav", "ogg"]:
        results["audio"] = AudioDetector().analyze(file_path)
    
    elif media_type in ["mp4", "mov", "avi"]:
        results["image"] = ImageDetector().analyze_video_frames(file_path)
        results["audio"] = AudioDetector().analyze(file_path)
        results["sync"]  = SyncAnalyzer().analyze(file_path)
    
    final = FusionEngine().fuse(results)
    db.save_result(job_id, final)
    cache.set(job_id, "COMPLETE")
```

---

### 4.4 Chrome Extension

**Manifest version:** MV3 (required for Chrome Web Store compliance)

**Files:**
```
extension/
├── manifest.json       ← MV3 config
├── background.js       ← Service worker (MV3)
├── content.js          ← DOM scraping, right-click context
├── popup.html/.js      ← Extension popup UI
└── icons/
```

**User flow:**
```
User right-clicks image/video/audio on any webpage
  → context_menu "Analyze with DeepSentinel"
  → content.js extracts src URL or selected text
  → background.js sends to backend: POST /api/analyze { url: "..." }
  → popup.html shows progress + result
```

**manifest.json (key fields):**
```json
{
  "manifest_version": 3,
  "name": "DeepSentinel",
  "permissions": ["contextMenus", "storage", "activeTab"],
  "host_permissions": ["https://deepsentinel.ai/*", "http://localhost:8000/*"],
  "background": { "service_worker": "background.js" },
  "action": { "default_popup": "popup.html" }
}
```

---

### 4.5 Database & Caching Layer

**PostgreSQL** — persistent storage

```sql
-- Two core tables for prototype:

CREATE TABLE analysis_jobs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    status        TEXT CHECK (status IN ('PENDING','PROCESSING','COMPLETE','FAILED')),
    media_type    TEXT,
    file_hash     TEXT,          -- SHA-256, for deduplication
    result_json   JSONB,         -- full result payload
    confidence    FLOAT,         -- top-level score (0.0 - 1.0)
    processing_ms INTEGER        -- latency tracking
);

CREATE TABLE audit_log (
    id         SERIAL PRIMARY KEY,
    job_id     UUID REFERENCES analysis_jobs(id),
    ip_hash    TEXT,             -- hashed IP, not raw (privacy)
    user_agent TEXT,
    timestamp  TIMESTAMPTZ DEFAULT NOW(),
    action     TEXT              -- 'SUBMITTED', 'VIEWED', 'EXPORTED'
);
```

**Redis** — ephemeral state

```
Key pattern:         job:{job_id}:status      → "PENDING" | "PROCESSING" | "COMPLETE"
Key pattern:         job:{job_id}:progress    → "0.45"  (fraction complete)
Key pattern:         ratelimit:{ip_hash}      → request count, TTL 60s
TTL for job keys:    3600s (1 hour)
```

---

## 5. Detection Modules — Deep Dive

### 5.1 Text Detection

**Model:** `roberta-base-openai-detector` (HuggingFace)
**Fallback / ensemble:** `Hello-SimpleAI/chatgpt-detector-roberta`

**What it detects:** ChatGPT, Gemini, Claude, and other LLM-generated text via learned statistical patterns (burstiness, perplexity, repetition signatures)

**Implementation:**

```python
# backend/detectors/text_detector.py

from transformers import pipeline

class TextDetector:
    def __init__(self):
        self.classifier = pipeline(
            "text-classification",
            model="roberta-base-openai-detector",
            device=-1  # CPU for prototype; set to 0 for GPU
        )

    def analyze(self, text: str) -> dict:
        if len(text) < 50:
            return {"error": "Text too short for reliable analysis (min 50 chars)"}

        # Chunk long text (model max: 512 tokens)
        chunks = self._chunk_text(text, max_tokens=480)
        chunk_scores = [self.classifier(chunk)[0] for chunk in chunks]

        # Average confidence across chunks
        ai_scores = [
            r["score"] if r["label"] == "LABEL_1" else 1 - r["score"]
            for r in chunk_scores
        ]
        avg_score = sum(ai_scores) / len(ai_scores)

        return {
            "confidence": round(avg_score, 4),
            "indicators": self._extract_indicators(text, avg_score),
            "chunk_count": len(chunks),
            "model": "roberta-base-openai-detector"
        }

    def _extract_indicators(self, text: str, score: float) -> list[dict]:
        indicators = []
        # Perplexity proxy: unusually uniform sentence lengths
        sentences = text.split(".")
        lengths = [len(s.split()) for s in sentences if s.strip()]
        variance = sum((l - sum(lengths)/len(lengths))**2 for l in lengths) / len(lengths)
        if variance < 8.0:
            indicators.append({
                "name": "Uniform sentence structure",
                "severity": "HIGH" if score > 0.7 else "MED",
                "explanation": "Human writing varies sentence length naturally. This text is unusually consistent."
            })
        # Add more heuristic checks here...
        return indicators

    def _chunk_text(self, text: str, max_tokens: int) -> list[str]:
        words = text.split()
        chunks, current = [], []
        for word in words:
            current.append(word)
            if len(current) >= max_tokens:
                chunks.append(" ".join(current))
                current = []
        if current:
            chunks.append(" ".join(current))
        return chunks
```

**Indicators produced:**
- Uniform sentence structure
- Low perplexity score (unnaturally predictable word choices)
- Repetitive n-gram patterns
- Absence of typos/colloquialisms (statistical outlier)
- Hedging language overuse ("It is important to note that...")

---

### 5.2 Image Deepfake Detection

**Primary model:** `EfficientNet-B4` fine-tuned on FaceForensics++
**Pretrained weights source:** `selimsef/dfdc_deepfake_challenge` (HuggingFace / DFDC winners)
**Supporting library:** OpenCV + MediaPipe (face detection pre-filter)

**What it detects:** GAN-generated faces, face-swap artifacts, neural texture inconsistencies, blending seams at hairlines/jaw

**Implementation:**

```python
# backend/detectors/image_detector.py

import cv2
import torch
import numpy as np
import mediapipe as mp
from torchvision import transforms
from PIL import Image

class ImageDetector:
    def __init__(self):
        self.model = self._load_model()
        self.face_detector = mp.solutions.face_detection.FaceDetection(
            model_selection=1, min_detection_confidence=0.5
        )
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    def _load_model(self):
        # Load ONNX model for faster CPU inference
        import onnxruntime as ort
        return ort.InferenceSession("models/efficientnet_b4_dfdc.onnx")

    def analyze(self, image_path: str) -> dict:
        img = cv2.imread(image_path)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Step 1: Face detection (only analyze face regions)
        faces = self._detect_faces(img_rgb)

        if not faces:
            return {
                "confidence": 0.15,  # Low confidence without face
                "note": "No faces detected — limited analysis applied",
                "indicators": [self._texture_analysis(img_rgb)]
            }

        # Step 2: Run model on each face crop
        face_scores = []
        for bbox in faces:
            crop = self._crop_face(img_rgb, bbox, margin=0.3)
            score = self._run_model(crop)
            face_scores.append(score)

        avg_score = sum(face_scores) / len(face_scores)

        return {
            "confidence": round(avg_score, 4),
            "faces_analyzed": len(faces),
            "indicators": self._generate_indicators(img_rgb, faces, avg_score),
            "model": "efficientnet-b4-dfdc-onnx"
        }

    def analyze_video_frames(self, video_path: str, sample_rate: int = 30) -> dict:
        """Sample frames from video and run image analysis on each"""
        cap = cv2.VideoCapture(video_path)
        frame_scores = []
        frame_num = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            if frame_num % sample_rate == 0:
                result = self.analyze_frame(frame)
                if "confidence" in result:
                    frame_scores.append(result["confidence"])
            frame_num += 1

        cap.release()

        if not frame_scores:
            return {"confidence": 0.0, "error": "No analyzable frames found"}

        return {
            "confidence": round(max(frame_scores) * 0.7 + sum(frame_scores)/len(frame_scores) * 0.3, 4),
            "frames_analyzed": len(frame_scores),
            "peak_confidence": max(frame_scores),
            "indicators": self._video_frame_indicators(frame_scores)
        }

    def _generate_indicators(self, img, faces, score) -> list[dict]:
        indicators = []
        if score > 0.6:
            indicators.append({
                "name": "Facial boundary inconsistency",
                "severity": "HIGH",
                "explanation": "The edges where the face meets the hairline or neck show subtle blending artifacts typical of AI face-swap technology."
            })
        # Add: eye symmetry check, blink analysis, skin texture uniformity
        return indicators
```

**Indicators produced:**
- Facial boundary inconsistency (blending seams)
- Abnormal skin texture uniformity (GAN smoothing)
- Eye asymmetry or unnatural iris texture
- Background-foreground color temperature mismatch
- Compression artifact patterns inconsistent with stated file format

---

### 5.3 Audio Clone Detection

**Model:** `facebook/wav2vec2-base` (HuggingFace) + custom classifier head
**Dataset trained on:** WaveFake dataset (11 TTS systems)
**Supporting library:** `librosa` for feature extraction

**What it detects:** Voice cloning (ElevenLabs, Bark, XTTS), TTS synthesis artifacts, unnatural prosody patterns, spectral inconsistencies

**Implementation:**

```python
# backend/detectors/audio_detector.py

import librosa
import numpy as np
import torch
from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification

class AudioDetector:
    MODEL_ID = "HazmeiNabil/wav2vec2-audio-deepfake-detector"  # community fine-tuned

    def __init__(self):
        self.extractor = Wav2Vec2FeatureExtractor.from_pretrained(self.MODEL_ID)
        self.model = Wav2Vec2ForSequenceClassification.from_pretrained(self.MODEL_ID)
        self.model.eval()

    def analyze(self, audio_path: str) -> dict:
        # Load and resample to 16kHz (Wav2Vec2 requirement)
        waveform, sr = librosa.load(audio_path, sr=16000, mono=True)

        if len(waveform) / 16000 < 1.0:
            return {"error": "Audio too short (minimum 1 second required)"}

        # Cap at 30 seconds to prevent OOM
        waveform = waveform[:16000 * 30]

        # Model inference
        inputs = self.extractor(waveform, sampling_rate=16000, return_tensors="pt", padding=True)
        with torch.no_grad():
            logits = self.model(**inputs).logits
        probabilities = torch.softmax(logits, dim=-1)
        ai_confidence = probabilities[0][1].item()  # class 1 = fake

        # Librosa-based heuristic features
        heuristics = self._heuristic_analysis(waveform, sr=16000)

        # Blend model + heuristics
        final_confidence = ai_confidence * 0.75 + heuristics["score"] * 0.25

        return {
            "confidence": round(final_confidence, 4),
            "duration_s": round(len(waveform) / 16000, 1),
            "indicators": self._generate_indicators(heuristics, ai_confidence),
            "model": self.MODEL_ID
        }

    def _heuristic_analysis(self, waveform: np.ndarray, sr: int) -> dict:
        score = 0.0
        flags = []

        # 1. Pitch variance (TTS often too consistent)
        pitches, magnitudes = librosa.piptrack(y=waveform, sr=sr)
        valid_pitches = pitches[magnitudes > np.median(magnitudes)]
        if len(valid_pitches) > 0:
            pitch_std = np.std(valid_pitches)
            if pitch_std < 20:
                score += 0.3
                flags.append("low_pitch_variance")

        # 2. Silence pattern uniformity (natural speech has irregular pauses)
        rms = librosa.feature.rms(y=waveform)[0]
        silence_frames = np.sum(rms < 0.01)
        if silence_frames / len(rms) > 0.4:
            score += 0.1
            flags.append("excessive_silence")

        # 3. Spectral flatness (synthesized audio is spectrally cleaner)
        flatness = librosa.feature.spectral_flatness(y=waveform)[0]
        if np.mean(flatness) < 0.001:
            score += 0.25
            flags.append("low_spectral_flatness")

        return {"score": min(score, 1.0), "flags": flags}

    def _generate_indicators(self, heuristics: dict, model_score: float) -> list[dict]:
        indicators = []
        flag_map = {
            "low_pitch_variance": {
                "name": "Unnaturally consistent pitch",
                "severity": "HIGH",
                "explanation": "Human voices naturally vary in pitch across a conversation. This audio shows pitch consistency that is typical of text-to-speech systems."
            },
            "low_spectral_flatness": {
                "name": "Synthetic spectral profile",
                "severity": "MED",
                "explanation": "The frequency distribution of this audio resembles computer-generated sound rather than natural voice acoustics."
            },
        }
        for flag in heuristics.get("flags", []):
            if flag in flag_map:
                indicators.append(flag_map[flag])
        return indicators
```

**Indicators produced:**
- Unnaturally consistent pitch (low prosody variance)
- Synthetic spectral profile (spectral flatness)
- Unnatural breathing pattern absence
- Audio-lip sync mismatch (video only, via SyncAnalyzer)
- Overly clean background (real recordings have ambient noise)

---

### 5.4 Video Analysis Pipeline

**Not a separate model** — Video is decomposed into:
1. **Frame samples** → `ImageDetector.analyze_video_frames()`
2. **Audio track** → extracted via FFmpeg → `AudioDetector.analyze()`
3. **Sync check** → `SyncAnalyzer` (lip movement vs. audio onset correlation)

**FFmpeg extraction (preprocessing):**

```python
# backend/preprocessors/video_preprocessor.py
import subprocess
import os

class VideoPreprocessor:
    def extract_audio(self, video_path: str, out_path: str) -> str:
        """Extract audio track from video as WAV"""
        subprocess.run([
            "ffmpeg", "-y", "-i", video_path,
            "-vn", "-acodec", "pcm_s16le",
            "-ar", "16000", "-ac", "1",
            out_path
        ], check=True, capture_output=True)
        return out_path

    def get_metadata(self, video_path: str) -> dict:
        """Get duration, fps, resolution"""
        result = subprocess.run([
            "ffprobe", "-v", "quiet", "-print_format", "json",
            "-show_streams", video_path
        ], capture_output=True, text=True)
        import json
        return json.loads(result.stdout)
```

**SyncAnalyzer (Audio-Lip Sync):**

```python
# backend/detectors/sync_analyzer.py
import cv2
import librosa
import mediapipe as mp
import numpy as np

class SyncAnalyzer:
    """
    Coarse lip-sync analysis:
    1. Extract lip openness per frame via MediaPipe
    2. Extract audio energy per time window via librosa
    3. Compute cross-correlation — low correlation = likely desync
    """
    def analyze(self, video_path: str) -> dict:
        lip_signal = self._extract_lip_signal(video_path)
        audio_signal = self._extract_audio_energy(video_path)

        if lip_signal is None or audio_signal is None:
            return {"confidence": 0.0, "skipped": True}

        # Align signals (resample to same length)
        min_len = min(len(lip_signal), len(audio_signal))
        lip_signal = lip_signal[:min_len]
        audio_signal = audio_signal[:min_len]

        correlation = np.corrcoef(lip_signal, audio_signal)[0, 1]
        desync_confidence = max(0, 1.0 - abs(correlation))

        return {
            "confidence": round(desync_confidence, 4),
            "correlation": round(float(correlation), 4),
            "indicators": self._generate_indicators(desync_confidence, correlation)
        }
```

---

### 5.5 Confidence Fusion Engine

**Purpose:** Combine scores from multiple detectors into a single interpretable confidence score with weighted blending.

```python
# backend/fusion/fusion_engine.py

class FusionEngine:
    """
    Weights are tuned to reflect model reliability on benchmark data.
    Sum of weights for any single-modality input always = 1.0.
    """
    WEIGHTS = {
        "text":  1.00,
        "image": 1.00,
        "audio": 0.60,
        "sync":  0.40,   # audio + sync sum to 1.0 for video-only inputs
    }

    def fuse(self, module_results: dict) -> dict:
        scores = {}
        all_indicators = []

        for modality, result in module_results.items():
            if "error" in result:
                continue
            scores[modality] = result["confidence"]
            all_indicators.extend(result.get("indicators", []))

        if not scores:
            return {"confidence": 0.0, "error": "All detection modules failed", "indicators": []}

        # Normalize weights to sum to 1.0 for active modules only
        active_weights = {k: self.WEIGHTS[k] for k in scores}
        weight_sum = sum(active_weights.values())
        normalized = {k: v / weight_sum for k, v in active_weights.items()}

        final_confidence = sum(scores[k] * normalized[k] for k in scores)

        # Sort indicators by severity (HIGH → MED → LOW)
        severity_order = {"HIGH": 0, "MED": 1, "LOW": 2}
        sorted_indicators = sorted(
            all_indicators,
            key=lambda x: severity_order.get(x.get("severity", "LOW"), 2)
        )

        return {
            "confidence": round(final_confidence, 4),
            "confidence_pct": round(final_confidence * 100, 1),
            "risk_level": self._risk_label(final_confidence),
            "modality_scores": scores,
            "indicators": sorted_indicators[:8],   # Cap at 8 for UI clarity
            "modalities_analyzed": list(scores.keys()),
        }

    def _risk_label(self, score: float) -> str:
        if score >= 0.75:  return "HIGH"
        if score >= 0.45:  return "MEDIUM"
        if score >= 0.20:  return "LOW"
        return "UNLIKELY"
```

---

## 6. API Contract

### POST `/api/analyze`

Upload a file for analysis.

**Request:** `multipart/form-data`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | File | Yes | Max 50MB |
| `source_url` | string | No | For Chrome extension URL-based submission |

**Response `202 Accepted`:**
```json
{
  "job_id": "3f8a1c2d-...",
  "status": "PENDING",
  "estimated_seconds": 8,
  "media_type": "image"
}
```

**Error `413`:** File too large
**Error `415`:** Unsupported media type
**Error `429`:** Rate limit exceeded

---

### GET `/api/status/{job_id}`

Poll job status and retrieve results.

**Response while processing (`200`):**
```json
{
  "job_id": "3f8a1c2d-...",
  "status": "PROCESSING",
  "progress": 0.45,
  "started_at": "2025-02-20T10:42:01Z"
}
```

**Response on completion (`200`):**
```json
{
  "job_id": "3f8a1c2d-...",
  "status": "COMPLETE",
  "media_type": "video",
  "confidence_pct": 87.3,
  "risk_level": "HIGH",
  "modality_scores": {
    "image": 0.891,
    "audio": 0.712,
    "sync":  0.834
  },
  "indicators": [
    {
      "name": "Facial boundary inconsistency",
      "severity": "HIGH",
      "explanation": "The edges where the face meets the hairline show subtle blending artifacts typical of AI face-swap technology."
    },
    {
      "name": "Audio-lip sync mismatch",
      "severity": "HIGH",
      "explanation": "The movement of the speaker's lips does not consistently match the audio waveform, a common sign of audio replacement."
    },
    {
      "name": "Unnaturally consistent pitch",
      "severity": "MED",
      "explanation": "Human voices naturally vary in pitch. This audio shows pitch consistency typical of voice synthesis systems."
    }
  ],
  "modalities_analyzed": ["image", "audio", "sync"],
  "disclaimer": "This analysis provides probabilistic indicators, not definitive proof. Results should be interpreted alongside other verification methods.",
  "processing_ms": 7842
}
```

---

### GET `/api/report/{job_id}`

Returns a PDF report (generated with ReportLab).

**Response `200`:** `Content-Type: application/pdf`

---

## 7. Data Models & Schema

### `AnalysisResult` (Pydantic)

```python
# backend/models/schemas.py

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class RiskLevel(str, Enum):
    UNLIKELY = "UNLIKELY"
    LOW      = "LOW"
    MEDIUM   = "MEDIUM"
    HIGH     = "HIGH"

class Severity(str, Enum):
    LOW  = "LOW"
    MED  = "MED"
    HIGH = "HIGH"

class Indicator(BaseModel):
    name: str
    severity: Severity
    explanation: str

class ModalityScore(BaseModel):
    confidence: float = Field(ge=0.0, le=1.0)
    model: str
    indicators: list[Indicator]

class AnalysisResult(BaseModel):
    job_id: str
    status: str
    confidence_pct: Optional[float] = None
    risk_level: Optional[RiskLevel] = None
    modality_scores: dict[str, float] = {}
    indicators: list[Indicator] = []
    modalities_analyzed: list[str] = []
    disclaimer: str = (
        "This analysis provides probabilistic indicators, not definitive proof. "
        "Results should be interpreted alongside other verification methods."
    )
    processing_ms: Optional[int] = None
```

---

## 8. Project File Structure

```
deepsentinel/
│
├── backend/
│   ├── main.py                         # FastAPI app + routes
│   ├── celery_app.py                   # Celery config + task definitions
│   ├── config.py                       # Env-based settings (pydantic-settings)
│   ├── requirements.txt
│   │
│   ├── detectors/
│   │   ├── __init__.py
│   │   ├── text_detector.py            # RoBERTa text analysis
│   │   ├── image_detector.py           # EfficientNet-B4 image/frame analysis
│   │   ├── audio_detector.py           # Wav2Vec2 audio analysis
│   │   └── sync_analyzer.py            # Audio-lip sync correlation
│   │
│   ├── preprocessors/
│   │   ├── video_preprocessor.py       # FFmpeg audio extraction, frame sampling
│   │   └── file_validator.py           # MIME type, size, malware-scan stub
│   │
│   ├── fusion/
│   │   └── fusion_engine.py            # Weighted ensemble + indicator sorting
│   │
│   ├── models/
│   │   ├── schemas.py                  # Pydantic models
│   │   └── db.py                       # SQLAlchemy models + async session
│   │
│   ├── utils/
│   │   ├── pdf_generator.py            # ReportLab PDF export
│   │   ├── storage.py                  # Local/S3 file management
│   │   └── rate_limiter.py             # slowapi integration
│   │
│   └── models_cache/                   # Downloaded ONNX / HuggingFace weights
│       ├── efficientnet_b4_dfdc.onnx
│       └── .gitkeep                    # Weights NOT committed to git
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   └── client.js               # Axios wrapper + polling logic
│       ├── components/
│       │   ├── FileUploadZone.jsx      # Drag-drop with type validation
│       │   ├── AnalysisProgress.jsx    # Animated progress with status text
│       │   ├── ConfidenceMeter.jsx     # Animated gauge (Recharts or custom SVG)
│       │   ├── IndicatorBreakdown.jsx  # Expandable severity cards
│       │   ├── RiskBadge.jsx           # HIGH / MEDIUM / LOW / UNLIKELY pill
│       │   └── ReportButton.jsx        # PDF download trigger
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   └── AnalyzePage.jsx
│       └── styles/
│           └── index.css               # Tailwind directives
│
├── extension/
│   ├── manifest.json                   # MV3
│   ├── background.js                   # Service worker
│   ├── content.js                      # DOM interaction
│   ├── popup.html
│   ├── popup.js
│   └── icons/
│
├── docker-compose.yml                  # postgres + redis + backend + worker
├── Dockerfile.backend
├── Dockerfile.worker                   # Separate image for Celery workers
├── .env.example
└── README.md
```

---

## 9. Environment & Configuration

```bash
# .env.example — copy to .env and fill in values

# === Backend ===
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/deepsentinel
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=change-me-in-production-use-openssl-rand-hex-32
MAX_UPLOAD_SIZE_MB=50
RATE_LIMIT_PER_MIN=10

# === Storage ===
STORAGE_BACKEND=local           # "local" or "s3"
LOCAL_STORAGE_PATH=./uploads
# AWS_ACCESS_KEY_ID=...         # Only if STORAGE_BACKEND=s3
# AWS_SECRET_ACCESS_KEY=...
# S3_BUCKET_NAME=deepsentinel-uploads

# === ML Models ===
MODELS_CACHE_DIR=./backend/models_cache
USE_GPU=false                   # Set true if CUDA available
ONNX_PROVIDERS=CPUExecutionProvider   # or CUDAExecutionProvider

# === Frontend ===
VITE_API_BASE_URL=http://localhost:8000

# === Chrome Extension ===
EXTENSION_API_URL=http://localhost:8000   # Change to prod URL before packaging
```

---

## 10. Prototype Build Plan

**Target:** Working demo in 6 weeks. Prioritize text + image first, audio + video in week 3.

### Week 1–2: Core Detection (Text + Image)

```
✅ Day 1:  Project scaffold — FastAPI + React + PostgreSQL + Redis via docker-compose
✅ Day 2:  File upload endpoint + Celery queue wiring
✅ Day 3:  TextDetector integration + unit tests
✅ Day 4:  ImageDetector integration + ONNX model download script
✅ Day 5:  FusionEngine + AnalysisResult schema
✅ Day 6:  Frontend: FileUploadZone + polling loop
✅ Day 7:  Frontend: ConfidenceMeter + IndicatorBreakdown
✅ Day 8:  End-to-end test: upload image → see result in UI
✅ Day 9:  Database persistence + audit log
✅ Day 10: Error handling, loading states, input validation
```

### Week 3: Audio & Video Pipeline

```
✅ Day 11: AudioDetector (Wav2Vec2) + librosa heuristics
✅ Day 12: VideoPreprocessor (FFmpeg audio extraction)
✅ Day 13: ImageDetector.analyze_video_frames()
✅ Day 14: SyncAnalyzer (basic cross-correlation)
✅ Day 15: FusionEngine updated for multi-modal video jobs
```

### Week 4: Web UI Polish + API

```
✅ Day 16: Animated ConfidenceMeter (SVG gauge with color zones)
✅ Day 17: IndicatorBreakdown cards with severity icons
✅ Day 18: PDF report generation (ReportLab)
✅ Day 19: Rate limiting + IP hashing for audit log
✅ Day 20: /api/health + /api/report endpoints
```

### Week 5: Chrome Extension + Testing

```
✅ Day 21: Extension scaffold (MV3 manifest + service worker)
✅ Day 22: Right-click context menu → POST to API
✅ Day 23: popup.html results display
✅ Day 24: Integration tests (pytest + httpx for API)
✅ Day 25: Postman collection for judges demo
```

### Week 6: Hardening + Demo Prep

```
✅ Day 26: Input sanitization + malformed file handling
✅ Day 27: Ethical disclaimer on all result pages
✅ Day 28: Usage policy page + rate limit messaging
✅ Day 29: Demo video recording (screen capture of full flow)
✅ Day 30: Docker deploy on free-tier Render.com / Railway.app
```

---

## 11. Security & Ethics Layer

### Input Validation

```python
ALLOWED_MIME_TYPES = {
    "text/plain", "text/html",
    "image/jpeg", "image/png", "image/webp",
    "audio/mpeg", "audio/wav", "audio/ogg",
    "video/mp4", "video/quicktime", "video/x-msvideo"
}

MAX_SIZES_MB = {
    "text": 1, "image": 10, "audio": 25, "video": 50
}
```

### Ethical Safeguards

- **Probabilistic framing only:** The UI and API never say "This IS a deepfake." Every result includes the disclaimer.
- **No user data retention beyond TTL:** Uploaded files auto-deleted after 1 hour. Results kept for audit only (no raw content).
- **Rate limiting:** 10 requests/min per IP. Prevents automated bulk surveillance use.
- **Audit log:** All submissions logged with hashed IP, timestamp, and result — for accountability.
- **No face recognition:** The system detects manipulation artifacts, NOT the identity of any person in the media.
- **Transparency page:** `/about/how-it-works` explains models used, their known limitations, and false-positive rates.

### Known False Positive Sources (disclose to users)

| Trigger | Why it raises score | Mitigation |
|---|---|---|
| Heavy JPEG compression | Introduces blocking artifacts resembling GAN noise | Note in output if file appears highly compressed |
| Artistic filters | Smooth skin textures in Instagram-filtered photos | Include file EXIF metadata in report |
| Non-native English writing | Can trigger text model on statistical grounds | Add language detection, apply different threshold |
| Professional studio audio | Very clean audio may resemble TTS | Lower audio weight for professionally recorded content |

---

## 12. Deployment Architecture

### Local Development (Docker Compose)

```yaml
# docker-compose.yml

version: "3.9"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: deepsentinel
      POSTGRES_PASSWORD: password
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports: ["8000:8000"]
    env_file: .env
    depends_on: [postgres, redis]
    volumes: ["./uploads:/app/uploads", "./backend/models_cache:/app/models_cache"]
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    env_file: .env
    depends_on: [postgres, redis]
    volumes: ["./uploads:/app/uploads", "./backend/models_cache:/app/models_cache"]
    command: celery -A celery_app worker --loglevel=info --concurrency=2

volumes:
  pgdata:
```

### Prototype Cloud Deployment (Free Tier)

| Service | Provider | Free Tier |
|---|---|---|
| Backend + Worker | Render.com (Web Service) | 750 hrs/month |
| PostgreSQL | Render.com (Postgres) | 90 days free |
| Redis | Upstash | 10k req/day |
| Frontend | Vercel | Unlimited |
| File storage | Cloudflare R2 | 10GB free |

**Note:** Heavy ML inference (video) will time out on free-tier CPU. For demo, pre-process and cache results, or use lightweight ONNX models only.

---

## 13. Performance Targets

| Operation | Target (CPU) | Target (GPU) | Notes |
|---|---|---|---|
| Text analysis (1000 words) | < 2s | < 0.5s | RoBERTa inference |
| Image analysis (1 face) | < 3s | < 0.5s | ONNX EfficientNet |
| Audio analysis (30s clip) | < 5s | < 1s | Wav2Vec2 |
| Video analysis (30s clip) | < 15s | < 3s | Frame sampling + audio |
| API response (job enqueue) | < 100ms | — | Non-blocking |
| PDF report generation | < 1s | — | CPU-only |

---

## 14. Known Limitations & Trade-offs

| Limitation | Impact | Accepted For Prototype? |
|---|---|---|
| No custom model training — using pretrained weights | Accuracy capped at ~85% for novel deepfake methods | ✅ Yes — retraining requires weeks + GPUs |
| Text detection unreliable for < 50 words | Short captions, tweets cannot be analyzed | ✅ Yes — show warning to user |
| Video sync analysis is coarse (no lip landmark tracking) | May miss subtle dubbing | ✅ Yes — MediaPipe is sufficient for demo |
| CPU-only inference on free-tier cloud | Video jobs take 15–30s | ✅ Yes — show progress bar, set expectations |
| No support for non-Latin text scripts | Arabic, Chinese text analysis unreliable | ⚠️ Noted — show language warning |
| Models may not detect latest GPT-5 / Sora outputs | Rapid AI advancement outpaces detection | ✅ Yes — inherent limitation of the field; disclose |

---

*Document maintained by: Development Team*
*Last updated: February 2026*
*Next review: After prototype demo (March 6, 2026)*
