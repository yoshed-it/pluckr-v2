import "react-native-url-polyfill/auto";

/**
 * Thin mobile app shell that composes shared controller hooks with
 * AsyncStorage-backed selection persistence and native UI components.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from "react-native";
import {
  createOrganizationSelectionStorage,
  useAuthController,
  useOrganizationController,
  useSessionController,
  useWorkspaceController
} from "@pluckr/app-core";
import { getSupabaseNativeClient } from "@pluckr/supabase";

import { MobileAuthStage } from "../components/MobileAuthStage";
import { MobileOrganizationStage } from "../components/MobileOrganizationStage";
import { MobileWorkspaceStage } from "../components/MobileWorkspaceStage";
import { mobileTheme } from "../theme";

export function PluckrMobileApp() {
  const supabase = useState(() => getSupabaseNativeClient(AsyncStorage))[0];
  const selectionStorage = useState(() =>
    createOrganizationSelectionStorage(AsyncStorage)
  )[0];

  const sessionController = useSessionController(supabase);
  const authController = useAuthController(supabase);
  const organizationController = useOrganizationController(
    supabase,
    sessionController.session?.user.id,
    selectionStorage
  );
  const workspaceController = useWorkspaceController(
    supabase,
    organizationController.memberships,
    organizationController.selectedOrganizationId
  );

  const selectedMembership = organizationController.memberships.find(
    (record) =>
      record.organization.id === organizationController.selectedOrganizationId
  );

  async function handleLogout() {
    await selectionStorage.clearSelectedOrganizationId();
    await supabase.auth.signOut();
    authController.resetAfterLogout();
    organizationController.resetAfterLogout();
    workspaceController.resetWorkspaceView();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sessionController.isBooting || !sessionController.session?.user ? (
          <MobileAuthStage
            mode={authController.authMode}
            fullName={authController.fullName}
            email={authController.email}
            password={authController.password}
            confirmPassword={authController.confirmPassword}
            error={authController.authError ?? sessionController.sessionError}
            notice={
              sessionController.isBooting
                ? "Restoring your session..."
                : authController.authNotice
            }
            isSubmitting={
              sessionController.isBooting || authController.authSubmitting
            }
            onModeChange={authController.changeAuthMode}
            onFullNameChange={authController.setFullName}
            onEmailChange={authController.setEmail}
            onPasswordChange={authController.setPassword}
            onConfirmPasswordChange={authController.setConfirmPassword}
            onSubmit={() =>
              void (authController.authMode === "signup"
                ? authController.signUp()
                : authController.authMode === "forgot"
                  ? authController.sendPasswordReset()
                  : authController.signIn())
            }
          />
        ) : organizationController.membershipsLoading || !selectedMembership ? (
          <MobileOrganizationStage
            memberships={organizationController.memberships}
            isCreating={
              !organizationController.membershipsLoading &&
              (organizationController.isCreatingOrganization ||
                organizationController.memberships.length === 0)
            }
            organizationName={organizationController.organizationName}
            organizationDescription={organizationController.organizationDescription}
            isSubmitting={
              organizationController.membershipsLoading ||
              organizationController.organizationSubmitting
            }
            error={organizationController.organizationError}
            notice={
              organizationController.membershipsLoading
                ? "Loading your organizations..."
                : organizationController.organizationNotice
            }
            onSelectOrganization={organizationController.setSelectedOrganizationId}
            onStartCreate={organizationController.startCreatingOrganization}
            onCancelCreate={organizationController.cancelCreatingOrganization}
            onOrganizationNameChange={organizationController.setOrganizationName}
            onOrganizationDescriptionChange={
              organizationController.setOrganizationDescription
            }
            onCreateOrganization={() =>
              void organizationController.submitOrganization()
            }
            onShowJoinMessage={organizationController.showJoinMessage}
            onLogout={() => void handleLogout()}
          />
        ) : (
          <MobileWorkspaceStage
            organization={selectedMembership.organization}
            membership={selectedMembership.membership}
            summary={workspaceController.workspaceSummary}
            clients={workspaceController.workspaceClients}
            charts={workspaceController.workspaceCharts}
            isLoading={workspaceController.workspaceLoading}
            isSeeding={workspaceController.workspaceSeeding}
            error={workspaceController.workspaceError}
            notice={workspaceController.workspaceNotice}
            onBack={() => {
              organizationController.setSelectedOrganizationId(null);
              workspaceController.resetWorkspaceView();
            }}
            onSeedDemoData={() =>
              void workspaceController.seedWorkspaceDemoData()
            }
            onLogout={() => void handleLogout()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mobileTheme.colors.background
  },
  scrollContent: {
    paddingHorizontal: mobileTheme.spacing.lg,
    paddingTop: mobileTheme.spacing.lg,
    paddingBottom: mobileTheme.spacing.xxxl,
    gap: mobileTheme.spacing.md
  }
});
