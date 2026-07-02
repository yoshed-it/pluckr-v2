import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "../../pluckrAppTheme";

export const pluckrClientListStageStyles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pluckrAppTheme.spacing.xs
  },
  link: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "600"
  },
  logoutLink: {
    color: pluckrAppTheme.colors.critical,
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "600"
  },
  heroActions: {
    marginTop: pluckrAppTheme.spacing.md
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm,
    marginTop: pluckrAppTheme.spacing.md
  },
  searchField: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: pluckrAppTheme.colors.backgroundSoft,
    color: pluckrAppTheme.colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 17,
    lineHeight: 22
  },
  formStack: {
    gap: pluckrAppTheme.spacing.md
  },
  profileAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.md
  },
  profileAvatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(12, 104, 99, 0.1)"
  },
  profileAvatarGlyph: {
    color: pluckrAppTheme.colors.sage,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "300"
  },
  intakeSection: {
    gap: pluckrAppTheme.spacing.sm
  },
  intakeSectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  fieldRow: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.sm
  },
  fieldColumn: {
    flex: 1
  },
  formCopy: {
    flex: 1,
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  formActionStack: {
    gap: pluckrAppTheme.spacing.sm
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
  optionalToggle: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md,
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.lg,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  optionalToggleTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  optionalToggleCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2
  },
  optionalToggleIcon: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "500"
  },
  inlineError: {
    color: pluckrAppTheme.colors.critical,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  tagChip: {
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
  emptyStateStack: {
    gap: pluckrAppTheme.spacing.md
  },
  emptyStateTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700"
  },
  emptyState: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  listStack: {
    gap: pluckrAppTheme.spacing.sm
  },
  cardButton: {
    borderRadius: pluckrAppTheme.radii.lg
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.md
  },
  clientCopy: {
    flex: 1
  },
  rowChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs,
    marginTop: pluckrAppTheme.spacing.xs
  },
  rowAccessory: {
    alignItems: "center",
    justifyContent: "center"
  },
  openGlyph: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 22,
    lineHeight: 22,
    fontWeight: "700"
  },
  cardTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700"
  },
  cardBody: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: pluckrAppTheme.spacing.xs
  },
  cardMeta: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: pluckrAppTheme.spacing.sm
  }
});
