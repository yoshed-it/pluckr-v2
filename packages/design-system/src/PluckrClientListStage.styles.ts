import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

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
  heroActions: {
    marginTop: pluckrAppTheme.spacing.lg
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pluckrAppTheme.spacing.md
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm,
    marginTop: pluckrAppTheme.spacing.lg
  },
  searchField: {
    flex: 1,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    borderRadius: pluckrAppTheme.radii.sm,
    backgroundColor: pluckrAppTheme.colors.surface,
    color: pluckrAppTheme.colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: pluckrAppTheme.typography.body
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
  formStack: {
    gap: pluckrAppTheme.spacing.md
  },
  formCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
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
  pronounsText: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  cardMeta: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: pluckrAppTheme.spacing.sm
  }
});
