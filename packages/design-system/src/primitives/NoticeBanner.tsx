import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

type Props = {
  tone?: "neutral" | "success" | "error";
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PluckrNoticeBanner({
  tone = "neutral",
  message,
  actionLabel,
  onAction
}: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.statusDot,
          tone === "success"
            ? styles.successDot
            : tone === "error"
              ? styles.errorDot
              : styles.neutralDot
        ]}
      />
      <Text numberOfLines={2} style={styles.label}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Text accessibilityRole="button" onPress={onAction} style={styles.action}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.lg,
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.sm,
    backgroundColor: "#101C2E",
    shadowColor: "#101C2E",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6
    },
    elevation: 3
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: pluckrAppTheme.radii.full
  },
  neutralDot: {
    backgroundColor: pluckrAppTheme.colors.info
  },
  successDot: {
    backgroundColor: pluckrAppTheme.colors.success
  },
  errorDot: {
    backgroundColor: pluckrAppTheme.colors.critical
  },
  label: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  action: {
    color: "#8FC7DF",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  }
});
