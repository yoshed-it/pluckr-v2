import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { MembershipWithOrganization, ProviderRecord } from "@pluckr/supabase";

import { PluckrCard } from "./PluckrCard";
import { PluckrNoticeBanner } from "./PluckrNoticeBanner";
import { PluckrSectionHeader } from "./PluckrSectionHeader";
import { pluckrAppTheme } from "./pluckrAppTheme";

type Props = {
  organization: MembershipWithOrganization["organization"];
  membership: MembershipWithOrganization["membership"];
  provider: ProviderRecord | null;
  membershipsCount: number;
  isUpdatingPrivacy: boolean;
  error: string | null;
  notice: string | null;
  onOpenAdmin: () => void;
  onBackToOrganizations: () => void;
  onToggleProtectSensitiveScreens: (nextValue: boolean) => void;
};

export function PluckrSettingsStage({
  organization,
  membership,
  provider,
  membershipsCount,
  isUpdatingPrivacy,
  error,
  notice,
  onOpenAdmin,
  onBackToOrganizations,
  onToggleProtectSensitiveScreens
}: Props) {
  const canManageTeam =
    membership.role === "owner" || membership.role === "admin";

  return (
    <View style={styles.container}>
      {error ? <PluckrNoticeBanner tone="error" message={error} /> : null}
      {notice ? <PluckrNoticeBanner tone="success" message={notice} /> : null}

      <PluckrCard>
        <PluckrSectionHeader title="Account" />
        <View style={styles.stack}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>
              {provider?.full_name || membership.display_name || "Unconfigured"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Role</Text>
            <Text style={styles.detailValue}>{membership.role}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{provider?.phone || "Not set"}</Text>
          </View>
        </View>
      </PluckrCard>

      <PluckrCard>
        <PluckrSectionHeader title="Practice" />
        <View style={styles.stack}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current practice</Text>
            <Text style={styles.detailValue}>{organization.name}</Text>
          </View>
          {membershipsCount > 1 ? (
            <Pressable
              accessibilityRole="button"
              style={styles.rowButton}
              onPress={onBackToOrganizations}
            >
              <Text style={styles.rowButtonLabel}>Switch practice</Text>
            </Pressable>
          ) : null}
        </View>
      </PluckrCard>

      <PluckrCard>
        <PluckrSectionHeader title="Privacy" />
        <Pressable
          accessibilityRole="button"
          style={styles.toggleRow}
          disabled={isUpdatingPrivacy}
          onPress={() =>
            onToggleProtectSensitiveScreens(!organization.protect_sensitive_screens)
          }
        >
          <View style={styles.toggleCopy}>
            <Text style={styles.rowTitle}>Protect sensitive screens</Text>
            <Text style={styles.rowBody}>
              Hide sensitive records during app switching and screenshot capture.
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              organization.protect_sensitive_screens
                ? styles.statusPillActive
                : styles.statusPillInactive
            ]}
          >
            <Text
              style={[
                styles.statusPillLabel,
                organization.protect_sensitive_screens
                  ? styles.statusPillLabelActive
                  : null
              ]}
            >
              {isUpdatingPrivacy
                ? "Saving"
                : organization.protect_sensitive_screens
                  ? "On"
                  : "Off"}
            </Text>
          </View>
        </Pressable>
      </PluckrCard>

      {canManageTeam ? (
        <PluckrCard>
          <PluckrSectionHeader title="Team" />
          <Pressable
            accessibilityRole="button"
            style={styles.rowButton}
            onPress={onOpenAdmin}
          >
            <Text style={styles.rowButtonLabel}>Manage team access</Text>
          </Pressable>
        </PluckrCard>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  stack: {
    gap: pluckrAppTheme.spacing.sm
  },
  detailRow: {
    gap: 4
  },
  detailLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    textTransform: "uppercase"
  },
  detailValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    textTransform: "capitalize"
  },
  rowButton: {
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "rgba(44, 62, 80, 0.06)"
  },
  rowButtonLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700"
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md
  },
  toggleCopy: {
    flex: 1,
    gap: 4
  },
  rowTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700"
  },
  rowBody: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  statusPill: {
    minWidth: 64,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: pluckrAppTheme.radii.full,
    alignItems: "center",
    justifyContent: "center"
  },
  statusPillActive: {
    backgroundColor: "rgba(127, 183, 133, 0.18)"
  },
  statusPillInactive: {
    backgroundColor: "rgba(44, 62, 80, 0.08)"
  },
  statusPillLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  statusPillLabelActive: {
    color: pluckrAppTheme.colors.sageStrong
  }
});
