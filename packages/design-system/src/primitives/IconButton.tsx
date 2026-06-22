import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { PluckrIcon, type PluckrIconName } from "./Icon";
import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

type PluckrIconButtonProps = {
  icon: PluckrIconName;
  accessibilityLabel: string;
  onPress: () => void;
  tone?: "default" | "critical" | "accent";
};

export function PluckrIconButton({
  icon,
  accessibilityLabel,
  onPress,
  tone = "default"
}: PluckrIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        tone === "critical"
          ? styles.critical
          : tone === "accent"
            ? styles.accent
            : styles.defaultTone,
        pressed ? styles.pressed : null
      ]}
    >
      <PluckrIcon
        name={icon}
        size={18}
        color={
          tone === "critical"
            ? pluckrAppTheme.colors.critical
            : tone === "accent"
              ? pluckrAppTheme.colors.sageStrong
              : pluckrAppTheme.colors.textPrimary
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full
  },
  defaultTone: {
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  accent: {
    backgroundColor: pluckrAppTheme.colors.infoSurface
  },
  critical: {
    backgroundColor: pluckrAppTheme.colors.criticalSurface
  },
  pressed: {
    opacity: 0.65
  }
});
