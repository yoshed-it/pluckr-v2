import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

export const clinicalMemoryTrendStyles = StyleSheet.create({
  panel: {
    gap: pluckrAppTheme.spacing.sm,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(228, 229, 221, 0.82)",
    backgroundColor: "rgba(237, 246, 241, 0.58)"
  },
  header: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  headerCopy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  latestPill: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  latestLabel: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 10,
    fontWeight: "800"
  },
  latestValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "900"
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  filterChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  filterChipActive: { backgroundColor: pluckrAppTheme.colors.sageStrong },
  filterChipLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "800"
  },
  filterChipLabelActive: { color: "#FFFFFF" },
  metricRow: { flexDirection: "row", gap: 6 },
  metricChip: {
    flex: 1,
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  metricChipActive: { backgroundColor: "rgba(13, 104, 99, 0.14)" },
  metricChipLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "900"
  },
  metricChipLabelActive: { color: pluckrAppTheme.colors.sageStrong },
  chartWrap: {
    height: 142,
    flexDirection: "row",
    gap: 8,
    padding: 10,
    position: "relative",
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.52)",
    overflow: "hidden"
  },
  chartScale: {
    width: 52,
    justifyContent: "space-between"
  },
  scaleLabel: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800"
  },
  chartGrid: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    position: "relative",
    paddingHorizontal: 2
  },
  gridLineTop: {
    position: "absolute",
    top: 5,
    right: 0,
    left: 0,
    height: 1,
    backgroundColor: pluckrAppTheme.colors.divider
  },
  gridLineMid: {
    position: "absolute",
    top: "50%",
    right: 0,
    left: 0,
    height: 1,
    backgroundColor: "rgba(228, 229, 221, 0.54)"
  },
  gridLineBottom: {
    position: "absolute",
    right: 0,
    bottom: 5,
    left: 0,
    height: 1,
    backgroundColor: pluckrAppTheme.colors.divider
  },
  pointColumn: {
    flex: 1,
    minWidth: 26,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative"
  },
  pointStem: {
    width: 3,
    minHeight: 8,
    borderRadius: 999,
    backgroundColor: "rgba(13, 104, 99, 0.2)"
  },
  pointDot: {
    position: "absolute",
    width: 12,
    height: 12,
    marginTop: -6,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: pluckrAppTheme.colors.sageStrong,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  emptyChart: {
    minHeight: 120,
    justifyContent: "center",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.52)"
  },
  emptyTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "900"
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4
  },
  memoryRow: { flexDirection: "row", gap: 8 },
  memoryStat: { flex: 1 },
  memoryLabel: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 10,
    fontWeight: "800"
  },
  memoryValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2
  }
});
