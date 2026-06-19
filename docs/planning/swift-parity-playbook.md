# Swift Parity Playbook

## Current Goal

Keep the v2 rebuild feeling like the Swift prototype while moving the product onto Expo, Next.js, and Supabase.

That means the first screens should not feel like a redesign. They should feel like the same app on a cleaner stack.

## What Exists Now

The current v2 slice is implemented in both apps:

- web: auth -> organization selection -> workspace
- mobile: auth -> organization selection -> workspace

Shared data behavior now lives in Supabase:

- creating an organization automatically creates the owner membership
- creating an organization automatically creates the first provider row
- a demo seed RPC can create realistic investor data for an empty clinic

## Swift To V2 Mapping

### Auth

Swift reference:

- `Views/Auth/LoginView.swift`
- `Views/Auth/SignUpView.swift`
- `Views/Auth/ForgotPasswordView.swift`

V2 implementation:

- `apps/web/src/components/AuthStage.tsx`
- `apps/mobile/src/components/MobileAuthStage.tsx`

### Organization Selection

Swift reference:

- `Views/OrganizationSelectionView.swift`
- `Views/Organization/CreateOrganizationView.swift`

V2 implementation:

- `apps/web/src/components/OrganizationStage.tsx`
- `apps/mobile/src/components/MobileOrganizationStage.tsx`
- `supabase/migrations/202606190002_auth_bootstrap_and_demo_seed.sql`

### First Workspace

Swift reference:

- organization-aware provider/client workflow across the existing charting app

V2 implementation:

- `apps/web/src/components/WorkspaceStage.tsx`
- `apps/mobile/src/components/MobileWorkspaceStage.tsx`
- `packages/supabase/src/organization.ts`

## Next Work, In Order

1. add invite-based organization joining so the secondary org action is real
2. add client detail and client creation flows
3. add chart entry creation so the workspace is no longer read-only
4. port image and consent workflows
5. port provider/admin management

## How To Verify This Slice

1. run `npm install`
2. run `npx supabase db push`
3. run `npm run dev:web`
4. run `npm run start:mobile`
5. create an account or sign in
6. create an organization
7. seed demo data
8. confirm clients and recent charts render in both apps
