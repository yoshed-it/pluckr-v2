import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function PluckrConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.lg,
    backgroundColor: "rgba(22, 32, 40, 0.36)"
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: pluckrAppTheme.spacing.lg,
    borderRadius: pluckrAppTheme.radii.lg,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 28,
    fontWeight: "700"
  },
  message: {
    marginTop: pluckrAppTheme.spacing.sm,
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: pluckrAppTheme.spacing.sm,
    marginTop: pluckrAppTheme.spacing.lg
  },
  cancelButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: pluckrAppTheme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(44, 62, 80, 0.05)"
  },
  cancelLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700"
  },
  confirmButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: pluckrAppTheme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(184, 61, 61, 0.12)"
  },
  confirmLabel: {
    color: pluckrAppTheme.colors.critical,
    fontSize: 13,
    fontWeight: "700"
  }
});
