# V23 migration and test checklist

## Why this migration
The V22 app was delivered as one large HTML document with inline CSS and imperative DOM rendering. It also inserted the Supabase JavaScript SDK from jsDelivr at runtime. On some Android networks or browsers, a blocked/slow third-party CDN can leave authentication actions unavailable even though the page shell appears.

V23 moves the app to React + Vite and installs the Supabase SDK as a normal npm dependency. Vite bundles the SDK into the app's own versioned assets, so login no longer depends on fetching the SDK from jsDelivr at runtime. The remote Google Fonts import was also removed; system fonts are used to avoid another blocking request.

## Preserved
- Existing Supabase project URL and browser publishable key in `public/config.js`.
- Existing `public.personal_state` table and row-level security model.
- Existing user-specific state fields and data shape: income, savings allocation, expense allocation, budget, accounts, transactions and onboarding completion.
- Manual accounts, expenses, income, transfers, transaction editing/deletion, category suggestions, filters, monthly plan, CSV import, JSON backup/restore and clear-data workflow.
- Persistent aurora styling and responsive desktop/mobile navigation.

## No backend deployment
No database migration, schema change, Edge Function deployment or Supabase project change is needed. The existing `personal_state` table and RLS policies remain in use.

## Before production rollout
1. Deploy V23 to a staging URL first, not over the only working V22 deployment.
2. Test sign-in with an existing Android test account in current Chrome.
3. Test sign-in and sign-out on iOS Safari.
4. Test email confirmation for a newly created account if enabled in Supabase Auth.
5. Confirm the existing user's accounts and transactions appear after sign-in.
6. Add an expense, income and transfer; verify each appears on dashboard, activity and insights.
7. Test CSV import, JSON backup and restore.
8. Confirm the installed PWA updates to the V23 service worker.
9. Only then promote V23 to the primary production URL.

## Build
Run `npm install` then `npm run build`. Upload the contents of `dist/` to Netlify, or connect the repository and use the `netlify.toml` build settings. Do not upload the source folder as if it were a prebuilt static site.

## Validation performed in this workspace
- JSX/JavaScript transpilation and syntax checks passed using the installed TypeScript compiler.
- `package.json` and project manifest JSON parsed successfully.
- Checked that the new source contains no runtime jsDelivr or Google Fonts import.
- Checked the existing Supabase schema reference and state field compatibility.
- A full Vite production build and live Android/iOS device test could not be run in this environment because npm package registry access timed out. Netlify or a machine with npm registry access must install dependencies and run the production build.
