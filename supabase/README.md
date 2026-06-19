# Supabase Backend

This folder contains the database foundation for Pluckr v2.

## What Lives Here

- SQL migrations
- backend structure notes
- the shared organization, membership, client, chart, and storage model

## Current Backend Shape

The first migration creates:

- `organizations`
- `organization_memberships`
- `providers`
- `clients`
- `chart_entries`
- `chart_images`
- `invite_links`

It also creates a private `client-media` storage bucket and baseline row-level policies.

## Team Rule

Treat the repository migration files as the source of truth for schema changes.

- If you change schema in the Supabase dashboard, pull that change back into the repo
- Prefer schema changes through migrations once the team is in motion

## Setup

Use the docs in:

- `docs/setup/supabase.md`
- `docs/setup/team-onboarding.md`

## Key Security Rule

Only server code should ever use `SUPABASE_SECRET_KEY`.

Never put secret keys in:

- `NEXT_PUBLIC_*`
- `EXPO_PUBLIC_*`
- committed `.env` files
