# FinTrack₵ — Definitive Frontend Build Guide

> **App:** FinTrack₵ — MoMo personal finance intelligence for Ghana  
> **Stack:** React 18 · TypeScript · Vite · Tailwind CSS · TanStack Query · Zustand · Recharts · React Router v6  
> **Design source:** Stitch output — "Precise Logic" design system  
> **Responsive strategy:** Mobile-first, single codebase — layout transforms at `lg:` (1024px) breakpoint

---

## Architectural Decisions — Read This First

Every structural decision is made here. Do not change these mid-build.

### Decision 1 — Vite, not Create React App

**Chosen:** Vite  
**Why:** CRA is deprecated. Vite is 10–100× faster in development, supports TypeScript natively, and is the current industry standard. Build times matter when you're actively developing.

### Decision 2 — Tailwind CSS, not CSS Modules or styled-components

**Chosen:** Tailwind CSS with the Stitch design system tokens extended into `tailwind.config.ts`  
**Why:** Stitch generated Tailwind classes. Translating those directly to React means the component code matches the design code exactly. Every colour, spacing, and radius token from the DESIGN.md lives in one config file.

### Decision 3 — TanStack Query for all server state

**Chosen:** TanStack Query (React Query v5)  
**Rejected:** useState + useEffect for API calls  
**Why:** TanStack Query gives you caching, background refetching, loading states, error states, and optimistic updates for free. Without it, every page becomes a tangle of `useEffect` cleanup functions. With it, data fetching is 5 lines.

### Decision 4 — Zustand for client state only

**Chosen:** Zustand for auth state (access token, user) and UI state (dark mode toggle, sidebar collapsed)  
**Rejected:** Redux, Context API for everything  
**Why:** Redux is overkill for this app. Zustand is 3–5 lines to set up, works perfectly with TypeScript, and never causes the re-render cascades that Context does. Server state lives in TanStack Query. Client state lives in Zustand. These two never overlap.

### Decision 5 — Single codebase, two layouts (not two apps)

**Chosen:** One React app where layout components swap at the `lg:` breakpoint  
**Rejected:** Separate mobile/desktop codebases, React Native for mobile  
**Why:** The Stitch designs share all components — cards, badges, transaction rows, charts. Only the navigation and column structure change between mobile and desktop. A responsive layout wrapper handles this with Tailwind's `lg:` prefix. You write each component once.

### Decision 6 — Recharts for all charts

**Chosen:** Recharts  
**Why:** Recharts is React-native (not a Canvas wrapper), fully TypeScript typed, composable, and renders beautifully with the design system colours. The bar chart, line chart, and area chart you need are all first-class Recharts components. No D3 needed.

### Decision 7 — React Router v6 with nested routes

**Chosen:** React Router v6 with layout routes  
**Why:** The sidebar/topbar layout wraps all authenticated pages. A layout route in React Router v6 renders the shell once and swaps only the `<Outlet />` content per page — no prop drilling, no repeated layout code.

### Decision 8 — Axios instance, not raw fetch

**Chosen:** Axios with a configured instance  
**Why:** Axios handles request/response interceptors cleanly. The interceptor automatically attaches the `Authorization: Bearer <token>` header to every request and handles 401 errors by attempting a token refresh before retrying. This is impossible to do cleanly with raw fetch without significant boilerplate.

---

## Design System — Extracted from Stitch DESIGN.md

These are the exact tokens from your Stitch output. They go directly into `tailwind.config.ts`.

### Colour Palette

```
Primary green:     #00694c   (income, positive, active nav)
Primary container: #008560   (green button hover)
Inverse primary:   #68dbae   (dark mode green)

Secondary blue:    #0060a8   (transfers, info)
Tertiary purple:   #554cb9   (loans, subscriptions)
Error red:         #ba1a1a   (debits, spend, errors)
Amber:             #EF9F27   (warnings, cash out)

Surface (page bg): #f8f9ff
Surface card:      #ffffff
Surface low:       #eff4ff
Surface container: #e5eeff

Text primary:      #0b1c2f
Text secondary:    #3d4943
Text muted:        #6d7a73

Border default:    rgba(0,0,0,0.08)
Border variant:    #bccac1
```

### Typography Scale

```
h1: Inter 28px / 600 / line-height 34px / letter-spacing -0.02em
h2: Inter 22px / 600 / line-height 28px / letter-spacing -0.01em
h3: Inter 18px / 600 / line-height 24px
h4: Inter 15px / 500 / line-height 20px
body-reg: Inter 14px / 400 / line-height 20px
body-mid: Inter 14px / 500 / line-height 20px
body-sm: Inter 13px / 400 / line-height 18px
label: Inter 12px / 600 / line-height 16px
```

### Spacing & Radius

```
Spacing: xs=4px, sm=8px, md=16px, lg=24px, xl=32px, gutter=20px
Radius: sm=4px, DEFAULT=8px, md=12px, lg=16px, xl=24px, full=9999px
Card shadow: 0px 2px 4px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.02)
```

### Dark Mode Tokens

```
Page bg:     #141C26   (dark navy)
Card bg:     #1A2535   (slightly lighter navy)
Card bg alt: #212E40   (inputs, hover states)
Text:        #E8EDF3   (primary)
Text muted:  #8A9BB0   (secondary)
Border:      rgba(255,255,255,0.08)
Green:       #68dbae   (inverse-primary — same green, lighter shade)
```

---

## Project Structure — Final

```
fintrack-frontend/
├── public/
│   └── favicon.svg                     ← ₵ mark as SVG favicon
├── src/
│   ├── api/
│   │   ├── axios.ts                    ← configured Axios instance + interceptors
│   │   ├── auth.api.ts
│   │   ├── statements.api.ts
│   │   ├── transactions.api.ts
│   │   ├── categories.api.ts
│   │   └── analytics.api.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx            ← decides sidebar vs bottom nav
│   │   │   ├── Sidebar.tsx             ← desktop: 240px fixed left nav
│   │   │   ├── TopBar.tsx              ← desktop: 60px fixed top bar
│   │   │   ├── BottomNav.tsx           ← mobile: fixed 80px bottom nav
│   │   │   └── MobileHeader.tsx        ← mobile: fixed 64px top header
│   │   ├── ui/
│   │   │   ├── MetricCard.tsx          ← 4-up stat cards on dashboard
│   │   │   ├── CategoryBar.tsx         ← horizontal bar with label + amount
│   │   │   ├── TransactionRow.tsx      ← single transaction list item
│   │   │   ├── TransactionBadge.tsx    ← DEBIT / CASH_IN / TRANSFER pills
│   │   │   ├── CategoryDot.tsx         ← coloured dot for category
│   │   │   ├── EmptyState.tsx          ← empty page illustration + CTA
│   │   │   ├── SkeletonCard.tsx        ← loading skeleton for cards
│   │   │   ├── UploadZone.tsx          ← drag-and-drop PDF upload area
│   │   │   ├── Button.tsx              ← primary / outlined / ghost variants
│   │   │   ├── Input.tsx               ← text input with label + error
│   │   │   ├── Select.tsx              ← dropdown select
│   │   │   ├── Modal.tsx               ← overlay modal with backdrop
│   │   │   ├── Toast.tsx               ← success/error notification
│   │   │   └── ThemeToggle.tsx         ← dark/light mode switch
│   │   └── charts/
│   │       ├── SpendingBarChart.tsx    ← category breakdown bars
│   │       ├── BalanceLineChart.tsx    ← balance over time area chart
│   │       ├── TrendGroupedChart.tsx   ← month-on-month grouped bars
│   │       └── SpendingHeatmap.tsx     ← calendar heatmap
│   ├── hooks/
│   │   ├── useAuth.ts                  ← login, register, logout, token refresh
│   │   ├── useDashboard.ts             ← analytics summary query
│   │   ├── useTransactions.ts          ← paginated filtered transactions
│   │   ├── useStatements.ts            ← statements list + upload mutation
│   │   ├── useCategories.ts            ← categories + merchant cache
│   │   ├── useAnalytics.ts             ← trends, recurring, forecast
│   │   └── useMediaQuery.ts            ← isDesktop boolean hook
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── onboarding/
│   │   │   └── OnboardingPage.tsx      ← first upload flow
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── transactions/
│   │   │   └── TransactionsPage.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx
│   │   ├── statements/
│   │   │   └── StatementsPage.tsx
│   │   ├── categories/
│   │   │   └── CategoriesPage.tsx
│   │   └── settings/
│   │       └── SettingsPage.tsx
│   ├── router/
│   │   ├── index.tsx                   ← route definitions
│   │   └── ProtectedRoute.tsx          ← redirects to /login if no token
│   ├── store/
│   │   ├── auth.store.ts               ← Zustand: accessToken, user
│   │   └── ui.store.ts                 ← Zustand: darkMode, sidebarCollapsed
│   ├── types/
│   │   ├── api.types.ts                ← all API response shapes
│   │   └── ui.types.ts                 ← component prop types
│   ├── utils/
│   │   ├── currency.ts                 ← formatGHS(1234.50) → "GHS 1,234.50"
│   │   ├── date.ts                     ← formatDate, formatPeriod
│   │   └── category.ts                 ← category colour/icon maps
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                       ← Tailwind directives + global styles
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## TASK 0 — Project Bootstrap

**Branch:** `feature/frontend-bootstrap`

---

### 0.1 — Create the Vite project

```bash
npm create vite@latest fintrack-frontend -- --template react-ts
cd fintrack-frontend
npm install
```

---

### 0.2 — Install all dependencies

```bash
# Routing
npm install react-router-dom

