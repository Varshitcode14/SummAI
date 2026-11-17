# ◈ SummAI: AI Text Summarizer for Microsoft Edge

Turn any webpage or selected text into a **summary, flowchart, or learning roadmap** in one click, without leaving your tab.

SummAI lives in Edge's side panel, so it stays open while you browse. Powered by **Groq-hosted Llama 3.3 70B** behind a REST API.

[![Edge Add-ons](https://img.shields.io/badge/Edge-Add--ons-0078D7?logo=microsoftedge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/summai-%E2%80%93-text-summarizer/iilhbdhbacoojhhfhfagokiilglafjhj)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-00c9ff)
![LLM](https://img.shields.io/badge/LLM-Llama%203.3%2070B-00ffaa)
![Groq](https://img.shields.io/badge/Inference-Groq-f55036)

**Install:** [Edge Add-ons Store](https://microsoftedge.microsoft.com/addons/detail/summai-%E2%80%93-text-summarizer/iilhbdhbacoojhhfhfagokiilglafjhj)
**Code:** [GitHub](https://github.com/Varshitcode14/SummAI-Microsoft-Edge-Extension)

---

## ✨ Features

| Tab | What it does |
|---|---|
| **◈ Summarize** | Condenses text into a **Brief** (2-3 lines), **Detailed** (paragraph), or **Bullet** (key points) summary, with original length, summary length, and % reduction stats. |
| **⬡ Flowchart** | Breaks content into ordered, color-coded nodes (Introduction, Background, Methodology, Results, Discussion, Conclusion). Click a node to expand its mini-summary, and a final summary closes the chart. |
| **◎ Roadmap** | Extracts the key topics from the text and builds an expandable step-by-step learning path for each one. |

**Three ways to feed it text** (on every tab):

- ✂ **Selected Text**: highlight anything on a page; SummAI picks it up automatically.
- 📄 **Full Page**: extracts the page's readable text (capped at 8,000 characters to stay within token limits).
- ✏ **Manual**: type or paste your own text.

**Also included:** one-click copy of the summary, a live backend status indicator (ONLINE / OFFLINE), input validation (minimum 10 words), and a dark UI built for a narrow side panel.

---

## 🧠 How It Works

```
┌──────────────────────────┐        ┌────────────────────────────┐
│   Edge Extension (MV3)   │        │       REST Backend         │
│                          │  HTTPS │      (hosted on Render)    │
│  content.js              │ ─────► │                            │
│   • captures selection   │  JSON  │  /api/health               │
│   • extracts page text   │        │  /api/summarize            │
│  background.js           │ ◄───── │  /api/flowchart            │
│   • opens side panel     │        │  /api/roadmap              │
│   • stores selection     │        │            │               │
│  sidebar.html/js/css     │        │            ▼               │
│   • UI + API calls       │        │   Groq · Llama 3.3 70B     │
└──────────────────────────┘        └────────────────────────────┘
```

1. **`content.js`** runs on every page. It listens for text selection and answers requests to extract the full page text.
2. **`background.js`** (service worker) opens the side panel when the toolbar icon is clicked and stores the latest selection in `chrome.storage.local`.
3. **`sidebar.js`** reads the text, calls the backend, and renders the result as a summary card, flowchart nodes, or roadmap cards.
4. The **backend** prompts Llama 3.3 70B on Groq and returns **structured JSON**, which the UI turns into the visual components.

---

## 🛠 Tech Stack

- **Extension:** Manifest V3, Side Panel API, content scripts, service worker, vanilla JS/HTML/CSS
- **Backend:** REST API hosted on Render
- **LLM:** Llama 3.3 70B (`llama-3.3-70b-versatile`) via Groq
- **Uptime:** UptimeRobot pinging `/api/health` every 5 minutes to avoid free-tier cold starts

---

## 🔌 API Reference

Base URL: `https://summai-backend.onrender.com`

### `GET /api/health`
Lightweight health check (no LLM call).
```json
{ "status": "ok" }
```

### `POST /api/summarize`
```json
// request
{ "text": "…", "summary_type": "brief | detailed | bullet" }

// response
{
  "success": true,
  "summary": "…",
  "original_length": 1200,
  "summary_length": 180
}
```

### `POST /api/flowchart`
```json
// request
{ "text": "…" }

// response
{
  "success": true,
  "nodes": [
    { "id": 1, "title": "…", "type": "Introduction", "mini_summary": "…" }
  ],
  "final_summary": "…"
}
```

### `POST /api/roadmap`
```json
// request
{ "text": "…" }

// response
{
  "success": true,
  "topics": ["Topic A", "Topic B"],
  "roadmap": {
    "Topic A": ["Step 1", "Step 2"],
    "Topic B": ["Step 1", "Step 2"]
  }
}
```

On failure, endpoints return `{ "success": false, "error": "…" }`.

---

## 🚀 Getting Started

### Option 1: Install from the store
Get it from the [Edge Add-ons page](https://microsoftedge.microsoft.com/addons/detail/summai-%E2%80%93-text-summarizer/iilhbdhbacoojhhfhfagokiilglafjhj), pin it to the toolbar, and click the icon to open the side panel.

### Option 2: Load it locally (for development)
1. Clone the repo:
   ```bash
   git clone https://github.com/Varshitcode14/SummAI-Microsoft-Edge-Extension.git
   ```
2. Open `edge://extensions/` and turn on **Developer mode**.
3. Click **Load unpacked** and select the extension folder (the one containing `manifest.json`).
4. Pin SummAI to the toolbar and click the icon.

### Running your own backend
Point the `API` constant at the top of `sidebar.js` (and `host_permissions` in `manifest.json`) to your own deployment, then set your Groq API key as an environment variable on the host (for example `GROQ_API_KEY`). Get a free key at [console.groq.com](https://console.groq.com).

---

## 📁 Project Structure

```
SummAI-Extension/
├── manifest.json     # MV3 config: permissions, side panel, content script
├── background.js     # Service worker: opens side panel, stores selection
├── content.js        # Selection capture + full-page text extraction
├── sidebar.html      # Side panel layout (3 tabs)
├── sidebar.js        # Tab logic, API calls, result rendering
├── sidebar.css       # Dark UI theme
└── icons/            # 16, 32, 48, 128 px icons
```

**Permissions used:** `activeTab`, `scripting`, `sidePanel`, `storage`, plus host access to the SummAI backend only.

---

## 🔒 Privacy

Text is only sent to the backend when you click **Summarize**, **Generate Flowchart**, or **Generate Roadmap**. Nothing is sent automatically while you browse. The latest text selection is kept locally in your browser's extension storage so the side panel can read it.

---

## 🗺 Roadmap

- [ ] Export flowcharts and roadmaps as image/PDF
- [ ] Summary history
- [ ] Language selection for summaries
- [ ] Right-click "Summarize selection" context menu
- [ ] Support for PDFs opened in the browser

---

## ⚠️ Notes

- The backend runs on a free tier, so the first request after a long idle period can be slow.
- Very long pages are truncated to 8,000 characters before summarization.
- Groq occasionally retires models; if you see a `model_not_found` error on your own deployment, update the model name in the backend's LLM service.

---

## 👤 Author

**Varshit**: [GitHub](https://github.com/Varshitcode14)

If SummAI helps you, a ⭐ on the repo goes a long way.
