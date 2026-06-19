/**
 * Mobile organization picker card modeled after the Swift selection view.
 */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { MembershipWithOrganization } from "@pluckr/supabase";

import { PaperCard } from "./PaperCard";
import { mobileTheme } from "../theme";

type OrganizationCardProps = {
  record: MembershipWithOrganization;
  onPress: () => void;
};

function formatRole(role: MembershipWithOrganization["membership"]["role"]) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function OrganizationCard({ record, onPress }: OrganizationCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => (
        <View style={pressed ? styles.pressed : null}>
          <PaperCard compact>
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
          </PaperCard>
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
    gap: mobileTheme.spacing.md
  },
  glyph: {
    width: 48,
    height: 48,
    borderRadius: mobileTheme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(127, 183, 133, 0.12)"
  },
  glyphText: {
    color: mobileTheme.colors.sageStrong,
    fontSize: 24,
    fontWeight: "700"
  },
  copy: {
    flex: 1,
    gap: mobileTheme.spacing.xs
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: mobileTheme.spacing.sm
  },
  name: {
    flex: 1,
    color: mobileTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700"
  },
  roleChip: {
    color: mobileTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: mobileTheme.radii.full,
    fontSize: mobileTheme.typography.caption,
    overflow: "hidden",
    fontWeight: "700"
  },
  description: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21
  }
});
