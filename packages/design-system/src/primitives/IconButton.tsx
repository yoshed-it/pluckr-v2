import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { PluckrIcon, type PluckrIconName } from "./Icon";
import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

type PluckrIconButtonProps = {
  icon: PluckrIconName;
  accessibilityLabel: string;
  onPress: () => void;
  tone?: "default" | "critical" | "accent";
  size?: "sm" | "md" | "lg";
};

export function PluckrIconButton({
  icon,
  accessibilityLabel,
  onPress,
  tone = "default",
  size = "md"
}: PluckrIconButtonProps) {
  const dimension = size === "sm" ? 32 : size === "lg" ? 42 : 36;
  const iconSize =
    size === "sm"
      ? pluckrAppTheme.iconSizes.sm
      : size === "lg"
        ? pluckrAppTheme.iconSizes.lg
        : pluckrAppTheme.iconSizes.md;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          width: dimension,
          height: dimension
        },
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
        size={iconSize}
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
