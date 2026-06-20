import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
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
  useAdminController,
  useProviderProfileController,
  useSessionController,
  useWorkspaceController,
  type ChartUploadAsset,
  type KeyValueStorage
} from "@pluckr/app-core";
import {
  type ClientRecord,
  updateClientConsent
} from "@pluckr/supabase";

import { PluckrAuthStage } from "./PluckrAuthStage";
import { PluckrAdminStage } from "./PluckrAdminStage";
import { PluckrClientJournalStage } from "./PluckrClientJournalStage";
import { PluckrClientListStage } from "./PluckrClientListStage";
import { PluckrImageConsentStage } from "./PluckrImageConsentStage";
import { PluckrJournalLoadingStage } from "./PluckrJournalLoadingStage";
import { PluckrLaunchStage } from "./PluckrLaunchStage";
import { PluckrOrganizationStage } from "./PluckrOrganizationStage";
import { PluckrProviderHomeStage } from "./PluckrProviderHomeStage";
import { PluckrProviderSetupStage } from "./PluckrProviderSetupStage";
import { pluckrAppTheme } from "./pluckrAppTheme";

type ActiveWorkspaceScreen =
  | "workspace"
  | "clients"
  | "journal"
  | "consent"
  | "admin";

type PluckrAppShellProps = {
  supabase: SupabaseClient;
  storage: KeyValueStorage;
  logoSource: ImageSourcePropType;
  onRequestChartImages: () => Promise<ChartUploadAsset[]>;
  privacyCurtainVisible?: boolean;
  onPrivacyStateChange?: (state: {
    isSensitiveScreen: boolean;
    protectSensitiveScreens: boolean;
  }) => void;
};

