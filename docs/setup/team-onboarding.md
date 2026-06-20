# Team Onboarding

## Access Each Developer Needs

- GitHub access to the repo
- Supabase project access
- Vercel project access

For mobile-specific work later:

- Expo account access
- Apple developer access if we ship iOS builds

## First-Day Setup

1. Clone the repo.
2. Install Node.js 20+ and npm.
3. Ask for the shared Supabase project URL and publishable key.
4. Add local env files for web and mobile.
5. Run the web app and mobile app locally.

## Who Needs The Supabase Secret Key

Not everyone.

Give `SUPABASE_SECRET_KEY` only to people doing:

- backend work
- server-side auth or admin flows
- deployment setup

Frontend-only contributors usually do not need it.

## Shared Working Rules

- keep schema changes in `supabase/migrations`
- do not commit `.env.local` files
- do not use `NEXT_PUBLIC_*` for secrets
- do not use `EXPO_PUBLIC_*` for secrets
- do not treat dashboard-only schema edits as done until the repo reflects them

## Recommended Early Ownership

- one person owns Supabase project setup
- one person owns Vercel project setup
- everyone else consumes the shared env contract and repo docs

That reduces setup drift while the project is still changing fast.
