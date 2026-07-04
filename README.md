# FinTrack₵ Frontend

MoMo personal finance intelligence for Ghana. Upload MTN Mobile Money PDF statements and explore spending, categories, fees, e-levy, and trends.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS (Precise Logic design tokens)
- TanStack Query (server state)
- Zustand (auth + UI)
- React Router, Axios, Recharts, react-hook-form + Zod

## Prerequisites

- Node.js 20+ recommended
- FinTrack backend running (default `http://localhost:3000`)

See `plan/backend-eguide.md` for the API contract the frontend expects.

## Setup

```bash
npm install
cp .env.example .env.local
```

`.env.local`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

If you omit `VITE_API_URL`, the Vite dev server proxies `/api` to `http://localhost:3000` (see `vite.config.ts`).

## Scripts

```bash
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle
npm run preview  # serve dist/
npm run lint     # ESLint
```

## App routes

| Path | Access |
|---|---|
| `/` | Public landing |
| `/login`, `/register` | Public auth |
| `/onboarding` | Authenticated, no statements yet |
| `/dashboard`, `/transactions`, `/analytics`, `/statements`, `/categories`, `/settings` | Authenticated, has statements |

Session restore uses an httpOnly refresh cookie (`POST /auth/refresh`) on boot. The access token is kept in memory only.

## Project layout

```
src/
  api/           # Axios client + endpoint modules
  components/    # layout, ui, charts, landing, auth
  hooks/         # TanStack Query hooks
  pages/         # route screens
  router/        # routes, ProtectedRoute, RequireStatements
  store/         # Zustand auth + UI
  types/         # API types
  utils/         # currency, dates, csv, errors
```

## Docs in this repo

| File | Purpose |
|---|---|
| `plan/backend-eguide.md` | Backend API contract for sync |
| `plan/finishing-touches.md` | Product polish checklist |
| `instructions.md` | Original frontend build guide |
| `plan/stitch_finora_personal_finance_intelligence/` | Landing design source (Finora → FinTrack₵) |

## Notes

- Design tokens live in `tailwind.config.ts` and `src/index.css`.
- Money fields: strings on statements/transactions, numbers on analytics (see backend guide).
- CORS + credentials must be enabled on the backend for local auth cookies.
