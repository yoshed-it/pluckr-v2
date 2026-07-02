import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getClientDisplayName, type ClientRecord } from "@pluckr/domain";

import { PluckrBottomDrawer } from "../../primitives/BottomSheet";
import { PluckrIcon, type PluckrIconName } from "../../primitives/Icon";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

type ClientAction = {
  key: string;
  label: string;
  description: string;
  icon: PluckrIconName;
  tone?: "default" | "critical";
  onPress: () => void;
};

type Props = {
  visible: boolean;
  client: ClientRecord;
  onClose: () => void;
  onArchiveClient: () => void;
};

export function ClientActionsDrawer({
  visible,
  client,
  onClose,
  onArchiveClient
}: Props) {
  const actions: ClientAction[] = [
    {
      key: "archive",
      label: "Archive client",
      description: "Remove from active lists while keeping records.",
      icon: "archive",
      tone: "critical",
      onPress: onArchiveClient
    }
  ];

  return (
    <PluckrBottomDrawer
      visible={visible}
      title="More"
      subtitle={getClientDisplayName(client)}
      onClose={onClose}
    >
      <View style={styles.stack}>
        <View style={styles.comingSoonPanel}>
          <Text style={styles.comingSoonTitle}>More coming soon</Text>
          <Text style={styles.comingSoonCopy}>
            Documents, workflows, messages, and deeper client tools will live
            here as Pluckr grows.
          </Text>
        </View>
        {actions.map((action) => (
          <Pressable
            key={action.key}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.actionRow,
              action.tone === "critical" ? styles.actionRowCritical : null,
              pressed ? styles.pressed : null
            ]}
            onPress={() => {
              onClose();
              action.onPress();
            }}
          >
            <View
              style={[
                styles.iconWell,
                action.tone === "critical" ? styles.iconWellCritical : null
              ]}
            >
              <PluckrIcon
                name={action.icon}
                size={pluckrAppTheme.iconSizes.md}
                color={
                  action.tone === "critical"
                    ? pluckrAppTheme.colors.critical
                    : pluckrAppTheme.colors.sageStrong
                }
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.copy}>
              <Text
                style={[
                  styles.label,
                  action.tone === "critical" ? styles.labelCritical : null
                ]}
              >
                {action.label}
              </Text>
              <Text style={styles.description}>{action.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </PluckrBottomDrawer>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: pluckrAppTheme.spacing.sm
  },
  comingSoonPanel: {
    gap: pluckrAppTheme.spacing.xs,
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: pluckrAppTheme.spacing.sm
  },
  comingSoonTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800"
  },
  comingSoonCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm,
    minHeight: 68,
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.lg,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  actionRowCritical: {
    backgroundColor: pluckrAppTheme.colors.criticalSurface
  },
  iconWell: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.mint
  },
  iconWellCritical: {
    backgroundColor: "rgba(200, 106, 91, 0.12)"
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2
  },
  label: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  labelCritical: {
    color: pluckrAppTheme.colors.critical
  },
  description: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  pressed: {
    opacity: 0.72
  }
});