# Server state
npm install @tanstack/react-query @tanstack/react-query-devtools

# Client state
npm install zustand

# HTTP
npm install axios

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Charts
npm install recharts

# File upload
npm install react-dropzone

# Date utilities
npm install date-fns

# Icons (Material Symbols via font — already in design system)
# No package needed — loaded via Google Fonts link in index.html

# Form validation
npm install react-hook-form @hookform/resolvers zod
```

---

### 0.3 — Configure Tailwind with design system tokens

Replace `tailwind.config.ts` — this is the complete design system from your Stitch DESIGN.md:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Stitch "Precise Logic" palette ──────────────────────────────
        primary:                   '#00694c',
        'primary-container':       '#008560',
        'on-primary':              '#ffffff',
        'on-primary-container':    '#f5fff7',
        'inverse-primary':         '#68dbae',  // dark mode green

        secondary:                 '#0060a8',
        'secondary-container':     '#5da9fe',
        'on-secondary':            '#ffffff',
        'on-secondary-container':  '#003d6d',

        tertiary:                  '#554cb9',
        'tertiary-container':      '#6e66d4',
        'on-tertiary':             '#ffffff',

        error:                     '#ba1a1a',
        'error-container':         '#ffdad6',
        'on-error':                '#ffffff',

        // Surfaces
        background:                '#f8f9ff',
        surface:                   '#f8f9ff',
        'surface-bright':          '#f8f9ff',
        'surface-container-lowest':'#ffffff',
        'surface-container-low':   '#eff4ff',
        'surface-container':       '#e5eeff',
        'surface-container-high':  '#dce9ff',
        'surface-container-highest':'#d3e4fe',
        'surface-dim':             '#cbdbf5',
        'surface-variant':         '#d3e4fe',
        'inverse-surface':         '#213145',
        'inverse-on-surface':      '#eaf1ff',

        // Text
        'on-surface':              '#0b1c2f',
        'on-surface-variant':      '#3d4943',
        'on-background':           '#0b1c2f',

        // Borders
        outline:                   '#6d7a73',
        'outline-variant':         '#bccac1',

        // Semantic aliases (easier to use in components)
        'color-income':            '#00694c',
        'color-debit':             '#ba1a1a',
        'color-transfer':          '#0060a8',
        'color-cash-out':          '#EF9F27',
        'color-loan':              '#554cb9',
        'color-data':              '#185FA5',
        'color-airtime':           '#378ADD',
        'color-uncategorised':     '#6d7a73',

        // Dark mode surfaces
        'dark-bg':                 '#141C26',
        'dark-surface':            '#1A2535',
        'dark-surface-alt':        '#212E40',
        'dark-border':             'rgba(255,255,255,0.08)',
        'dark-text':               '#E8EDF3',
        'dark-muted':              '#8A9BB0',
      },

      fontSize: {
        'h1':       ['28px', { lineHeight: '34px', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h2':       ['22px', { lineHeight: '28px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h3':       ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'h4':       ['15px', { lineHeight: '20px', fontWeight: '500' }],
        'body-reg': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-mid': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-sm':  ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'label':    ['12px', { lineHeight: '16px', fontWeight: '600' }],
      },

      spacing: {
        'xs':     '4px',
        'sm':     '8px',
        'md':     '16px',
        'lg':     '24px',
        'xl':     '32px',
        'gutter': '20px',
      },

      borderRadius: {
        'sm':      '4px',
        DEFAULT:   '8px',
        'md':      '12px',
        'lg':      '16px',
        'xl':      '24px',
        'full':    '9999px',
      },

      boxShadow: {
        'card': '0px 2px 4px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.02)',
        'nav':  '0px -2px 10px rgba(0,0,0,0.02)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### 0.4 — Global CSS and fonts

Replace `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Import Inter from Google Fonts — add to index.html head */
  html {
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Smooth dark mode transition */
  *, *::before, *::after {
    transition-property: background-color, border-color;
    transition-duration: 150ms;
    transition-timing-function: ease;
  }

  /* Safe area for mobile bottom nav */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

@layer components {
  .card {
    @apply bg-surface-container-lowest rounded-md border border-[rgba(0,0,0,0.08)] shadow-card;
  }

  .dark .card {
    @apply bg-dark-surface border-[rgba(255,255,255,0.08)];
  }
}
```

Update `index.html` — add Inter font and Material Symbols to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

---

### 0.5 — Vite config

Replace `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

> **Why the proxy?** During development, your React app runs on port 5173 and your NestJS backend on port 3000. The proxy forwards `/api/*` requests to the backend, avoiding CORS issues in development. In production, Vercel handles this differently (environment variable for the backend URL).

**Task 0 complete checkpoint:** `npm run dev` → React app loads on `localhost:5173` with no errors. Tailwind classes work. Inter font renders correctly.

---

## TASK 1 — Types and API Layer

**What you are building:** TypeScript types for every API response, and an Axios instance with interceptors. All API calls live here — pages and hooks never call Axios directly.

**Branch:** `feature/api-layer`

---

### 1.1 — TypeScript types

Create `src/types/api.types.ts`:

```typescript
// ── Auth ──────────────────────────────────────────────────────────────────
export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id:        string;
  email:     string;
  fullName:  string | null;
  createdAt: string;
}

// ── Categories ────────────────────────────────────────────────────────────
export interface Category {
  id:       string;
  name:     string;
  icon:     string;
  color:    string;
  isIncome: boolean;
}

export interface MerchantCacheEntry {
  id:          string;
  merchantKey: string;
  categoryId:  string;
  source:      'RULES' | 'USER';
  category:    Category;
}

// ── Statements ────────────────────────────────────────────────────────────
export interface Statement {
  id:          string;
  userId:      string;
  msisdn:      string;
  periodStart: string;
  periodEnd:   string;
  totalDebit:  string;
  totalCredit: string;
  totalFees:   string;
  totalELevy:  string;
  uploadedAt:  string;
}

export interface UploadResult {
  statementId: string;
  msisdn:      string;
  period:      { start: string; end: string };
  totals:      { totalDebit: number; totalCredit: number; totalFees: number; totalELevy: number };
  summary:     { inserted: number; skipped: number; errors: number };
}

// ── Transactions ──────────────────────────────────────────────────────────
export type TransactionType =
  | 'DEBIT' | 'CREDIT' | 'TRANSFER'
  | 'CASH_IN' | 'CASH_OUT' | 'PAYMENT' | 'ADJUSTMENT';

export interface Transaction {
  id:              string;
  statementId:     string;
  userId:          string;
  categoryId:      string | null;
  transactionDate: string;
  transType:       TransactionType;
  amount:          string;
  fees:            string;
  eLevy:           string;
  balanceBefore:   string | null;
  balanceAfter:    string | null;
  merchantName:    string | null;
  merchantNumber:  string | null;
  channel:         string | null;
  refId:           string | null;
  category:        Category | null;
}

export interface PaginatedTransactions {
  data: Transaction[];
  meta: {
    total:   number;
    page:    number;
    limit:   number;
    pages:   number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TransactionFilters {
  categoryId?:  string;
  transType?:   string;
  statementId?: string;
  dateFrom?:    string;
  dateTo?:      string;
  search?:      string;
  page?:        number;
  limit?:       number;
}

// ── Analytics ─────────────────────────────────────────────────────────────
export interface CategoryBreakdownItem {
  name:       string;
  color:      string;
  icon:       string;
  total:      number;
  count:      number;
  percentage: number;
}

export interface BalancePoint {
  date:    string;
  balance: number;
}

export interface MonthlySummary {
  totalSpent:       number;
  totalReceived:    number;
  netPosition:      number;
  totalFees:        number;
  totalELevy:       number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdownItem[];
  balanceTimeline:   BalancePoint[];
}

export interface MonthTrend extends MonthlySummary {
  statementId:  string;
  periodStart:  string;
  periodEnd:    string;
  periodLabel:  string;
}

export interface RecurringPayment {
  merchantName:  string;
  category:      string;
  occurrences:   number;
  averageAmount: number;
  lastSeen:      string;
  nextExpected:  string | null;
}

export interface BalanceForecast {
  currentBalance:            number | null;
  dailyAverageSpend:         number;
  forecastedSpendRemaining:  number;
  forecastedEndBalance:      number | null;
  daysLeft:                  number;
  willRunLow:                boolean;
}
```

---

### 1.2 — Axios instance with interceptors

Create `src/api/axios.ts`:

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export const api = axios.create({
  baseURL:         BASE_URL,
  withCredentials: true, // send httpOnly refresh cookie on every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor — attach access token ─────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — refresh token on 401 ───────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: Error) => void }> = [];

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry  = true;
      isRefreshing     = true;

      try {
        // POST /auth/refresh reads the httpOnly refresh cookie automatically
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
        const { accessToken } = data;
        useAuthStore.getState().setAccessToken(accessToken);
        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
```

---

### 1.3 — API functions

Create `src/api/auth.api.ts`:

```typescript
import { api } from './axios';
import type { AuthResponse, User } from '@/types/api.types';

export const authApi = {
  register: (data: { email: string; password: string; fullName?: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  getMe: () =>
    api.get<User>('/users/me').then((r) => r.data),

  updateMe: (data: { fullName?: string }) =>
    api.patch<User>('/users/me', data).then((r) => r.data),
};
```

Create `src/api/statements.api.ts`:

```typescript
import { api } from './axios';
import type { Statement, UploadResult } from '@/types/api.types';

export const statementsApi = {
  getAll: () =>
    api.get<Statement[]>('/statements').then((r) => r.data),

  getById: (id: string) =>
    api.get<Statement>(`/statements/${id}`).then((r) => r.data),

  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<UploadResult>('/statements/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
};
```

Create `src/api/transactions.api.ts`:

```typescript
import { api } from './axios';
import type { PaginatedTransactions, Transaction, TransactionFilters } from '@/types/api.types';

export const transactionsApi = {
  getAll: (filters: TransactionFilters = {}) =>
    api.get<PaginatedTransactions>('/transactions', { params: filters }).then((r) => r.data),

  updateCategory: (id: string, categoryId: string) =>
    api.patch<Transaction>(`/transactions/${id}/category`, { categoryId }).then((r) => r.data),
};
```

Create `src/api/analytics.api.ts`:

```typescript
import { api } from './axios';
import type { MonthlySummary, MonthTrend, RecurringPayment, BalanceForecast } from '@/types/api.types';

export const analyticsApi = {
  getSummary: (statementId?: string) =>
    api.get<MonthlySummary>('/analytics/summary', { params: { statementId } }).then((r) => r.data),

  getTrends: () =>
    api.get<MonthTrend[]>('/analytics/trends').then((r) => r.data),

  getRecurring: () =>
    api.get<RecurringPayment[]>('/analytics/recurring').then((r) => r.data),

  getForecast: () =>
    api.get<BalanceForecast>('/analytics/forecast').then((r) => r.data),
};
```

Create `src/api/categories.api.ts`:

```typescript
import { api } from './axios';
import type { Category, MerchantCacheEntry } from '@/types/api.types';

export const categoriesApi = {
  getAll: () =>
    api.get<Category[]>('/categories').then((r) => r.data),

  getMerchantCache: () =>
    api.get<MerchantCacheEntry[]>('/categories/merchant-cache').then((r) => r.data),

  assignMerchant: (merchantKey: string, categoryId: string) =>
    api.post('/categories/merchant-cache', { merchantKey, categoryId }).then((r) => r.data),
};
```

**Task 1 complete checkpoint:** TypeScript shows no errors on all API files. The Axios interceptor correctly attaches `Authorization: Bearer` on every request.

---

## TASK 2 — Zustand Stores

**What you are building:** Global client state — auth token + user, dark mode, sidebar state.

**Branch:** `feature/state`

---

### 2.1 — Auth store

Create `src/store/auth.store.ts`:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/api.types';

interface AuthState {
  accessToken: string | null;
  user:        User | null;
  setAccessToken: (token: string) => void;
  setUser:        (user: User)    => void;
  logout:         ()              => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user:        null,

      setAccessToken: (token) => set({ accessToken: token }),
      setUser:        (user)  => set({ user }),

      logout: () => {
        set({ accessToken: null, user: null });
      },
    }),
    {
      name:    'fintrack-auth',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the user object — access token dies with the session
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
```

> **Why sessionStorage, not localStorage?** The access token is deliberately NOT persisted (it's kept in memory only via React state). Only the user profile object is persisted to sessionStorage so the user's name shows on page refresh. If the tab closes, the user must log in again, which triggers a new access token from the refresh cookie.

---

### 2.2 — UI store

Create `src/store/ui.store.ts`:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  darkMode:         boolean;
  sidebarCollapsed: boolean;
  toggleDarkMode:   ()      => void;
  toggleSidebar:    ()      => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode:         false,
      sidebarCollapsed: false,

      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          // Apply to html element for Tailwind dark mode
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name:    'fintrack-ui',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Apply dark mode class on page load from persisted state
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    },
  ),
);
```

---

## TASK 3 — Utility Functions

**What you are building:** The currency formatter and date utilities used in every component.

**Branch:** `feature/utils`

---

### 3.1 — Currency formatter

Create `src/utils/currency.ts`:

```typescript
/**
 * Formats a number or string as Ghana Cedis.
 * formatGHS(2131)       → "GHS 2,131.00"
 * formatGHS('1010.00')  → "GHS 1,010.00"
 * formatGHS(-120)       → "-GHS 120.00"
 */
export function formatGHS(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return 'GHS 0.00';

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'GHS 0.00';

  const abs      = Math.abs(num);
  const sign     = num < 0 ? '-' : '';
  const formatted = abs.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${sign}GHS ${formatted}`;
}

/**
 * Formats with explicit +/- sign for change indicators.
 * formatGHSChange(553)  → "+GHS 553.00"
 * formatGHSChange(-120) → "-GHS 120.00"
 */
export function formatGHSChange(value: number): string {
  const sign     = value >= 0 ? '+' : '-';
  const abs      = Math.abs(value);
  const formatted = abs.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}GHS ${formatted}`;
}

/**
 * Formats a percentage change with sign.
 * formatPct(12.5)  → "+12.5%"
 * formatPct(-8)    → "-8.0%"
 */
export function formatPct(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
```

---

### 3.2 — Date utilities

Create `src/utils/date.ts`:

```typescript
import { format, parseISO, isValid } from 'date-fns';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, 'd MMM yyyy'); // "28 Apr 2026"
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, 'd MMM, HH:mm'); // "28 Apr, 07:06"
}

export function formatPeriod(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, 'MMMM yyyy'); // "April 2026"
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, 'd MMM'); // "28 Apr"
}
```

---

### 3.3 — Category utilities

Create `src/utils/category.ts`:

```typescript
// Maps category names to their design-system colours
export const CATEGORY_COLORS: Record<string, string> = {
  'Shopping / POS':    '#ba1a1a',  // error red
  'Cash Withdrawal':   '#EF9F27',  // amber
  'Data Bundles':      '#185FA5',  // dark blue
  'Airtime / Data':    '#378ADD',  // blue
  'Loan Repayment':    '#554cb9',  // tertiary purple
  'Person-to-Person':  '#00694c',  // primary green
  'Bank Transfer':     '#0060a8',  // secondary blue
  'Utilities':         '#6d7a73',  // outline gray
  'Income':            '#00694c',  // primary green
  'Uncategorised':     '#6d7a73',  // muted
};

export function getCategoryColor(name: string | null | undefined): string {
  return CATEGORY_COLORS[name ?? ''] ?? '#6d7a73';
}

// Maps transaction types to badge colours
export const TRANS_TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  DEBIT:      { bg: 'rgba(186,26,26,0.1)', text: '#ba1a1a',  label: 'DEBIT'      },
  CREDIT:     { bg: 'rgba(0,105,76,0.1)',  text: '#00694c',  label: 'CREDIT'     },
  TRANSFER:   { bg: 'rgba(0,96,168,0.1)', text: '#0060a8',  label: 'TRANSFER'   },
  CASH_IN:    { bg: 'rgba(0,105,76,0.1)',  text: '#00694c',  label: 'CASH IN'    },
  CASH_OUT:   { bg: 'rgba(239,159,39,0.1)',text: '#EF9F27',  label: 'CASH OUT'   },
  PAYMENT:    { bg: 'rgba(85,76,185,0.1)', text: '#554cb9',  label: 'PAYMENT'    },
  ADJUSTMENT: { bg: 'rgba(0,105,76,0.1)',  text: '#00694c',  label: 'ADJUSTMENT' },
};

