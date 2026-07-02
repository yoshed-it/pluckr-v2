import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

export type PluckrSnackbarTone = "success" | "error" | "warning" | "info";

type Props = {
  id?: string;
  message: string | null;
  tone?: PluckrSnackbarTone;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: (id?: string) => void;
  durationMs?: number;
};

export function PluckrSnackbar({
  id,
  message,
  tone = "info",
  actionLabel,
  onAction,
  onDismiss,
  durationMs = 3600
}: Props) {
  const [visible, setVisible] = useState(Boolean(message));
  const ringStyles = {
    success: styles.successRing,
    error: styles.errorRing,
    warning: styles.warningRing,
    info: styles.infoRing
  };
  const dotStyles = {
    success: styles.successDot,
    error: styles.errorDot,
    warning: styles.warningDot,
    info: styles.infoDot
  };

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);

    if (actionLabel && onAction) {
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.(id);
    }, tone === "error" ? Math.max(durationMs, 4800) : durationMs);

    return () => clearTimeout(timer);
  }, [actionLabel, durationMs, id, message, onAction, onDismiss, tone]);

  if (!message || !visible) {
    return null;
  }

  function handleActionPress() {
    onAction?.();
    setVisible(false);
    onDismiss?.(id);
  }

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <View style={styles.snackbar}>
        <View style={[styles.statusRing, ringStyles[tone]]}>
          <View style={[styles.statusDot, dotStyles[tone]]} />
        </View>
        <Text numberOfLines={2} style={styles.message}>
          {message}
        </Text>
        {actionLabel && onAction ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleActionPress}
            style={({ pressed }) => [pressed ? styles.pressed : null]}
          >
            <Text style={styles.action}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    right: pluckrAppTheme.spacing.lg,
    bottom: pluckrAppTheme.navigation.bottomBarHeight + pluckrAppTheme.spacing.md,
    left: pluckrAppTheme.spacing.lg,
    zIndex: 30
  },
  snackbar: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.lg,
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.sm,
    backgroundColor: "#101C2E",
    ...Platform.select({
      web: {
        boxShadow: "0px 7px 14px rgba(16, 28, 46, 0.18)"
      },
      default: {
        shadowColor: "#101C2E",
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: {
          width: 0,
          height: 7
        },
        elevation: 4
      }
    })
  },
  statusRing: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    borderWidth: 2
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: pluckrAppTheme.radii.full
  },
  successRing: {
    borderColor: pluckrAppTheme.colors.success
  },
  errorRing: {
    borderColor: pluckrAppTheme.colors.critical
  },
  warningRing: {
    borderColor: pluckrAppTheme.colors.warning
  },
  infoRing: {
    borderColor: "#6FB7D7"
  },
  successDot: {
    backgroundColor: pluckrAppTheme.colors.success
  },
  errorDot: {
    backgroundColor: pluckrAppTheme.colors.critical
  },
  warningDot: {
    backgroundColor: pluckrAppTheme.colors.warning
  },
  infoDot: {
    backgroundColor: "#6FB7D7"
  },
  message: {
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
    fontWeight: "800"
  },
  pressed: {
    opacity: 0.68
  }
});
