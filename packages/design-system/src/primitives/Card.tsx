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
    borderRadius: pluckrAppTheme.radii.lg,
    backgroundColor: pluckrAppTheme.colors.surface,
    borderWidth: 0.5,
    borderColor: pluckrAppTheme.colors.border,
    ...Platform.select({
      web: {
        boxShadow: "0px 6px 14px rgba(15, 23, 42, 0.045)"
      },
      default: {
        shadowColor: "#0F172A",
        shadowOpacity: 0.045,
        shadowRadius: 14,
        shadowOffset: {
          width: 0,
          height: 6
        },
        elevation: 1
      }
    })
  },
  regular: {
    padding: 18
  },
  compact: {
    padding: 16
  },
  accent: {
    backgroundColor: pluckrAppTheme.colors.surfaceAccent
  }
});
