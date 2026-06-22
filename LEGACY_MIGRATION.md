# Legacy Migration

This file tracks every deprecated UI file, compatibility shim, and legacy folder
that exists during the stabilization sprint.

## Rules

- Do not delete a file unless its replacement exists.
- Do not delete a file unless no code imports it.
- Do not delete a file unless typecheck passes afterward.
- Do not delete a file unless the app still runs or builds to the current baseline.
- Record every deletion here.
- If unsure, convert the file into a shim instead of deleting it.

## Validation Commands

```bash
rg "apps/mobile/src/components|apps/web/src/components" .
rg "packages/design-system/src/Pluckr" .
rg "from .*deprecated" .
rg "TODO\\(legacy\\)|LEGACY|deprecated" .
```

## Status Key

- `active`: file still exists and may still own behavior
- `shim`: temporary compatibility layer or re-export
- `migrated`: replacement exists and imports have moved; safe delete check remains
- `deleted`: removed after replacement, import search, typecheck, and app validation

## Mobile Legacy Folder

| owner | file/component | current location | replacement location | category | still imported by | migration stage | removal stage | delete criteria | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| platform sprint | BrandHeader | `apps/mobile/src/components/BrandHeader.tsx` | `packages/design-system/src/composite/BrandHeader.tsx` | composite | deleted | 0 | 5 | deleted on 2026-06-22 after `rg -n "\\bBrandHeader\\b" . --glob '!node_modules'` showed no code imports outside docs/tracker and typecheck/build stayed green | deleted |
| platform sprint | MobileAuthStage | `apps/mobile/src/components/MobileAuthStage.tsx` | `packages/design-system/src/features/provider-onboarding/AuthStage.tsx` | feature | deleted | 0 | 5 | deleted after `rg -n "from .*MobileAuthStage|MobileAuthStage" .` showed no code imports and typecheck stayed green | deleted |
| platform sprint | MobileClientJournalStage | `apps/mobile/src/components/MobileClientJournalStage.tsx` | `packages/design-system/src/features/provider-clients/ClientJournalStage.tsx` | feature | deleted | 0 | 6 | deleted after `rg -n "from .*MobileClientJournalStage|MobileClientJournalStage" .` showed no code imports and typecheck/build stayed green | deleted |
| platform sprint | MobileClientListStage | `apps/mobile/src/components/MobileClientListStage.tsx` | `packages/design-system/src/features/provider-clients/ClientListStage.tsx` | feature | deleted | 0 | 5 | deleted after `rg -n "from .*MobileClientListStage|MobileClientListStage" .` showed no code imports and typecheck/build stayed green | deleted |
| platform sprint | MobileOrganizationStage | `apps/mobile/src/components/MobileOrganizationStage.tsx` | `packages/design-system/src/features/provider-onboarding/OrganizationGate.tsx` | feature | deleted | 0 | 5 | deleted after `rg -n "from .*MobileOrganizationStage|MobileOrganizationStage" .` showed no code imports and typecheck stayed green | deleted |
| platform sprint | MobileWorkspaceStage | `apps/mobile/src/components/MobileWorkspaceStage.tsx` | `packages/design-system/src/PluckrProviderHomeStage.tsx` | feature | deleted | 0 | 5 | deleted after `rg -n "from .*MobileWorkspaceStage|MobileWorkspaceStage" .` showed no code imports and typecheck/build stayed green | deleted |
| platform sprint | OrganizationCard | `apps/mobile/src/components/OrganizationCard.tsx` | `packages/design-system/src/PluckrOrganizationCard.tsx` | composite | deleted | 0 | 5 | deleted on 2026-06-22 together with `PaperCard.tsx` after `rg -n "\\b(OrganizationCard|PaperCard)\\b" . --glob '!node_modules'` showed no runtime imports and typecheck/build stayed green | deleted |
| platform sprint | PaperCard | `apps/mobile/src/components/PaperCard.tsx` | `packages/design-system/src/primitives/Card.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 together with `OrganizationCard.tsx` after import proof and passing typecheck/build | deleted |
| platform sprint | PluckrButton | `apps/mobile/src/components/PluckrButton.tsx` | `packages/design-system/src/primitives/Button.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after `rg -n "\\bPluckrButton\\b" . --glob '!node_modules'` showed no app-folder runtime imports and typecheck/build stayed green | deleted |
| platform sprint | PluckrTextField | `apps/mobile/src/components/PluckrTextField.tsx` | `packages/design-system/src/primitives/TextField.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after `rg -n "\\bPluckrTextField\\b" . --glob '!node_modules'` showed no app-folder runtime imports and typecheck/build stayed green | deleted |
| platform sprint | mobileClientJournalStyles | `apps/mobile/src/components/mobileClientJournalStyles.ts` | delete with `MobileClientJournalStage.tsx` | delete | deleted | 0 | 6 | paired feature file removed with `MobileClientJournalStage.tsx`; typecheck/build stayed green | deleted |
| platform sprint | mobileClientListStyles | `apps/mobile/src/components/mobileClientListStyles.ts` | delete with `MobileClientListStage.tsx` | delete | deleted | 0 | 5 | paired feature file removed with `MobileClientListStage.tsx`; typecheck/build stayed green | deleted |
| platform sprint | mobileWorkspaceStyles | `apps/mobile/src/components/mobileWorkspaceStyles.ts` | delete with `MobileWorkspaceStage.tsx` | delete | deleted | 0 | 5 | paired feature file removed with `MobileWorkspaceStage.tsx`; typecheck/build stayed green | deleted |

## Web Legacy Folder

| owner | file/component | current location | replacement location | category | still imported by | migration stage | removal stage | delete criteria | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| platform sprint | AuthStage | `apps/web/src/components/AuthStage.tsx` | `packages/design-system/src/features/provider-onboarding/AuthStage.tsx` | feature | deleted | 0 | 5 | deleted after `rg -n "from .*AuthStage|AuthStage" .` showed no code imports and typecheck stayed green | deleted |
| platform sprint | BrandHero | `apps/web/src/components/BrandHero.tsx` | `packages/design-system/src/composite/BrandHeader.tsx` | composite | deleted | 0 | 5 | deleted on 2026-06-22 after `rg -n "\\bBrandHero\\b" . --glob '!node_modules'` showed no code imports outside docs/tracker and typecheck/build stayed green | deleted |
| platform sprint | ClientJournalStage | `apps/web/src/components/ClientJournalStage.tsx` | `packages/design-system/src/features/provider-clients/ClientJournalStage.tsx` | feature | deleted | 0 | 6 | deleted after `rg -n "from .*ClientJournalStage|ClientJournalStage" .` showed no code imports and typecheck/build stayed green | deleted |
| platform sprint | ClientListStage | `apps/web/src/components/ClientListStage.tsx` | `packages/design-system/src/features/provider-clients/ClientListStage.tsx` | feature | deleted | 0 | 5 | deleted after `rg -n "from .*ClientListStage|ClientListStage" .` showed no code imports and typecheck/build stayed green | deleted |
| platform sprint | MetricPill | `apps/web/src/components/MetricPill.tsx` | `packages/design-system/src/composite/SectionHeader.tsx` | composite | deleted | 0 | 5 | deleted on 2026-06-22 after `rg -n "\\bMetricPill\\b" . --glob '!node_modules'` showed no runtime imports and typecheck/build stayed green | deleted |
| platform sprint | OrganizationStage | `apps/web/src/components/OrganizationStage.tsx` | `packages/design-system/src/features/provider-onboarding/OrganizationGate.tsx` | feature | deleted | 0 | 5 | deleted after `rg -n "from .*OrganizationStage|OrganizationStage" .` showed no code imports and typecheck stayed green | deleted |
| platform sprint | PaperPanel | `apps/web/src/components/PaperPanel.tsx` | `packages/design-system/src/primitives/Card.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after `rg -n "\\bPaperPanel\\b" . --glob '!node_modules'` showed no code imports outside docs/tracker and typecheck/build stayed green | deleted |
| platform sprint | WorkspaceStage | `apps/web/src/components/WorkspaceStage.tsx` | `packages/design-system/src/PluckrProviderHomeStage.tsx` | feature | deleted | 0 | 5 | deleted after `rg -n "from .*WorkspaceStage|WorkspaceStage" .` showed no code imports and typecheck/build stayed green | deleted |
| platform sprint | PluckrWebApp | `apps/web/src/components/PluckrWebApp.tsx` | keep as web wrapper | wrapper | `apps/web/src/app/page.tsx` | 0 | n/a | wrapper stays; only delete if web shell ownership moves | active |

