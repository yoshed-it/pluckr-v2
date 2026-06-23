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
  "Client Portal",
  "Messages",
  "Settings",
  "Team",
  "Workflows",
  "Integrations",
  "AI Assistant"
] as const;

/**
 * Permanent destination for app-wide modules that are not daily charting.
 *
 * The chips are informational until a module has a real workflow behind it.
 */
export function PluckrMoreStage() {
  return (
    <View style={styles.container}>
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
          New capabilities will appear here as Pluckr expands. The provider
          workflow remains the primary focus of the current beta.
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
