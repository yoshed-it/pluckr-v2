import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PluckrIcon, type PluckrIconName } from "../../primitives/Icon";
import { PluckrCard } from "../../primitives/Card";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

export type MoreStageItem = {
  key: string;
  label: string;
  description: string;
  icon: PluckrIconName;
  onPress: () => void;
};

type MoreStageProps = {
  items: MoreStageItem[];
};

/**
 * App-wide overflow hub for destinations that should not crowd daily charting.
 */
export function PluckrMoreStage({ items }: MoreStageProps) {
  return (
    <View style={styles.container}>
      <PluckrCard compact>
        <Text style={styles.kicker}>Control Center</Text>
        <View style={styles.grid}>
          {items.map((item) => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={({ pressed }) => [
                styles.item,
                pressed ? styles.pressed : null
              ]}
              onPress={item.onPress}
            >
              <View style={styles.iconWell}>
                <PluckrIcon
                  name={item.icon}
                  size={pluckrAppTheme.iconSizes.md}
                  color={pluckrAppTheme.colors.sageStrong}
                  strokeWidth={2.2}
                />
              </View>
              <View style={styles.copy}>
                <Text style={styles.label}>{item.label}</Text>
                <Text numberOfLines={2} style={styles.description}>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </PluckrCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  kicker: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.sm,
    marginTop: pluckrAppTheme.spacing.md
  },
  item: {
    minWidth: 142,
    flexGrow: 1,
    flexBasis: "46%",
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm,
    minHeight: 72,
    padding: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.lg,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  iconWell: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.mint
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2
  },
  label: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800"
  },
  description: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  pressed: {
    opacity: 0.72
  }
});
