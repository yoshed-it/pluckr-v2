import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

const upcomingModules = [
  "Consultations",
  "Scheduling",
  "Photos",
  "Documents",
  "Insurance",
  "Reports",
  "Analytics",
  "AI Assistant",
  "Client Portal",
  "Messages",
  "Workflows",
  "Settings",
  "Team",
  "Integrations"
] as const;

/**
 * Intentional placeholder for app-wide modules that are not daily charting.
 *
 * The chips are display-only for now so unfinished destinations do not feel
 * interactive before their workflows exist.
 */
export function PluckrMoreStage() {
  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.title}>
          More tools and features will live here as Pluckr grows.
        </Text>
        <Text style={styles.copy}>
          This space will collect the larger practice workflows without
          crowding the treatment workspace.
        </Text>
      </View>

      <View style={styles.chipGrid}>
        {upcomingModules.map((module) => (
          <View key={module} style={styles.moduleChip}>
            <Text style={styles.moduleChipLabel}>{module}</Text>
          </View>
        ))}
      </View>

      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonLabel}>Coming Soon</Text>
        <Text style={styles.comingSoonCopy}>
          We will activate these areas as each workflow becomes real enough to
          support clinical use.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.xl,
    paddingTop: pluckrAppTheme.spacing.xs
  },
  intro: {
    gap: pluckrAppTheme.spacing.xs
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 25,
    fontWeight: "800"
  },
  copy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 22,
    fontWeight: "600"
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  moduleChip: {
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.full,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  moduleChipLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "800"
  },
  comingSoon: {
    gap: pluckrAppTheme.spacing.xs,
    paddingTop: pluckrAppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: pluckrAppTheme.colors.divider
  },
  comingSoonLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  comingSoonCopy: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  }
});
