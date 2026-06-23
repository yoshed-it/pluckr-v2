import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";
import { PluckrIcon } from "../../primitives/Icon";

type Props = {
  phone?: string | null;
  email?: string | null;
  lastSeen: string;
};

function Item({
  icon,
  primary,
  secondary
}: {
  icon: "phone" | "mail" | "clock";
  primary: string;
  secondary: string;
}) {
  return (
    <View style={styles.item}>
      <View style={styles.iconWrap}>
        <PluckrIcon
          name={icon}
          size={pluckrAppTheme.iconSizes.md}
          color={pluckrAppTheme.colors.sageStrong}
        />
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.primary}>
          {primary}
        </Text>
        <Text numberOfLines={1} style={styles.secondary}>
          {secondary}
        </Text>
      </View>
    </View>
  );
}

export function ContactInfoRow({
  phone,
  email,
  lastSeen
}: Props) {
  return (
    <View style={styles.stack}>
      <Item icon="phone" primary={phone || "No phone"} secondary="Mobile" />
      <Item icon="mail" primary={email || "No email"} secondary="Email" />
      <Item icon="clock" primary={lastSeen} secondary="Last seen" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 10
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  iconWrap: {
    width: 20,
    alignItems: "center"
  },
  copy: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  primary: {
    flex: 1,
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600"
  },
  secondary: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  }
});
