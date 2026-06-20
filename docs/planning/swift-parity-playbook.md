# Swift Parity Playbook

## Current Goal

Keep the v2 rebuild feeling like the Swift prototype while moving the product onto Expo, Next.js, and Supabase.

That means the first screens should not feel like a redesign. They should feel like the same app on a cleaner stack.

## What Exists Now

The current v2 slice is implemented in both apps:

- web: auth -> organization selection -> workspace
- mobile: auth -> organization selection -> workspace
- web: dedicated client list screen with search and add-client flow
- mobile: dedicated client list screen with search and add-client flow
- web: dedicated client journal screen with chart list and chart-entry editing
- mobile: dedicated client journal screen with chart list and chart-entry editing

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

### Client List

Swift reference:

- `Views/Clients/ClientListView.swift`
- `Views/ClientEdit/AddClientView.swift`

V2 implementation:

- `apps/web/src/components/ClientListStage.tsx`
- `apps/mobile/src/components/MobileClientListStage.tsx`
- `packages/app-core/src/useClientListController.ts`
- `packages/supabase/src/clients.ts`

### Client Journal

Swift reference:

- `Views/Clients/ClientJournalView.swift`
- `Views/Charts/ChartEntryFormView.swift`

V2 implementation:

- `apps/web/src/components/ClientJournalStage.tsx`
- `apps/mobile/src/components/MobileClientJournalStage.tsx`
- `packages/app-core/src/useClientJournalController.ts`
- `packages/supabase/src/charts.ts`

## Next Work, In Order

1. port client editing and deletion flows
2. port image and consent workflows
3. add invite-based organization joining so the secondary org action is real
4. port provider/admin management
5. harden auth once the parity-first flows are stable

## How To Verify This Slice

1. run `npm install`
2. run `npx supabase db push`
3. run `npm run dev:web`
4. run `npm run start:mobile`
5. create an account or sign in
6. create an organization
7. seed demo data
8. confirm clients and recent charts render in both apps
9. open a client from the client list
10. create, edit, and delete a chart entry in both apps
