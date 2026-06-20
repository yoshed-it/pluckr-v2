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
    minHeight: 50,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  primary: {
    backgroundColor: pluckrAppTheme.colors.sageStrong
  },
  secondary: {
    backgroundColor: "rgba(44, 62, 80, 0.06)"
  },
  disabled: {
    opacity: 0.45
  },
  pressed: {
    opacity: 0.82
  },
  label: {
    fontSize: 17,
    fontWeight: "700"
  },
  primaryLabel: {
    color: "#FFFFFF"
  },
  secondaryLabel: {
    color: pluckrAppTheme.colors.textPrimary
  }
});
