# PlotVerso Agent Notes

## Stack

- Expo Router, React Native, TypeScript strict.
- Supabase Auth, Postgres, RLS, Realtime-ready tables and Edge Functions.
- React Hook Form + Zod for form validation.
- Vitest for pure logic and validation tests.

## Quality Commands

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run dev:web` for local web smoke testing.
- `npm run supabase:start` when testing real local Supabase flows.
- Supabase local requires Docker Desktop or another Docker-compatible runtime. Scripts call `npx supabase`, so no global CLI is required.

## Data Rules

- Screens must not import `src/shared/data/demo.ts` directly.
- Demo fixtures are allowed in tests, explicit demo helpers, and `src/shared/data/repository.ts`.
- Use `src/shared/data/repository.ts` as the app data boundary for current user, discover, matches, chat, public profiles, library and books.
- Preserve demo fallback when Supabase env/session/profile is not available, but do not swallow Supabase errors silently.
- Real Supabase writes should throw or surface a `RepositoryError` so screens can render `ErrorState`.

## Frontend Rules

- Keep the literary neon/glass identity.
- Prefer shared UI primitives from `src/shared/ui/core.tsx`.
- Use `src/shared/theme/tokens.ts` for spacing, radii and shadows when adding common styles.
- Add accessibility labels, roles and states to buttons, chips, checkboxes, inputs and toggles.
- Avoid relying only on web-specific styles for core layout; web-only gradients are acceptable as progressive enhancement.

## Testing Expectations

- Add focused tests for changed pure logic, schemas and repository behavior that can run without network.
- Do not change matching/business expectations without updating or adding tests.
- Avoid tests that require Supabase to be running unless they are clearly documented as integration tests.

## Supabase Notes

- Initial schema and RLS policies live in `supabase/migrations/20260507230000_initial_schema.sql`.
- Public profile reads are gated by `onboarding_completed`; private notes remain owner-only through `user_books` policies.
- Technical TODO before public beta: replace profile photo URL input with a Supabase Storage bucket, storage policies and upload flow.
