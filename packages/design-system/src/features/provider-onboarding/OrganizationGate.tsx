import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType
} from "react-native";
import type { MembershipWithOrganization } from "@pluckr/domain";

import { PluckrBrandHeader } from "../../composite/BrandHeader";
import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrAppTheme } from "../../pluckrAppTheme";

type PluckrOrganizationStageProps = {
  logoSource: ImageSourcePropType;
  memberships: MembershipWithOrganization[];
  canCreateWorkspace: boolean;
  isCreating: boolean;
  isJoining: boolean;
  organizationName: string;
  organizationDescription: string;
  inviteToken: string;
  isSubmitting: boolean;
  error: string | null;
  notice: string | null;
  onStartCreate: () => void;
  onCancelCreate: () => void;
  onStartJoin: () => void;
  onCancelJoin: () => void;
  onOrganizationNameChange: (value: string) => void;
  onOrganizationDescriptionChange: (value: string) => void;
  onCreateOrganization: () => void;
  onInviteTokenChange: (value: string) => void;
  onJoinOrganization: () => void;
  onLogout: () => void;
};

export function PluckrOrganizationStage({
  logoSource,
  memberships,
  canCreateWorkspace,
  isCreating,
  isJoining,
  organizationName,
  organizationDescription,
  inviteToken,
  isSubmitting,
  error,
  notice,
  onStartCreate,
  onCancelCreate,
  onStartJoin,
  onCancelJoin,
  onOrganizationNameChange,
  onOrganizationDescriptionChange,
  onCreateOrganization,
  onInviteTokenChange,
  onJoinOrganization,
  onLogout
}: PluckrOrganizationStageProps) {
  const isNewUser = memberships.length === 0;
  const showInviteAccess = isNewUser || isJoining;
  const shouldDefaultToCreate = isNewUser && canCreateWorkspace && !isJoining;
  const showCreateForm = isCreating || shouldDefaultToCreate;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.kicker}>Practice Access</Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <PluckrBrandHeader
        title="Practice Invite"
        subtitle="Practice access comes from an invite. Sign in, then enter your invite token to finish onboarding."
        compact
        logoSource={logoSource}
      />

      {showCreateForm ? (
        <PluckrCard>
          <View style={styles.stack}>
            <Text style={styles.sectionTitle}>Create Practice</Text>
            <PluckrTextField
              label="Practice Name"
              placeholder="Practice Name"
              autoCapitalize="words"
              value={organizationName}
              onChangeText={onOrganizationNameChange}
            />
            <PluckrTextField
              label="Description"
              placeholder="Description (optional)"
              multiline
              value={organizationDescription}
              onChangeText={onOrganizationDescriptionChange}
            />
            <PluckrButton
              label={isSubmitting ? "Creating..." : "Create Practice"}
              disabled={!organizationName.trim() || isSubmitting}
              onPress={() => onCreateOrganization()}
            />
            <PluckrButton
              label={shouldDefaultToCreate ? "Use Invite Instead" : "Cancel"}
              variant="secondary"
              disabled={isSubmitting}
              onPress={() =>
                shouldDefaultToCreate ? onStartJoin() : onCancelCreate()
              }
            />
          </View>
        </PluckrCard>
      ) : showInviteAccess ? (
        <PluckrCard>
          <View style={styles.stack}>
            <Text style={styles.sectionTitle}>Enter Invite Token</Text>
            <PluckrTextField
              label="Invite Token Or Link"
              placeholder="Paste the invite token or full invite link"
              autoCapitalize="none"
              autoCorrect={false}
              value={inviteToken}
              onChangeText={onInviteTokenChange}
            />
            <PluckrButton
              label={isSubmitting ? "Joining..." : "Join Workspace"}
              disabled={!inviteToken.trim() || isSubmitting}
              onPress={() => onJoinOrganization()}
            />
            {!isNewUser ? (
              <PluckrButton
                label="Cancel"
                variant="secondary"
                disabled={isSubmitting}
                onPress={() => onCancelJoin()}
              />
            ) : null}
              <Text style={styles.helperCopy}>
              Ask the practice owner or admin to send you an invite if you do not
              have one yet.
            </Text>
            {isNewUser && canCreateWorkspace ? (
              <PluckrButton
                label="Create First Practice"
                variant="secondary"
                disabled={isSubmitting}
                onPress={() => onStartCreate()}
              />
            ) : null}
            {isNewUser && canCreateWorkspace ? (
              <Text style={styles.helperCopy}>
                Only create a practice when you are setting it up for
                the first time.
              </Text>
            ) : null}
          </View>
        </PluckrCard>
      ) : (
        <View style={styles.stack}>
          <PluckrCard accent>
            <View style={styles.stack}>
              <PluckrButton
                label="Use Invite"
                onPress={() => onStartJoin()}
              />
              <Text style={styles.helperCopy}>
                Practice selection is not part of the daily workflow. Once you are
                attached, Pluckr will take you straight into your provider dashboard.
              </Text>
            </View>
          </PluckrCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pluckrAppTheme.spacing.sm
  },
  kicker: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  logoutLink: {
    color: pluckrAppTheme.colors.critical,
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "600"
  },
  stack: {
    gap: pluckrAppTheme.spacing.md
  },
  helperCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20
  },
  error: {
    color: pluckrAppTheme.colors.critical
  },
  success: {
    color: pluckrAppTheme.colors.success
  }
});
