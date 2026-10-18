# LabVIEW Academy & Nigel AI Mentor

An interactive learning platform for LabVIEW, automated test engineering and Nigel AI prompting:
a curriculum, a dataflow simulator with hands-on labs, CLAD/CLD/CLA exam prep, a certification
readiness tracker, a resource library, and AI mentors backed by Google Gemini.

![Certification radar chart](docs/screenshots/radar-chart-full.png)

## Quick start

Requires Node.js **22.18+** (see `.nvmrc`).

```bash
npm install
cp .env.example .env     # optional: add GEMINI_API_KEY for live AI answers
npm run dev              # http://localhost:3000
```

Without `GEMINI_API_KEY` the app still works: the Mentor and Nigel Studio endpoints return
built-in offline answers, and the navbar shows that AI is offline.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Express + Vite dev server with HMR |
| `npm run build` | Production client build into `dist/` |
| `npm start` | Serve `dist/` and the API in production mode (run `build` first) |
| `npm run lint` | Type-check (`tsc --noEmit`, strict) |
| `npm test` | Unit + API tests (Node's built-in runner) |
| `npm run check` | lint, test and build, the same as CI |

## Configuration

All optional; see [.env.example](.env.example).

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | none | Enables live Gemini responses |
| `GEMINI_MODEL` | `gemini-3.8-flash` | Model used by the server |
| `PORT` | `3000` | HTTP port |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` | `30` / `60000` | Per-IP budget for AI endpoints |

## Architecture

```
server.ts            bootstrap: env, Vite (dev) or static dist (prod), graceful shutdown
server/
  app.ts             createApp(config, ai): routes, security headers, error handling
  validation.ts      request validation and size limits (pure, unit-tested)
  rateLimit.ts       in-memory per-IP fixed-window limiter
  gemini.ts          AiClient seam over @google/genai (null when no key)
  personas.ts        mentor system prompts and offline answers
  nigelFallback.ts   offline blueprint + validation of model JSON output
src/
  App.tsx            shell, persisted progress state, lazy-loaded views
  components/        one view per tab, plus ErrorBoundary
  data/              static curriculum, labs, exam and resource content
  utils/             pure logic (simulator engine, tracker, prompt evaluator, storage), tested
  types/             types shared by client and server
```

Design notes:

- **API** exposes `GET /api/health`, `POST /api/mentor/chat` and `POST /api/nigel/assist`.
  Inputs are validated (400 on bad input), student text is fenced as untrusted data in prompts,
  model output is validated before being returned, and upstream failures map to 502 without
  leaking details.
- **Testability**: routes are exercised in-process with a fake `AiClient`, so tests never touch
  the network.
- **Progress** (milestones, labs, skills) persists to `localStorage` and tolerates corrupt or
  blocked storage.
- Views are code-split with `React.lazy`; a per-view error boundary keeps one crash from
  blanking the app.

## Deployment notes

- The rate limiter is in-memory, which is fine for one instance. Use a shared store if you scale out.
- `trust proxy` is set to `1` (single reverse proxy such as Cloud Run); adjust for other topologies.

## Screenshots

See [docs/screenshots](docs/screenshots).
