import { StyleSheet } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

export const pluckrImageConsentStageStyles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
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
    fontSize: pluckrAppTheme.typography.display,
    lineHeight: 40,
    fontWeight: "700"
  },
  subtitle: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24,
    marginTop: pluckrAppTheme.spacing.sm
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
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
  },
  detailStack: {
    gap: pluckrAppTheme.spacing.md,
    marginTop: pluckrAppTheme.spacing.md
  },
  detailRow: {
    gap: pluckrAppTheme.spacing.xs
  },
  detailLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.caption,
    lineHeight: 18,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  detailValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24
  },
  formStack: {
    gap: pluckrAppTheme.spacing.md
  },
  formCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  previewStack: {
    gap: pluckrAppTheme.spacing.xs
  }
});
