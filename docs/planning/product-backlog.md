# Pluckr Product Backlog

This document turns current product notes into a phased backlog for `pluckr-v2`.
It is intentionally prioritized. It is not a commitment to build everything at
once.

## Planning Rules

- Improve usability first.
- Preserve the old product's workflow and visual intent where it already worked.
- Do not expand scope just because the long-term product needs it eventually.
- Shared UI should stay Expo/React Native-first where possible.
- Business logic, permissions, and persistence should stay outside screens.

## Current Product Goal

The near-term goal is to make Pluckr feel like a usable clinical prototype:

- providers can get into the app
- complete setup without confusion
- add and find clients
- chart treatment quickly
- understand treatment context at a glance
- trust that data is saving and recoverable

## Phase 0: Usability Baseline

Goal: make the app feel stable and coherent enough for daily use and demos.

### Priority 0.1

- Add user-friendly validation for email, phone number, and required fields.
- Rework post-login routing so users land in the correct setup or working state.
- Add save/loading/error/empty state polish across the current auth, org, client, and chart flows.
- Tighten destructive action handling with confirmation patterns on mobile and web.

### Dependencies

- none beyond the current auth/org/client/chart foundation

### Notes

- Validation should be soft while typing and strict on submit.
- This phase should reduce confusion before we add more product surface area.

## Phase 1: Core Client Workflow

Goal: make client intake and client context feel complete.

### Priority 1.1

- Expand Add Client into a proper intake flow.
- Expand Client Profile into a real treatment context surface.
- Add expandable summary notes.
- Surface consent state clearly in both add-client and client-profile flows.

### Add Client Fields

- first name
- last name
- email
- phone
- pronouns
- notes
- image consent status
- optional care summary

### Client Profile Sections

- contact info
- pronouns
- care summary
- consent status
- treatment history
- chart entries
- notes

### Recommended UX Pattern

- mobile: bottom sheet for quick add, full screen when the form becomes longer
- tablet/web: side drawer for quick add, dedicated client profile surface for deeper editing

### Dependencies

- Phase 0 validation
- current client-detail and tag foundation

## Phase 2: Provider Setup And Dashboard

Goal: make the app feel like it belongs to a real provider, not just a loose data shell.

### Priority 2.1

- Add provider profile completion flow.
- Add provider dashboard with minimal daily utility.
- Route users through provider setup if their profile is incomplete.

### Provider Profile Fields

- name
- email
- phone
- role
- pronouns
- default modality preference
- default machine if applicable
- provider notes/settings

### Provider Dashboard MVP

- today / recent activity
- recent clients
- start new chart entry
- incomplete chart entries
- quick add client
- provider setup/profile status

### Dependencies

- Phase 0 routing
- provider data model expansion

## Phase 3: Navigation And App Shell

Goal: make the app structure legible and scalable.

### Priority 3.1

- Add bottom navigation for the primary app areas.
- Add a real context bar that owns current org/client/provider/session context.
- Move secondary actions into context menus instead of cluttering screens.

### Proposed Bottom Tabs

- Dashboard
- Clients
- Capture
- Reports
- Settings

### Context Bar Responsibilities

- current organization
- current client
- current provider
- current treatment/session context
- quick actions
- dropdown menus for secondary actions

### Dependencies

- Phase 1 client profile
- Phase 2 provider dashboard
- naming audit, so the shell does not hard-code messy language

## Phase 4: Permissions And Clinical Safety Foundations

Goal: make the product behave like a real multi-role clinical app.

### Priority 4.1

- Add role-aware permissions model.
- Add audit logs and stronger save-state visibility.
- Define privacy assumptions explicitly in product behavior.

### Minimum Roles

- organization owner
- admin
- provider
- assistant / front desk
- read-only / auditor

### Permission Domains

- client access
- chart creation/editing
- photo access
- consent documents
- settings
- user management
- reports/exports

### Dependencies

- stable provider and organization flows
- settings surface
- clearer naming and navigation model

## Phase 5: Real Clinical Reliability

Goal: cover the missing behavior needed for the app to act like a clinical system rather than only a polished prototype.

### Priority 5.1

- offline/draft handling
- incomplete chart recovery
- deleted record recovery / soft delete flows
- export and report generation
- secure photo handling completion
- stronger consent records
- better audit and activity history

### Dependencies

- permissions
- provider dashboard
- media flow
- charting stability