export type PluckrPrivacyState = {
  isSensitiveScreen: boolean;
  protectSensitiveScreens: boolean;
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
  logoSource,
  onRequestChartImages,
  privacyCurtainVisible = false,
  onPrivacyStateChange
}: PluckrAppShellProps) {
  const [activeWorkspaceScreen, setActiveWorkspaceScreen] =
    useState<ActiveWorkspaceScreen>("workspace");
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [consentSignerName, setConsentSignerName] = useState("");
  const [consentSignature, setConsentSignature] = useState<string | null>(null);
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
  const selectedMembership = organizationController.memberships.find(
    (record) =>
      record.organization.id === organizationController.selectedOrganizationId
  );
  const workspaceController = useWorkspaceController(
    supabase,
    organizationController.memberships,
    organizationController.selectedOrganizationId,
    selectedMembership?.membership.id ?? null
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
  const providerProfileController = useProviderProfileController(
    supabase,
    selectedMembership
  );
  const adminController = useAdminController(supabase, selectedMembership);

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
  const shouldShowProviderSetupGate =
    !showLaunchStage &&
    !sessionController.isBooting &&
    !!sessionController.session?.user &&
    !organizationController.membershipsLoading &&
    !!selectedMembership &&
    !providerProfileController.isLoadingProvider &&
    providerProfileController.providerSetupRequired;
  const protectSensitiveScreens =
    selectedMembership?.organization.protect_sensitive_screens ?? true;
  const isSensitiveScreen =
    Boolean(selectedMembership) &&
    (activeWorkspaceScreen === "workspace" ||
      activeWorkspaceScreen === "clients" ||
      activeWorkspaceScreen === "journal" ||
      activeWorkspaceScreen === "consent" ||
      activeWorkspaceScreen === "admin");

  useEffect(() => {
    onPrivacyStateChange?.({
      isSensitiveScreen,
      protectSensitiveScreens
    });
  }, [isSensitiveScreen, onPrivacyStateChange, protectSensitiveScreens]);

  async function handleLogout() {
    await selectionStorage.clearSelectedOrganizationId();
    await supabase.auth.signOut();
    setActiveWorkspaceScreen("workspace");
    setSelectedClient(null);
    setConsentSignerName("");
    setConsentSignature(null);
    setConsentError(null);
    setConsentNotice(null);
    authController.resetAfterLogout();
    organizationController.resetAfterLogout();
    workspaceController.resetWorkspaceView();
  }

  function handleBackToOrganizations() {
    setSelectedClient(null);
    setActiveWorkspaceScreen("workspace");
    organizationController.setSelectedOrganizationId(null);
  }

  async function handleConsentSave() {
    if (!selectedClient || !organizationController.selectedOrganizationId) {
      return;
    }

    if (!consentSignerName.trim()) {
      setConsentError("Signer name is required.");
      return;
    }

    if (!consentSignature) {
      setConsentError("Signature is required.");
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
        consentSignaturePath: consentSignature
      });

      setSelectedClient(updatedClient);
      setConsentNotice("Image consent recorded.");
      setConsentSignerName("");
      setConsentSignature(null);
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

  function handleRequestChartImages() {
    if (!selectedClient?.consent_signed_at) {
      if (selectedClient) {
        setConsentSignerName(
          `${selectedClient.first_name} ${selectedClient.last_name}`.trim()
        );
        setConsentSignature(selectedClient.consent_signature_path);
      }
      setConsentError(null);
      setConsentNotice(null);
      setActiveWorkspaceScreen("consent");
      return Promise.resolve([] as ChartUploadAsset[]);
    }

    return onRequestChartImages();
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
        ) : selectedMembership && providerProfileController.isLoadingProvider ? (
          <PluckrJournalLoadingStage message="Loading your provider profile..." />
        ) : shouldShowOrganizationGate ? (
          <PluckrOrganizationStage
            logoSource={logoSource}
            memberships={organizationController.memberships}
            isCreating={
              !organizationController.membershipsLoading &&
              (organizationController.isCreatingOrganization ||
                organizationController.memberships.length === 0)
            }
            isJoining={organizationController.isJoiningOrganization}
            organizationName={organizationController.organizationName}
            organizationDescription={organizationController.organizationDescription}
            inviteToken={organizationController.inviteToken}
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
            onStartJoin={organizationController.startJoiningOrganization}
            onCancelJoin={organizationController.cancelJoiningOrganization}
            onOrganizationNameChange={organizationController.setOrganizationName}
            onOrganizationDescriptionChange={
              organizationController.setOrganizationDescription
            }
            onCreateOrganization={() =>
              void organizationController.submitOrganization()
            }
            onInviteTokenChange={organizationController.setInviteToken}
            onJoinOrganization={() =>
              void organizationController.submitJoinOrganization()
            }
            onLogout={() => void handleLogout()}
          />
        ) : shouldShowProviderSetupGate ? (
          <PluckrProviderSetupStage
            logoSource={logoSource}
            fullName={providerProfileController.providerProfileForm.fullName}
            phone={providerProfileController.providerProfileForm.phone}
            error={providerProfileController.providerError}
            notice={providerProfileController.providerNotice}
            isSaving={providerProfileController.isSavingProvider}
            onBack={handleBackToOrganizations}
            onLogout={() => void handleLogout()}
            onFormChange={providerProfileController.updateProviderProfileForm}
            onSubmit={() =>
              void providerProfileController.submitProviderProfile()
            }
          />
        ) : activeWorkspaceScreen === "admin" && selectedMembership ? (
          <PluckrAdminStage
            organization={selectedMembership.organization}
            providers={adminController.providers}
            inviteLinks={adminController.inviteLinks}
            inviteForm={adminController.inviteForm}
            isLoading={adminController.isLoadingAdmin}
            isSaving={adminController.isSavingAdmin}
            error={adminController.adminError}
            notice={adminController.adminNotice}
            onBack={() => setActiveWorkspaceScreen("workspace")}
            onInviteFormChange={(key, value) =>
              adminController.updateInviteForm(key, value)
            }
            onCreateInvite={() => void adminController.submitInvite()}
            onChangeProviderRole={(record, role) =>
              void adminController.changeProviderRole(record, role)
            }
            onToggleProviderStatus={(record, isActive) =>
              void adminController.changeProviderStatus(record, isActive)
            }
            onRevokeInvite={(inviteId) =>
              void adminController.removeInvite(inviteId)
            }
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
            signatureValue={consentSignature}
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
            onSignatureChange={setConsentSignature}
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
              setConsentSignature(selectedClient.consent_signature_path);
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
            onPickChartImages={() =>
              void handleRequestChartImages().then((assets) => {
                if (assets.length > 0) {
                  void clientJournalController.uploadChartAssets(assets);
                }
              })
            }
            onRemoveChartImage={(image) =>
              void clientJournalController.removeChartImageDraft(image)
            }
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
            dailyFolioClients={workspaceController.dailyFolioClients}
            isLoading={workspaceController.workspaceLoading}
            isSeeding={workspaceController.workspaceSeeding}
            error={
              organizationController.organizationError ??
              workspaceController.workspaceError
            }
            notice={
              organizationController.organizationNotice ??
              workspaceController.workspaceNotice
            }
            isUpdatingPrivacy={organizationController.organizationSettingsSubmitting}
            onOpenClients={() => setActiveWorkspaceScreen("clients")}
            onSeedDemoData={() => void workspaceController.seedWorkspaceDemoData()}
            onOpenClient={(client) => {
              setSelectedClient(client);
              setActiveWorkspaceScreen("journal");
            }}
            onAddFolioClient={(client) => {
              void workspaceController.addFolioClient(client);
            }}
            onRemoveFolioClient={(client) => {
              void workspaceController.removeFolioClient(client);
            }}
            onOpenAdmin={() => setActiveWorkspaceScreen("admin")}
            onToggleProtectSensitiveScreens={(nextValue) =>
              void organizationController.updateSelectedOrganizationPrivacy(nextValue)
            }
            onLogout={() => void handleLogout()}
          />
        ) : (
          <PluckrJournalLoadingStage message="Refreshing organization context..." />
        )}
      </ScrollView>
      {privacyCurtainVisible && isSensitiveScreen && protectSensitiveScreens ? (
        <View pointerEvents="none" style={styles.privacyCurtain}>
          <Text style={styles.privacyCurtainTitle}>Sensitive Screen Hidden</Text>
          <Text style={styles.privacyCurtainCopy}>
            Pluckr concealed this clinical screen to reduce accidental exposure.
          </Text>
        </View>
      ) : null}
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
  },
  privacyCurtain: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.xl,
    backgroundColor: "rgba(246, 244, 239, 0.96)"
  },
  privacyCurtainTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center"
  },
  privacyCurtainCopy: {
    marginTop: pluckrAppTheme.spacing.xs,
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24,
    textAlign: "center"
  }
});