export function isIncomeType(transType: string): boolean {
  return ['CASH_IN', 'CREDIT', 'ADJUSTMENT'].includes(transType);
}
```

---

## TASK 4 — Custom Hooks

**What you are building:** Data fetching hooks using TanStack Query. Every page uses these — never calls the API directly.

**Branch:** `feature/hooks`

---

### 4.1 — Auth hook

Create `src/hooks/useAuth.ts`:

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

export function useLogin() {
  const { setAccessToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      const user = await authApi.getMe();
      setUser(user);
      navigate('/dashboard');
    },
  });
}

export function useRegister() {
  const { setAccessToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      const user = await authApi.getMe();
      setUser(user);
      navigate('/onboarding');
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate   = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      navigate('/login');
    },
  });
}

export function useMe() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['me'],
    queryFn:  authApi.getMe,
    enabled:  !!token,
  });
}
```

---

### 4.2 — Dashboard / analytics hook

Create `src/hooks/useDashboard.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics.api';

export function useSummary(statementId?: string) {
  return useQuery({
    queryKey: ['analytics', 'summary', statementId],
    queryFn:  () => analyticsApi.getSummary(statementId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTrends() {
  return useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn:  analyticsApi.getTrends,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecurring() {
  return useQuery({
    queryKey: ['analytics', 'recurring'],
    queryFn:  analyticsApi.getRecurring,
    staleTime: 5 * 60 * 1000,
  });
}

export function useForecast() {
  return useQuery({
    queryKey: ['analytics', 'forecast'],
    queryFn:  analyticsApi.getForecast,
    staleTime: 5 * 60 * 1000,
  });
}
```