## Flat Shared UI Shims And Legacy Screens

| owner | file/component | current location | replacement location | category | still imported by | migration stage | removal stage | delete criteria | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| platform sprint | PluckrButton | `packages/design-system/src/PluckrButton.tsx` | `packages/design-system/src/primitives/Button.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./primitives/Button`, root barrel exported the primitive directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrCard | `packages/design-system/src/PluckrCard.tsx` | `packages/design-system/src/primitives/Card.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./primitives/Card`, root barrel exported the primitive directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrTextField | `packages/design-system/src/PluckrTextField.tsx` | `packages/design-system/src/primitives/TextField.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./primitives/TextField`, root barrel exported the primitive directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrIcon | `packages/design-system/src/PluckrIcon.tsx` | `packages/design-system/src/primitives/Icon.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./primitives/Icon`, root barrel exported the primitive directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrIconButton | `packages/design-system/src/PluckrIconButton.tsx` | `packages/design-system/src/primitives/IconButton.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./primitives/IconButton`, root barrel exported the primitive directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrNoticeBanner | `packages/design-system/src/PluckrNoticeBanner.tsx` | `packages/design-system/src/primitives/NoticeBanner.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./primitives/NoticeBanner`, root barrel exported the primitive directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrBottomDrawer | `packages/design-system/src/PluckrBottomDrawer.tsx` | `packages/design-system/src/primitives/BottomSheet.tsx` | primitive | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./primitives/BottomSheet`, root barrel exported the primitive directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrBrandHeader | `packages/design-system/src/PluckrBrandHeader.tsx` | `packages/design-system/src/composite/BrandHeader.tsx` | composite | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./composite/BrandHeader`, root barrel exported the composite directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrSectionHeader | `packages/design-system/src/PluckrSectionHeader.tsx` | `packages/design-system/src/composite/SectionHeader.tsx` | composite | deleted | 0 | 4 | deleted on 2026-06-22 after internal imports moved to `./composite/SectionHeader`, root barrel exported the composite directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrFolioPanel | `packages/design-system/src/PluckrFolioPanel.tsx` | `packages/design-system/src/features/provider-dashboard/FolioPanel.tsx` | feature | deleted | 0 | 5 | deleted on 2026-06-22 after root barrel exported the feature directly and no imports remained to the shim path | deleted |
| platform sprint | PluckrFolioPickerDrawer | `packages/design-system/src/PluckrFolioPickerDrawer.tsx` | `packages/design-system/src/features/provider-dashboard/FolioPickerDrawer.tsx` | feature | deleted | 0 | 5 | deleted on 2026-06-22 after root barrel exported the feature directly and no imports remained to the shim path | deleted |
| platform sprint | PluckrProviderHomeHero | `packages/design-system/src/PluckrProviderHomeHero.tsx` | `packages/design-system/src/features/provider-dashboard/ProviderHomeHero.tsx` | feature | deleted | 0 | 5 | deleted on 2026-06-22 after root barrel exported the feature directly and no imports remained to the shim path | deleted |
| platform sprint | PluckrRecentClientsPanel | `packages/design-system/src/PluckrRecentClientsPanel.tsx` | `packages/design-system/src/features/provider-dashboard/RecentClientsPanel.tsx` | feature | deleted | 0 | 5 | deleted on 2026-06-22 after root barrel exported the feature directly and no imports remained to the shim path | deleted |
| platform sprint | PluckrRecentActivityPanel | `packages/design-system/src/PluckrRecentActivityPanel.tsx` | `packages/design-system/src/features/provider-dashboard/RecentActivityPanel.tsx` | feature | deleted | 0 | 5 | deleted on 2026-06-22 after root barrel exported the feature directly and no imports remained to the shim path | deleted |
| platform sprint | PluckrProviderHomeStage | `packages/design-system/src/PluckrProviderHomeStage.tsx` | `packages/design-system/src/features/provider-dashboard/ProviderDashboard.tsx` | feature | deleted | 0 | 5 | deleted on 2026-06-22 after the shared shell imported `features/provider-dashboard/ProviderDashboard` directly, root barrel exported the feature directly, and typecheck/build stayed green | deleted |
| platform sprint | PluckrProviderHomeStage.styles | `packages/design-system/src/PluckrProviderHomeStage.styles.ts` | `packages/design-system/src/features/provider-dashboard/providerDashboardStyles.ts` | delete | deleted | 0 | 5 | deleted on 2026-06-22 together with `PluckrProviderHomeStage.tsx` after no imports remained to the shim path | deleted |
| platform sprint | PluckrAppShell | `packages/design-system/src/PluckrAppShell.tsx` | `packages/design-system/src/shell/PluckrAppShell.tsx` | shell | root barrel and app wrappers | 0 | 4 | app wrappers import structured shell or new shell entry directly; no legacy imports remain | shim |
| platform sprint | PluckrAuthStage | `packages/design-system/src/PluckrAuthStage.tsx` | `packages/design-system/src/features/provider-onboarding/AuthStage.tsx` | feature | moved | 0 | 5 | file moved on 2026-06-22; shell and barrel import the feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrOrganizationStage | `packages/design-system/src/PluckrOrganizationStage.tsx` | `packages/design-system/src/features/provider-onboarding/OrganizationGate.tsx` | feature | moved | 0 | 5 | file moved on 2026-06-22; shell and barrel import the feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrProviderSetupStage | `packages/design-system/src/PluckrProviderSetupStage.tsx` | `packages/design-system/src/features/provider-onboarding/ProviderSetupStage.tsx` | feature | moved | 0 | 5 | file moved on 2026-06-22; shell and barrel import the feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrSettingsStage | `packages/design-system/src/PluckrSettingsStage.tsx` | `packages/design-system/src/features/settings/SettingsStage.tsx` | feature | moved | 0 | 6 | file moved on 2026-06-22; shell and barrel import the feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrClientListStage | `packages/design-system/src/PluckrClientListStage.tsx` | `packages/design-system/src/features/provider-clients/ClientListStage.tsx` | feature | moved | 0 | 5 | file moved on 2026-06-22; shell and barrel import the feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrClientListStage.styles | `packages/design-system/src/PluckrClientListStage.styles.ts` | `packages/design-system/src/features/provider-clients/ClientListStage.styles.ts` | delete | moved | 0 | 5 | style file moved on 2026-06-22 with its feature; typecheck/build stayed green | migrated |
| platform sprint | PluckrClientJournalStage | `packages/design-system/src/PluckrClientJournalStage.tsx` | `packages/design-system/src/features/provider-clients/ClientJournalStage.tsx` | feature | moved | 0 | 6 | file moved on 2026-06-22; shell and barrel import the feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrClientJournalStage.styles | `packages/design-system/src/PluckrClientJournalStage.styles.ts` | `packages/design-system/src/features/provider-clients/ClientJournalStage.styles.ts` | delete | moved | 0 | 6 | style file moved on 2026-06-22 with its feature; typecheck/build stayed green | migrated |
| platform sprint | PluckrChartEntryEditor | `packages/design-system/src/PluckrChartEntryEditor.tsx` | `packages/design-system/src/features/provider-charting/ChartEntryEditor.tsx` | feature | moved | 0 | 6 | file moved on 2026-06-22; client journal imports the chart feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrChartEntryEditor.styles | `packages/design-system/src/PluckrChartEntryEditor.styles.ts` | `packages/design-system/src/features/provider-charting/ChartEntryEditor.styles.ts` | delete | moved | 0 | 6 | style file moved on 2026-06-22 with its feature; typecheck/build stayed green | migrated |
| platform sprint | PluckrChartDetailPanel | `packages/design-system/src/PluckrChartDetailPanel.tsx` | `packages/design-system/src/features/provider-charting/ChartDetailPanel.tsx` | feature | moved | 0 | 6 | file moved on 2026-06-22; client journal imports the chart feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrImageConsentStage | `packages/design-system/src/PluckrImageConsentStage.tsx` | `packages/design-system/src/features/provider-clients/ImageConsentStage.tsx` | feature | moved | 0 | stop point | file moved on 2026-06-22; shell and barrel import the feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrImageConsentStage.styles | `packages/design-system/src/PluckrImageConsentStage.styles.ts` | `packages/design-system/src/features/provider-clients/ImageConsentStage.styles.ts` | delete | moved | 0 | stop point | style file moved on 2026-06-22 with its feature; typecheck/build stayed green | migrated |
| platform sprint | PluckrSignaturePad | `packages/design-system/src/PluckrSignaturePad.tsx` | future `features/consent/SignaturePad.tsx` or web-safe wrapper | feature | `features/provider-clients/ImageConsentStage.tsx`, root barrel | 0 | stop point | web-safe export path agreed; no broad barrel import; typecheck/build pass | active |
| platform sprint | PluckrAdminStage | `packages/design-system/src/PluckrAdminStage.tsx` | `packages/design-system/src/features/admin/AdminStage.tsx` | feature | moved | 0 | stop point | file moved on 2026-06-22; shell and barrel import the feature path directly; typecheck/build stayed green | migrated |
| platform sprint | PluckrWorkspaceStage | `packages/design-system/src/PluckrWorkspaceStage.tsx` | superseded by provider dashboard feature | feature | deleted | 0 | 5 | deleted after `rg -n "from .*PluckrWorkspaceStage|PluckrWorkspaceStage" .` showed no code imports and typecheck/build stayed green | deleted |
| platform sprint | PluckrWorkspaceStage.styles | `packages/design-system/src/PluckrWorkspaceStage.styles.ts` | delete with `PluckrWorkspaceStage.tsx` | delete | deleted | 0 | 5 | paired file removed with `PluckrWorkspaceStage.tsx`; typecheck/build stayed green | deleted |
| platform sprint | PluckrNavigationBar | `packages/design-system/src/PluckrNavigationBar.tsx` | keep until shell presentation split completes | shell | shared shell | 0 | 4 | shell refactor moves ownership cleanly; no imports remain | active |
| platform sprint | PluckrUtilityBar | `packages/design-system/src/PluckrUtilityBar.tsx` | keep until shell presentation split completes | shell | shared shell | 0 | 4 | shell refactor moves ownership cleanly; no imports remain | active |
| platform sprint | PluckrConfirmDialog | `packages/design-system/src/PluckrConfirmDialog.tsx` | keep or move to composite layer | composite | active feature imports | 0 | stop point | not deleted until replacement exists | active |
| platform sprint | PluckrFullScreenImageModal | `packages/design-system/src/PluckrFullScreenImageModal.tsx` | keep or move to composite layer | composite | active feature imports | 0 | stop point | not deleted until replacement exists | active |
| platform sprint | PluckrJournalLoadingStage | `packages/design-system/src/PluckrJournalLoadingStage.tsx` | keep or move to shell/loading feature | feature | shared shell | 0 | stop point | not deleted until replacement exists | active |
| platform sprint | PluckrLaunchStage | `packages/design-system/src/PluckrLaunchStage.tsx` | keep or move to shell/loading feature | feature | shared shell | 0 | stop point | not deleted until replacement exists | active |
| platform sprint | PluckrOptionDrawer | `packages/design-system/src/PluckrOptionDrawer.tsx` | keep or move to composite layer | composite | active feature imports | 0 | stop point | not deleted until replacement exists | active |
| platform sprint | PluckrProbeDrawer | `packages/design-system/src/PluckrProbeDrawer.tsx` | `packages/design-system/src/features/provider-charting/ProbeDrawer.tsx` | feature | moved | 0 | 6 | file moved on 2026-06-22 with the chart feature group; typecheck/build stayed green | migrated |
| platform sprint | PluckrStepPickerDrawer | `packages/design-system/src/PluckrStepPickerDrawer.tsx` | keep or move to composite/chart layer | feature | active feature imports | 0 | 6 | not deleted until replacement exists | active |
| platform sprint | PluckrTagPickerDrawer | `packages/design-system/src/PluckrTagPickerDrawer.tsx` | keep or move to composite layer | feature | active feature imports | 0 | 6 | not deleted until replacement exists | active |
| platform sprint | PluckrOrganizationCard | `packages/design-system/src/PluckrOrganizationCard.tsx` | keep or move to structured feature folder | composite | active stage import | 0 | stop point | not deleted until replacement exists | active |

