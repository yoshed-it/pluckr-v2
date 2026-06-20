/**
 * Mobile version of the Swift organization selection and creation flow.
 */
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MembershipWithOrganization } from "@pluckr/supabase";

import { BrandHeader } from "./BrandHeader";
import { OrganizationCard } from "./OrganizationCard";
import { PaperCard } from "./PaperCard";
import { PluckrButton } from "./PluckrButton";
import { PluckrTextField } from "./PluckrTextField";
import { mobileTheme } from "../theme";

type MobileOrganizationStageProps = {
  memberships: MembershipWithOrganization[];
  isCreating: boolean;
  organizationName: string;
  organizationDescription: string;
  isSubmitting: boolean;
  error: string | null;
  notice: string | null;
  onSelectOrganization: (organizationId: string) => void;
  onStartCreate: () => void;
  onCancelCreate: () => void;
  onOrganizationNameChange: (value: string) => void;
  onOrganizationDescriptionChange: (value: string) => void;
  onCreateOrganization: () => void;
  onShowJoinMessage: () => void;
  onLogout: () => void;
};

export function MobileOrganizationStage({
  memberships,
  isCreating,
  organizationName,
  organizationDescription,
  isSubmitting,
  error,
  notice,
  onSelectOrganization,
  onStartCreate,
  onCancelCreate,
  onOrganizationNameChange,
  onOrganizationDescriptionChange,
  onCreateOrganization,
  onShowJoinMessage,
  onLogout
}: MobileOrganizationStageProps) {
  const isNewUser = memberships.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.kicker}>Organizations</Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <BrandHeader
        title="Organizations"
        subtitle={
          isNewUser
            ? "Welcome to Pluckr. Create your first organization to get started with clinical charting."
            : "Select an organization or create a new one to keep moving."
        }
        compact={!isNewUser}
      />

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? (
        <Text style={[styles.message, styles.success]}>{notice}</Text>
      ) : null}

      {isCreating ? (
        <PaperCard>
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
        </PaperCard>
      ) : (
        <View style={styles.stack}>
          {memberships.length > 0 ? (
            <PaperCard>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Organizations</Text>
                <Text style={styles.countChip}>{memberships.length}</Text>
              </View>
              <View style={styles.stack}>
                {memberships.map((record) => (
                  <OrganizationCard
                    key={record.organization.id}
                    record={record}
                    onPress={() => onSelectOrganization(record.organization.id)}
                  />
                ))}
              </View>
            </PaperCard>
          ) : null}

          <PaperCard accent>
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
                onPress={() => onShowJoinMessage()}
              />
            </View>
          </PaperCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: mobileTheme.spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: mobileTheme.spacing.sm
  },
  kicker: {
    color: mobileTheme.colors.sageStrong,
    fontSize: mobileTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  logoutLink: {
    color: mobileTheme.colors.critical,
    fontSize: mobileTheme.typography.body,
    fontWeight: "600"
  },
  stack: {
    gap: mobileTheme.spacing.md
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: mobileTheme.spacing.md
  },
  sectionTitle: {
    color: mobileTheme.colors.textPrimary,
    fontSize: mobileTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
  },
  countChip: {
    color: mobileTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: mobileTheme.radii.full,
    overflow: "hidden",
    fontSize: mobileTheme.typography.caption,
    fontWeight: "700"
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20
  },
  error: {
    color: mobileTheme.colors.critical
  },
  success: {
    color: mobileTheme.colors.success
  }
});
