# Swift Parity Playbook

## Current Goal

Keep the v2 rebuild feeling like the Swift prototype while moving the product onto Expo, Next.js, and Supabase.

That means the first screens should not feel like a redesign. They should feel like the same app on a cleaner stack.

## What Exists Now

The current v2 slice is implemented in both apps:

- web: auth -> organization-aware provider workspace
- mobile: auth -> organization-aware provider workspace
- web: dedicated client list screen with search and add-client flow
- mobile: dedicated client list screen with search and add-client flow
- web: dedicated client journal screen with chart list and chart-entry editing
- mobile: dedicated client journal screen with chart list and chart-entry editing

Shared data behavior now lives in Supabase:

- creating an organization automatically creates the owner membership
- creating an organization automatically creates the first provider row
- a demo seed RPC can create realistic investor data for an empty clinic

Current product direction:

- most users should attach to one organization and enter it directly after sign-in
- organization selection should not remain a normal daily provider destination
- multi-organization support can return later as an admin/settings-level capability

## Swift To V2 Mapping

### Auth

Swift reference:

- `Views/Auth/LoginView.swift`
- `Views/Auth/SignUpView.swift`
- `Views/Auth/ForgotPasswordView.swift`

V2 implementation:

- `apps/web/src/components/AuthStage.tsx`
- `apps/mobile/src/components/MobileAuthStage.tsx`

### Organization / Practice Setup

Swift reference:

- `Views/OrganizationSelectionView.swift`
- `Views/Organization/CreateOrganizationView.swift`

V2 implementation:

- `packages/design-system/src/features/provider-onboarding/OrganizationGate.tsx`
- `supabase/migrations/202606190002_auth_bootstrap_and_demo_seed.sql`

Direction change:

- keep organization creation and attach flows
- stop treating organization picking as the end-state UX for most users
- transition toward sign-in -> attached organization -> provider workspace

### First Workspace

Swift reference:

- organization-aware provider/client workflow across the existing charting app

V2 implementation:

- `packages/design-system/src/features/provider-dashboard/ProviderDashboard.tsx`
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

1. tighten sign-in -> setup -> workspace routing
2. simplify the one-user / one-org attachment flow
3. improve add-client and client workspace behavior
4. port image and consent workflows end-to-end
5. port provider/admin management
6. harden auth once the care-first flows are stable

## How To Verify This Slice

1. run `npm install`
2. run `npx supabase db push`
3. run `npm run dev:web`
4. run `npm run start:mobile`
5. create an account or sign in
6. enter the attached organization or complete setup if none exists
7. seed demo data if the workspace is empty
8. confirm clients and recent charts render in both apps
9. open a client from the client list
10. create, edit, and delete a chart entry in both apps
