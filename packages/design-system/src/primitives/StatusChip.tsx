import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";
import { PluckrIcon, type PluckrIconName } from "./Icon";

type StatusChipProps = {
  label: string;
  tone?: "success" | "neutral" | "accent";
  icon?: PluckrIconName;
  onPress?: () => void;
};

export function StatusChip({
  label,
  tone = "neutral",
  icon,
  onPress
}: StatusChipProps) {
  const content = (
    <View
      style={[
        styles.base,
        tone === "success"
          ? styles.success
          : tone === "accent"
            ? styles.accent
            : styles.neutral
      ]}
    >
      {icon ? (
        <PluckrIcon
          name={icon}
          size={pluckrAppTheme.iconSizes.sm}
          color={
            tone === "success" || tone === "accent"
              ? pluckrAppTheme.colors.sageStrong
              : pluckrAppTheme.colors.textSecondary
          }
          strokeWidth={2.1}
        />
      ) : null}
      <Text
        style={[
          styles.label,
          tone === "success" || tone === "accent"
            ? styles.successLabel
            : styles.neutralLabel
        ]}
      >
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
  neutral: {
    backgroundColor: pluckrAppTheme.colors.surface,
    borderColor: pluckrAppTheme.colors.border
  },
  success: {
    backgroundColor: pluckrAppTheme.colors.successSurface,
    borderColor: "transparent"
  },
  accent: {
    backgroundColor: pluckrAppTheme.colors.infoSurface,
    borderColor: "transparent"
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  neutralLabel: {
    color: pluckrAppTheme.colors.textPrimary
  },
  successLabel: {
    color: pluckrAppTheme.colors.sageStrong
  },
  pressed: {
    opacity: 0.72
  }
});
