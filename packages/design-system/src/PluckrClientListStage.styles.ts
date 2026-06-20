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
  heroActions: {
    marginTop: pluckrAppTheme.spacing.md
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm,
    marginTop: pluckrAppTheme.spacing.md
  },
  searchField: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: pluckrAppTheme.colors.backgroundSoft,
    color: pluckrAppTheme.colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 17,
    lineHeight: 22
  },
  formStack: {
    gap: pluckrAppTheme.spacing.md
  },
  formCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
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
