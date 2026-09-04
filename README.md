# Examplus

> JEE Advanced AI Study & Mock Test Platform — a full-stack TypeScript app
> that pairs a React/Vite front end with an Express + Google Gemini back
> end to deliver AI-powered JEE Advanced mock tests, proctored exam rooms,
> focus analytics, and a handpicked study library.

![stack](https://img.shields.io/badge/stack-React%2019%20%2B%20Vite%206%20%2B%20Express%204%20%2B%20TypeScript-0b3d91)
![runtime](https://img.shields.io/badge/runtime-Node%2020%2B-3c873a)
![ai](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)

---

## What it does

Examplus is built first and foremost for **JEE Advanced** aspirants, with
secondary support for NEET, SAT, school board, and Olympiad preparation.
It combines:

- **Live exam room** with a strict focus mode, fullscreen lock, and proctoring.
- **AI Question Solver** that takes a typed question or an image (photo of the
  problem) and returns a step-by-step solution, key concept, common pitfalls,
  and a 10-second elimination trick.
- **Doubt Chat** — a 24/7 empathetic AI tutor that answers follow-up questions
  in under 250 words.
- **Focus Cam** — a webcam-based engagement analyser that detects deep focus,
  fatigue, boredom, and frustration, then suggests a recovery action
  (hydration, breathing exercise, switching to AI solver, etc.).
- **AI Proctor Audit** that scores the integrity of a finished attempt based on
  the proctoring flags collected during the session.
- **Daily Accountability** that rates the day (Productive Legend / Average /
  Unfocused / Wasted) and serves a roast-or-praise with a plan for tomorrow.
- **AI Test Generator** for teachers — produces a fresh multi-MCQ paper on any
  topic at any difficulty in seconds.
- **PDF → Online Test Converter** — upload a question paper (PDF or text) and
  Examplus parses it into a fully structured mock test with marks, negative
  marking, and step-by-step solutions.
- **To-Do Proof Verification** — submit study-task completion with optional
  photo evidence; the AI grades the credibility and awards streak bonus points.
- **Study Library** with PDF books/handbooks, **Notice Board** for announcements,
  and a **Student Profile** with weak-topic tracking, percentiles, and streak.

Two roles ship in the app: `student` and `admin`. The admin panel manages
exams, books, notices, and candidate records.

---

## Tech stack

| Layer        | Tech                                                                 |
|--------------|----------------------------------------------------------------------|
| Front-end    | React 19, Vite 6, Tailwind CSS 4, Motion, Recharts, Lucide icons    |
| Back-end     | Node.js 20+, Express 4, TypeScript                                  |
| AI           | Google Gemini (`gemini-2.0-flash` via `@google/genai`)              |
| Build        | `vite build` for the client, `esbuild` for the local prod server    |
| Deployment   | Vercel — static front end + serverless `api/` function              |

---

## Project structure

```
.
├── api/
│   └── index.ts          # Vercel serverless function (wraps createApp)
├── src/                  # React front end
│   ├── App.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── ai-solver/
│   │   ├── exam/
│   │   ├── focus-tracker/
│   │   ├── library/
│   │   ├── notices/
│   │   └── profile/
│   ├── data/             # Mock data (exams, books, profile, notices)
│   └── utils/
├── index.html
├── server.ts             # Express app + local dev server
├── vercel.json           # Vercel build + rewrite config
├── vite.config.ts
├── tailwind.config (via @tailwindcss/vite)
└── package.json
```

---

## Run locally

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Install
npm install

# 2. Add your Gemini API key
cp .env.example .env
# then edit .env and set:
#   GEMINI_API_KEY=your_key_here
# (The app also runs without the key — every AI endpoint has a high-quality
#  algorithmic fallback so the UI never breaks during demos.)

# 3. Start the dev server (Vite + Express on http://localhost:3000)
npm run dev
```

### Other scripts

```bash
npm run build      # Vite build + bundle server.cjs for local prod
npm start          # Run the bundled server from dist/server.cjs
npm run preview    # Serve the built dist/ statically
npm run lint       # Type-check only
```

---

## API surface

All endpoints are mounted under `/api/`. JSON in, JSON out.

| Method | Path                            | Purpose                                       |
|--------|---------------------------------|-----------------------------------------------|
| GET    | `/api/health`                   | Liveness check                                |
| POST   | `/api/ai/solve`                 | Solve a question (text or image)              |
| POST   | `/api/ai/doubt-chat`            | Conversational follow-up tutor                |
| POST   | `/api/ai/facial-analysis`       | Webcam frame → engagement / emotion metrics   |
| POST   | `/api/ai/proctor-audit`         | End-of-exam integrity audit                   |
| POST   | `/api/ai/daily-accountability`  | Daily productivity review + tomorrow plan     |
| POST   | `/api/ai/generate-test-questions` | Fresh MCQ paper on a topic                  |
| POST   | `/api/ai/parse-exam-pdf`        | PDF / text → structured online test           |
| POST   | `/api/ai/verify-todo-proof`     | Verify study-task completion evidence         |

Every endpoint is a thin wrapper around a Gemini prompt with strict JSON
response schemas. If `GEMINI_API_KEY` is missing, the endpoint returns a
deterministic fallback so the UI keeps working.

---

## Deploy to Vercel

The project ships with a Vercel-ready setup out of the box.

1. Push this repository to GitHub (already done).
2. Go to <https://vercel.com/new> and **Import** the repo
   `d3948200054-oss/test-app`.
3. Vercel auto-detects Vite. Keep the defaults:
   - **Framework Preset:** Vite
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
4. **Project Name:** set this to `preppy-test` to get
   `https://preppy-test.vercel.app` as the production URL.
5. Open **Environment Variables** and add:
   - `GEMINI_API_KEY` — your Google Gemini API key.
6. Click **Deploy**. Vercel will:
   - Build the front end into `dist/`.
   - Compile `api/index.ts` as a serverless function that handles every
     `/api/*` request.
   - Rewrite every other path to `index.html` for client-side routing.

Subsequent pushes to `main` trigger automatic redeploys.

---

## Environment variables

| Name              | Required | Description                                              |
|-------------------|----------|----------------------------------------------------------|
| `GEMINI_API_KEY`  | No       | Google Gemini API key. Without it, fallbacks are used.   |
| `NODE_ENV`        | No       | Set automatically by Vercel. Leave `development` locally. |

---

## License

MIT — see source for details.
