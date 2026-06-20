import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

export const pluckrWorkspaceStageStyles = StyleSheet.create({
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
  metricGrid: {
    gap: pluckrAppTheme.spacing.sm,
    marginTop: pluckrAppTheme.spacing.lg
  },
  metricLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  metricValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 28,
    fontWeight: "700",
    marginTop: pluckrAppTheme.spacing.xs
  },
  heroActions: {
    gap: pluckrAppTheme.spacing.sm,
    marginTop: pluckrAppTheme.spacing.lg
  },
  heroBadge: {
    color: pluckrAppTheme.colors.sageStrong,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pluckrAppTheme.spacing.md
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
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
  emptyState: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  listStack: {
    gap: pluckrAppTheme.spacing.sm
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
