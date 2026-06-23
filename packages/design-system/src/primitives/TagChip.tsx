import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";
import { PluckrIcon, type PluckrIconName } from "./Icon";

type TagChipProps = {
  label: string;
  icon?: PluckrIconName;
  variant?: "filled" | "outline";
  onPress?: () => void;
};

export function TagChip({
  label,
  icon,
  variant = "filled",
  onPress
}: TagChipProps) {
  const content = (
    <View style={[styles.base, variant === "outline" ? styles.outline : styles.filled]}>
      {icon ? (
        <PluckrIcon
          name={icon}
          size={pluckrAppTheme.iconSizes.sm}
          color={
            variant === "outline"
              ? pluckrAppTheme.colors.textSecondary
              : pluckrAppTheme.colors.sageStrong
          }
        />
      ) : null}
      <Text style={[styles.label, variant === "outline" ? styles.outlineLabel : styles.filledLabel]}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => <View style={pressed ? styles.pressed : null}>{content}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.pill,
    borderWidth: 1
  },
  filled: {
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    borderColor: "transparent"
  },
  outline: {
    backgroundColor: pluckrAppTheme.colors.surface,
    borderColor: pluckrAppTheme.colors.border
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  filledLabel: {
    color: pluckrAppTheme.colors.textPrimary
  },
  outlineLabel: {
    color: pluckrAppTheme.colors.textSecondary
  },
  pressed: {
    opacity: 0.72
  }
});
