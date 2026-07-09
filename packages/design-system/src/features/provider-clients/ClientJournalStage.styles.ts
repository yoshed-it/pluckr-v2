import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "../../pluckrAppTheme";

export const pluckrClientJournalStageStyles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pluckrAppTheme.spacing.xs
  },
  toolbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.xs
  },
  link: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 15,
    fontWeight: "600"
  },
  contextButton: {
    minHeight: 34,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(44, 62, 80, 0.05)"
  },
  contextButtonLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  logoutLink: {
    color: pluckrAppTheme.colors.critical,
    fontSize: 15,
    fontWeight: "600"
  },
  eyebrow: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: pluckrAppTheme.spacing.xs
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700"
  },
  subtitle: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24,
    marginTop: pluckrAppTheme.spacing.sm
  },
  metaRow: {
    gap: pluckrAppTheme.spacing.sm,
    marginTop: pluckrAppTheme.spacing.md
  },
  contextMetaRow: {
    gap: 2
  },
  metaChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  metaChip: {
    alignSelf: "flex-start",
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.16)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    fontSize: 11,
    fontWeight: "700"
  },
  metaCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  heroActions: {
    marginTop: pluckrAppTheme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  primaryActionWrap: {
    maxWidth: 176
  },
  heroIconActions: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.xs
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20
  },
  error: {
    color: pluckrAppTheme.colors.critical
  },
  success: {
    color: pluckrAppTheme.colors.success
  },
  detailEditorStack: {
    gap: pluckrAppTheme.spacing.sm
  },
  detailSection: {
    gap: pluckrAppTheme.spacing.sm,
    paddingTop: pluckrAppTheme.spacing.xs
  },
  detailSectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  detailSectionCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19
  },
  fieldRow: {
    gap: pluckrAppTheme.spacing.sm
  },
  detailActionRow: {
    gap: pluckrAppTheme.spacing.sm,
    paddingTop: pluckrAppTheme.spacing.xs
  },
  tagSelector: {
    gap: 2,
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: 8,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  tagSelectorLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  tagSelectorValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700"
  },
  archiveButton: {
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(184, 61, 61, 0.08)"
  },
  archiveButtonLabel: {
    color: pluckrAppTheme.colors.critical,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700"
  },
  formStack: {
    gap: pluckrAppTheme.spacing.md
  },
  formCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  sectionBlock: {
    gap: pluckrAppTheme.spacing.sm
  },
  sectionLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700"
  },
  segmentRow: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.sm
  },
  segmentButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: pluckrAppTheme.spacing.sm,
    alignItems: "center"
  },
  segmentButtonActive: {
    backgroundColor: pluckrAppTheme.colors.sage,
    borderColor: pluckrAppTheme.colors.sage
  },
  segmentLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  segmentLabelActive: {
    color: "#FFFFFF"
  },
  machineRow: {
    gap: pluckrAppTheme.spacing.sm
  },
  probeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  probeChip: {
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  probeChipActive: {
    backgroundColor: "rgba(127, 183, 133, 0.18)",
    borderColor: pluckrAppTheme.colors.sageStrong
  },
  probeChipLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  probeChipLabelActive: {
    color: pluckrAppTheme.colors.sageStrong
  },
  imageCallout: {
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.md,
    gap: pluckrAppTheme.spacing.xs
  },
  imageCalloutTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700"
  },
  imageCalloutCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pluckrAppTheme.spacing.md
  },
  countChip: {
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700"
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
  },
  emptyStateStack: {
    gap: pluckrAppTheme.spacing.md
  },
  emptyStateTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700"
  },
  emptyState: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  chartSummaryStack: {
    gap: pluckrAppTheme.spacing.xs
  },
  chartFooter: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: pluckrAppTheme.spacing.xs
  },
  chartFooterLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700"
  },
  listStack: {
    gap: pluckrAppTheme.spacing.sm
  },
  cardDate: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.caption,
    lineHeight: 18,
    marginBottom: pluckrAppTheme.spacing.sm
  },
  cardTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700"
  },
  chartMetricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md,
    marginBottom: pluckrAppTheme.spacing.xs
  },
  metricLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600"
  },
  metricValue: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
    textAlign: "right"
  },
  cardBody: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: pluckrAppTheme.spacing.sm
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs,
    marginTop: pluckrAppTheme.spacing.sm
  },
  imageSection: {
    marginTop: pluckrAppTheme.spacing.md,
    gap: pluckrAppTheme.spacing.sm
  },
  imageMetaRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  imageMetaLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    lineHeight: 18,
    fontWeight: "700"
  },
  imagePreviewRow: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.sm
  },
  imagePreview: {
    width: 64,
    height: 64,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  galleryStack: {
    gap: pluckrAppTheme.spacing.sm
  },
  gallerySubtitle: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 2
  },
  compareButton: {
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.full,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  compareButtonActive: {
    borderColor: pluckrAppTheme.colors.sageStrong,
    backgroundColor: pluckrAppTheme.colors.sageStrong
  },
  compareButtonDisabled: {
    opacity: 0.42
  },
  compareButtonLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800"
  },
  compareButtonLabelActive: {
    color: "#FFFFFF"
  },
  compareHint: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  compareStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.xs,
    paddingHorizontal: 2
  },
  compareStatus: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900"
  },
  comparePanel: {
    gap: pluckrAppTheme.spacing.sm,
    padding: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.xl,
    borderWidth: 1,
    borderColor: "rgba(13, 104, 99, 0.14)",
    backgroundColor: "rgba(237, 246, 241, 0.74)"
  },
  comparePanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  comparePanelTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900"
  },
  comparePanelMeta: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700"
  },
  compareImagesRow: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.sm
  },
  compareColumn: {
    flex: 1,
    minWidth: 0,
    gap: 4
  },
  compareLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  compareImage: {
    width: "100%",
    aspectRatio: 0.82,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  compareDate: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800"
  },
  compareContext: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600"
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.sm
  },
  galleryTile: {
    width: "48%",
    minWidth: 148,
    borderRadius: pluckrAppTheme.radii.lg,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surface,
    position: "relative",
    overflow: "hidden"
  },
  galleryTileSelected: {
    borderColor: pluckrAppTheme.colors.sageStrong,
    borderWidth: 2
  },
  galleryImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  galleryMeta: {
    gap: 2,
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: pluckrAppTheme.spacing.sm
  },
  galleryDate: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800"
  },
  galleryContext: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  selectionBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: pluckrAppTheme.colors.sageStrong
  },
  selectionBadgeInactive: {
    backgroundColor: "rgba(35, 40, 36, 0.64)"
  },
  selectionBadgeLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900"
  },
  entryActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: pluckrAppTheme.spacing.md
  }
});
