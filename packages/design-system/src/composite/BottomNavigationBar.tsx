import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PluckrIcon, type PluckrIconName } from "../primitives/Icon";
import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

export type BottomNavigationItem = {
  key: string;
  label: string;
  icon: PluckrIconName;
  active?: boolean;
  onPress: () => void;
};

export type BottomNavigationBarProps = {
  items: BottomNavigationItem[];
  primaryAction: {
    label: string;
    icon: PluckrIconName;
    onPress: () => void;
  };
};

/**
 * App-wide provider control center.
 *
 * This intentionally lives in the shell layer so every provider screen gets the
 * same navigation affordance instead of rebuilding tab controls per feature.
 */
export function BottomNavigationBar({
  items,
  primaryAction
}: BottomNavigationBarProps) {
  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <View style={styles.bar}>
        {items.slice(0, 2).map((item) => (
          <NavigationItem key={item.key} item={item} />
        ))}
        <Pressable
          accessibilityLabel={primaryAction.label}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.primaryAction,
            pressed ? styles.pressed : null
          ]}
          onPress={primaryAction.onPress}
        >
          <PluckrIcon
            name={primaryAction.icon}
            size={pluckrAppTheme.iconSizes.xl}
            color={pluckrAppTheme.colors.surface}
            strokeWidth={2.4}
          />
        </Pressable>
        {items.slice(2, 4).map((item) => (
          <NavigationItem key={item.key} item={item} />
        ))}
      </View>
    </View>
  );
}

function NavigationItem({ item }: { item: BottomNavigationItem }) {
  const color = item.active
    ? pluckrAppTheme.colors.sageStrong
    : pluckrAppTheme.colors.textMuted;

  return (
    <Pressable
      accessibilityLabel={item.label}
      accessibilityRole="button"
      accessibilityState={{ selected: item.active }}
      style={({ pressed }) => [
        styles.item,
        item.active ? styles.itemActive : null,
        pressed ? styles.pressed : null
      ]}
      onPress={item.onPress}
    >
      <PluckrIcon
        name={item.icon}
        size={pluckrAppTheme.iconSizes.lg}
        color={color}
        strokeWidth={item.active ? 2.5 : 2.1}
      />
      <Text style={[styles.label, item.active ? styles.labelActive : null]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    paddingHorizontal: pluckrAppTheme.spacing.lg,
    paddingBottom: 12,
    backgroundColor: "rgba(250, 249, 245, 0.92)"
  },
  bar: {
    minHeight: pluckrAppTheme.navigation.bottomBarHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingTop: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.xl,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    shadowColor: pluckrAppTheme.colors.textPrimary,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: -2
    },
    elevation: 8
  },
  item: {
    width: 58,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    borderRadius: pluckrAppTheme.radii.lg
  },
  itemActive: {
    backgroundColor: "rgba(13, 104, 99, 0.06)"
  },
  label: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700"
  },
  labelActive: {
    color: pluckrAppTheme.colors.sageStrong
  },
  primaryAction: {
    width: pluckrAppTheme.navigation.floatingActionSize,
    height: pluckrAppTheme.navigation.floatingActionSize,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.sage,
    shadowColor: pluckrAppTheme.colors.sage,
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8
    },
    elevation: 9
  },
  pressed: {
    opacity: 0.72
  }
});
