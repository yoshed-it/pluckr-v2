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
    backgroundColor: pluckrAppTheme.colors.surface,
    shadowColor: "#1C1C1C",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3
    },
    elevation: 1
  },
  regular: {
    padding: 20
  },
  compact: {
    padding: 14
  },
  accent: {
    backgroundColor: "#F2F7F2"
  }
});
