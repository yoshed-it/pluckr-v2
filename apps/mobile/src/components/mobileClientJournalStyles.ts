/**
 * Shared styles for the mobile client journal screen.
 */
import { StyleSheet } from "react-native";

import { mobileTheme } from "../theme";

export const styles = StyleSheet.create({
  container: {
    gap: mobileTheme.spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: mobileTheme.spacing.xs
  },
  link: {
    color: mobileTheme.colors.sageStrong,
    fontSize: mobileTheme.typography.body,
    fontWeight: "600"
  },
  logoutLink: {
    color: mobileTheme.colors.critical,
    fontSize: mobileTheme.typography.body,
    fontWeight: "600"
  },
  eyebrow: {
    color: mobileTheme.colors.sageStrong,
    fontSize: mobileTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: mobileTheme.spacing.xs
  },
  title: {
    color: mobileTheme.colors.textPrimary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700"
  },
  subtitle: {
    color: mobileTheme.colors.textSecondary,
    fontSize: mobileTheme.typography.body,
    lineHeight: 24,
    marginTop: mobileTheme.spacing.sm
  },
  metaRow: {
    gap: mobileTheme.spacing.sm,
    marginTop: mobileTheme.spacing.md
  },
  metaChip: {
    alignSelf: "flex-start",
    color: mobileTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: mobileTheme.radii.full,
    overflow: "hidden",
    fontSize: mobileTheme.typography.caption,
    fontWeight: "700"
  },
  metaCopy: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  heroActions: {
    marginTop: mobileTheme.spacing.lg
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20
  },
  error: {
    color: mobileTheme.colors.critical
  },
  success: {
    color: mobileTheme.colors.success
  },
  formStack: {
    gap: mobileTheme.spacing.md
  },
  sectionTitle: {
    color: mobileTheme.colors.textPrimary,
    fontSize: mobileTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
  },
  emptyState: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  listStack: {
    gap: mobileTheme.spacing.sm
  },
  cardTitle: {
    color: mobileTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700"
  },
  cardBody: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: mobileTheme.spacing.xs
  },
  cardMeta: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: mobileTheme.spacing.sm
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: mobileTheme.spacing.xs,
    marginTop: mobileTheme.spacing.sm
  },
  entryActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: mobileTheme.spacing.md
  }
});
