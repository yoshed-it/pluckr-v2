"use client";

/**
 * Thin web app shell that composes shared controller hooks with
 * web-specific storage and rendering components.
 */
import { useState } from "react";
import {
  createOrganizationSelectionStorage,
  useAuthController,
  useOrganizationController,
  useSessionController,
  useWorkspaceController
} from "@pluckr/app-core";
import { getSupabaseBrowserClient } from "@pluckr/supabase";

import { AuthStage } from "./AuthStage";
import { OrganizationStage } from "./OrganizationStage";
import { WorkspaceStage } from "./WorkspaceStage";

export function PluckrWebApp() {
  const supabase = useState(() => getSupabaseBrowserClient())[0];
  const selectionStorage = useState(() =>
    createOrganizationSelectionStorage({
      getItem: (key) =>
        typeof window === "undefined" ? null : window.localStorage.getItem(key),
      setItem: (key, value) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, value);
        }
      },
      removeItem: (key) => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(key);
        }
      }
    })
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

  if (sessionController.isBooting || !sessionController.session?.user) {
    return (
      <AuthStage
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
    );
  }

  if (
    organizationController.membershipsLoading ||
    !selectedMembership
  ) {
    return (
      <OrganizationStage
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
    );
  }

  return (
    <WorkspaceStage
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
      onSeedDemoData={() => void workspaceController.seedWorkspaceDemoData()}
      onLogout={() => void handleLogout()}
    />
  );
}