## Deletion Log

Add entries here when a file moves to `deleted`.

| stage | deleted file | replacement | proof |
| --- | --- | --- | --- |
| 0 | `apps/mobile/src/components/MobileAuthStage.tsx` | `packages/design-system/src/features/provider-onboarding/AuthStage.tsx` | no code imports; typecheck passed after removal |
| 0 | `apps/web/src/components/AuthStage.tsx` | `packages/design-system/src/features/provider-onboarding/AuthStage.tsx` | no code imports; typecheck passed after removal |
| 0 | `apps/mobile/src/components/MobileOrganizationStage.tsx` | `packages/design-system/src/features/provider-onboarding/OrganizationGate.tsx` | no code imports; typecheck passed after removal |
| 0 | `apps/web/src/components/OrganizationStage.tsx` | `packages/design-system/src/features/provider-onboarding/OrganizationGate.tsx` | no code imports; typecheck passed after removal |
| 0 | `apps/mobile/src/components/MobileWorkspaceStage.tsx` | `packages/design-system/src/PluckrProviderHomeStage.tsx` | no code imports; typecheck and web build passed after removal |
| 0 | `apps/mobile/src/components/mobileWorkspaceStyles.ts` | deleted with `MobileWorkspaceStage.tsx` | paired file removal; typecheck and web build passed |
| 0 | `apps/web/src/components/WorkspaceStage.tsx` | `packages/design-system/src/PluckrProviderHomeStage.tsx` | no code imports; typecheck and web build passed after removal |
| 0 | `packages/design-system/src/PluckrWorkspaceStage.tsx` | `packages/design-system/src/PluckrProviderHomeStage.tsx` | no code imports; typecheck and web build passed after removal |
| 0 | `packages/design-system/src/PluckrWorkspaceStage.styles.ts` | deleted with `PluckrWorkspaceStage.tsx` | paired file removal; typecheck and web build passed |
| 0 | `apps/mobile/src/components/MobileClientListStage.tsx` | `packages/design-system/src/features/provider-clients/ClientListStage.tsx` | no code imports; typecheck and web build passed after removal |
| 0 | `apps/mobile/src/components/mobileClientListStyles.ts` | deleted with `MobileClientListStage.tsx` | paired file removal; typecheck and web build passed |
| 0 | `apps/web/src/components/ClientListStage.tsx` | `packages/design-system/src/features/provider-clients/ClientListStage.tsx` | no code imports; typecheck and web build passed after removal |
| 0 | `apps/mobile/src/components/MobileClientJournalStage.tsx` | `packages/design-system/src/features/provider-clients/ClientJournalStage.tsx` | no code imports; typecheck and web build passed after removal |
| 0 | `apps/mobile/src/components/mobileClientJournalStyles.ts` | deleted with `MobileClientJournalStage.tsx` | paired file removal; typecheck and web build passed |
| 0 | `apps/web/src/components/ClientJournalStage.tsx` | `packages/design-system/src/features/provider-clients/ClientJournalStage.tsx` | no code imports; typecheck and web build passed after removal |
