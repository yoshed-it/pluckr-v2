import React, { type PropsWithChildren } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

type PluckrBottomDrawerProps = PropsWithChildren<{
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  scrollable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}>;

export function PluckrBottomDrawer({
  visible,
  title,
  subtitle,
  onClose,
  scrollable = true,
  actionLabel,
  onAction,
  actionDisabled = false,
  children
}: PluckrBottomDrawerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {actionLabel && onAction ? (
              <Pressable
                accessibilityRole="button"
                disabled={actionDisabled}
                onPress={onAction}
                style={[
                  styles.actionButton,
                  actionDisabled ? styles.actionButtonDisabled : null
                ]}
              >
                <Text style={styles.actionLabel}>{actionLabel}</Text>
              </Pressable>
            ) : null}
          </View>
          {scrollable ? (
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.content, styles.contentContainer]}>{children}</View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(34, 43, 53, 0.28)"
  },
  sheet: {
    maxHeight: "76%",
    paddingHorizontal: pluckrAppTheme.spacing.lg,
    paddingTop: pluckrAppTheme.spacing.sm,
    paddingBottom: pluckrAppTheme.spacing.xl,
    borderTopLeftRadius: pluckrAppTheme.radii.xl,
    borderTopRightRadius: pluckrAppTheme.radii.xl,
    backgroundColor: pluckrAppTheme.colors.surface,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border
  },
  handle: {
    alignSelf: "center",
    width: 54,
    height: 5,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(44, 62, 80, 0.18)",
    marginBottom: pluckrAppTheme.spacing.md
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md
  },
  headerCopy: {
    flex: 1
  },
  subtitle: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: pluckrAppTheme.spacing.xs
  },
  actionButton: {
    minWidth: 36,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  actionButtonDisabled: {
    opacity: 0.48
  },
  actionLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "700"
  },
  content: {
    marginTop: pluckrAppTheme.spacing.md
  },
  contentContainer: {
    gap: pluckrAppTheme.spacing.sm
  }
});
