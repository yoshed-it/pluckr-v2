import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrSectionHeaderProps = {
  title: string;
  count?: number | string | null;
  accessory?: React.ReactNode;
};

export function PluckrSectionHeader({
  title,
  count = null,
  accessory
}: PluckrSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {accessory ?? (count !== null ? <Text style={styles.countChip}>{count}</Text> : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 28,
    fontWeight: "700"
  },
  countChip: {
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.14)",
    minWidth: 34,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    textAlign: "center"
  }
});
