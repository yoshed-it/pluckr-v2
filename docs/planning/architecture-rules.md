# Architecture Rules

## Why These Rules Exist

Pluckr v2 is trying to recreate the Swift product without recreating the Swift sprawl.

The goal is:

- keep the look and behavior familiar
- keep data logic separated from UI
- keep files small enough to reason about
- keep shared behavior shared instead of copy-pasted

## Current Structure

### Frontend state and controller logic

- `packages/app-core`

This package owns shared app-flow behavior for web and mobile:

- session hydration
- auth form state and auth actions
- organization selection and creation
- workspace loading and demo seeding
- client list loading, search, and add-client flow
- client journal loading and chart entry editing

This is the MVVM-ish middle layer.

### Backend and data access

- `packages/supabase`
- `supabase/`

This layer owns:

- Supabase clients
- typed records
- organization and workspace queries
- database migrations and policies

UI components should not contain raw Supabase queries if the logic can live here.

### UI and platform surfaces

- `apps/web`
- `apps/mobile`
- `packages/design-system`

These apps should mainly:

- compose controller hooks
- pass props into components
- render thin platform wrappers around shared product UI
- hold platform-specific storage or navigation glue

The shared product UI should mainly live in `packages/design-system` using Expo
React Native components:

- `View`
- `Text`
- `Pressable`
- `ScrollView`
- `TextInput`
- `Image`
- `StyleSheet`

Next should host and route the web app, but it should not become the default
place where product screens are rebuilt with DOM elements.

## Rules We’re Following

1. Keep files under roughly 250 lines when practical.
2. Keep UI components focused on rendering and interaction wiring.
3. Keep data-fetching and mutation logic outside screen components.
4. Prefer shared controller logic over duplicated web/mobile orchestration.
5. Comment files and non-obvious logic, but do not narrate obvious code.
6. Build reusable components only when they remove real duplication.
7. Preserve stable ids and list item boundaries so drag-and-drop can be added later without rewriting the tree shape.
8. Do not build DOM-based product screens unless the screen is truly web-only.
9. Keep Supabase, auth, storage, and server logic outside screen files.

## What Counts As Superfluous Code

We should avoid:

- duplicate auth, workspace, or screen UI across web and mobile
- one-off helper components used once with no clarity benefit
- raw backend calls inside visual components
- DOM-only product implementations that should be shared Expo UI
- giant multipurpose screens with unrelated responsibilities
- premature abstractions for features we do not have yet

We should allow:

- small controller hooks that remove duplication
- shared types for the same workflow across platforms
- small style helper files when they keep screen files readable

## Next Swift Parity Slice

The current implemented slice covers:

- auth
- organization selection and creation
- first workspace summary
- client list with search and add-client flow
- client journal with lightweight chart creation, editing, and deletion

The next slice should deepen, in order:

1. `Views/Charts/ChartEntryFormView.swift` machine settings, probe selection, and stronger validation
2. image and consent workflow parity
3. client editing and richer journal detail parity

That path finishes the core provider workflow instead of jumping to admin or polish features too early.