---

### 4.3 — Transactions hook

Create `src/hooks/useTransactions.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions.api';
import type { TransactionFilters } from '@/types/api.types';

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn:  () => transactionsApi.getAll(filters),
    placeholderData: (prev) => prev, // keep showing previous data while loading next page
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, categoryId }: { id: string; categoryId: string }) =>
      transactionsApi.updateCategory(id, categoryId),
    onSuccess: () => {
      // Invalidate all transaction and analytics queries to reflect new categorisation
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
```

---

### 4.4 — Statements hook

Create `src/hooks/useStatements.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statementsApi } from '@/api/statements.api';

export function useStatements() {
  return useQuery({
    queryKey: ['statements'],
    queryFn:  statementsApi.getAll,
  });
}

export function useUploadStatement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: statementsApi.upload,
    onSuccess: () => {
      // After upload, refresh statements, transactions, and all analytics
      qc.invalidateQueries({ queryKey: ['statements'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
```

---

### 4.5 — Responsive hook

Create `src/hooks/useMediaQuery.ts`:

```typescript
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Convenience hook — true when viewport >= 1024px (Tailwind lg breakpoint)
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
```

---

## TASK 5 — Router and App Shell

**What you are building:** The routing structure and the responsive layout wrapper that switches between sidebar (desktop) and bottom nav (mobile).

**Branch:** `feature/router-layout`

---

### 5.1 — Protected route

Create `src/router/ProtectedRoute.tsx`:

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.accessToken);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
```

---

### 5.2 — Router

Create `src/router/index.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { TransactionsPage } from '@/pages/transactions/TransactionsPage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';
import { StatementsPage } from '@/pages/statements/StatementsPage';
import { CategoriesPage } from '@/pages/categories/CategoriesPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

