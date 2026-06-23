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
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
        <Text style={styles.copy}>
          Additional tools and features will appear here as your practice grows.
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
          Pluckr is being built one workflow at a time. Future updates will
          appear here without disrupting your daily clinical workflow.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.lg,
    minHeight: 420,
    paddingTop: pluckrAppTheme.spacing.sm,
    backgroundColor: pluckrAppTheme.colors.backgroundSoft
  },
  header: {
    gap: pluckrAppTheme.spacing.xs
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.heading,
    lineHeight: 30,
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
    gap: pluckrAppTheme.spacing.sm,
    paddingTop: pluckrAppTheme.spacing.xs,
    paddingBottom: pluckrAppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: pluckrAppTheme.colors.divider
  },
  moduleChip: {
    minHeight: 32,
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.full,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  moduleChipLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800"
  },
  comingSoon: {
    gap: pluckrAppTheme.spacing.xs,
    paddingTop: pluckrAppTheme.spacing.sm
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
