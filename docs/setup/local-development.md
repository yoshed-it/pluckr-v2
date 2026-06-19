# Local Development

## Prerequisites

- Node.js 20 or newer
- npm
- access to the shared Supabase project

Optional later:

- Xcode for iOS simulator work
- Android Studio for Android emulator work

## Install

From the repo root:

```bash
npm install
npx supabase db push
```

## Environment Files

Create one shared root `.env.local`.

Use these examples as references:

- `.env.example`
- `apps/web/.env.example`
- `apps/mobile/.env.example`

The app-level `.env.local` files are symlinked to the root file so local development only has one source of truth.

The repo includes these example files:

- `.env.example`
- `apps/web/.env.example`
- `apps/mobile/.env.example`

## Run The Web App

From the repo root:

```bash
npm run dev:web
```

Then sign in or create an account. The current web slice follows the same sequence as the Swift app:

1. sign in or create an account
2. create or select an organization
3. seed demo data if the workspace is empty
4. review client list and recent charts

## Run The Mobile App

From the repo root:

```bash
npm run start:mobile
```

Then use the Expo prompt to launch:

- iOS simulator
- Android emulator
- Expo Go

## Recommended Day-One Team Workflow

Keep it simple:

1. use the hosted Supabase project
2. run the web app locally
3. run the Expo app locally
4. avoid introducing local-only backend differences

Once the app stabilizes, we can add a more advanced local database workflow.
