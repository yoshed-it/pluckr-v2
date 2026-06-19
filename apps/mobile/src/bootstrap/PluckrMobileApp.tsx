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
  useClientJournalController,
  useClientListController,
  useOrganizationController,
  useSessionController,
  useWorkspaceController
} from "@pluckr/app-core";
import { getSupabaseNativeClient, type ClientRecord } from "@pluckr/supabase";

import { MobileAuthStage } from "../components/MobileAuthStage";
import { MobileClientJournalStage } from "../components/MobileClientJournalStage";
import { MobileClientListStage } from "../components/MobileClientListStage";
import { MobileOrganizationStage } from "../components/MobileOrganizationStage";
import { MobileWorkspaceStage } from "../components/MobileWorkspaceStage";
import { mobileTheme } from "../theme";

type ActiveWorkspaceScreen = "workspace" | "clients" | "journal";

export function PluckrMobileApp() {
  const supabase = useState(() => getSupabaseNativeClient(AsyncStorage))[0];
  const [activeWorkspaceScreen, setActiveWorkspaceScreen] =
    useState<ActiveWorkspaceScreen>("workspace");
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
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
        ) : activeWorkspaceScreen === "clients" ? (
          <MobileClientListStage
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
        ) : activeWorkspaceScreen === "journal" && selectedClient ? (
          <MobileClientJournalStage
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
              setActiveWorkspaceScreen("workspace");
              setSelectedClient(null);
              organizationController.setSelectedOrganizationId(null);
              workspaceController.resetWorkspaceView();
            }}
            onOpenClients={() => setActiveWorkspaceScreen("clients")}
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
