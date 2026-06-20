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
  adminWrap: {
    maxWidth: 180
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
    gap: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(44, 62, 80, 0.08)"
  },
  clientRowCopy: {
    flex: 1
  },
  rowLink: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "600"
  },
  addPill: {
    minHeight: 34,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(127, 183, 133, 0.16)"
  },
  addPillLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  removePill: {
    minHeight: 34,
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
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md
  },
  privacyRowDisabled: {
    opacity: 0.6
  },
  privacyCopyStack: {
    flex: 1,
    gap: pluckrAppTheme.spacing.xxs
  },
  privacyPill: {
    minWidth: 68,
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: pluckrAppTheme.radii.full,
    alignItems: "center",
    justifyContent: "center"
  },
  privacyPillActive: {
    backgroundColor: "rgba(127, 183, 133, 0.18)"
  },
  privacyPillInactive: {
    backgroundColor: "rgba(44, 62, 80, 0.08)"
  },
  privacyPillLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700"
  },
  privacyPillLabelActive: {
    color: pluckrAppTheme.colors.sageStrong
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
