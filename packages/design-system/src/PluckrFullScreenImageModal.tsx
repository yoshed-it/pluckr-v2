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
  details?: Array<{
    label: string;
    value: string;
  }>;
  actionLabel?: string;
  onClose: () => void;
  onAction?: () => void;
};

export function PluckrFullScreenImageModal({
  visible,
  imageUrl,
  title,
  subtitle,
  details = [],
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
                  details.length > 0 || (actionLabel && onAction)
                    ? safeBottom + 150
                    : safeBottom
              }
            ]}
            resizeMode="contain"
          />
        ) : null}
        {details.length > 0 || (actionLabel && onAction) ? (
          <View style={[styles.footerStack, { bottom: safeBottom }]}>
            {details.length > 0 ? (
              <View style={styles.detailsPanel}>
                {details.map((detail) => (
                  <View key={detail.label} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text numberOfLines={1} style={styles.detailValue}>
                      {detail.value}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {actionLabel && onAction ? (
              <Pressable
                accessibilityRole="button"
                style={styles.actionButton}
                onPress={onAction}
              >
                <Text style={styles.actionLabel}>{actionLabel}</Text>
              </Pressable>
            ) : null}
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
  footerStack: {
    position: "absolute",
    left: pluckrAppTheme.spacing.lg,
    right: pluckrAppTheme.spacing.lg,
    zIndex: 2,
    gap: pluckrAppTheme.spacing.sm
  },
  detailsPanel: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: pluckrAppTheme.radii.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    gap: 5
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm
  },
  detailLabel: {
    width: 64,
    color: "rgba(255,255,255,0.58)",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  detailValue: {
    flex: 1,
    minWidth: 0,
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700"
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
