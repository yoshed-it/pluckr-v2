import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";
import { PluckrIcon, type PluckrIconName } from "../../primitives/Icon";

type QuickAction = {
  key: string;
  label: string;
  icon: PluckrIconName;
  onPress?: () => void;
  accent?: boolean;
  disabled?: boolean;
};

type Props = {
  actions: QuickAction[];
};

export function QuickActionGrid({ actions }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Actions</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {actions.map((action) => (
          <Pressable
            key={action.key}
            accessibilityRole="button"
            disabled={action.disabled || !action.onPress}
            onPress={action.onPress}
          >
            {({ pressed }) => (
              <View style={pressed ? styles.pressed : null}>
                <View
                  style={[
                    styles.tileShell,
                    action.accent ? styles.accentShell : styles.defaultShell
                  ]}
                >
                  <View style={[styles.tile, action.disabled ? styles.disabled : null]}>
                    <PluckrIcon
                      name={action.icon}
                      size={pluckrAppTheme.iconSizes.md}
                      color={
                        action.accent
                          ? pluckrAppTheme.colors.surface
                          : pluckrAppTheme.colors.textPrimary
                      }
                    />
                    <Text style={[styles.label, action.accent ? styles.accentLabel : null]}>
                      {action.label}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700"
  },
  grid: {
    gap: 10,
    paddingRight: 4
  },
  tileShell: {
    width: 84,
    borderWidth: 1,
    borderRadius: pluckrAppTheme.radii.card,
    borderColor: pluckrAppTheme.colors.border
  },
  defaultShell: {
    backgroundColor: pluckrAppTheme.colors.surface
  },
  accentShell: {
    backgroundColor: pluckrAppTheme.colors.sageStrong,
    borderColor: "transparent",
    opacity: 0.96
  },
  tile: {
    minHeight: 76,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  label: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
    textAlign: "center"
  },
  accentLabel: {
    color: pluckrAppTheme.colors.surface
  },
  disabled: {
    opacity: 0.5
  },
  pressed: {
    opacity: 0.78
  }
});
