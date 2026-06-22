# Design System Migration Audit

This audit defines how `pluckr-v2` should move from its current mixed UI state
into a component-first shared design system.

It is intentionally written before deleting large parts of the legacy UI.

## Goal

- one shared design system
- thin platform-specific wrappers only where truly required
- a clear `primitives -> composite -> features -> screens` hierarchy
- no duplicate UI libraries across `apps/mobile`, `apps/web`, and
  `packages/design-system`

## Current State

The repo currently has three overlapping UI layers:

1. shared UI in `packages/design-system/src`
2. legacy mobile UI in `apps/mobile/src/components`
3. legacy web UI in `apps/web/src/components`

This is the main source of confusion and duplication.

## Complexity Hotspots

### Shared design system

- `packages/design-system/src/PluckrAppShell.tsx` — 748 lines
- `packages/design-system/src/PluckrClientJournalStage.tsx` — 522 lines
- `packages/design-system/src/PluckrChartEntryEditor.tsx` — 427 lines
- `packages/design-system/src/PluckrClientJournalStage.styles.ts` — 370 lines
- `packages/design-system/src/PluckrChartEntryEditor.styles.ts` — 280 lines
- `packages/design-system/src/PluckrFolioPanel.tsx` — 271 lines
- `packages/design-system/src/PluckrChartDetailPanel.tsx` — 268 lines
- `packages/design-system/src/PluckrOrganizationStage.tsx` — 260 lines

### App core

- `packages/app-core/src/useClientJournalController.ts` — 419 lines
- `packages/app-core/src/useOrganizationController.ts` — 271 lines
- `packages/app-core/src/useClientDetailController.ts` — 233 lines

### Legacy app layers

- `apps/mobile/src/bootstrap/PluckrCameraCaptureModal.tsx` — 325 lines
- `apps/web/src/components/ClientJournalStage.tsx` — 237 lines
- `apps/web/src/components/ClientListStage.tsx` — 222 lines
- `apps/mobile/src/components/MobileOrganizationStage.tsx` — 211 lines
- `apps/web/src/components/WorkspaceStage.tsx` — 208 lines
- `apps/mobile/src/components/MobileClientJournalStage.tsx` — 200 lines

## Duplicate UI Inventory

### Clear primitive duplication

These should become shared primitives and the legacy copies should be removed
after migration:

- shared `PluckrButton.tsx`
- mobile `apps/mobile/src/components/PluckrButton.tsx`

- shared `PluckrTextField.tsx`
- mobile `apps/mobile/src/components/PluckrTextField.tsx`

- shared `PluckrCard.tsx`
- mobile `apps/mobile/src/components/PaperCard.tsx`
- web `apps/web/src/components/PaperPanel.tsx`

- shared `PluckrBrandHeader.tsx`
- mobile `apps/mobile/src/components/BrandHeader.tsx`
- web `apps/web/src/components/BrandHero.tsx`

### Clear screen duplication

These legacy screens overlap with shared screens and should be treated as
migration targets, not long-term sources of truth:

- shared `PluckrAuthStage.tsx`
- mobile `MobileAuthStage.tsx`
- web `AuthStage.tsx`

- shared `PluckrOrganizationStage.tsx`
- mobile `MobileOrganizationStage.tsx`
- web `OrganizationStage.tsx`

- shared `PluckrClientListStage.tsx`
- mobile `MobileClientListStage.tsx`
- web `ClientListStage.tsx`

- shared `PluckrClientJournalStage.tsx`
- mobile `MobileClientJournalStage.tsx`
- web `ClientJournalStage.tsx`

- shared `PluckrWorkspaceStage.tsx`
- mobile `MobileWorkspaceStage.tsx`
- web `WorkspaceStage.tsx`

### Legitimate platform-specific layer

These should remain platform-specific unless a better shared abstraction is
introduced:

- `apps/mobile/src/bootstrap/PluckrCameraCaptureModal.tsx`
- `apps/mobile/src/bootstrap/usePluckrPrivacyGuard.ts`
- `apps/mobile/src/bootstrap/PluckrMobileApp.tsx`
- `apps/web/src/components/PluckrWebApp.tsx`

## Structural Problems

### 1. Flat design-system folder

Everything currently lives in one folder:

- tokens
- primitives
- composite components
- feature components
- screens
- stylesheets

This makes discoverability poor and encourages screen-first development.

### 2. Naming inconsistency

The current names mix several naming models:

- `Stage`
- `Panel`
- `Card`
- `Drawer`
- `Hero`

There is no explicit mapping between name and architectural layer.

### 3. Hardcoded visual values remain widespread

