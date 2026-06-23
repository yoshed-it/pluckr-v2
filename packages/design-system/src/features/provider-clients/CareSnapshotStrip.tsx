import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";
import { PluckrCard } from "../../primitives/Card";

type SnapshotItem = {
  label: string;
  value: string;
};

type Props = {
  items: SnapshotItem[];
};

export function CareSnapshotStrip({
  items
}: Props) {
  return (
    <PluckrCard accent compact>
      <View style={styles.header}>
        <Text style={styles.title}>Care Snapshot</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stats}
      >
        {items.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Text numberOfLines={1} style={styles.label}>
              {item.label}
            </Text>
            <Text numberOfLines={2} style={styles.value}>
              {item.value}
            </Text>
          </View>
        ))}
      </ScrollView>
    </PluckrCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700"
  },
  stats: {
    gap: 8,
    paddingRight: 4
  },
  statCard: {
    width: 104,
    minHeight: 68,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: pluckrAppTheme.radii.button,
    backgroundColor: pluckrAppTheme.colors.surface,
    borderWidth: 0.5,
    borderColor: pluckrAppTheme.colors.border
  },
  label: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  value: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700"
  }
});
