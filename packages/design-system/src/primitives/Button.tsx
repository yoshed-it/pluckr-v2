import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent
} from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

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
    minHeight: 46,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: pluckrAppTheme.radii.button,
    alignItems: "center",
    justifyContent: "center"
  },
  primary: {
    backgroundColor: pluckrAppTheme.colors.sageStrong,
    ...Platform.select({
      web: {
        boxShadow: "0px 8px 18px rgba(10, 111, 102, 0.16)"
      },
      default: {
        shadowColor: "#0A6F66",
        shadowOpacity: 0.16,
        shadowRadius: 12,
        shadowOffset: {
          width: 0,
          height: 6
        },
        elevation: 2
      }
    })
  },
  secondary: {
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  disabled: {
    opacity: 0.45
  },
  pressed: {
    opacity: 0.82
  },
  label: {
    fontSize: 15,
    fontWeight: "700"
  },
  primaryLabel: {
    color: "#FFFFFF"
  },
  secondaryLabel: {
    color: pluckrAppTheme.colors.textPrimary
  }
});
