import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

export const clientTimelineSectionStyles = StyleSheet.create({
  stack: { gap: pluckrAppTheme.spacing.sm },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm,
    paddingHorizontal: 2
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800"
  },
  subtitle: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 2
  },
  count: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    backgroundColor: "rgba(127, 183, 133, 0.16)"
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.sm
  },
  metricCard: {
    flexBasis: "47%",
    flexGrow: 1,
    gap: 3,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.66)",
    borderWidth: 1,
    borderColor: "rgba(228, 229, 221, 0.82)"
  },
  metricLabel: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  metricValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  snapshotStack: { gap: pluckrAppTheme.spacing.xs },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900"
  },
  latestTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  latestMeta: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700"
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  settingChip: {
    color: pluckrAppTheme.colors.textPrimary,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700"
  },
  breakdownGrid: { gap: pluckrAppTheme.spacing.sm },
  breakdownRow: { gap: 5 },
  breakdownLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  breakdownLabel: {
    flex: 1,
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800"
  },
  breakdownCount: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800"
  },
  breakdownTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    overflow: "hidden"
  },
  breakdownFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: pluckrAppTheme.colors.sageStrong
  },
  coverageRow: { flexDirection: "row", gap: pluckrAppTheme.spacing.sm },
  coverageStat: { flex: 1 },
  coverageValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900"
  },
  helperCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600"
  },
  emptyTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    marginBottom: 6
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  }
});