Many shared components still contain hardcoded `rgba(...)`, `#fff`, and other
non-token color values outside `themeTokens.ts`.

That means the design system is still not fully authoritative.

### 4. Oversized screen components

The largest shared files are still assembling too much custom UI directly.

This violates the desired rule:

- screens compose
- features orchestrate
- primitives render

## Target Architecture

Move `packages/design-system/src` toward this structure:

```txt
src/
  tokens/
    themeTokens.ts
    pluckrTheme.ts

  primitives/
    Button.tsx
    Card.tsx
    Surface.tsx
    TextField.tsx
    IconButton.tsx
    Badge.tsx
    Divider.tsx
    BottomSheet.tsx
    Modal.tsx
    LoadingState.tsx
    EmptyState.tsx

  composite/
    BrandHeader.tsx
    SectionHeader.tsx
    TopBar.tsx
    ClientCard.tsx
    OrganizationCard.tsx
    SearchHeader.tsx
    TimelineItem.tsx

  features/
    provider-dashboard/
      ProviderDashboard.tsx
      ProviderHomeHero.tsx
      FolioPanel.tsx
      RecentClientsPanel.tsx
      RecentActivityPanel.tsx

    client-workspace/
      ClientWorkspace.tsx
      ClientSummaryCard.tsx
      ClientEditPanel.tsx
      ChartList.tsx
      ChartListItem.tsx

    treatment-chart/
      TreatmentChart.tsx
      TreatmentSection.tsx
      MachineSection.tsx
      OutcomeSection.tsx
      ProbeDrawer.tsx
      StepPickerDrawer.tsx
      TagPickerDrawer.tsx

    organization/
      OrganizationSwitcher.tsx
      ProviderSetup.tsx

  screens/
    AuthScreen.tsx
    OrganizationScreen.tsx
    ProviderDashboardScreen.tsx
    ClientListScreen.tsx
    ClientWorkspaceScreen.tsx
    SettingsScreen.tsx
    AdminScreen.tsx

  shell/
    PluckrAppShell.tsx
    AppRouter.tsx
    AppGates.tsx
    ShellNavigation.tsx
```

## Naming Rules

### Keep generic names for primitives

- `Button`
- `Card`
- `Surface`
- `TextField`
- `IconButton`
- `Badge`
- `BottomSheet`

Do not prefix these with `Pluckr`.

### Use domain names for product components

- `ProviderDashboard`
- `ClientWorkspace`
- `TreatmentChart`
- `OrganizationSwitcher`
- `ClinicalMemoryCard`

### Keep `Pluckr` prefix only for app-level infrastructure

- `PluckrAppShell`
- `PluckrTheme`
- `PluckrProvider`

## Migration Plan

### Phase 1. Freeze legacy expansion

- do not add new UI to `apps/mobile/src/components`
- do not add new UI to `apps/web/src/components`
- all new product UI should go into shared design-system components

### Phase 2. Reorganize without behavior changes

- create the new folder structure inside `packages/design-system/src`
- move shared files into architectural buckets
- preserve exports through `index.ts`
- do not rename legacy files yet unless necessary to avoid breaking imports

### Phase 3. Standardize primitives

First-class shared primitives should be:

- `Button`
- `Card`
- `TextField`
- `IconButton`
- `BottomSheet`
- `NoticeBanner`
- `SectionHeader`

Then migrate shared components to use them consistently.

### Phase 4. Extract composite components

Candidates to extract immediately:

- `ClientCard`
- `ChartListItem`
- `ClientSummaryCard`
- `TopBar`
- `SearchHeader`
- `SettingsRow`

### Phase 5. Break oversized screens

Start with:

1. `PluckrAppShell.tsx`
2. `PluckrClientJournalStage.tsx`
3. `PluckrChartEntryEditor.tsx`
4. `PluckrOrganizationStage.tsx`

### Phase 6. Migrate legacy consumers

For each legacy screen:

1. identify imports and runtime entry points
2. replace duplicated primitives with shared ones
3. replace duplicated screens with shared screens
4. confirm mobile and web still build cleanly
5. only then remove unused legacy files

### Phase 7. Remove legacy UI

A legacy component can only be removed when:

- all imports are gone
- app builds cleanly
- shared replacement exists
- behavior is verified

## Immediate Next Steps

1. reorganize the shared design-system folder into architectural buckets
2. keep current exports stable while moving files
3. split `PluckrAppShell` into shell/router/gates/navigation
4. split client journal into smaller domain components
5. do a second pass replacing remaining hardcoded colors with tokens

## Non-Goals During This Refactor

- no broad feature expansion
- no new platform-specific UI unless technically required
- no blind redesign
- no deleting legacy trees until references are removed
