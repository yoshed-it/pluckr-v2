import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MembershipWithOrganization } from "@pluckr/domain";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

type PluckrProviderHomeHeroProps = {
  organizationName: string;
  displayName: MembershipWithOrganization["membership"]["display_name"] | null;
};

export function PluckrProviderHomeHero({
  organizationName,
  displayName
}: PluckrProviderHomeHeroProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>Today</Text>
      <Text style={styles.title}>
        {displayName ? `Welcome, ${displayName}` : "Welcome"}
      </Text>
      <Text style={styles.organizationName}>{organizationName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: pluckrAppTheme.spacing.xxs,
    paddingBottom: pluckrAppTheme.spacing.sm
  },
  eyebrow: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.display,
    lineHeight: 40,
    fontWeight: "700"
  },
  organizationName: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  }
});
