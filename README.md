# PlotVerso

PlotVerso is a literary dating MVP built with one Expo TypeScript codebase for Android and web. It includes auth, onboarding, library management, compatibility ranking, likes, matches, chat, AI reply suggestions through Supabase Edge Functions, reporting, blocking, light/dark theme, tests, CI, and Supabase migrations.

## Stack

- Expo, React Native, Expo Router, TypeScript
- React Hook Form, Zod
- Supabase Auth, Postgres, Storage, Realtime, Edge Functions
- Open Library first for book search, Google Books-ready fallback path
- Vitest for pure logic tests

## Setup

```bash
npm install
cp .env.example .env
npm run supabase:start
npm run dev:web
```

Use `npm.cmd` on Windows if PowerShell blocks `npm.ps1`.
Supabase local requires Docker Desktop. The project scripts use `npx supabase`, so a global Supabase CLI install is not required.

## Environment

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` optional for future provider-backed Edge Functions
- `GOOGLE_BOOKS_API_KEY` optional

If AI or external book keys are missing, Edge Functions and client helpers return deterministic fallback data.

## Supabase

Local config lives in `supabase/config.toml`. The initial schema, triggers and RLS policies live in `supabase/migrations`. Seed data lives in `supabase/seed.sql`.

```bash
npm run supabase:start
npm run supabase:types
```

## Scripts

- `npm run dev`: Expo development server
- `npm run dev:web`: Expo Web
- `npm run android`: Android native run
- `npm run typecheck`: strict TypeScript
- `npm run lint`: ESLint
- `npm test`: Vitest
- `npm run build:android:preview`: EAS preview APK
- `npm run build:android:prod`: EAS production build

## Architecture

Screens live in `app/` using Expo Router. Feature modules live in `src/features/*` and keep Supabase calls out of route components. Shared UI, schemas, theme, auth context, domain types and demo data live in `src/shared/*`. Matching and book normalization are pure functions with tests so ranking and data ingestion can scale independently from screens.
