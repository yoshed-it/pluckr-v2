import React, { type PropsWithChildren } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

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
    borderRadius: pluckrAppTheme.radii.card,
    backgroundColor: pluckrAppTheme.colors.surface,
    borderWidth: 0.5,
    borderColor: pluckrAppTheme.colors.border,
    ...Platform.select({
      web: {
        boxShadow: pluckrAppTheme.shadows.paperSoft
      },
      default: {
        shadowColor: "#132238",
        shadowOpacity: 0.05,
        shadowRadius: 14,
        shadowOffset: {
          width: 0,
          height: 8
        },
        elevation: 1
      }
    })
  },
  regular: {
    padding: 16
  },
  compact: {
    padding: 12
  },
  accent: {
    backgroundColor: pluckrAppTheme.colors.surfaceAccent
  }
});
