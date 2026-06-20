# Vercel Setup

## What Vercel Is For

Vercel deploys the web app in this repo.

That means:

- `apps/web` goes to Vercel
- `apps/mobile` does not

The mobile app is an Expo app and will be run through Expo tooling, not hosted on Vercel.

## Step 1: Push This Repo to GitHub

Vercel works best when the repo is on GitHub.

## Step 2: Create the Vercel Project

1. In Vercel, create a new project from the GitHub repo.
2. Point the project at this repository.
3. Set the Root Directory to `apps/web`.
4. Let Vercel detect Next.js.

## Step 3: Add Environment Variables

In the Vercel project settings, add:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
```

Add them to:

- Development
- Preview
- Production

## Step 4: Know What Deploys Mean

Vercel creates:

- Preview deployments for non-production branches
- Production deployments from the production branch, usually `main`

That makes it easy for other devs to test branches without touching production.

## Team Rule

Only add server-only secrets in Vercel settings, never in the repo.

That includes:

- `SUPABASE_SECRET_KEY`

## Suggested Early Setup

- one Vercel project for the web prototype
- preview deployments enabled for branch testing
- custom domain later, after the app shape stabilizes
