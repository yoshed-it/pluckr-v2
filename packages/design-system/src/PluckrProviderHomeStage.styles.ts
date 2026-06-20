import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

export const pluckrProviderHomeStageStyles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  infoCopy: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  logoutLink: {
    color: pluckrAppTheme.colors.critical,
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "600"
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pluckrAppTheme.spacing.md
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 28,
    fontWeight: "700"
  },
  roleChip: {
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  countChip: {
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: pluckrAppTheme.colors.surfaceAccent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700"
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
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(44, 62, 80, 0.08)"
  },
  rowLink: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "600"
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