## Cross-Cutting Backlog

These are not one single phase. They should be pulled in when their parent
flows are touched.

### Validation

- email validation
- phone formatting and validation
- required client field validation
- required provider field validation

### Interaction Polish

- swipe to delete on mobile lists where appropriate
- confirm destructive actions consistently
- drag and drop on web/tablet only where it provides real value

### Product Health

- loading states
- empty states
- error states
- save status
- soft delete / archive consistency

### Future Session Work

- start session timer so a treatment session stays open and usable during active treatment

## Recommended Implementation Order

1. Validation and routing baseline
2. Add Client flow
3. Client Profile expansion
4. Provider Profile
5. Minimal Provider Dashboard
6. Navigation shell: bottom bar + context bar
7. Permissions foundation
8. Offline/drafts/audit/export reliability work

## Data Model Implications

These should guide implementation, not trigger immediate schema churn.

### Clients

- `care_summary` or equivalent summary field
- stronger consent metadata
- archived / soft-delete consistency
- possibly structured contact preferences later

### Providers

- provider profile table likely needs expansion for:
  - pronouns
  - phone
  - default modality
  - default machine
  - provider preferences / notes

### Organizations And Memberships

- role definitions should become explicit and enforced in one place
- multi-org routing needs a stable selected-org model

### Charts

- draft/incomplete status may need an explicit field
- session linkage may need a `session_id` later
- save-state or sync-state may need metadata later

### Sessions

- session timer likely implies a future `treatment_sessions` concept
- do not add it until we decide how sessions relate to chart entries

### Audit / Reporting

- audit log table(s) and report/export surfaces will need explicit scopes
- permission checks should be designed alongside export/report features

## Navigation Architecture Proposal

Recommended shell:

- auth gate
- organization gate
- provider setup gate
- primary app shell

Inside the primary app shell:

- bottom navigation owns primary sections
- context bar owns local context and secondary actions
- client profile becomes the main place to reach treatment charting
- treatment/charting should not need to live as a permanent top-level tab

Recommended destination rules after login:

1. If no organization exists: organization setup
2. If organization exists but provider profile is incomplete: provider setup
3. If user has multiple organizations: organization selection
4. If setup is complete: provider dashboard

## Naming Proposal

Current naming is mixed:

- organizations
- folio
- journal
- workspace

That creates cognitive drag. We should not rename everything immediately.
We should standardize around a small set of product terms.

### Recommended Working Map

- `Organization`: business or clinic container
- `Provider Dashboard`: provider home
- `Clients`: primary list and client-facing work area
- `Client Profile`: client detail surface
- `Treatment Chart` or `Chart Entry`: treatment documentation unit
- `Session`: future live treatment context if timer/session mode is added
- `Reports`: exports, summaries, audits
- `Settings`: provider/org/preferences/admin

### Terms To De-emphasize

- `Workspace`
  - too generic
- `Journal`
  - useful as a metaphor, but may be better as a section label than the core app noun
- `Folio`
  - legacy/internal-feeling unless we deliberately keep it as a product concept

### Recommendation

Use `Dashboard`, `Clients`, `Client Profile`, and `Chart Entry` as the main
visible nouns for now. Keep `journal` as a lower-level internal concept if
needed during migration, but avoid making it the main navigation language.

## Risks

- If we add navigation before naming stabilizes, we may hard-code confusing IA.
- If we add permissions too late, we may build flows that assume every user can do everything.
- If we add dashboard/shell features before client flow is solid, the app may feel broad but shallow.
- If we overbuild scheduling now, it will distract from core treatment documentation.
- If we add session concepts too early, chart/session boundaries may get muddy.

## Open Questions

- Is `care summary` separate from freeform notes, or a structured summary derived from notes?
- Does provider profile live entirely inside membership/provider tables, or partly inside auth user metadata?
- Should assistants/front desk be able to create clients and see consent, but not see chart details?
- Does `Capture` deserve a bottom tab before camera/media flow is excellent?
- Should `Reports` exist early as a placeholder, or wait until export/reporting is real?
- When session timer arrives, is a session required before charting, or optional?

## Immediate Recommendation

Do not try to build the whole backlog now.

Build the next slices in this order:

1. validation + routing cleanup
2. add-client flow expansion
3. client profile expansion
4. provider profile
5. minimal provider dashboard

That sequence should make Pluckr feel meaningfully more usable without
blowing up scope.
