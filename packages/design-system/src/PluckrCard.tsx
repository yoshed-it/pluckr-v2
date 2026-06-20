import React, { type PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrCardProps = PropsWithChildren<{
  accent?: boolean;
  compact?: boolean;
}>;

export function PluckrCard({
  accent = false,
  compact = false,
  children
}: PluckrCardProps) {
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
    borderRadius: pluckrAppTheme.radii.lg,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surface,
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
    padding: pluckrAppTheme.spacing.lg
  },
  compact: {
    padding: pluckrAppTheme.spacing.md
  },
  accent: {
    backgroundColor: pluckrAppTheme.colors.surfaceAccent
  }
});
