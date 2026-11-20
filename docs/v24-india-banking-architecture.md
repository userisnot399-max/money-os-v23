# Money OS V24 — India Banking Infrastructure

## Status

Architecture foundation only. This document does not connect to banks, create an Account Aggregator session, collect a mobile number, or request real financial data. All current UI and integration tests must use synthetic demo records.

## Current V23 baseline

- React 19 + Vite 7 frontend.
- Supabase Auth for email/password sign-in.
- One `public.personal_state` JSON snapshot per authenticated user, protected by row-level security.
- Accounts are manual tracking profiles.
- Transactions can be entered manually or imported from CSV.
- No bank connection, Account Aggregator client, transaction sync worker, or consent service exists today.

The existing JSON snapshot is useful for preferences and legacy compatibility, but should not become the permanent store for bank-sourced financial records.

## Target India-first architecture

```
Money OS web app
  └─ authenticated Money OS API
       ├─ user / workspace service
       ├─ consent and connection status service
       ├─ provider adapter interface
       │    └─ authorised Account Aggregator integration (future, subject to eligibility)
       ├─ transaction normalisation service
       ├─ duplicate detection and categorisation
       └─ scheduled sync / notification worker (future)
             └─ encrypted, user-scoped financial data store
```

The frontend must never call a financial-data provider directly with provider secrets. Provider credentials and any sensitive integration material belong only in an appropriately secured server-side environment. Never put service-role keys, provider secrets, access tokens, OTPs, bank passwords, UPI PINs, or CVVs in browser code, local storage, logs, or support messages.

## Proposed domain model

These are design entities, not a migration to run yet:

- `financial_connections`: one provider relationship per user; provider name, lifecycle state, timestamps, and non-sensitive reference identifiers.
- `financial_consents`: purpose, data categories, selected institution/account references, date range, frequency, expiry, status, and revocation timestamp. Preserve an auditable consent history.
- `financial_accounts`: normalised account metadata; institution, account type, masked display identifier, currency, connection reference, and status. Never store full account numbers unless the approved integration and reviewed data model demonstrably require them.
- `financial_transactions`: user-scoped normalised transactions; provider reference, account reference, booking/value dates, amount, currency, direction, narration/merchant, category, and deduplication fingerprint.
- `sync_runs`: status, start/end timestamps, records processed, retry metadata, and safe error codes. Do not log raw provider payloads or secrets.

Every user-owned row must have a user ownership key and enforce access at the database layer. A client-supplied user ID must never be trusted as authorisation.

## Provider adapter contract

Keep provider-specific details behind a server-side interface with operations conceptually equivalent to:

- create or update a consent request;
- read consent status and revocation events;
- discover eligible financial information only after the approved consent flow;
- request and retrieve data within the consent scope;
- normalise provider records into Money OS domain objects.

The adapter must reject requests outside the consent scope and must not expose raw provider payloads to the browser. Exact operations, payloads, and callback mechanics will be determined only after a qualified provider and authorised integration arrangement are selected.

## Product flow

1. User signs in.
2. First-time user sees an account-discovery introduction with a clear **Demo preview** label.
3. Demo preview shows fictional institutions and masked sample accounts.
4. User can select sample accounts, review a plainly worded sample consent summary, or skip.
5. Dashboard labels sample accounts and transactions as demo data.
6. Accounts settings provides connection status and a future account-management entry point.

Do not ask for a real mobile number, OTP, bank credentials, UPI PIN, account number, card number, or CVV in the demo flow. A mobile number alone is not authority to enumerate a person's accounts. UPI IDs and credit-card data availability must not be promised; availability depends on the supported institution, data type, provider, and applicable consent.

## Security and reliability requirements

- Server-side authorisation on every user-scoped operation.
- Row-level security and least-privilege database roles.
- Encryption in transit and at rest; reviewed key management for any sensitive data.
- No secrets or financial identifiers in frontend bundles, analytics, URLs, or logs.
- Idempotent ingestion and duplicate detection using stable provider references where available.
- Explicit handling for expired, paused, and revoked consent.
- Bounded retries, backoff, safe error messages, and sync observability.
- Data minimisation, retention/deletion rules, export, and user-visible disconnect controls.
- Threat modelling, dependency review, security testing, privacy review, and legal/provider review before any live financial data is processed.

## Delivery sequence

- **V24.0:** document the architecture and preserve V23 compatibility.
- **V24.1:** build the clearly labelled synthetic account-discovery and consent-preview UX.
- **V24.2:** introduce reviewed, user-scoped domain tables and server-side API boundaries using synthetic fixtures only.
- **V24.3:** add normalisation, deduplication, sync-state UI, and automated tests with synthetic fixtures.
- **Future live integration:** only after the responsible organisation's eligibility, contractual/provider arrangements, security reviews, and applicable approvals are confirmed by qualified professionals.

## Compatibility rule

Keep `personal_state` and its existing account/transaction arrays working during the transition. Do not delete or silently migrate existing user data. A future migration must be additive, reversible where practical, tested against a copy of the schema, and separately reviewed before deployment.
