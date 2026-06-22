# Swift Parity Checklist

This is the strict execution list for getting `pluckr-v2` to genuinely match
the old Swift app's product behavior and surface area.

Use this list before starting broader roadmap work. No distractions.

## Status Key

- `done`: functionally present and close enough to the Swift app to stop treating it as a parity blocker
- `partial`: present, but still materially behind the Swift app in behavior, structure, or finish
- `missing`: not meaningfully rebuilt yet

## 1. App Shell And Root Gating

### 1.1 Launch / boot feel

- `done` launch screen exists
- `partial` launch polish still differs from old Swift pacing and feel

### 1.2 Auth gate

- `done` login / signup / forgot password basic flow exists
- `partial` validation, messaging, and post-auth routing are still behind the Swift app

### 1.3 Organization gate

- `partial` organization creation and membership attachment exist
- `missing` direct one-user / one-org resolution after sign-in
- `missing` real invite-based organization join flow
- `partial` organization selection still exists too prominently for the intended product model

### 1.4 Provider setup gate

- `missing` provider profile setup gate and completion routing

## 2. Provider Home

### 2.1 Provider home shell

- `partial` provider home exists, but it is still simplified compared to Swift

### 2.2 Daily folio behavior

- `missing` real folio workflow
- `missing` folio picker and add/remove interactions

### 2.3 Home actions and menus

- `partial` some primary actions exist
- `missing` the richer top-level menu structure from Swift
- `missing` roadmap/info button behavior
- `missing` probe-management entry point
- `missing` admin entry points tied to role

### 2.4 Recent clients and activity

- `partial` recent clients and recent chart activity exist
- `partial` still not shaped exactly like the Swift provider home composition

## 3. Client List And Add Client

### 3.1 Client list

- `done` client list exists with search
- `partial` list row behavior and action patterns are still behind Swift

### 3.2 Add client

- `partial` add-client flow exists
- `partial` form fields and UX are still thinner than Swift
- `missing` stronger field validation and formatting

### 3.3 Client deletion / archive flow

- `partial` archive/delete behavior exists in v2 direction
- `partial` destructive-flow polish is still behind Swift

## 4. Client Profile / Journal

### 4.1 Client header

- `partial` client header exists
- `partial` still needs to behave like a care strip instead of drifting toward a profile page
- `missing` preferred-name-first hierarchy and tighter care-context presentation

### 4.2 Client detail surface

- `partial` contact info, notes, consent state, and client tags exist
- `partial` detailed identity/admin info should move toward a secondary details drawer instead of expanding the main care workspace

### 4.3 Client editing

- `partial` edit client exists
- `partial` still needs to feel like a real Swift-equivalent edit flow instead of a bolted-on form

### 4.4 Client tags

- `done` client tags now have a real picker flow
- `partial` still missing a true library-management/admin flow

## 5. Chart Entries

### 5.1 Journal list

- `done` chart list exists
- `partial` still needs deeper parity with the old chart cards and detail affordances

### 5.2 Chart create/edit

- `partial` charting flow exists and is significantly closer now
- `partial` still needs final spacing / density / one-handed polish

### 5.3 Modality / RF / DC / time / probe / area

- `partial` these are all present
- `partial` interaction quality still needs another pass to fully match the Swift feel

### 5.4 Chart tags

- `done` chart tags now have a real picker flow
- `partial` custom-tag library/admin behavior is still simplified

### 5.5 Chart detail view

- `missing` dedicated chart detail surface equivalent to Swift `ChartDetailView`

## 6. Images And Consent

### 6.1 Consent gate

- `partial` consent gate exists
- `missing` real signature-canvas parity
- `missing` richer consent-record viewing behavior

### 6.2 Chart image upload

- `missing` actual photo picker / camera upload flow in v2
- `missing` immediate preview behavior inside charting
- `missing` full chart-image persistence behavior through Supabase storage helpers

### 6.3 Image gallery / full-screen viewing

- `missing` real chart image gallery parity
- `missing` full-screen image viewing parity

### 6.4 Consent-linked image workflow

- `partial` data model and gate are in place
- `missing` full end-to-end workflow parity

## 7. Probe Management

- `missing` probe management screen
- `missing` custom probe creation flow
- `missing` admin/provider probe library behavior

## 8. Organization Management

### 8.1 Join organization

- `missing` real token/link join flow

### 8.2 Manage organizations

- `partial` organization basics exist
- `missing` richer management and switching behavior from the Swift app

## 9. Admin And Provider Management

### 9.1 Admin dashboard

- `missing` admin dashboard parity

### 9.2 Providers management

- `missing` provider management parity

### 9.3 Security diagnostics / admin diagnostics

- `missing` security/admin diagnostics parity

## 10. Reusable System UX

### 10.1 Loading / empty / error states

- `partial` present in some flows
- `partial` not yet systematically parity-matched across the app

### 10.2 Snackbar / transient feedback

- `missing` shared snackbar behavior equivalent to old Swift overlays

### 10.3 Feedback / bug-report affordances

- `missing` feedback and bug-report actions across the app shell

### 10.4 Bottom picker / modal polish

- `partial` shared drawers exist
- `partial` still need final polish and consistency checks

## 11. Naming And Information Architecture

- `partial` new architecture exists, but visible product language is still mixed
- `missing` final parity-safe naming map before broader feature expansion

## 12. Strict Order To Finish Parity

This is the order we should actually work in:

1. images and consent end-to-end
2. chart detail view
3. provider profile setup gate and routing
4. one-user / one-org sign-in routing
5. real join-organization flow
6. provider home / folio parity
7. probe management
8. admin / providers management surfaces
9. shared snackbar / feedback / bug-report utilities
10. final pass on loading / empty / error / destructive-action polish
11. naming audit and parity-safe cleanup
12. only then move into new features / backlog / TODO work

## 13. What Not To Do Yet

Do not treat these as current parity tasks:

- bottom navigation redesign
- reports
- scheduling
- advanced permissions expansion beyond what parity requires
- session timer
- drag-and-drop
- broader dashboard redesign

Those belong after parity unless one becomes necessary to unlock an old Swift behavior.
