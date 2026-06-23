# Pluckr Design Principles

Pluckr is a clinical workspace, not a dashboard app.

## Principles

- Calm
- Clinical
- Efficient
- Native
- Quiet
- Dense where appropriate
- Never playful
- Never dashboard-y

## Core Components

- `TopBar`
- `BottomNavigationBar`
- `Drawer`
- `BottomSheet`
- `Card`
- `Chip`
- `FormSection`
- `TimelineEntry`
- `TreatmentArea`
- `ChartReference`

## Navigation

The bottom navigation is the provider control center. It should remain present
throughout normal provider workflows and only disappear for auth, onboarding,
or full-screen platform flows such as camera or sensitive image review.

The center action is reserved for future quick actions. Keep it visible but
disabled until its behavior is intentionally designed.

## Feedback

Use the snackbar for lightweight confirmations and non-blocking errors. It
appears above bottom navigation, auto-dismisses, and should never cover primary
navigation.
