import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PluckrIcon, type PluckrIconName } from "./primitives/Icon";
import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrUtilityAction = {
  label: string;
  onPress: () => void;
  tone?: "default" | "critical";
  icon?: PluckrIconName;
  iconOnly?: boolean;
};

type PluckrUtilityBarProps = {
  backLabel?: string | null;
  onBack?: (() => void) | null;
  actions: PluckrUtilityAction[];
};

export function PluckrUtilityBar({
  backLabel = null,
  onBack = null,
  actions
}: PluckrUtilityBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.leading}>
          {onBack && backLabel ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Back to ${backLabel}`}
              hitSlop={10}
              onPress={onBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Text style={styles.backChevron}>‹</Text>
              <Text numberOfLines={1} style={styles.backLabel}>
                {backLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.actions}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              hitSlop={8}
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.actionPill,
                action.tone === "critical" ? styles.criticalActionPill : null,
                pressed ? styles.pressed : null
              ]}
            >
              {!action.iconOnly ? (
                <Text
                  style={[
                    styles.actionLabel,
                    action.tone === "critical" ? styles.criticalActionLabel : null
                  ]}
                >
                  {action.label}
                </Text>
              ) : null}
              {action.icon ? (
                <View style={styles.iconWrap}>
                  <PluckrIcon
                    name={action.icon}
                    size={14}
                    color={
                      action.tone === "critical"
                        ? pluckrAppTheme.colors.critical
                        : pluckrAppTheme.colors.textPrimary
                    }
                  />
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: pluckrAppTheme.spacing.xs
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  leading: {
    flex: 1,
    minWidth: 0
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: pluckrAppTheme.spacing.xs
  },
  actionPill: {
    minHeight: 28,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    backgroundColor: pluckrAppTheme.colors.surface,
    flexDirection: "row",
    gap: 6
  },
  criticalActionPill: {
    borderColor: pluckrAppTheme.colors.criticalSurface,
    backgroundColor: pluckrAppTheme.colors.criticalSurface
  },
  actionLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700"
  },
  criticalActionLabel: {
    color: pluckrAppTheme.colors.critical
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%"
  },
  backChevron: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 24,
    lineHeight: 26,
    marginRight: 2,
    fontWeight: "400"
  },
  backLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400"
  },
  pressed: {
    opacity: 0.65
  }
});
