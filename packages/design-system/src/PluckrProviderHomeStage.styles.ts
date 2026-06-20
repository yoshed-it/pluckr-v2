import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

export const pluckrProviderHomeStageStyles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  header: {
    gap: pluckrAppTheme.spacing.xs
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.display,
    lineHeight: 42,
    fontWeight: "700"
  },
  organizationName: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24
  },
  subtitle: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.caption,
    lineHeight: 18
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
  error: {
    color: pluckrAppTheme.colors.critical
  },
  success: {
    color: pluckrAppTheme.colors.success
  },
  emptyState: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24
  },
  actionStack: {
    gap: pluckrAppTheme.spacing.md
  },
  cardStack: {
    gap: pluckrAppTheme.spacing.sm
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(44, 62, 80, 0.08)"
  },
  clientRowCopy: {
    flex: 1
  },
  addPill: {
    minHeight: 32,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(127, 183, 133, 0.14)"
  },
  addPillLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  removePill: {
    minHeight: 32,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(184, 61, 61, 0.08)"
  },
  removePillLabel: {
    color: pluckrAppTheme.colors.critical,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  clientCard: {
    paddingVertical: pluckrAppTheme.spacing.sm
  },
  activityCard: {
    paddingVertical: pluckrAppTheme.spacing.sm,
    gap: pluckrAppTheme.spacing.xxs
  },
  clientName: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24,
    fontWeight: "700"
  },
  clientMeta: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  activityMeta: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    lineHeight: 18,
    fontWeight: "600"
  }
});
