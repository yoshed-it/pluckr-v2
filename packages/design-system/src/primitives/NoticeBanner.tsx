import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

type Props = {
  tone?: "neutral" | "success" | "error";
  message: string;
};

export function PluckrNoticeBanner({
  tone = "neutral",
  message
}: Props) {
  return (
    <View
      style={[
        styles.container,
        tone === "success"
          ? styles.success
          : tone === "error"
            ? styles.error
            : styles.neutral
      ]}
    >
      <Text
        style={[
          styles.label,
          tone === "success"
            ? styles.successLabel
            : tone === "error"
              ? styles.errorLabel
              : styles.neutralLabel
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: pluckrAppTheme.radii.md,
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.sm
  },
  neutral: {
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  success: {
    backgroundColor: pluckrAppTheme.colors.successSurface
  },
  error: {
    backgroundColor: pluckrAppTheme.colors.criticalSurface
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  neutralLabel: {
    color: pluckrAppTheme.colors.textSecondary
  },
  successLabel: {
    color: pluckrAppTheme.colors.success
  },
  errorLabel: {
    color: pluckrAppTheme.colors.critical
  }
});
