import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type {
  AdminProviderRecord,
  InviteLinkRecord,
  MembershipWithOrganization,
  OrganizationRole
} from "@pluckr/supabase";

import { PluckrButton } from "./PluckrButton";
import { PluckrCard } from "./PluckrCard";
import { PluckrNoticeBanner } from "./PluckrNoticeBanner";
import { PluckrTextField } from "./PluckrTextField";
import { pluckrAppTheme } from "./pluckrAppTheme";

type Props = {
  organization: MembershipWithOrganization["organization"];
  providers: AdminProviderRecord[];
  inviteLinks: InviteLinkRecord[];
  inviteForm: {
    email: string;
    role: OrganizationRole;
  };
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  notice: string | null;
  hideToolbar?: boolean;
  onBack: () => void;
  onInviteFormChange: (key: "email" | "role", value: string) => void;
  onCreateInvite: () => void;
  onChangeProviderRole: (
    record: AdminProviderRecord,
    role: OrganizationRole
  ) => void;
  onToggleProviderStatus: (record: AdminProviderRecord, isActive: boolean) => void;
  onRevokeInvite: (inviteId: string) => void;
};

const roleOptions: OrganizationRole[] = ["admin", "provider", "viewer"];

export function PluckrAdminStage({
  organization,
  providers,
  inviteLinks,
  inviteForm,
  isLoading,
  isSaving,
  error,
  notice,
  hideToolbar = false,
  onBack,
  onInviteFormChange,
  onCreateInvite,
  onChangeProviderRole,
  onToggleProviderStatus,
  onRevokeInvite
}: Props) {
  return (
    <View style={styles.container}>
      {!hideToolbar ? (
        <View style={styles.toolbar}>
          <Text style={styles.link} onPress={onBack}>
            ← Dashboard
          </Text>
          <Text style={styles.kicker}>Admin</Text>
        </View>
      ) : null}

      <PluckrCard>
        <Text style={styles.eyebrow}>Admin Dashboard</Text>
        <Text style={styles.title}>{organization.name}</Text>
        <Text style={styles.subtitle}>
          Manage providers and generate invite links for this organization.
        </Text>
      </PluckrCard>

      {error ? <PluckrNoticeBanner tone="error" message={error} /> : null}
      {notice ? <PluckrNoticeBanner tone="success" message={notice} /> : null}

      <PluckrCard>
        <Text style={styles.sectionTitle}>Invite Team Member</Text>
        <View style={styles.stack}>
          <PluckrTextField
            label="Email"
            placeholder="teammate@clinic.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={inviteForm.email}
            onChangeText={(value) => onInviteFormChange("email", value)}
          />
          <View style={styles.roleRow}>
            {roleOptions.map((role) => (
              <Pressable
                key={role}
                accessibilityRole="button"
                style={[
                  styles.roleChip,
                  inviteForm.role === role ? styles.roleChipActive : null
                ]}
                onPress={() => onInviteFormChange("role", role)}
              >
                <Text
                  style={[
                    styles.roleChipLabel,
                    inviteForm.role === role ? styles.roleChipLabelActive : null
                  ]}
                >
                  {role}
                </Text>
              </Pressable>
            ))}
          </View>
          <PluckrButton
            label={isSaving ? "Creating..." : "Create Invite"}
            disabled={!inviteForm.email.trim() || isSaving}
            onPress={() => onCreateInvite()}
          />
        </View>
      </PluckrCard>

      <PluckrCard>
        <Text style={styles.sectionTitle}>Providers</Text>
        {isLoading ? (
          <Text style={styles.emptyState}>Loading providers...</Text>
        ) : providers.length === 0 ? (
          <Text style={styles.emptyState}>No providers found yet.</Text>
        ) : (
          <View style={styles.stack}>
            {providers.map((record) => (
              <View key={record.provider.id} style={styles.providerRow}>
                <View style={styles.providerCopy}>
                  <Text style={styles.providerName}>{record.provider.full_name}</Text>
                  <Text style={styles.providerMeta}>
                    {record.membership?.email || "No email"} •{" "}
                    {record.provider.is_active ? "Active" : "Inactive"}
                  </Text>
                </View>
                <View style={styles.providerActions}>
                  <View style={styles.roleRow}>
                    {roleOptions.map((role) => (
                      <Pressable
                        key={role}
                        accessibilityRole="button"
                        disabled={!record.membership || isSaving}
                        style={[
                          styles.miniRoleChip,
                          record.membership?.role === role
                            ? styles.miniRoleChipActive
                            : null
                        ]}
                        onPress={() => onChangeProviderRole(record, role)}
                      >
                        <Text style={styles.miniRoleChipLabel}>{role}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.statusButton}
                    onPress={() =>
                      onToggleProviderStatus(record, !record.provider.is_active)
                    }
                  >
                    <Text style={styles.statusButtonLabel}>
                      {record.provider.is_active ? "Deactivate" : "Activate"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </PluckrCard>

      <PluckrCard>
        <Text style={styles.sectionTitle}>Invites</Text>
        {inviteLinks.length === 0 ? (
          <Text style={styles.emptyState}>No invites generated yet.</Text>
        ) : (
          <View style={styles.stack}>
            {inviteLinks.map((invite) => (
              <View key={invite.id} style={styles.inviteRow}>
                <View style={styles.providerCopy}>
                  <Text style={styles.providerName}>{invite.email}</Text>
                  <Text style={styles.providerMeta}>
                    {invite.role} • {invite.accepted_at ? "Accepted" : "Pending"}
                  </Text>
                  <Text style={styles.tokenText}>{invite.token}</Text>
                </View>
                {!invite.accepted_at ? (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.statusButton}
                    onPress={() => onRevokeInvite(invite.id)}
                  >
                    <Text style={styles.statusButtonLabel}>Revoke</Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </PluckrCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: pluckrAppTheme.spacing.md },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  link: { color: pluckrAppTheme.colors.sageStrong, fontSize: 15, fontWeight: "600" },
  kicker: { color: pluckrAppTheme.colors.sageStrong, fontSize: 12, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase" },
  eyebrow: { color: pluckrAppTheme.colors.sageStrong, fontSize: 12, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 4 },
  title: { color: pluckrAppTheme.colors.textPrimary, fontSize: 28, lineHeight: 34, fontWeight: "700" },
  subtitle: { color: pluckrAppTheme.colors.textSecondary, fontSize: 16, lineHeight: 24, marginTop: 8 },
  sectionTitle: { color: pluckrAppTheme.colors.textPrimary, fontSize: 20, lineHeight: 26, fontWeight: "700", marginBottom: 12 },
  message: { textAlign: "center", fontSize: 14, lineHeight: 20 },
  error: { color: pluckrAppTheme.colors.critical },
  success: { color: pluckrAppTheme.colors.success },
  stack: { gap: pluckrAppTheme.spacing.sm },
  roleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  roleChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(44,62,80,0.05)" },
  roleChipActive: { backgroundColor: "rgba(127,183,133,0.16)" },
  roleChipLabel: { color: pluckrAppTheme.colors.textPrimary, fontSize: 13, fontWeight: "700", textTransform: "capitalize" },
  roleChipLabelActive: { color: pluckrAppTheme.colors.sageStrong },
  providerRow: { gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(44,62,80,0.08)" },
  providerCopy: { gap: 2 },
  providerName: { color: pluckrAppTheme.colors.textPrimary, fontSize: 15, lineHeight: 22, fontWeight: "700" },
  providerMeta: { color: pluckrAppTheme.colors.textSecondary, fontSize: 13, lineHeight: 18 },
  providerActions: { gap: 10 },
  miniRoleChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(44,62,80,0.05)" },
  miniRoleChipActive: { backgroundColor: "rgba(127,183,133,0.16)" },
  miniRoleChipLabel: { color: pluckrAppTheme.colors.textSecondary, fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  statusButton: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: "rgba(44,62,80,0.05)" },
  statusButtonLabel: { color: pluckrAppTheme.colors.sageStrong, fontSize: 12, fontWeight: "700" },
  inviteRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(44,62,80,0.08)" },
  tokenText: { color: pluckrAppTheme.colors.sageStrong, fontSize: 12, lineHeight: 18 },
  emptyState: { color: pluckrAppTheme.colors.textSecondary, fontSize: 15, lineHeight: 22 }
});
