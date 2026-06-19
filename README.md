# Pluckr v2

Fresh workspace for the React Native + Vercel + Supabase rebuild.

## Repo Shape

- `apps/mobile`: Expo-based React Native app for provider-facing workflows
- `apps/web`: Next.js app for investor demos, admin, and clinic ops
- `packages/design-system`: shared Pluckr brand tokens and theme helpers
- `packages/supabase`: shared Supabase client helpers for web and mobile
- `supabase`: schema, migration, and backend notes
- `docs`: onboarding, setup, planning, design, and legacy archive

## Design Intent

This workspace intentionally preserves the existing Pluckr feel:

- warm paper-like surfaces
- sage and forest accents
- journal-inspired spacing and typography
- soft rounded cards instead of generic dashboard chrome

That keeps the investor story visually continuous while the product architecture gets rebuilt.

## Team Docs

Start here:

- [Docs Index](./docs/README.md)
- [Supabase Setup](./docs/setup/supabase.md)
- [Vercel Setup](./docs/setup/vercel.md)
- [Local Development](./docs/setup/local-development.md)
- [Team Onboarding](./docs/setup/team-onboarding.md)

## Local Development

Prerequisites:

- Node.js 20+ and npm
- a Supabase project
- Vercel access for web deployments

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev:web
```

Run the mobile app:

```bash
npm run start:mobile
```

## Environment Variables

This repo now uses one shared root `.env.local` as the source of truth for local development.

- `apps/web/.env.local` points to the root file
- `apps/mobile/.env.local` points to the root file

Use current Supabase keys:

- client-side: publishable key
- server-side: secret key

The exact contract is documented in [Supabase Setup](./docs/setup/supabase.md).

## Current Priorities

1. Establish the shared backend foundation in Supabase
2. Build auth and organization context
3. Recreate the core client and chart flows
4. Keep the current visual language while the product grows
