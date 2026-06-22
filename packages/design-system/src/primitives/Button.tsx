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
    minHeight: 50,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  primary: {
    backgroundColor: pluckrAppTheme.colors.sageStrong,
    ...Platform.select({
      web: {
        boxShadow: "0px 4px 8px rgba(15, 23, 42, 0.08)"
      },
      default: {
        shadowColor: "#0F172A",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
          width: 0,
          height: 4
        },
        elevation: 1
      }
    })
  },
  secondary: {
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: "rgba(253, 254, 254, 0.72)"
  },
  disabled: {
    opacity: 0.45
  },
  pressed: {
    opacity: 0.82
  },
  label: {
    fontSize: 16,
    fontWeight: "700"
  },
  primaryLabel: {
    color: "#FFFFFF"
  },
  secondaryLabel: {
    color: pluckrAppTheme.colors.textPrimary
  }
});
