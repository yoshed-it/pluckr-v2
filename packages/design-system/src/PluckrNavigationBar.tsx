import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrNavigationBarProps = {
  title: string;
  subtitle?: string | null;
};

export function PluckrNavigationBar({
  title,
  subtitle = null
}: PluckrNavigationBarProps) {
  const isIos = Platform.OS === "ios";

  return (
    <View style={styles.container}>
      <View style={[styles.row, isIos ? styles.iosRow : styles.androidRow]}>
        <View style={styles.titleSlot}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>
      </View>

      {subtitle ? (
        <Text
          numberOfLines={1}
          style={[styles.subtitle, isIos ? styles.iosSubtitle : styles.androidSubtitle]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: pluckrAppTheme.spacing.sm,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(44, 62, 80, 0.08)"
  },
  row: {
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  iosRow: {
    justifyContent: "center"
  },
  androidRow: {
    justifyContent: "center"
  },
  titleSlot: {
    alignItems: "center"
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: Platform.OS === "ios" ? 17 : 22,
    lineHeight: Platform.OS === "ios" ? 22 : 28,
    fontWeight: Platform.OS === "ios" ? "600" : "700",
    textAlign: Platform.OS === "ios" ? "center" : "center"
  },
  subtitle: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18
  },
  iosSubtitle: {
    textAlign: "center"
  },
  androidSubtitle: {
    textAlign: "left"
  },
  pressed: {
    opacity: 0.6
  }
});
