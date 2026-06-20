/**
 * Shared paper card wrapper for the mobile rebuild.
 */
import React, { type PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { mobileTheme } from "../theme";

type PaperCardProps = PropsWithChildren<{
  accent?: boolean;
  compact?: boolean;
}>;

export function PaperCard({
  accent = false,
  compact = false,
  children
}: PaperCardProps) {
  return (
    <View
      style={[
        styles.card,
        compact ? styles.compact : styles.regular,
        accent ? styles.accent : null
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: mobileTheme.radii.lg,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surface,
    shadowColor: "#2C3E50",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10
    },
    elevation: 3
  },
  regular: {
    padding: mobileTheme.spacing.lg
  },
  compact: {
    padding: mobileTheme.spacing.md
  },
  accent: {
    backgroundColor: mobileTheme.colors.surfaceAccent
  }
});
