import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { MembershipWithOrganization } from "@pluckr/domain";

import { PluckrCard } from "./primitives/Card";
import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrOrganizationCardProps = {
  record: MembershipWithOrganization;
  onPress: () => void;
};

function formatRole(role: MembershipWithOrganization["membership"]["role"]) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function PluckrOrganizationCard({
  record,
  onPress
}: PluckrOrganizationCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => (
        <View style={pressed ? styles.pressed : null}>
          <PluckrCard compact>
            <View style={styles.row}>
              <View style={styles.glyph}>
                <Text style={styles.glyphText}>+</Text>
              </View>
              <View style={styles.copy}>
                <View style={styles.header}>
                  <Text style={styles.name}>{record.organization.name}</Text>
                  <Text style={styles.roleChip}>
                    {formatRole(record.membership.role)}
                  </Text>
                </View>
                <Text style={styles.description}>
                  {record.organization.description ||
                    "Clinical workspace ready for charts, clients, and demo sessions."}
                </Text>
              </View>
            </View>
          </PluckrCard>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.md
  },
  glyph: {
    width: 48,
    height: 48,
    borderRadius: pluckrAppTheme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(127, 183, 133, 0.12)"
  },
  glyphText: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 24,
    fontWeight: "700"
  },
  copy: {
    flex: 1,
    gap: pluckrAppTheme.spacing.xs
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  name: {
    flex: 1,
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700"
  },
  roleChip: {
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.full,
    fontSize: pluckrAppTheme.typography.caption,
    overflow: "hidden",
    fontWeight: "700"
  },
  description: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21
  }
});
