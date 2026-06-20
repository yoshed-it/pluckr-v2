# Shell Navigation Map

This document defines the current shell intent for `pluckr-v2` while we finish
Swift parity without inventing a whole new product structure.

## Why This Exists

The old shell drifted into a screen-toggle model:

- dashboard lived inside provider home
- journal back behavior was hardcoded
- screen headers were making local navigation decisions
- context was duplicated across screens instead of owned by the shell

That made the app feel inconsistent even when the underlying data flow worked.

## Top-Level Shell States

These are the shell-owned states we should treat as first-class:

1. `workspace`
   The provider dashboard surface. This is where folio, recent clients,
   activity, and quick-entry actions live.
2. `clients`
   The client directory and add-client flow.
3. `journal`
   A selected client's profile + charting surface.
4. `consent`
   Consent detail and signature capture for the currently selected client.
5. `admin`
   Organization admin surfaces for invites and provider management.

## Required Route Context

Some screens need route context beyond their own name.

### Journal

Journal must know where it was opened from:

- `workspace`
- `clients`

That origin controls the back action. Journal should not always return to the
client list.

### Consent

Consent currently belongs to the selected client's journal flow.

- back returns to `journal`
- selected client remains active

## Shell-Owned Context Bar

The shell should render the persistent top context bar for authenticated
workspace screens.

The context bar owns:

- current organization
- current provider
- current client when applicable
- current screen label
- screen-level quick actions
- back to previous shell state when needed

Screen components should not each invent a separate top toolbar when the shell
already knows the context.

## Snackbar Versus Context Bar

- `context bar`: top, persistent, navigational, stateful
- `snackbar`: bottom, transient, feedback-only

These are different jobs and should stay separate.

## Drawer Strategy

Drawers are useful, but they should sit on top of a stable shell.

Good drawer candidates:

- folio queue / quick client switching
- client quick actions
- lightweight pickers and filters

Bad drawer candidates:

- replacing broken back behavior
- hiding missing information architecture
- acting as a substitute for the context bar

## Immediate Shell Priorities

1. keep shell navigation state explicit
2. preserve journal origin
3. centralize top context in the shell
4. simplify stage-level toolbars
5. then refine dashboard, folio, and snackbar behavior