export const router = createBrowserRouter([
  // Public routes — no shell, no auth
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // Protected routes — wrapped in AppShell
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/onboarding', element: <OnboardingPage /> },
      {
        element: <AppShell />,
        children: [
          { path: '/',              element: <DashboardPage /> },
          { path: '/dashboard',     element: <DashboardPage /> },
          { path: '/transactions',  element: <TransactionsPage /> },
          { path: '/analytics',     element: <AnalyticsPage /> },
          { path: '/statements',    element: <StatementsPage /> },
          { path: '/categories',    element: <CategoriesPage /> },
          { path: '/settings',      element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
```

---

### 5.3 — AppShell — the responsive layout core

Create `src/components/layout/AppShell.tsx`:

```typescript
import { Outlet } from 'react-router-dom';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { MobileHeader } from './MobileHeader';

export function AppShell() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      // Desktop: fixed sidebar left, fixed topbar top, scrollable content right
      <div className="flex h-screen bg-background dark:bg-dark-bg overflow-hidden">
        {/* Sidebar — 240px fixed */}
        <Sidebar />

        {/* Main area — fills remaining width */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto p-xl">
            <div className="max-w-[1240px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Mobile: fixed header top, bottom nav, scrollable content
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <MobileHeader />

      <main className="pt-16 pb-24 px-gutter">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
```

---

### 5.4 — Sidebar (desktop only)

Create `src/components/layout/Sidebar.tsx`:

```typescript
import { NavLink } from 'react-router-dom';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { path: '/dashboard',    icon: 'dashboard',    label: 'Dashboard'    },
  { path: '/transactions', icon: 'receipt_long', label: 'Transactions' },
  { path: '/analytics',    icon: 'analytics',    label: 'Analytics'    },
  { path: '/statements',   icon: 'description',  label: 'Statements'   },
  { path: '/categories',   icon: 'sell',         label: 'Categories'   },
  { path: '/settings',     icon: 'settings',     label: 'Settings'     },
] as const;

export function Sidebar() {
  const user          = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  return (
    <aside className="w-[240px] h-screen flex-shrink-0 flex flex-col
                      bg-surface-container-lowest dark:bg-dark-surface
                      border-r border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]">

      {/* Logo */}
      <div className="h-[60px] flex items-center px-lg border-b border-[rgba(0,0,0,0.06)]
                      dark:border-[rgba(255,255,255,0.06)]">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">₵</span>
        </div>
        <span className="ml-2.5 text-h4 font-semibold text-on-surface dark:text-dark-text tracking-tight">
          FinTrack₵
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-sm py-md space-y-xs overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
               text-body-mid font-medium
               ${isActive
                 ? 'bg-[rgba(0,105,76,0.1)] text-primary dark:text-inverse-primary border-l-3 border-primary'
                 : 'text-on-surface-variant dark:text-dark-muted hover:bg-surface-container-low dark:hover:bg-dark-surface-alt'
               }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-sm py-md border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-label font-bold">
              {(user?.fullName ?? user?.email ?? 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-on-surface dark:text-dark-text truncate">
              {user?.fullName ?? 'My Account'}
            </p>
            <p className="text-label text-outline dark:text-dark-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg
                     text-body-sm text-outline dark:text-dark-muted
                     hover:bg-surface-container-low dark:hover:bg-dark-surface-alt
                     transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
```

---

### 5.5 — TopBar (desktop only)

Create `src/components/layout/TopBar.tsx`:

```typescript
import { useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/ui.store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transactions',
  '/analytics':    'Analytics',
  '/statements':   'Statements',
  '/categories':   'Categories',
  '/settings':     'Settings',
};

export function TopBar() {
  const { pathname } = useLocation();
  const title        = PAGE_TITLES[pathname] ?? 'FinTrack₵';

  return (
    <header className="h-[60px] flex-shrink-0 flex items-center justify-between px-xl
                       bg-surface-container-lowest dark:bg-dark-surface
                       border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
      <h1 className="text-h3 font-semibold text-on-surface dark:text-dark-text">{title}</h1>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="w-9 h-9 flex items-center justify-center rounded-full
                           hover:bg-surface-container-low dark:hover:bg-dark-surface-alt
                           transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant dark:text-dark-muted text-[20px]">
            notifications
          </span>
        </button>
      </div>
    </header>
  );
}
```

---

### 5.6 — BottomNav (mobile only)

Create `src/components/layout/BottomNav.tsx`:

```typescript
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard',    icon: 'dashboard',    label: 'Dashboard'   },
  { path: '/transactions', icon: 'receipt_long', label: 'Activity'    },
  { path: '/analytics',    icon: 'analytics',    label: 'Insights'    },
  { path: '/statements',   icon: 'description',  label: 'Reports'     },
  { path: '/settings',     icon: 'settings',     label: 'Settings'    },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe
                    bg-surface-container-lowest dark:bg-dark-surface
                    border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]
                    shadow-nav">
      <div className="flex justify-around items-center h-20 px-2">
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl
               transition-all duration-150 active:scale-95
               ${isActive
                 ? 'text-primary dark:text-inverse-primary bg-[rgba(0,105,76,0.08)]'
                 : 'text-outline dark:text-dark-muted hover:text-primary'
               }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span className="text-[11px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
```

---

### 5.7 — MobileHeader (mobile only)

Create `src/components/layout/MobileHeader.tsx`:

```typescript
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transactions',
  '/analytics':    'Analytics',
  '/statements':   'Statements',
  '/categories':   'Categories',
  '/settings':     'Settings',
};

export function MobileHeader() {
  const { pathname } = useLocation();
  const user         = useAuthStore((s) => s.user);
  const title        = PAGE_TITLES[pathname] ?? 'FinTrack₵';

  return (
    <header className="fixed top-0 w-full z-50 h-16
                       bg-surface-container-lowest dark:bg-dark-surface
                       border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]
                       shadow-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-label font-bold">
            {(user?.fullName ?? 'U').charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-h4 font-semibold text-on-surface dark:text-dark-text leading-tight">
            {title}
          </h1>
          {user && (
            <p className="text-label text-outline dark:text-dark-muted leading-tight">
              {user.fullName ?? user.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button className="w-9 h-9 flex items-center justify-center rounded-full
                           hover:bg-surface-container-low dark:hover:bg-dark-surface-alt">
          <span className="material-symbols-outlined text-on-surface-variant dark:text-dark-muted text-[20px]">
            notifications
          </span>
        </button>
      </div>
    </header>
  );
}
```

**Task 5 complete checkpoint:** Navigate between routes. On desktop (>1024px) the sidebar and topbar render. On mobile the bottom nav and header render. Dark mode toggle works. Unauthenticated routes redirect to `/login`.

---

## TASK 6 — Core UI Components

**What you are building:** The shared building blocks every page uses. Build these before any page.

**Branch:** `feature/ui-components`

---

### 6.1 — MetricCard

Create `src/components/ui/MetricCard.tsx`:

```typescript
interface MetricCardProps {
  label:    string;
  value:    string;
  change?:  string;
  variant?: 'default' | 'positive' | 'negative';
}

export function MetricCard({ label, value, change, variant = 'default' }: MetricCardProps) {
  const valueColor = {
    default:  'text-on-surface dark:text-dark-text',
    positive: 'text-primary dark:text-inverse-primary',
    negative: 'text-error',
  }[variant];

  const changeColor = {
    default:  'text-outline',
    positive: 'text-primary dark:text-inverse-primary',
    negative: 'text-error',
  }[variant];

  return (
    <div className="card p-4">
      <p className="text-label text-on-surface-variant dark:text-dark-muted mb-1 uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-h3 font-semibold ${valueColor} leading-tight`}>{value}</p>
      {change && (
        <p className={`text-body-sm mt-1 ${changeColor}`}>{change}</p>
      )}
    </div>
  );
}
```

---

### 6.2 — CategoryBar

Create `src/components/ui/CategoryBar.tsx`:

```typescript
import { formatGHS } from '@/utils/currency';

interface CategoryBarProps {
  name:       string;
  color:      string;
  amount:     number;
  percentage: number;
  count?:     number;
}

export function CategoryBar({ name, color, amount, percentage, count }: CategoryBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Colour dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-body-mid text-body-sm text-on-surface dark:text-dark-text truncate">
            {name}
          </span>
          <span className="text-label text-on-surface dark:text-dark-text ml-2 flex-shrink-0">
            {formatGHS(amount)}
          </span>
        </div>
        {/* Bar track */}
        <div className="h-1.5 w-full bg-surface-container dark:bg-dark-surface-alt rounded-full">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
          />
        </div>
        {count !== undefined && (
          <p className="text-label text-outline dark:text-dark-muted mt-0.5">
            {count} transaction{count !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Percentage */}
      <span className="text-label text-outline dark:text-dark-muted flex-shrink-0 w-10 text-right">
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}
```

---

### 6.3 — TransactionBadge

Create `src/components/ui/TransactionBadge.tsx`:

```typescript
import { TRANS_TYPE_STYLES } from '@/utils/category';
import type { TransactionType } from '@/types/api.types';

interface TransactionBadgeProps {
  type: TransactionType;
}

export function TransactionBadge({ type }: TransactionBadgeProps) {
  const style = TRANS_TYPE_STYLES[type] ?? TRANS_TYPE_STYLES.DEBIT;

  return (
    <span
      className="inline-block text-label px-2 py-0.5 rounded-full font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}
```

---

### 6.4 — TransactionRow

Create `src/components/ui/TransactionRow.tsx`:

```typescript
import { formatGHS } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { getCategoryColor, isIncomeType } from '@/utils/category';
import { TransactionBadge } from './TransactionBadge';
import type { Transaction } from '@/types/api.types';

interface TransactionRowProps {
  transaction: Transaction;
  onEditCategory?: (tx: Transaction) => void;
  compact?: boolean; // mobile card vs desktop table row
}

export function TransactionRow({ transaction: tx, onEditCategory, compact = false }: TransactionRowProps) {
  const amount    = parseFloat(tx.amount);
  const isIncome  = isIncomeType(tx.transType);
  const catColor  = getCategoryColor(tx.category?.name);
  const merchant  = tx.merchantName || tx.merchantNumber || '—';

  if (compact) {
    // Mobile card style — matches Stitch dashboard transaction list
    return (
      <div className="flex items-center gap-3 py-3 border-b border-[rgba(0,0,0,0.06)]
                      dark:border-[rgba(255,255,255,0.06)] last:border-0">
        {/* Category colour circle */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${catColor}18` }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: catColor }} />
        </div>

        {/* Merchant + date */}
        <div className="flex-1 min-w-0">
          <p className="text-body-mid font-medium text-on-surface dark:text-dark-text truncate">{merchant}</p>
          <p className="text-body-sm text-outline dark:text-dark-muted">{formatDateTime(tx.transactionDate)}</p>
        </div>

        {/* Amount */}
        <span className={`text-body-mid font-semibold ${isIncome ? 'text-primary dark:text-inverse-primary' : 'text-error'}`}>
          {isIncome ? '+' : '−'}{formatGHS(Math.abs(amount))}
        </span>
      </div>
    );
  }

  // Desktop table row
  return (
    <tr className="border-b border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.04)]
                   hover:bg-surface-container-low dark:hover:bg-dark-surface-alt transition-colors group">
      <td className="py-3 px-4 text-body-sm text-outline dark:text-dark-muted whitespace-nowrap">
        {formatDateTime(tx.transactionDate)}
      </td>
      <td className="py-3 px-4">
        <TransactionBadge type={tx.transType} />
      </td>
      <td className="py-3 px-4">
        <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">{merchant}</p>
        {tx.merchantNumber && (
          <p className="text-label text-outline dark:text-dark-muted">{tx.merchantNumber}</p>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
          <span className="text-body-sm text-on-surface dark:text-dark-text">
            {tx.category?.name ?? 'Uncategorised'}
          </span>
        </div>
      </td>
      <td className={`py-3 px-4 text-right font-semibold text-body-mid ${isIncome ? 'text-primary dark:text-inverse-primary' : 'text-error'}`}>
        {isIncome ? '+' : '−'}{formatGHS(Math.abs(amount))}
      </td>
      <td className="py-3 px-4 text-right text-body-sm text-outline dark:text-dark-muted">
        {parseFloat(tx.fees) > 0 ? formatGHS(tx.fees) : '—'}
      </td>
      <td className="py-3 px-4 text-right text-body-sm text-outline dark:text-dark-muted">
        {parseFloat(tx.eLevy) > 0 ? formatGHS(tx.eLevy) : '—'}
      </td>
      <td className="py-3 px-4 text-right text-body-sm text-on-surface dark:text-dark-text">
        {tx.balanceAfter ? formatGHS(tx.balanceAfter) : '—'}
      </td>
      <td className="py-3 px-4">
        {onEditCategory && (
          <button
            onClick={() => onEditCategory(tx)}
            className="opacity-0 group-hover:opacity-100 transition-opacity
                       p-1.5 rounded hover:bg-surface-container dark:hover:bg-dark-surface-alt"
          >
            <span className="material-symbols-outlined text-outline text-[16px]">edit</span>
          </button>
        )}
      </td>
    </tr>
  );
}
```

---

### 6.5 — UploadZone

Create `src/components/ui/UploadZone.tsx`:

```typescript
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadZoneProps {
  onFile:   (file: File) => void;
  loading?: boolean;
}

export function UploadZone({ onFile, loading = false }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (file) setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-12 h-12 rounded-full bg-[rgba(0,105,76,0.1)] flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
        </div>
        <div className="text-center">
          <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">{selectedFile.name}</p>
          <p className="text-body-sm text-outline dark:text-dark-muted">
            {(selectedFile.size / 1024).toFixed(0)} KB
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onFile(selectedFile)}
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-body-mid font-medium
                       hover:bg-primary-container transition-colors disabled:opacity-60"
          >
            {loading ? 'Uploading...' : 'Upload and analyse'}
          </button>
          <button
            onClick={() => setSelectedFile(null)}
            className="px-4 py-2.5 text-outline dark:text-dark-muted text-body-sm hover:text-on-surface"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center gap-3 py-10 px-6
                  rounded-md border-2 border-dashed cursor-pointer transition-all
                  ${isDragActive
                    ? 'border-primary bg-[rgba(0,105,76,0.06)]'
                    : 'border-outline-variant dark:border-[rgba(255,255,255,0.15)] hover:border-primary hover:bg-surface-container-low'
                  }`}
    >
      <input {...getInputProps()} />
      <span className="material-symbols-outlined text-primary text-[40px]">cloud_upload</span>
      <div className="text-center">
        <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">
          {isDragActive ? 'Drop your statement here' : 'Drag and drop your MoMo PDF here'}
        </p>
        <p className="text-body-sm text-outline dark:text-dark-muted mt-1">
          or <span className="text-primary underline">browse files</span>
        </p>
      </div>
      <p className="text-label text-outline dark:text-dark-muted">
        Supports PDF up to 10MB · MTN MoMo statements only
      </p>
    </div>
  );
}
```

---

### 6.6 — SkeletonCard

Create `src/components/ui/SkeletonCard.tsx`:

```typescript
interface SkeletonCardProps {
  height?: string;
  className?: string;
}

function SkeletonLine({ width = 'w-full', height = 'h-3' }: { width?: string; height?: string }) {
  return (
    <div className={`${width} ${height} rounded bg-surface-container dark:bg-dark-surface-alt animate-pulse`} />
  );
}

export function SkeletonCard({ height = 'h-32', className = '' }: SkeletonCardProps) {
  return (
    <div className={`card p-4 ${height} ${className}`}>
      <div className="space-y-3">
        <SkeletonLine width="w-1/3" />
        <SkeletonLine width="w-2/3" height="h-6" />
        <SkeletonLine width="w-1/4" />
      </div>
    </div>
  );
}

export function SkeletonMetricGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i} height="h-24" />
      ))}
    </div>
  );
}
```

---

### 6.7 — ThemeToggle

Create `src/components/ui/ThemeToggle.tsx`:

```typescript
import { useUIStore } from '@/store/ui.store';

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useUIStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="w-9 h-9 flex items-center justify-center rounded-full
                 hover:bg-surface-container-low dark:hover:bg-dark-surface-alt
                 transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="material-symbols-outlined text-on-surface-variant dark:text-dark-muted text-[20px]">
        {darkMode ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
```

---

### 6.8 — EmptyState

Create `src/components/ui/EmptyState.tsx`:

```typescript
interface EmptyStateProps {
  icon:        string;
  title:       string;
  description: string;
  action?:     React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-surface-container dark:bg-dark-surface-alt
                      flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-outline dark:text-dark-muted text-[32px]">
          {icon}
        </span>
      </div>
      <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-2">{title}</h3>
      <p className="text-body-sm text-outline dark:text-dark-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
```

---

## TASK 7 — Charts

**What you are building:** All data visualisation components using Recharts with the design system colours.

**Branch:** `feature/charts`

---

### 7.1 — SpendingBarChart

Create `src/components/charts/SpendingBarChart.tsx`:

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CategoryBreakdownItem } from '@/types/api.types';
import { formatGHS } from '@/utils/currency';

interface SpendingBarChartProps {
  data: CategoryBreakdownItem[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as CategoryBreakdownItem;
  return (
    <div className="card p-3 text-body-sm">
      <p className="font-medium text-on-surface dark:text-dark-text">{d.name}</p>
      <p className="text-outline dark:text-dark-muted">{formatGHS(d.total)} · {d.percentage}%</p>
    </div>
  );
}

export function SpendingBarChart({ data }: SpendingBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 60, top: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 12, fill: '#6d7a73' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Bar dataKey="total" radius={4} barSize={10}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

### 7.2 — BalanceLineChart

Create `src/components/charts/BalanceLineChart.tsx`:

```typescript
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { BalancePoint } from '@/types/api.types';
import { formatGHS } from '@/utils/currency';
import { formatShortDate } from '@/utils/date';

interface BalanceLineChartProps {
  data: BalancePoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-body-sm">
      <p className="font-medium text-on-surface dark:text-dark-text">{formatShortDate(label)}</p>
      <p className="text-primary dark:text-inverse-primary">{formatGHS(payload[0].value)}</p>
    </div>
  );
}

export function BalanceLineChart({ data }: BalanceLineChartProps) {
  // Deduplicate by date — keep last balance per day
  const deduped = Object.values(
    data.reduce((acc, point) => ({ ...acc, [point.date]: point }), {} as Record<string, BalancePoint>),
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={deduped} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#00694c" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#00694c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDate}
          tick={{ fontSize: 11, fill: '#6d7a73' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11, fill: '#6d7a73' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#00694c"
          strokeWidth={2}
          fill="url(#balanceGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#00694c' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

---

## TASK 8 — Pages

**What you are building:** All 8 pages of FinTrack₵, each responsive across mobile and desktop using the components built above.

**Branch:** `feature/pages`

---

### 8.1 — Dashboard page

Create `src/pages/dashboard/DashboardPage.tsx`:

```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useSummary, useRecurring, useForecast } from '@/hooks/useDashboard';
import { useTransactions } from '@/hooks/useTransactions';
import { useStatements } from '@/hooks/useStatements';
import { MetricCard } from '@/components/ui/MetricCard';
import { CategoryBar } from '@/components/ui/CategoryBar';
import { TransactionRow } from '@/components/ui/TransactionRow';
import { BalanceLineChart } from '@/components/charts/BalanceLineChart';
import { SkeletonMetricGrid, SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatGHS, formatGHSChange } from '@/utils/currency';
import { formatDate, formatPeriod } from '@/utils/date';
import { useUploadStatement } from '@/hooks/useStatements';
import { UploadZone } from '@/components/ui/UploadZone';

export function DashboardPage() {
  const isDesktop = useIsDesktop();
  const { data: statements }  = useStatements();
  const [activeStmt, setActiveStmt] = useState<string | undefined>();

  const { data: summary, isLoading: summaryLoading } = useSummary(activeStmt);
  const { data: recurring } = useRecurring();
  const { data: forecast }  = useForecast();
  const { data: txData }    = useTransactions({ limit: 6, statementId: activeStmt });
  const { mutate: upload, isPending: uploading } = useUploadStatement();

  // No statements yet — show onboarding upload prompt
  if (statements && statements.length === 0) {
    return (
      <div className="max-w-lg mx-auto pt-8">
        <h2 className="text-h2 font-semibold text-on-surface dark:text-dark-text mb-1">
          Welcome to FinTrack₵
        </h2>
        <p className="text-body-sm text-outline dark:text-dark-muted mb-6">
          Upload your first MoMo statement to get started
        </p>
        <div className="card p-6">
          <UploadZone
            onFile={(file) => upload(file)}
            loading={uploading}
          />
        </div>
      </div>
    );
  }

  const latestStatement = statements?.[0];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">
            {latestStatement ? formatPeriod(latestStatement.periodStart) : 'Dashboard'}
          </h2>
          {latestStatement && (
            <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">
              MoMo {latestStatement.msisdn}
            </p>
          )}
        </div>
        <Link
          to="/statements"
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                     rounded-lg text-body-sm font-medium hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">upload</span>
          Upload statement
        </Link>
      </div>

      {/* Forecast alert */}
      {forecast?.willRunLow && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg
                        bg-[rgba(239,159,39,0.1)] border border-[rgba(239,159,39,0.3)]">
          <span className="material-symbols-outlined text-[#EF9F27] text-[20px]">warning</span>
          <p className="text-body-sm text-on-surface dark:text-dark-text">
            Your balance may run low around the end of the month.
            Projected end balance: <strong>{formatGHS(forecast.forecastedEndBalance)}</strong>
          </p>
        </div>
      )}

      {/* Metric cards */}
      {summaryLoading ? (
        <SkeletonMetricGrid />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total spent"
            value={formatGHS(summary?.totalSpent)}
            variant="negative"
          />
          <MetricCard
            label="Total received"
            value={formatGHS(summary?.totalReceived)}
            variant="positive"
          />
          <MetricCard
            label="Net position"
            value={formatGHSChange(summary?.netPosition ?? 0)}
            variant={(summary?.netPosition ?? 0) >= 0 ? 'positive' : 'negative'}
          />
          <MetricCard
            label="Transactions"
            value={String(summary?.transactionCount ?? 0)}
          />
        </div>
      )}

      {/* Two-column section — desktop only */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Category breakdown — 3 cols on desktop */}
        <div className="lg:col-span-3 card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">
              Spending by category
            </h3>
          </div>
          {summaryLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-surface-container dark:bg-dark-surface-alt rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(summary?.categoryBreakdown ?? []).map((cat) => (
                <CategoryBar
                  key={cat.name}
                  name={cat.name}
                  color={cat.color}
                  amount={cat.total}
                  percentage={cat.percentage}
                  count={cat.count}
                />
              ))}
            </div>
          )}
        </div>

        {/* Balance timeline — 2 cols on desktop */}
        <div className="lg:col-span-2 card p-4">
          <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-4">
            Balance this month
          </h3>
          {summaryLoading ? (
            <SkeletonCard height="h-[200px]" />
          ) : (
            <BalanceLineChart data={summary?.balanceTimeline ?? []} />
          )}
        </div>
      </div>

      {/* Recent transactions + Recurring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent transactions */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">
              Recent transactions
            </h3>
            <Link to="/transactions" className="text-body-sm text-primary dark:text-inverse-primary font-medium">
              View all →
            </Link>
          </div>
          <div>
            {(txData?.data ?? []).map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} compact />
            ))}
          </div>
        </div>

        {/* Recurring payments */}
        <div className="card p-4">
          <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-1">
            Recurring payments
          </h3>
          <p className="text-body-sm text-outline dark:text-dark-muted mb-4">
            Detected across your statements
          </p>
          {(recurring ?? []).length === 0 ? (
            <p className="text-body-sm text-outline dark:text-dark-muted">
              Upload more statements to detect recurring payments.
            </p>
          ) : (
            <div className="space-y-3">
              {(recurring ?? []).slice(0, 4).map((r) => (
                <div key={r.merchantName} className="flex items-center justify-between py-2
                                                     border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]
                                                     last:border-0">
                  <div>
                    <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">
                      {r.merchantName}
                    </p>
                    <p className="text-body-sm text-outline dark:text-dark-muted">
                      {r.occurrences}× · {formatGHS(r.averageAmount)} avg
                    </p>
                  </div>
                  {r.nextExpected && (
                    <div className="text-right">
                      <p className="text-label text-[#EF9F27] font-semibold">Next expected</p>
                      <p className="text-body-sm text-outline dark:text-dark-muted">
                        {formatDate(r.nextExpected)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fees tracker */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 lg:col-span-2">
            <p className="text-label text-outline dark:text-dark-muted uppercase tracking-wide mb-1">
              MoMo fees paid
            </p>
            <p className="text-h3 font-semibold text-[#EF9F27]">{formatGHS(summary.totalFees)}</p>
            <p className="text-body-sm text-outline dark:text-dark-muted mt-1">This period</p>
          </div>
          <div className="card p-4 lg:col-span-2">
            <p className="text-label text-outline dark:text-dark-muted uppercase tracking-wide mb-1">
              E-levy paid
            </p>
            <p className="text-h3 font-semibold text-[#EF9F27]">{formatGHS(summary.totalELevy)}</p>
            <p className="text-body-sm text-outline dark:text-dark-muted mt-1">Government levy</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 8.2 — Transactions page

Create `src/pages/transactions/TransactionsPage.tsx`:

```typescript
import { useState } from 'react';
import { useTransactions, useUpdateCategory } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { TransactionRow } from '@/components/ui/TransactionRow';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatGHS } from '@/utils/currency';
import type { Transaction, TransactionFilters } from '@/types/api.types';

export function TransactionsPage() {
  const isDesktop = useIsDesktop();
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 20 });
  const [editing, setEditing] = useState<Transaction | null>(null);

  const { data, isLoading }     = useTransactions(filters);
  const { data: categories }    = useCategories();
  const { mutate: updateCat, isPending } = useUpdateCategory();

  const handleSearch = (search: string) => setFilters((f) => ({ ...f, search, page: 1 }));
  const handlePage   = (page: number)   => setFilters((f) => ({ ...f, page }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">Transactions</h2>
          <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">
            Manage and track your financial flow
          </p>
        </div>
        <button className="hidden lg:flex items-center gap-2 px-4 py-2.5 border border-outline-variant
                           rounded-lg text-body-sm text-on-surface dark:text-dark-text
                           hover:bg-surface-container-low dark:hover:bg-dark-surface-alt transition-colors">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                             text-outline text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search merchant..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant
                         dark:border-[rgba(255,255,255,0.15)] bg-transparent
                         text-body-reg text-on-surface dark:text-dark-text
                         placeholder:text-outline dark:placeholder:text-dark-muted
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                         transition-all"
            />
          </div>

          {/* Category filter */}
          <select
            onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value || undefined, page: 1 }))}
            className="px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                       bg-transparent text-body-reg text-on-surface dark:text-dark-text
                       focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All categories</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            onChange={(e) => setFilters((f) => ({ ...f, transType: e.target.value || undefined, page: 1 }))}
            className="px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                       bg-transparent text-body-reg text-on-surface dark:text-dark-text
                       focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All types</option>
            {['DEBIT','CREDIT','TRANSFER','CASH_IN','CASH_OUT','PAYMENT'].map((t) => (
              <option key={t} value={t}>{t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Results summary */}
        {data && (
          <p className="text-body-sm text-outline dark:text-dark-muted mt-3">
            Showing {data.meta.total} transactions
          </p>
        )}
      </div>

      {/* Transaction list */}
      {isLoading ? (
        <SkeletonCard height="h-96" />
      ) : !data?.data.length ? (
        <EmptyState
          icon="receipt_long"
          title="No transactions found"
          description="Try adjusting your filters or upload a MoMo statement to get started."
        />
      ) : isDesktop ? (
        // Desktop: full table
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low dark:bg-dark-surface-alt">
                {['Date','Type','Merchant','Category','Amount','Fees','E-levy','Balance after',''].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-label text-outline dark:text-dark-muted
                                         uppercase tracking-wide font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  onEditCategory={setEditing}
                />
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3
                          border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
            <p className="text-body-sm text-outline dark:text-dark-muted">
              Page {data.meta.page} of {data.meta.pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={!data.meta.hasPrev}
                onClick={() => handlePage(filters.page! - 1)}
                className="px-3 py-1.5 rounded border border-outline-variant text-body-sm
                           disabled:opacity-40 hover:bg-surface-container-low transition-colors"
              >
                ← Previous
              </button>
              <button
                disabled={!data.meta.hasNext}
                onClick={() => handlePage(filters.page! + 1)}
                className="px-3 py-1.5 rounded border border-outline-variant text-body-sm
                           disabled:opacity-40 hover:bg-surface-container-low transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Mobile: card list
        <div className="card divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.06)]">
          {data.data.map((tx) => (
            <div key={tx.id} className="px-4">
              <TransactionRow transaction={tx} compact onEditCategory={setEditing} />
            </div>
          ))}
        </div>
      )}

      {/* Edit category slide panel */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="w-full max-w-sm bg-surface-container-lowest dark:bg-dark-surface h-full
                          shadow-xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">Edit category</h3>
              <button onClick={() => setEditing(null)}>
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <p className="text-body-mid font-medium text-on-surface dark:text-dark-text mb-1">
              {editing.merchantName ?? 'Unknown merchant'}
            </p>
            <p className="text-body-sm text-outline dark:text-dark-muted mb-6">
              Currently: {editing.category?.name ?? 'Uncategorised'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(categories ?? []).map((cat) => (
                <button
                  key={cat.id}
                  disabled={isPending}
                  onClick={() => {
                    updateCat({ id: editing.id, categoryId: cat.id });
                    setEditing(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-body-sm
                              text-left transition-all
                              ${editing.categoryId === cat.id
                                ? 'border-primary bg-[rgba(0,105,76,0.08)] text-primary dark:text-inverse-primary'
                                : 'border-outline-variant dark:border-[rgba(255,255,255,0.1)] hover:border-primary'
                              }`}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-on-surface dark:text-dark-text truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 8.3 — Statements page (upload flow)

Create `src/pages/statements/StatementsPage.tsx`:

```typescript
import { useState } from 'react';
import { useStatements, useUploadStatement } from '@/hooks/useStatements';
import { UploadZone } from '@/components/ui/UploadZone';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatGHS } from '@/utils/currency';
import { formatDate, formatPeriod } from '@/utils/date';
import type { UploadResult } from '@/types/api.types';

export function StatementsPage() {
  const { data: statements, isLoading } = useStatements();
  const { mutate: upload, isPending, data: uploadResult, reset } = useUploadStatement();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">Statements</h2>
          <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">
            Your uploaded MoMo statements
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg
                     text-body-sm font-medium hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">upload</span>
          Upload statement
        </button>
      </div>

      {/* Upload result banner */}
      {uploadResult && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg
                        bg-[rgba(0,105,76,0.1)] border border-[rgba(0,105,76,0.3)]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            <p className="text-body-sm text-on-surface dark:text-dark-text">
              Statement uploaded — <strong>{uploadResult.summary.inserted}</strong> transactions imported
              {uploadResult.summary.skipped > 0 && `, ${uploadResult.summary.skipped} duplicates skipped`}
            </p>
          </div>
          <button onClick={reset} className="text-primary text-label font-semibold">Dismiss</button>
        </div>
      )}

      {/* Upload zone (expanded) */}
      {showUpload && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">
              Upload MoMo statement
            </h3>
            <button onClick={() => setShowUpload(false)}>
              <span className="material-symbols-outlined text-outline">close</span>
            </button>
          </div>
          <UploadZone
            onFile={(file) => {
              upload(file, { onSuccess: () => setShowUpload(false) });
            }}
            loading={isPending}
          />
          <div className="mt-4 p-3 rounded-lg bg-surface-container-low dark:bg-dark-surface-alt">
            <p className="text-body-sm font-medium text-on-surface dark:text-dark-text mb-2">
              How to download your statement:
            </p>
            {['Open MoMo app → tap "My Account"',
              'Select "Statement" → choose month → tap "Download"',
              'Upload the PDF here'].map((step, i) => (
              <p key={i} className="text-body-sm text-outline dark:text-dark-muted mb-1">
                {i + 1}. {step}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Statements table */}
      {isLoading ? (
        <SkeletonCard height="h-64" />
      ) : !statements?.length ? (
        <EmptyState
          icon="description"
          title="No statements yet"
          description="Upload your first MoMo statement to start tracking your finances."
          action={
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-body-sm font-medium"
            >
              Upload statement
            </button>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low dark:bg-dark-surface-alt">
                  {['Period','Transactions','Spent','Received','Net','Fees','E-levy','Uploaded',''].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-label text-outline dark:text-dark-muted
                                           uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statements.map((stmt) => (
                  <tr key={stmt.id}
                      className="border-b border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.04)]
                                 hover:bg-surface-container-low dark:hover:bg-dark-surface-alt transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-body-mid font-medium text-on-surface dark:text-dark-text">
                        {formatPeriod(stmt.periodStart)}
                      </p>
                      <p className="text-body-sm text-outline dark:text-dark-muted">
                        {formatDate(stmt.periodStart)} – {formatDate(stmt.periodEnd)}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-body-sm text-on-surface dark:text-dark-text">
                      {/* transaction count not in statement response — link to view */}
                      —
                    </td>
                    <td className="py-3 px-4 text-body-sm text-error font-medium">
                      {formatGHS(stmt.totalDebit)}
                    </td>
                    <td className="py-3 px-4 text-body-sm text-primary dark:text-inverse-primary font-medium">
                      {formatGHS(stmt.totalCredit)}
                    </td>
                    <td className="py-3 px-4 text-body-sm font-medium">
                      <span className={parseFloat(stmt.totalCredit) >= parseFloat(stmt.totalDebit)
                        ? 'text-primary dark:text-inverse-primary' : 'text-error'}>
                        {formatGHS(parseFloat(stmt.totalCredit) - parseFloat(stmt.totalDebit))}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-body-sm text-[#EF9F27]">{formatGHS(stmt.totalFees)}</td>
                    <td className="py-3 px-4 text-body-sm text-[#EF9F27]">{formatGHS(stmt.totalELevy)}</td>
                    <td className="py-3 px-4 text-body-sm text-outline dark:text-dark-muted">
                      {formatDate(stmt.uploadedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <a href={`/dashboard?statementId=${stmt.id}`}
                         className="text-primary dark:text-inverse-primary text-body-sm font-medium hover:underline">
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="lg:hidden divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.06)]">
            {statements.map((stmt) => (
              <div key={stmt.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-body-mid font-semibold text-on-surface dark:text-dark-text">
                    {formatPeriod(stmt.periodStart)}
                  </p>
                  <a href={`/dashboard?statementId=${stmt.id}`}
                     className="text-primary dark:text-inverse-primary text-body-sm font-medium">
                    View →
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-label text-outline dark:text-dark-muted">Spent</p>
                    <p className="text-body-sm text-error font-medium">{formatGHS(stmt.totalDebit)}</p>
                  </div>
                  <div>
                    <p className="text-label text-outline dark:text-dark-muted">Received</p>
                    <p className="text-body-sm text-primary dark:text-inverse-primary font-medium">
                      {formatGHS(stmt.totalCredit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-label text-outline dark:text-dark-muted">Fees</p>
                    <p className="text-body-sm text-[#EF9F27] font-medium">{formatGHS(stmt.totalFees)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## TASK 9 — App Entry Point

**Branch:** Complete on `feature/pages`

---

### 9.1 — App.tsx

Replace `src/App.tsx`:

```typescript
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from '@/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:       1,
      staleTime:   2 * 60 * 1000,  // 2 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

---

### 9.2 — main.tsx

Replace `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply persisted dark mode before React renders to prevent flash
const stored = localStorage.getItem('fintrack-ui');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.darkMode) {
      document.documentElement.classList.add('dark');
    }
  } catch { /* ignore */ }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## TASK 10 — Missing Hooks

### 10.1 — useCategories

Create `src/hooks/useCategories.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories.api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn:  categoriesApi.getAll,
    staleTime: Infinity, // categories rarely change
  });
}

export function useMerchantCache() {
  return useQuery({
    queryKey: ['merchant-cache'],
    queryFn:  categoriesApi.getMerchantCache,
  });
}
```

---

## Responsive Pattern Reference

Every component follows this responsive pattern. Memorise it:

```
Mobile first → add desktop overrides with lg: prefix

Layout:
  mobile:  block / flex-col / single column
  desktop: flex-row / multi-column grid

Navigation:
  mobile:  BottomNav (fixed bottom) + MobileHeader (fixed top 64px)
  desktop: Sidebar (fixed left 240px) + TopBar (fixed top 60px)

Cards:
  mobile:  full-width, stacked vertically
  desktop: grid-cols-2, grid-cols-3, grid-cols-5 etc.

Tables:
  mobile:  hidden (show card list instead)
  desktop: block (full table with all columns)

Padding:
  mobile:  px-gutter (20px)
  desktop: px-xl (32px) inside AppShell

Text:
  mobile:  smaller sizes, more compact
  desktop: same — Inter scales well, no size changes needed
```

---

## Complete Build Checklist

### Before writing any component
- [ ] Types defined in `api.types.ts`
- [ ] API function written in `*.api.ts`
- [ ] Custom hook written using TanStack Query
- [ ] Utility functions available (currency, date, category)

### Component checklist
- [ ] Works on mobile (390px) without horizontal scroll
- [ ] Works on desktop (1280px) with sidebar visible
- [ ] Dark mode renders correctly (test with ThemeToggle)
- [ ] Loading state shown (SkeletonCard or spinner)
- [ ] Empty state shown when no data
- [ ] TypeScript: no `any` types except where Recharts forces it

### Before pushing to develop
- [ ] `npm run build` — zero TypeScript errors
- [ ] `npm run lint` — zero ESLint warnings
- [ ] Test upload flow: PDF → parsing → dashboard populates
- [ ] Test dark mode: every page looks correct
- [ ] Test mobile: bottom nav works, no overflow, charts readable

---

## Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Create `.env.production`:

```env
VITE_API_URL=https://your-fintrack-backend.railway.app/api/v1
```

---

*FinTrack₵ Frontend Guide v1.0 · React 18 + TypeScript + Vite + Tailwind + TanStack Query + Zustand*