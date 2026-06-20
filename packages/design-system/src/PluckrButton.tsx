import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent
} from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function PluckrButton({
  label,
  onPress,
  disabled = false,
  variant = "primary"
}: PluckrButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" ? styles.primaryLabel : styles.secondaryLabel
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: pluckrAppTheme.radii.md,
    alignItems: "center",
    justifyContent: "center"
  },
  primary: {
    backgroundColor: pluckrAppTheme.colors.sage
  },
  secondary: {
    backgroundColor: "rgba(127, 183, 133, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(127, 183, 133, 0.24)"
  },
  disabled: {
    opacity: 0.6
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  label: {
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "700"
  },
  primaryLabel: {
    color: "#FFFFFF"
  },
  secondaryLabel: {
    color: pluckrAppTheme.colors.sageStrong
  }
});
