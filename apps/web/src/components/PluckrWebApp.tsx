"use client";

/**
 * Thin web app shell that composes shared controller hooks with
 * web-specific storage and rendering components.
 */
import { useState } from "react";
import {
  createOrganizationSelectionStorage,
  useAuthController,
  useClientJournalController,
  useClientListController,
  useOrganizationController,
  useSessionController,
  useWorkspaceController
} from "@pluckr/app-core";
import { getSupabaseBrowserClient, type ClientRecord } from "@pluckr/supabase";

import { AuthStage } from "./AuthStage";
import { ClientJournalStage } from "./ClientJournalStage";
import { ClientListStage } from "./ClientListStage";
import { OrganizationStage } from "./OrganizationStage";
import { WorkspaceStage } from "./WorkspaceStage";

type ActiveWorkspaceScreen = "workspace" | "clients" | "journal";

export function PluckrWebApp() {
  const supabase = useState(() => getSupabaseBrowserClient())[0];
  const [activeWorkspaceScreen, setActiveWorkspaceScreen] =
    useState<ActiveWorkspaceScreen>("workspace");
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
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
  const clientListController = useClientListController(
    supabase,
    organizationController.selectedOrganizationId
  );
  const clientJournalController = useClientJournalController(
    supabase,
    organizationController.selectedOrganizationId,
    selectedClient
  );

  const selectedMembership = organizationController.memberships.find(
    (record) =>
      record.organization.id === organizationController.selectedOrganizationId
  );

  async function handleLogout() {
    await selectionStorage.clearSelectedOrganizationId();
    await supabase.auth.signOut();
    setActiveWorkspaceScreen("workspace");
    setSelectedClient(null);
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

  if (activeWorkspaceScreen === "clients") {
    return (
      <ClientListStage
        clients={clientListController.filteredClients}
        searchText={clientListController.searchText}
        isLoading={clientListController.isLoadingClients}
        error={clientListController.clientListError}
        notice={clientListController.clientListNotice}
        isCreatingClient={clientListController.isCreatingClient}
        isSavingClient={clientListController.isSavingClient}
        clientForm={clientListController.clientForm}
        onBack={() => setActiveWorkspaceScreen("workspace")}
        onLogout={() => void handleLogout()}
        onSelectClient={(client) => {
          setSelectedClient(client);
          setActiveWorkspaceScreen("journal");
        }}
        onSearchChange={clientListController.setSearchText}
        onStartCreate={clientListController.startCreatingClient}
        onCancelCreate={clientListController.cancelCreatingClient}
        onFormChange={clientListController.updateClientForm}
        onSubmitClient={() =>
          void clientListController.submitClient().then((saved) => {
            if (saved) {
              void workspaceController.refreshWorkspace();
            }
          })
        }
      />
    );
  }

  if (activeWorkspaceScreen === "journal" && selectedClient) {
    return (
      <ClientJournalStage
        client={selectedClient}
        charts={clientJournalController.charts}
        isLoading={clientJournalController.isLoadingCharts}
        error={clientJournalController.journalError}
        notice={clientJournalController.journalNotice}
        isEditingChart={clientJournalController.isEditingChart}
        isSavingChart={clientJournalController.isSavingChart}
        chartForm={clientJournalController.chartForm}
        onBack={() => setActiveWorkspaceScreen("clients")}
        onLogout={() => void handleLogout()}
        onStartChart={clientJournalController.startCreatingChart}
        onCancelChart={clientJournalController.cancelEditingChart}
        onEditChart={clientJournalController.startEditingChart}
        onDeleteChart={(chart) => void clientJournalController.removeChart(chart)}
        onChartFormChange={clientJournalController.updateChartForm}
        onSubmitChart={() =>
          void clientJournalController.submitChart().then((saved) => {
            if (saved) {
              void Promise.all([
                clientListController.refreshClients(),
                workspaceController.refreshWorkspace()
              ]);
            }
          })
        }
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
        setActiveWorkspaceScreen("workspace");
        setSelectedClient(null);
        organizationController.setSelectedOrganizationId(null);
        workspaceController.resetWorkspaceView();
      }}
      onOpenClients={() => setActiveWorkspaceScreen("clients")}
      onSeedDemoData={() => void workspaceController.seedWorkspaceDemoData()}
      onLogout={() => void handleLogout()}
    />
  );
}
