import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  type ImageSourcePropType
} from "react-native";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createOrganizationSelectionStorage,
  useAuthController,
  useClientDetailController,
  useClientJournalController,
  useClientListController,
  useOrganizationController,
  useSessionController,
  useWorkspaceController,
  type KeyValueStorage
} from "@pluckr/app-core";
import {
  type ClientRecord,
  updateClientConsent
} from "@pluckr/supabase";

import { PluckrAuthStage } from "./PluckrAuthStage";
import { PluckrClientJournalStage } from "./PluckrClientJournalStage";
import { PluckrClientListStage } from "./PluckrClientListStage";
import { PluckrImageConsentStage } from "./PluckrImageConsentStage";
import { PluckrJournalLoadingStage } from "./PluckrJournalLoadingStage";
import { PluckrLaunchStage } from "./PluckrLaunchStage";
import { PluckrOrganizationStage } from "./PluckrOrganizationStage";
import { PluckrProviderHomeStage } from "./PluckrProviderHomeStage";
import { pluckrAppTheme } from "./pluckrAppTheme";

type ActiveWorkspaceScreen = "workspace" | "clients" | "journal" | "consent";

type PluckrAppShellProps = {
  supabase: SupabaseClient;
  storage: KeyValueStorage;
  logoSource: ImageSourcePropType;
};

/**
 * Shared cross-platform product shell used by both Expo mobile and Next web.
 *
 * The shell owns navigation between the translated Swift parity screens, while
 * all backend and business logic stays in app-core and supabase packages.
 */
