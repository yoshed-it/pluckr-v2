# Pluckr v2

Fresh workspace for the React Native + Vercel + Supabase rebuild.

## What is here

- `apps/mobile`: Expo-flavored React Native shell for the provider-facing experience
- `apps/web`: Next.js App Router shell for investor, admin, and clinic ops surfaces
- `packages/design-system`: Shared Pluckr visual tokens translated from the current Swift theme
- `packages/supabase`: Lazy client helpers for web and mobile
- `supabase`: Prototype schema and migration notes
- `docs`: Design continuity and rebuild planning notes

## Design Intent

This scaffold intentionally preserves the existing visual language:

- warm paper backgrounds
- sage and forest green accents
- journal-like sectioning
- rounded clinical cards
- soft paper shadows

We can evolve the design later without losing the current product feel for investor demos.

## Install Later

This machine session did not have `npm` or `pnpm` on the shell path, so the repo was scaffolded by hand instead of generated with a CLI.

Once your package manager is available, install from the repo root:

```bash
npm install
```

Then use:

```bash
npm run dev:web
npm run start:mobile
```

## First Build Targets

1. Investor-facing web prototype in `apps/web`
2. Provider mobile prototype in `apps/mobile`
3. Shared auth and data access through Supabase
4. Incremental migration of the current feature set instead of a one-shot port
