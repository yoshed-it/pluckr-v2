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
import { PluckrNoticeBanner } from "../../primitives/NoticeBanner";
import { PluckrTextField } from "../../primitives/TextField";
import { PluckrOrganizationCard } from "../../PluckrOrganizationCard";
import { pluckrAppTheme } from "../../pluckrAppTheme";

type PluckrOrganizationStageProps = {
  logoSource: ImageSourcePropType;
  memberships: MembershipWithOrganization[];
  isCreating: boolean;
  isJoining: boolean;
  organizationName: string;
  organizationDescription: string;
  inviteToken: string;
  isSubmitting: boolean;
  error: string | null;
  notice: string | null;
  onSelectOrganization: (organizationId: string) => void;
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
  isCreating,
  isJoining,
  organizationName,
  organizationDescription,
  inviteToken,
  isSubmitting,
  error,
  notice,
  onSelectOrganization,
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

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.kicker}>Organizations</Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <PluckrBrandHeader
        title="Organizations"
        subtitle={
          isNewUser
            ? "Welcome to Pluckr. Create your first organization to get started with clinical charting."
            : "Choose which organization you'd like to work with."
        }
        compact={!isNewUser}
        logoSource={logoSource}
      />

      {error ? <PluckrNoticeBanner tone="error" message={error} /> : null}
      {notice ? <PluckrNoticeBanner tone="success" message={notice} /> : null}

      {isCreating ? (
        <PluckrCard>
          <View style={styles.stack}>
            <Text style={styles.sectionTitle}>Organization Details</Text>
            <PluckrTextField
              label="Organization Name"
              placeholder="Organization Name"
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
              label={isSubmitting ? "Creating..." : "Create Organization"}
              disabled={!organizationName.trim() || isSubmitting}
              onPress={() => onCreateOrganization()}
            />
            <PluckrButton
              label="Cancel"
              variant="secondary"
              disabled={isSubmitting}
              onPress={() => onCancelCreate()}
            />
          </View>
        </PluckrCard>
      ) : isJoining ? (
        <PluckrCard>
          <View style={styles.stack}>
            <Text style={styles.sectionTitle}>Join Organization</Text>
            <PluckrTextField
              label="Invite Token Or Link"
              placeholder="Paste the invite token or full invite link"
              autoCapitalize="none"
              autoCorrect={false}
              value={inviteToken}
              onChangeText={onInviteTokenChange}
            />
            <PluckrButton
              label={isSubmitting ? "Joining..." : "Join Organization"}
              disabled={!inviteToken.trim() || isSubmitting}
              onPress={() => onJoinOrganization()}
            />
            <PluckrButton
              label="Cancel"
              variant="secondary"
              disabled={isSubmitting}
              onPress={() => onCancelJoin()}
            />
          </View>
        </PluckrCard>
      ) : (
        <View style={styles.stack}>
          {memberships.length > 0 ? (
            <PluckrCard>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Organizations</Text>
                <Text style={styles.countChip}>{memberships.length}</Text>
              </View>
              <View style={styles.stack}>
                {memberships.map((record) => (
                  <PluckrOrganizationCard
                    key={record.organization.id}
                    record={record}
                    onPress={() => onSelectOrganization(record.organization.id)}
                  />
                ))}
              </View>
            </PluckrCard>
          ) : null}

          <PluckrCard accent>
            <View style={styles.stack}>
              <Text style={styles.sectionTitle}>
                {isNewUser ? "Get Started" : "More Actions"}
              </Text>
              <PluckrButton
                label={
                  isNewUser
                    ? "Create Your First Organization"
                    : "Create New Organization"
                }
                onPress={() => onStartCreate()}
              />
              <PluckrButton
                label={isNewUser ? "Join Existing Organization" : "Join Organization"}
                variant="secondary"
                onPress={() => onStartJoin()}
              />
              {!isNewUser ? (
                <Text style={styles.helperCopy}>
                  Paste an invite token or full link to join another clinic.
                </Text>
              ) : null}
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pluckrAppTheme.spacing.md
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
  },
  countChip: {
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    fontSize: pluckrAppTheme.typography.caption,
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
