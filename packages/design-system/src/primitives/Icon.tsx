import React from "react";
import { StyleSheet, Text } from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

type PluckrIconName =
  | "settings"
  | "logout"
  | "folio"
  | "open"
  | "remove"
  | "archive";

type PluckrIconProps = {
  name: PluckrIconName;
  size?: number;
  color: string;
};

const iconMap: Record<PluckrIconName, string> = {
  settings: "⚙",
  logout: "⇥",
  folio: "▤",
  open: "›",
  remove: "−",
  archive: "⌫"
};

export function PluckrIcon({
  name,
  size = 18,
  color
}: PluckrIconProps) {
  const glyph = iconMap[name];

  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.icon,
        {
          color,
          fontSize: size
        }
      ]}
    >
      {glyph}
    </Text>
  );
}

export type { PluckrIconName };

const styles = StyleSheet.create({
  icon: {
    textAlign: "center",
    includeFontPadding: false,
    fontWeight: "700",
    lineHeight: 18,
    minWidth: pluckrAppTheme.spacing.md
  }
});
