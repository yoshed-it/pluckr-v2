import React from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrFullScreenImageModalProps = {
  visible: boolean;
  imageUrl: string | null;
  actionLabel?: string;
  onClose: () => void;
  onAction?: () => void;
};

export function PluckrFullScreenImageModal({
  visible,
  imageUrl,
  actionLabel,
  onClose,
  onAction
}: PluckrFullScreenImageModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.headerRow}>
          {actionLabel && onAction ? (
            <Pressable
              accessibilityRole="button"
              style={styles.actionButton}
              onPress={onAction}
            >
              <Text style={styles.actionLabel}>{actionLabel}</Text>
            </Pressable>
          ) : null}
          <Pressable accessibilityRole="button" style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeLabel}>Close</Text>
          </Pressable>
        </View>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(18, 24, 30, 0.94)",
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.lg,
    paddingVertical: pluckrAppTheme.spacing.xl
  },
  headerRow: {
    position: "absolute",
    top: pluckrAppTheme.spacing.xl,
    right: pluckrAppTheme.spacing.lg,
    zIndex: 2,
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.xs
  },
  actionButton: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  actionLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "800"
  },
  closeButton: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  closeLabel: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700"
  },
  image: {
    width: "100%",
    height: "100%"
  }
});
