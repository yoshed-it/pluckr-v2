# Pluckr Architecture

## Mission

Pluckr is a modular clinical operating system.

Electrology is the first specialty, not the final product. Architecture work
should strengthen the platform without becoming an open-ended rewrite.

## Core Rules

1. Build a platform, not a one-off app.
2. Fix architecture before adding features when the current boundary blocks growth.
3. Keep one source of truth for domain concepts, permissions, design tokens, and shared UI.
4. Compose from tokens -> primitives -> shared components -> feature components -> surfaces.
5. Prefer data-driven behavior over hardcoded UI decisions when a pattern already exists.
6. Keep responsibilities separate:
   - `packages/design-system`: presentation only
   - `packages/app-core`: business logic, controllers, orchestration
   - `packages/domain`: shared product concepts and contracts
   - `packages/supabase`: persistence, storage, auth adapters
7. Treat Provider Workspace, Client Portal, Admin Console, and Public Intake as
   one platform with multiple surfaces.
8. Extend existing systems before inventing parallel ones.
9. Prefer clear architecture over clever abstractions.
10. Keep the app working during refactors.

## Clinical Journey Orientation

Pluckr is organized around clinical journeys, not CRUD entities.

Every major feature should answer:

> What journey is this improving?

Tables and records are implementation details. The product experience should be
designed around how providers and clients move through care.

### Client Journey

- Discover
- Consult
- Treat
- Follow up
- Complete

### Provider Journey

- Prepare
- Treat
- Document
- Review
- Plan next visit

### Media Journey

- Consent
- Capture
- Assign
- Compare
- Archive

### Workflow Journey

- Build
- Assign
- Complete
- Review

Architecture implication:

- screens should not exist only because a table exists
- feature modules should be named by the journey or workflow they support
- domain models should support journey state, not just row shape
- navigation should optimize the next clinical action, not entity management
- backlog items should identify the journey they improve before implementation

## Stabilization Sprint Rules

This sprint is intentionally short.

- No new feature expansion.
- No scheduling.
- No billing.
- No drag-and-drop workflow builder.
- No speculative abstraction.
- Every stage must delete, replace, or simplify existing code.
- Do not create a second system beside the old one and call the work done.

## Package Boundaries

- `packages/domain` must not import app, UI, or data-layer code.
- `packages/design-system` may import `@pluckr/domain`, but must not import
  `@pluckr/app-core` or `@pluckr/supabase`.
- `packages/app-core` may import `@pluckr/domain` and `@pluckr/supabase`.
- `packages/supabase` may import `@pluckr/domain`.
- `apps/mobile` and `apps/web` may compose the package public APIs and add only
  platform-specific behavior.

## File Organization Guide

Future developers and AI agents should decide where a file belongs before
creating it.

### Folder Responsibilities

`apps/mobile`

- Expo entrypoints
- native-only behavior
- camera, privacy, and screenshot blocking
- mobile wrappers only
- no reusable UI unless it is truly mobile-only

`apps/web`

- Next.js routes
- web-only behavior
- server and web upload glue
- web wrappers only
- no reusable UI unless it is truly web-only

`packages/design-system`

- shared visual components
- tokens
- primitives
- composite UI
- presentational feature components
- shell layout
- no database calls
- no business logic
- no controller hooks

`packages/app-core`

- business logic
- controller hooks
- navigation state
- permission evaluation
- form orchestration
- selectors and view models
- no visual components
- no Supabase-specific row logic

`packages/domain`

- product truth
- shared types
- entities
- enums
- workflow contracts
- permission capability names
- no React
- no database code
- no UI code

`packages/supabase`

- Supabase client
- repositories
- DTO mapping
- auth and storage adapters
- database-specific types
- no UI
- no product decisions

### File Placement Rule

Before creating a file, ask:

1. Is this UI?
   - Put it in `packages/design-system`.
2. Is this business or app behavior?
   - Put it in `packages/app-core`.
3. Is this a product concept or shared type?
   - Put it in `packages/domain`.
4. Is this database, auth, or storage access?
   - Put it in `packages/supabase`.
5. Is this platform-specific mobile or web behavior?
   - Put it in `apps/mobile` or `apps/web`.

If a file seems to belong in multiple places, split it instead of forcing it
into one layer.

### Naming Rules

- primitives: `Button`, `Card`, `TextField`
- composites: `BrandHeader`, `SectionHeader`, `ConfirmDialog`
- features: `ClientWorkspace`, `TreatmentChart`, `ProviderDashboard`
- shell: `ProviderShell`, `PortalShell`, `AdminShell`
- controllers: `useClientListController`, `useTreatmentChartController`
- domain types: `Client`, `Provider`, `TreatmentSession`
- repositories: `clientRepository`, `chartRepository`
- platform wrappers: `PluckrMobileApp`, `PluckrWebApp`

### Deprecated Zones

Do not add new files to these locations unless the file is a temporary shim:

- `apps/mobile/src/components`
- `apps/web/src/components`
- flat `packages/design-system/src/Pluckr*.tsx`

Every shim must include a removal target in `LEGACY_MIGRATION.md`.

## Legacy Burn-Down

Compatibility shims are temporary migration tools, not permanent architecture.

Every legacy file or shim must have:

- an owner
- a replacement target
- a migration stage
- a removal checkpoint
- a delete proof command in `LEGACY_MIGRATION.md`

Legacy code may survive only if it is:

1. true platform-specific behavior that belongs in `apps/mobile` or `apps/web`
2. a temporary shim with a documented removal checkpoint

## Definition Of Done For This Sprint

- Provider workspace still works on mobile and web.
- `packages/design-system` no longer imports `@pluckr/app-core` or `@pluckr/supabase`.
- New UI is no longer being added to legacy app component folders.
- Replaced legacy files are deleted conservatively.
- Remaining legacy files are tracked with removal targets.
- Product work can resume without continuing the refactor immediately.

## Future Product Language And Org Model

This is a product-language rule for future work. Do not implement broad renames
or practice-management features during the stabilization sprint.

- Keep `Organization` as the internal infrastructure and domain concept.
- Prefer `Practice` as the user-facing product term for now.
- Avoid exposing `Organization` as a daily provider-facing destination.
- Avoid `Group` because it is too vague.
- Avoid `Workspace` as the primary org/practice term for now.

Expected future behavior:

1. An owner or admin creates a Practice.
2. Internally that creates or uses an Organization record.
3. The owner or admin invites users into that Practice.
4. Invited users join that specific Organization through the invite flow.
5. Most users belong to exactly one Practice.
6. If a user belongs to exactly one Practice, resolve it silently and enter the
   provider workspace.
7. If a user belongs to multiple Practices, expose a lightweight `Switch Practice`
   control in account/settings/admin, not as a main provider screen.
8. Owners and admins manage members and assignments from Practice Settings or
   Practice Management later.
9. Multi-practice visibility mainly matters for owners and admins because of
   billing, subscription, settings, and team management.

Product rule:

- `Practice` is the user-facing concept.
- `Organization` is infrastructure.
- Organization selection is not a daily provider workflow.
- `Workspace` remains a possible future language alternative, but not a sprint
  rename target.

Sprint constraint:

- Do not rename code broadly right now.
- Do not build Practice Management right now.
- Do not build a multi-org switcher right now unless required to preserve
  existing behavior.
- Only make sure the architecture does not force a top-level Organization screen
  as a primary provider workflow.
