import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

export const pluckrChartEntryEditorStyles = StyleSheet.create({
  editorShell: {
    gap: pluckrAppTheme.spacing.md
  },
  editorHeader: {
    gap: pluckrAppTheme.spacing.xs
  },
  kicker: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700"
  },
  copy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18
  },
  memorySection: {
    gap: pluckrAppTheme.spacing.xs,
    paddingBottom: pluckrAppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(44, 62, 80, 0.08)"
  },
  sectionEyebrow: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  memoryTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700"
  },
  memoryCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18
  },
  section: {
    gap: pluckrAppTheme.spacing.sm
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700"
  },
  sectionBody: {
    gap: pluckrAppTheme.spacing.sm
  },
  modalityRow: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.xs
  },
  modalityButton: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.xs,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  modalityButtonActive: {
    backgroundColor: pluckrAppTheme.colors.sage
  },
  modalityLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700",
    textAlign: "center"
  },
  modalityLabelActive: {
    color: "#FFFFFF"
  },
  compactGrid: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.xs
  },
  compactField: {
    flex: 1,
    gap: 2,
    minHeight: 58,
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: 8,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  compactLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  compactValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700"
  },
  compactHint: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 14
  },
  probeSummary: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  tagChip: {
    minHeight: 30,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(127, 183, 133, 0.18)"
  },
  tagChipLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  machineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  machineTile: {
    minWidth: "47%",
    flexGrow: 1,
    minHeight: 72,
    justifyContent: "space-between",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  machineLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  machineValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6
  },
  machineValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "700"
  },
  machineUnit: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "600"
  },
  futureTile: {
    minWidth: "47%",
    flexGrow: 1,
    minHeight: 72,
    justifyContent: "space-between",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.025)"
  },
  futureTileLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "600"
  },
  futureTileCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16
  },
  outcomeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  futurePill: {
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: 7,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  futurePillLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  imageCallout: {
    gap: pluckrAppTheme.spacing.xs,
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.md,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  imageTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700"
  },
  imageCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18
  },
  actionRow: {
    gap: pluckrAppTheme.spacing.sm,
    paddingTop: pluckrAppTheme.spacing.xs
  }
});