export function PluckrAppShell({
  supabase,
  storage,
  logoSource
}: PluckrAppShellProps) {
  const [activeWorkspaceScreen, setActiveWorkspaceScreen] =
    useState<ActiveWorkspaceScreen>("workspace");
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [consentSignerName, setConsentSignerName] = useState("");
  const [consentError, setConsentError] = useState<string | null>(null);
  const [consentNotice, setConsentNotice] = useState<string | null>(null);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [showLaunchStage, setShowLaunchStage] = useState(true);
  const selectionStorage = useState(() =>
    createOrganizationSelectionStorage(storage)
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
  const clientDetailController = useClientDetailController(
    supabase,
    organizationController.selectedOrganizationId,
    selectedClient
  );

  const selectedMembership = organizationController.memberships.find(
    (record) =>
      record.organization.id === organizationController.selectedOrganizationId
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLaunchStage(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const isHydratingOrganization =
    !showLaunchStage &&
    !!sessionController.session?.user &&
    organizationController.membershipsLoading;

  const shouldShowAuth =
    !showLaunchStage &&
    !sessionController.isBooting &&
    !sessionController.session?.user;

  const shouldShowOrganizationGate =
    !showLaunchStage &&
    !sessionController.isBooting &&
    !!sessionController.session?.user &&
    !organizationController.membershipsLoading &&
    !selectedMembership;

  async function handleLogout() {
    await selectionStorage.clearSelectedOrganizationId();
    await supabase.auth.signOut();
    setActiveWorkspaceScreen("workspace");
    setSelectedClient(null);
    setConsentSignerName("");
    setConsentError(null);
    setConsentNotice(null);
    authController.resetAfterLogout();
    organizationController.resetAfterLogout();
    workspaceController.resetWorkspaceView();
  }

  async function handleConsentSave() {
    if (!selectedClient || !organizationController.selectedOrganizationId) {
      return;
    }

    if (!consentSignerName.trim()) {
      setConsentError("Signer name is required.");
      return;
    }

    setIsSavingConsent(true);
    setConsentError(null);
    setConsentNotice(null);

    try {
      const updatedClient = await updateClientConsent(supabase, {
        organizationId: organizationController.selectedOrganizationId,
        clientId: selectedClient.id,
        consentSignedAt: new Date().toISOString(),
        consentSignaturePath: `signature:${consentSignerName.trim()}`
      });

      setSelectedClient(updatedClient);
      setConsentNotice("Image consent recorded.");
      setConsentSignerName("");
      setActiveWorkspaceScreen("journal");
      await Promise.all([
        clientListController.refreshClients(),
        workspaceController.refreshWorkspace()
      ]);
    } catch (error) {
      setConsentError(
        error instanceof Error
          ? error.message
          : "Unable to save image consent right now."
      );
    } finally {
      setIsSavingConsent(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {showLaunchStage ? (
          <PluckrLaunchStage logoSource={logoSource} />
        ) : sessionController.isBooting ? (
          <PluckrJournalLoadingStage message="Restoring your session..." />
        ) : shouldShowAuth ? (
          <PluckrAuthStage
            mode={authController.authMode}
            logoSource={logoSource}
            fullName={authController.fullName}
            email={authController.email}
            password={authController.password}
            confirmPassword={authController.confirmPassword}
            error={authController.authError ?? sessionController.sessionError}
            notice={authController.authNotice}
            isSubmitting={authController.authSubmitting}
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
        ) : isHydratingOrganization ? (
          <PluckrJournalLoadingStage message="Loading your organizations..." />
        ) : shouldShowOrganizationGate ? (
          <PluckrOrganizationStage
            logoSource={logoSource}
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
          <PluckrClientListStage
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
        ) : activeWorkspaceScreen === "consent" && selectedClient ? (
          <PluckrImageConsentStage
            client={selectedClient}
            signerName={consentSignerName}
            isSaving={isSavingConsent}
            error={consentError}
            notice={consentNotice}
            onBack={() => {
              setActiveWorkspaceScreen("journal");
              setConsentError(null);
              setConsentNotice(null);
            }}
            onLogout={() => void handleLogout()}
            onSignerNameChange={setConsentSignerName}
            onSignConsent={() => void handleConsentSave()}
          />
        ) : activeWorkspaceScreen === "journal" && selectedClient ? (
          <PluckrClientJournalStage
            client={selectedClient}
            charts={clientJournalController.charts}
            isLoading={clientJournalController.isLoadingCharts}
            error={clientJournalController.journalError}
            notice={clientJournalController.journalNotice}
            isEditingChart={clientJournalController.isEditingChart}
            isSavingChart={clientJournalController.isSavingChart}
            chartForm={clientJournalController.chartForm}
            availableChartTags={clientJournalController.availableChartTags}
            onBack={() => setActiveWorkspaceScreen("clients")}
            onLogout={() => void handleLogout()}
            onOpenConsent={() => {
              setConsentSignerName(
                `${selectedClient.first_name} ${selectedClient.last_name}`.trim()
              );
              setConsentError(null);
              setConsentNotice(null);
              setActiveWorkspaceScreen("consent");
            }}
            isEditingClient={clientDetailController.isEditingClient}
            isSavingClient={clientDetailController.isSavingClient}
            clientDetailError={clientDetailController.clientDetailError}
            clientDetailNotice={clientDetailController.clientDetailNotice}
            clientDetailForm={clientDetailController.clientDetailForm}
            availableClientTags={clientDetailController.availableClientTags}
            onStartEditClient={() => {
              clientJournalController.cancelEditingChart();
              clientDetailController.startEditingClient();
            }}
            onCancelEditClient={clientDetailController.cancelEditingClient}
            onClientDetailFormChange={clientDetailController.updateClientDetailForm}
            onToggleClientTag={clientDetailController.toggleClientTag}
            onAddCustomClientTag={clientDetailController.addCustomClientTag}
            onSubmitClientDetails={() =>
              void clientDetailController.submitClientDetails().then((updatedClient) => {
                if (updatedClient) {
                  setSelectedClient(updatedClient);
                  void Promise.all([
                    clientListController.refreshClients(),
                    workspaceController.refreshWorkspace()
                  ]);
                }
              })
            }
            onArchiveClient={() =>
              void clientDetailController.archiveSelectedClient().then((archivedClient) => {
                if (archivedClient) {
                  setSelectedClient(null);
                  setActiveWorkspaceScreen("clients");
                  void Promise.all([
                    clientListController.refreshClients(),
                    workspaceController.refreshWorkspace()
                  ]);
                }
              })
            }
            onStartChart={clientJournalController.startCreatingChart}
            onCancelChart={clientJournalController.cancelEditingChart}
            onEditChart={clientJournalController.startEditingChart}
            onDeleteChart={(chart) => void clientJournalController.removeChart(chart)}
            onChartFormChange={clientJournalController.updateChartForm}
            onToggleChartTag={clientJournalController.toggleChartTag}
            onAddCustomChartTag={clientJournalController.addCustomChartTag}
            onProbeStyleChange={clientJournalController.setProbeStyle}
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
        ) : selectedMembership ? (
          <PluckrProviderHomeStage
            organization={selectedMembership.organization}
            membership={selectedMembership.membership}
            summary={workspaceController.workspaceSummary}
            clients={workspaceController.workspaceClients}
            charts={workspaceController.workspaceCharts}
            isLoading={workspaceController.workspaceLoading}
            isSeeding={workspaceController.workspaceSeeding}
            error={workspaceController.workspaceError}
            notice={workspaceController.workspaceNotice}
            onOpenClients={() => setActiveWorkspaceScreen("clients")}
            onSeedDemoData={() => void workspaceController.seedWorkspaceDemoData()}
            onOpenClient={(client) => {
              setSelectedClient(client);
              setActiveWorkspaceScreen("journal");
            }}
            onLogout={() => void handleLogout()}
          />
        ) : (
          <PluckrJournalLoadingStage message="Refreshing organization context..." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: pluckrAppTheme.colors.background
  },
  scrollContent: {
    paddingHorizontal: pluckrAppTheme.spacing.lg,
    paddingTop: pluckrAppTheme.spacing.lg,
    paddingBottom: pluckrAppTheme.spacing.xxxl,
    gap: pluckrAppTheme.spacing.md
  }
});
