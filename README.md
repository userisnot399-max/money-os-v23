# Money OS V23 — React + Vite migration

This is the React migration of the V22 Money OS PWA. It keeps the existing Supabase project, `public.personal_state` JSON snapshot schema, user-scoped local cache, and V22 state shape.

## Stack
- React + React DOM
- Vite build/dev server
- `@supabase/supabase-js` imported and bundled at build time (no runtime CDN script)
- CSS-only persistent aurora engine and responsive glass UI
- Lightweight hand-written service worker; no router, chart library, icon library, or animation framework

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```
Upload the contents of `dist/` to the existing Netlify site. Configure the SPA fallback to `/index.html` if the host does not already do so.

## Supabase
`public/config.js` retains the existing project URL and browser publishable key. Keep the production values unchanged. The app uses the existing `public.personal_state` table and does not require a schema migration or Edge Function deployment. The table must already have the RLS policies from `schema-reference.sql`.

## Data compatibility
The saved snapshot retains the existing fields: `income`, `savingsAllocation`, `expensesAllocation`, `budget`, `accounts`, `transactions`, and `onboardingComplete`. Existing V22 account and transaction arrays are normalised but not discarded. Each authenticated user's data remains keyed by their Supabase user ID.

## Android and iOS
The app is responsive for mobile browsers and installable as a PWA. Use current Chrome on Android and Safari on iOS. Capacitor can be added later if native app-store packaging is required.

## Important deployment notes
- Deploy the complete `dist/` output together; do not upload `src/` directly.
- Keep `public/config.js` populated with the existing Supabase values.
- The Supabase JS SDK is bundled locally, removing the previous runtime jsDelivr dependency that could delay login on some Android networks.
- No bank connection or automatic transaction fetching is implemented. Accounts are manual tracking profiles and transactions are manual/CSV imported.
