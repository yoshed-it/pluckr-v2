import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PluckrIcon, type PluckrIconName } from "../primitives/Icon";
import { PluckrIconButton } from "../primitives/IconButton";
import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

type TopBarAction = {
  icon: PluckrIconName;
  label: string;
  onPress: () => void;
  tone?: "default" | "critical" | "accent";
};

type TopBarProps = {
  title: string;
  subtitle?: string | null;
  backLabel?: string | null;
  onBack?: (() => void) | null;
  actions?: TopBarAction[];
};

export function TopBar({
  title,
  subtitle = null,
  backLabel = null,
  onBack = null,
  actions = []
}: TopBarProps) {
  const showBack = Boolean(backLabel && onBack);

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Back to ${backLabel}`}
            hitSlop={10}
            onPress={onBack ?? undefined}
            style={({ pressed }) => [
              styles.backButton,
              pressed ? styles.pressed : null
            ]}
          >
            <PluckrIcon
              name="back"
              size={pluckrAppTheme.iconSizes.lg}
              color={pluckrAppTheme.colors.textPrimary}
              strokeWidth={2.2}
            />
            <Text numberOfLines={1} style={styles.backLabel}>
              {backLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.titleStack}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.trailing]}>
        {actions.slice(0, 2).map((action) => (
          <PluckrIconButton
            key={action.label}
            icon={action.icon}
            accessibilityLabel={action.label}
            onPress={action.onPress}
            tone={action.tone}
            size="sm"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: pluckrAppTheme.navigation.topBarHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  side: {
    flex: 1,
    minWidth: 0
  },
  trailing: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: pluckrAppTheme.spacing.xs
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%"
  },
  backLabel: {
    flexShrink: 1,
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "500"
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center"
  },
  titleStack: {
    flex: 1.5,
    alignItems: "center",
    gap: 2
  },
  subtitle: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    textAlign: "center"
  },
  pressed: {
    opacity: 0.62
  }
});
