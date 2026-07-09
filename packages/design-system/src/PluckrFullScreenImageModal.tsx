import React from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrFullScreenImageModalProps = {
  visible: boolean;
  imageUrl: string | null;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onClose: () => void;
  onAction?: () => void;
};

export function PluckrFullScreenImageModal({
  visible,
  imageUrl,
  title,
  subtitle,
  actionLabel,
  onClose,
  onAction
}: PluckrFullScreenImageModalProps) {
  const safeTop =
    Platform.OS === "ios"
      ? 64
      : Platform.OS === "android"
        ? 32
        : pluckrAppTheme.spacing.xl;
  const safeBottom = Platform.OS === "ios" ? 38 : pluckrAppTheme.spacing.xl;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.headerRow, { top: safeTop }]}>
          <Pressable
            accessibilityRole="button"
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeLabel}>Done</Text>
          </Pressable>
          <View style={styles.headerCopy}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? (
              <Text numberOfLines={1} style={styles.subtitle}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              {
                marginTop: safeTop + 42,
                marginBottom:
                  actionLabel && onAction ? safeBottom + 58 : safeBottom
              }
            ]}
            resizeMode="contain"
          />
        ) : null}
        {actionLabel && onAction ? (
          <View style={[styles.footerRow, { bottom: safeBottom }]}>
            <Pressable
              accessibilityRole="button"
              style={styles.actionButton}
              onPress={onAction}
            >
              <Text style={styles.actionLabel}>{actionLabel}</Text>
            </Pressable>
          </View>
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
    left: pluckrAppTheme.spacing.lg,
    right: pluckrAppTheme.spacing.lg,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm
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
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800"
  },
  subtitle: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  image: {
    width: "100%",
    flex: 1
  },
  footerRow: {
    position: "absolute",
    left: pluckrAppTheme.spacing.lg,
    right: pluckrAppTheme.spacing.lg,
    zIndex: 2
  },
  actionButton: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(255,255,255,0.94)"
  },
  actionLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "800"
  }
});
