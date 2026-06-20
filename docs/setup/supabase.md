# Supabase Setup

## Plain-English Mental Model

Supabase is the backend for Pluckr v2.

It handles:

- database tables
- authentication
- file storage
- row-level security

For this repo, think of Supabase as "the hosted app backend we all point to while we build."

## Current Key Names

As of June 19, 2026, Supabase's current docs prefer:

- publishable keys for client-side use
- secret keys for server-side use

Legacy `anon` and `service_role` keys still exist in some projects, but Supabase says the new publishable and secret keys should be used going forward.

## What To Create Right Now

Create one hosted Supabase project first.

That is the simplest path while the team gets moving.

Later, add separate staging and production projects.

## Step 1: Create the Project

1. Go to [database.new](https://database.new).
2. Create a new Supabase project.
3. Choose a project name like `pluckr-v2`.
4. Choose a region close to your users and close to where you expect Vercel to run.
5. Save the database password somewhere safe.

## Step 2: Apply the Schema

1. Open the new project in the Supabase dashboard.
2. Open the SQL Editor.
3. Copy the full contents of:
   `supabase/migrations/202606190001_initial_schema.sql`
4. Run it.

That migration creates:

- organizations
- memberships
- providers
- clients
- chart entries
- chart images
- invite links
- a private `client-media` storage bucket

## Step 3: Get the Values We Actually Need

Open the project's Connect dialog or `Settings > API Keys`.

Copy these values:

- Project URL
- Publishable key
- Secret key

## Step 4: Put the Keys in the Right Place

For local development, use the repo root `.env.local` as the single source of truth.

Add:

```env
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_PROJECT_REF=...
```

The app-level files:

- `apps/web/.env.local`
- `apps/mobile/.env.local`

are symlinked to the root file so both apps read the same local values.

## Important Rule

Never put `SUPABASE_SECRET_KEY` in the mobile app.

Never put `SUPABASE_SECRET_KEY` in any `NEXT_PUBLIC_*` or `EXPO_PUBLIC_*` variable.

## What Other Devs Need

Most devs only need:

- the project URL
- the publishable key

Only backend or deployment work should need the secret key.

## Team Workflow Recommendation

For now:

1. Use one shared hosted Supabase project.
2. Keep schema changes in `supabase/migrations`.
3. If someone changes schema in the dashboard, they must record it back in the repo.

Once the team is moving smoothly:

1. create a staging Supabase project
2. create a production Supabase project
3. move schema rollout to a migration workflow instead of dashboard-first changes

## CLI Workflow For Devs

The simplest day-one path is dashboard-first, not local Docker Supabase.

If a dev wants the CLI workflow:

1. install the Supabase CLI
2. login
3. link this repo to the hosted project
4. push migrations

Example flow:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

You can usually find the project ref in the dashboard URL for the project.

## Why This Repo Uses Membership-Based Policies

The initial migration now assumes:

- users belong to organizations through `organization_memberships`
- org members can read their own org data
- owners/admins can manage org-wide records
- providers can edit clinical records

That is a much better baseline than leaving every authenticated user able to touch everything.
