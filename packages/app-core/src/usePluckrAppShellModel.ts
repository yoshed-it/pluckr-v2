import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getClientDisplayName, getClientLegalName, type ClientRecord } from "@pluckr/domain";
import type { OrganizationRole } from "@pluckr/domain";
import { updateClientConsent } from "@pluckr/supabase";

import type { ChartUploadAsset } from "./chartFormState";
import { useAdminController } from "./useAdminController";
import { useAuthController } from "./useAuthController";
import { useClientDetailController } from "./useClientDetailController";
import { useClientJournalController } from "./useClientJournalController";
import { useClientListController } from "./useClientListController";
import { useOrganizationController } from "./useOrganizationController";
import { useProviderProfileController } from "./useProviderProfileController";
import { useSessionController } from "./useSessionController";
import { useWorkspaceController } from "./useWorkspaceController";

type ActiveWorkspaceScreen =
  | "workspace"
  | "clients"
  | "journal"
  | "consent"
  | "more"
  | "settings"
  | "admin";

type JournalOrigin = "workspace" | "clients";
type SettingsOrigin = "workspace" | "clients" | "more";
type AdminOrigin = "settings" | "more";

type SnackbarTone = "success" | "error" | "warning" | "info";

type SnackbarFeedback = {
  key: string;
  message: string;
  tone: SnackbarTone;
  actionLabel?: string;
  onAction?: () => void;
};

type SnackbarEvent = Omit<SnackbarFeedback, "key"> & {
  id: string;
};

function createSnackbarFeedback(
  source: string,
  message: string | null | undefined,
  tone: SnackbarTone
): SnackbarFeedback | null {
  if (!message) {
    return null;
  }

  return {
    key: `${source}:${tone}:${message}`,
    message,
    tone
  };
}

type UsePluckrAppShellModelProps = {
  supabase: SupabaseClient;
  onRequestChartImages: () => Promise<ChartUploadAsset[]>;
};

export function usePluckrAppShellModel({
  supabase,
  onRequestChartImages
}: UsePluckrAppShellModelProps) {
  const [activeWorkspaceScreen, setActiveWorkspaceScreen] =
    useState<ActiveWorkspaceScreen>("workspace");
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [journalOrigin, setJournalOrigin] = useState<JournalOrigin>("workspace");
  const [settingsOrigin, setSettingsOrigin] =
    useState<SettingsOrigin>("workspace");
  const [adminOrigin, setAdminOrigin] = useState<AdminOrigin>("settings");
  const [consentSignerName, setConsentSignerName] = useState("");
  const [consentSignature, setConsentSignature] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [consentNotice, setConsentNotice] = useState<string | null>(null);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [showLaunchStage, setShowLaunchStage] = useState(true);
  const [activeSnackbar, setActiveSnackbar] =
    useState<SnackbarEvent | null>(null);
  const snackbarSerialRef = useRef(0);
  const lastSnackbarKeyRef = useRef<string | null>(null);
  const showSnackbar = useCallback((feedback: SnackbarFeedback) => {
    snackbarSerialRef.current += 1;
    setActiveSnackbar({
      id: String(snackbarSerialRef.current),
      message: feedback.message,
      tone: feedback.tone,
      actionLabel: feedback.actionLabel,
      onAction: feedback.onAction
    });
  }, []);
  const dismissSnackbar = useCallback((id?: string) => {
    setActiveSnackbar((current) => {
      if (!current) {
        return null;
      }

      if (id && current.id !== id) {
        return current;
      }

      return null;
    });
  }, []);

  const sessionController = useSessionController(supabase);
  const authController = useAuthController(supabase);
  const organizationController = useOrganizationController(
    supabase,
    sessionController.session?.user.id
  );
  const selectedMembership = organizationController.memberships[0];
  const selectedOrganizationId = selectedMembership?.organization.id ?? null;
  const workspaceController = useWorkspaceController(
    supabase,
    organizationController.memberships,
    selectedOrganizationId,
    selectedMembership?.membership.id ?? null
  );
  const clientListController = useClientListController(
    supabase,
    selectedOrganizationId
  );
  const clientJournalController = useClientJournalController(
    supabase,
    selectedOrganizationId,
    selectedClient
  );
  const clientDetailController = useClientDetailController(
    supabase,
    selectedOrganizationId,
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
    organizationController.memberships.length === 0;

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
      activeWorkspaceScreen === "settings" ||
      activeWorkspaceScreen === "admin");

  const clientFullName = selectedClient
    ? getClientDisplayName(selectedClient)
    : null;

  const shouldShowShellNavigationBar =
    !showLaunchStage &&
    !sessionController.isBooting &&
    !!selectedMembership &&
    activeWorkspaceScreen !== "workspace" &&
    activeWorkspaceScreen !== "journal" &&
    !shouldShowOrganizationGate &&
    !shouldShowProviderSetupGate;

  const shouldShowUtilityBar =
    !showLaunchStage &&
    !sessionController.isBooting &&
    !!selectedMembership &&
    activeWorkspaceScreen !== "journal" &&
    !shouldShowOrganizationGate &&
    !shouldShowProviderSetupGate;
  const shouldShowBottomNavigation =
    !showLaunchStage &&
    !sessionController.isBooting &&
    !!selectedMembership &&
    !shouldShowOrganizationGate &&
    !shouldShowProviderSetupGate;

  function resetAfterLogout() {
    setActiveWorkspaceScreen("workspace");
    setSelectedClient(null);
    setJournalOrigin("workspace");
    setSettingsOrigin("workspace");
    setAdminOrigin("settings");
    setConsentSignerName("");
    setConsentSignature(null);
    setConsentError(null);
    setConsentNotice(null);
    sessionController.clearSession();
    authController.resetAfterLogout();
    organizationController.resetAfterLogout();
    workspaceController.resetWorkspaceView();
  }

  async function handleLogout() {
    resetAfterLogout();

    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        showSnackbar({
          key: "manual:logout-error",
          message: error.message,
          tone: "error"
        });
      }
    } catch (error) {
      showSnackbar({
        key: "manual:logout-error",
        message:
          error instanceof Error ? error.message : "Unable to finish logout.",
        tone: "error"
      });
    }
  }

  function handleOpenHomeFromBottomNavigation() {
    clientJournalController.cancelEditingChart();
    clientDetailController.cancelEditingClient();
    setSelectedClient(null);
    setJournalOrigin("workspace");
    setActiveWorkspaceScreen("workspace");
  }

  function handleOpenClientsFromBottomNavigation() {
    clientJournalController.cancelEditingChart();
    clientDetailController.cancelEditingClient();
    setSelectedClient(null);
    setJournalOrigin("clients");
    setActiveWorkspaceScreen("clients");
  }

  function openSettings(origin: SettingsOrigin) {
    clientJournalController.cancelEditingChart();
    clientDetailController.cancelEditingClient();
    setSelectedClient(null);
    setSettingsOrigin(origin);
    setActiveWorkspaceScreen("settings");
  }

  function handleOpenReportsFromBottomNavigation() {
    showSnackbar({
      key: "manual:reports-coming-soon",
      message: "Reports are coming soon.",
      tone: "info"
    });
  }

  function handleOpenMoreFromBottomNavigation() {
    clientJournalController.cancelEditingChart();
    clientDetailController.cancelEditingClient();
    setSelectedClient(null);
    setActiveWorkspaceScreen("more");
  }

  function openClientJournal(nextClient: ClientRecord, origin: JournalOrigin) {
    setSelectedClient(nextClient);
    setJournalOrigin(origin);
    setActiveWorkspaceScreen("journal");
  }

  function handleBackFromJournal() {
    setSelectedClient(null);
    setActiveWorkspaceScreen(journalOrigin);
  }

  function handleBackFromConsent() {
    setActiveWorkspaceScreen("journal");
    setConsentError(null);
    setConsentNotice(null);
  }

  const previousScreenLabel =
    activeWorkspaceScreen === "clients"
      ? "Dashboard"
      : activeWorkspaceScreen === "journal"
        ? journalOrigin === "workspace"
          ? "Dashboard"
          : "Clients"
        : activeWorkspaceScreen === "consent"
          ? "Client"
          : activeWorkspaceScreen === "settings"
            ? settingsOrigin === "more"
              ? "More"
              : settingsOrigin === "clients"
                ? "Clients"
                : "Dashboard"
            : activeWorkspaceScreen === "admin"
              ? adminOrigin === "more"
                ? "More"
                : "Settings"
              : null;

  const navigationBackAction =
    activeWorkspaceScreen === "clients"
      ? () => setActiveWorkspaceScreen("workspace")
      : activeWorkspaceScreen === "journal"
        ? handleBackFromJournal
        : activeWorkspaceScreen === "consent"
          ? handleBackFromConsent
          : activeWorkspaceScreen === "settings"
            ? () => setActiveWorkspaceScreen(settingsOrigin)
            : activeWorkspaceScreen === "admin"
              ? () => setActiveWorkspaceScreen(adminOrigin)
              : null;

  const navigationTitle =
    activeWorkspaceScreen === "workspace"
      ? "Dashboard"
      : activeWorkspaceScreen === "clients"
        ? "Clients"
        : activeWorkspaceScreen === "journal"
          ? "Client"
          : activeWorkspaceScreen === "consent"
            ? "Image Consent"
            : activeWorkspaceScreen === "more"
              ? "More"
            : activeWorkspaceScreen === "settings"
              ? "Settings"
              : activeWorkspaceScreen === "admin"
                ? "Team"
                : "Dashboard";

  const navigationSubtitle =
    activeWorkspaceScreen === "workspace"
      ? null
      : activeWorkspaceScreen === "clients"
        ? null
        : activeWorkspaceScreen === "journal"
          ? null
          : activeWorkspaceScreen === "consent"
            ? null
            : activeWorkspaceScreen === "more"
              ? "Additional tools and features will appear here as Pluckr grows."
            : activeWorkspaceScreen === "settings"
              ? null
              : activeWorkspaceScreen === "admin"
                ? null
                : null;

  const utilityActions =
    activeWorkspaceScreen === "more"
      ? []
      : [
          ...(activeWorkspaceScreen !== "journal" &&
          activeWorkspaceScreen !== "settings"
            ? [
                {
                  label: "Settings",
                  icon: "settings" as const,
                  iconOnly: true,
                  onPress: () =>
                    openSettings(
                      activeWorkspaceScreen === "clients"
                        ? "clients"
                        : "workspace"
                    )
                }
              ]
            : []),
          {
            label: "Log Out",
            icon: "logout" as const,
            iconOnly: true,
            onPress: () => void handleLogout(),
            tone: "critical" as const
          }
        ];
  const bottomNavigation = shouldShowBottomNavigation
    ? {
        items: [
          {
            key: "home",
            label: "Home",
            icon: "home" as const,
            active: activeWorkspaceScreen === "workspace",
            onPress: handleOpenHomeFromBottomNavigation
          },
          {
            key: "clients",
            label: "Clients",
            icon: "clients" as const,
            active:
              activeWorkspaceScreen === "clients" ||
              activeWorkspaceScreen === "journal" ||
              activeWorkspaceScreen === "consent",
            onPress: handleOpenClientsFromBottomNavigation
          },
          {
            key: "reports",
            label: "Reports",
            icon: "reports" as const,
            active: false,
            onPress: handleOpenReportsFromBottomNavigation
          },
          {
            key: "more",
            label: "More",
            icon: "more" as const,
            active:
              activeWorkspaceScreen === "more" ||
              activeWorkspaceScreen === "settings" ||
              activeWorkspaceScreen === "admin",
            onPress: handleOpenMoreFromBottomNavigation
          }
        ],
        primaryAction: {
          label: "Add",
          icon: "add" as const,
          disabled: true
        }
      }
    : null;

  const snackbarFeedback =
    createSnackbarFeedback(
      "auth",
      authController.authError ?? sessionController.sessionError,
      "error"
    ) ??
    createSnackbarFeedback("auth", authController.authNotice, "success") ??
    (activeWorkspaceScreen === "workspace"
      ? createSnackbarFeedback(
          "workspace",
          organizationController.organizationError ??
            workspaceController.workspaceError,
          "error"
        ) ??
        createSnackbarFeedback(
          "workspace",
          organizationController.organizationNotice ??
            workspaceController.workspaceNotice,
          "success"
        )
      : null) ??
    (activeWorkspaceScreen === "clients"
      ? createSnackbarFeedback(
          "clients",
          clientListController.clientListError,
          "error"
        ) ??
        createSnackbarFeedback(
          "clients",
          clientListController.clientListNotice,
          "success"
        )
      : null) ??
    (activeWorkspaceScreen === "journal"
      ? createSnackbarFeedback(
          "journal",
          clientDetailController.clientDetailError ??
            clientJournalController.journalError,
          "error"
        ) ??
        createSnackbarFeedback(
          "journal",
          clientDetailController.clientDetailNotice ??
            clientJournalController.journalNotice,
          "success"
        )
      : null) ??
    (activeWorkspaceScreen === "consent"
      ? createSnackbarFeedback("consent", consentError, "error") ??
        createSnackbarFeedback("consent", consentNotice, "success")
      : null) ??
    (activeWorkspaceScreen === "settings"
      ? createSnackbarFeedback(
          "settings",
          organizationController.organizationError,
          "error"
        ) ??
        createSnackbarFeedback(
          "settings",
          organizationController.organizationNotice,
          "success"
        )
      : null) ??
    (activeWorkspaceScreen === "admin"
      ? createSnackbarFeedback("admin", adminController.adminError, "error") ??
        createSnackbarFeedback("admin", adminController.adminNotice, "success")
      : null) ??
    (shouldShowProviderSetupGate
      ? createSnackbarFeedback(
          "provider-setup",
          providerProfileController.providerError,
          "error"
        ) ??
        createSnackbarFeedback(
          "provider-setup",
          providerProfileController.providerNotice,
          "success"
        )
      : null) ??
    (shouldShowOrganizationGate
      ? createSnackbarFeedback(
          "workspace-setup",
          organizationController.organizationError,
          "error"
        ) ??
        createSnackbarFeedback(
          "workspace-setup",
          organizationController.organizationNotice,
          "success"
        )
      : null) ??
    createSnackbarFeedback(
      "clients-global",
      clientListController.clientListError,
      "error"
    ) ??
    createSnackbarFeedback(
      "clients-global",
      clientListController.clientListNotice,
      "success"
    );
  const snackbarFeedbackKey = snackbarFeedback?.key ?? null;

  useEffect(() => {
    if (!snackbarFeedback) {
      lastSnackbarKeyRef.current = null;
      return;
    }

    if (lastSnackbarKeyRef.current === snackbarFeedback.key) {
      return;
    }

    lastSnackbarKeyRef.current = snackbarFeedback.key;
    showSnackbar(snackbarFeedback);
  }, [showSnackbar, snackbarFeedback, snackbarFeedbackKey]);

  async function handleConsentSave() {
    if (!selectedClient || !selectedOrganizationId) {
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
        organizationId: selectedOrganizationId,
        clientId: selectedClient.id,
        consentSignedAt: new Date().toISOString(),
        consentSignaturePath: consentSignature
      });

      setSelectedClient(updatedClient);
      setConsentNotice("Image consent recorded.");
      setConsentSignerName("");
      setConsentSignature(null);
      setActiveWorkspaceScreen("journal");
      showSnackbar({
        key: "manual:consent-recorded",
        message: "Image consent recorded.",
        tone: "success"
      });
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
        setConsentSignerName(getClientLegalName(selectedClient));
        setConsentSignature(selectedClient.consent_signature_path);
      }
      setConsentError(null);
      setConsentNotice(null);
      setActiveWorkspaceScreen("consent");
      return Promise.resolve([] as ChartUploadAsset[]);
    }

    return onRequestChartImages();
  }

  return {
    showLaunchStage,
    isBooting: sessionController.isBooting,
    isHydratingOrganization,
    isLoadingProvider: providerProfileController.isLoadingProvider,
    shouldShowAuth,
    shouldShowOrganizationGate,
    shouldShowProviderSetupGate,
    shouldShowUtilityBar,
    shouldShowShellNavigationBar,
    showProviderLoading:
      Boolean(selectedMembership) && providerProfileController.isLoadingProvider,
    showAdminStage: activeWorkspaceScreen === "admin" && Boolean(selectedMembership),
    showClientListStage: activeWorkspaceScreen === "clients",
    showConsentStage: activeWorkspaceScreen === "consent" && Boolean(selectedClient),
    showClientJournalStage:
      activeWorkspaceScreen === "journal" && Boolean(selectedClient),
    showMoreStage: activeWorkspaceScreen === "more" && Boolean(selectedMembership),
    showSettingsStage:
      activeWorkspaceScreen === "settings" && Boolean(selectedMembership),
    showProviderHomeStage:
      activeWorkspaceScreen === "workspace" && Boolean(selectedMembership),
    previousScreenLabel,
    navigationBackAction,
    navigationTitle,
    navigationSubtitle,
    utilityActions,
    bottomNavigation,
    snackbar: activeSnackbar
      ? {
          ...activeSnackbar,
          onDismiss: dismissSnackbar
        }
      : null,
    protectSensitiveScreens,
    isSensitiveScreen,
    authStageProps: {
      mode: authController.authMode,
      signupIntent: authController.signupIntent,
      fullName: authController.fullName,
      email: authController.email,
      password: authController.password,
      confirmPassword: authController.confirmPassword,
      error: authController.authError ?? sessionController.sessionError,
      notice: authController.authNotice,
      isSubmitting: authController.authSubmitting,
      onModeChange: authController.changeAuthMode,
      onFullNameChange: authController.setFullName,
      onEmailChange: authController.setEmail,
      onPasswordChange: authController.setPassword,
      onConfirmPasswordChange: authController.setConfirmPassword,
      onSubmit: () =>
        void (authController.authMode === "signup"
          ? authController.signUp()
          : authController.authMode === "forgot"
            ? authController.sendPasswordReset()
            : authController.signIn())
    },
    organizationStageProps: {
      memberships: organizationController.memberships,
      canCreateWorkspace:
        sessionController.session?.user.user_metadata.onboarding_intent ===
          "creator",
      isCreating:
        !organizationController.membershipsLoading &&
        organizationController.isCreatingOrganization,
      isJoining: organizationController.isJoiningOrganization,
      organizationName: organizationController.organizationName,
      organizationDescription: organizationController.organizationDescription,
      inviteToken: organizationController.inviteToken,
      isSubmitting:
        organizationController.membershipsLoading ||
        organizationController.organizationSubmitting,
      error: organizationController.organizationError,
      notice: organizationController.membershipsLoading
        ? "Loading your workspace..."
        : organizationController.organizationNotice,
      onStartCreate: organizationController.startCreatingOrganization,
      onCancelCreate: organizationController.cancelCreatingOrganization,
      onStartJoin: organizationController.startJoiningOrganization,
      onCancelJoin: organizationController.cancelJoiningOrganization,
      onOrganizationNameChange: organizationController.setOrganizationName,
      onOrganizationDescriptionChange:
        organizationController.setOrganizationDescription,
      onCreateOrganization: () => void organizationController.submitOrganization(),
      onInviteTokenChange: organizationController.setInviteToken,
      onJoinOrganization: () => void organizationController.submitJoinOrganization(),
      onLogout: () => void handleLogout()
    },
    providerSetupStageProps: {
      fullName: providerProfileController.providerProfileForm.fullName,
      phone: providerProfileController.providerProfileForm.phone,
      error: providerProfileController.providerError,
      notice: providerProfileController.providerNotice,
      isSaving: providerProfileController.isSavingProvider,
      onLogout: () => void handleLogout(),
      onFormChange: providerProfileController.updateProviderProfileForm,
      onSubmit: () => void providerProfileController.submitProviderProfile()
    },
    adminStageProps: selectedMembership
      ? {
          organization: selectedMembership.organization,
          providers: adminController.providers,
          inviteLinks: adminController.inviteLinks,
          inviteForm: adminController.inviteForm,
          isLoading: adminController.isLoadingAdmin,
          isSaving: adminController.isSavingAdmin,
          error: adminController.adminError,
          notice: adminController.adminNotice,
          hideToolbar: true,
          onBack: () => setActiveWorkspaceScreen(adminOrigin),
          onInviteFormChange: (key: "email" | "role", value: string) =>
            adminController.updateInviteForm(key, value),
          onCreateInvite: () => void adminController.submitInvite(),
          onChangeProviderRole: (
            record: typeof adminController.providers[number],
            role: OrganizationRole
          ) =>
            void adminController.changeProviderRole(record, role),
          onToggleProviderStatus: (
            record: typeof adminController.providers[number],
            isActive: boolean
          ) => void adminController.changeProviderStatus(record, isActive),
          onRevokeInvite: (inviteId: string) =>
            void adminController.removeInvite(inviteId)
        }
      : null,
    clientListStageProps: {
      clients: clientListController.filteredClients,
      searchText: clientListController.searchText,
      isLoading: clientListController.isLoadingClients,
      error: clientListController.clientListError,
      notice: clientListController.clientListNotice,
      isCreatingClient: clientListController.isCreatingClient,
      isSavingClient: clientListController.isSavingClient,
      hideToolbar: true,
      clientForm: clientListController.clientForm,
      clientFormErrors: clientListController.clientFormErrors,
      availableClientTags: clientListController.availableClientTags,
      onBack: () => setActiveWorkspaceScreen("workspace"),
      onLogout: () => void handleLogout(),
      onSelectClient: (client: ClientRecord) => {
        openClientJournal(client, "clients");
      },
      onSearchChange: clientListController.setSearchText,
      onStartCreate: clientListController.startCreatingClient,
      onCancelCreate: clientListController.cancelCreatingClient,
      onFormChange: clientListController.updateClientForm,
      onToggleClientTag: clientListController.toggleClientTag,
      onAddCustomClientTag: clientListController.addCustomClientTag,
      onSubmitClient: () =>
        void clientListController.submitClient().then((createdClient) => {
          if (createdClient) {
            openClientJournal(createdClient, "clients");
            void workspaceController.refreshWorkspace();
          }
        })
    },
    consentStageProps: selectedClient
      ? {
          client: selectedClient,
          signerName: consentSignerName,
          signatureValue: consentSignature,
          isSaving: isSavingConsent,
          error: consentError,
          notice: consentNotice,
          hideToolbar: true,
          onBack: handleBackFromConsent,
          onLogout: () => void handleLogout(),
          onSignerNameChange: setConsentSignerName,
          onSignatureChange: setConsentSignature,
          onSignConsent: () => void handleConsentSave()
        }
      : null,
    clientJournalStageProps: selectedClient
      ? {
          client: selectedClient,
          charts: clientJournalController.charts,
          isLoading: clientJournalController.isLoadingCharts,
          error: clientJournalController.journalError,
          notice: clientJournalController.journalNotice,
          isEditingChart: clientJournalController.isEditingChart,
          isSavingChart: clientJournalController.isSavingChart,
          hideToolbar: true,
          backLabel: previousScreenLabel,
          chartForm: clientJournalController.chartForm,
          previousChartReferencesByAreaId:
            clientJournalController.previousChartReferencesByAreaId,
          availableChartTags: clientJournalController.availableChartTags,
          onBack: handleBackFromJournal,
          onLogout: () => void handleLogout(),
          onOpenConsent: () => {
            setConsentSignerName(getClientLegalName(selectedClient));
            setConsentSignature(selectedClient.consent_signature_path);
            setConsentError(null);
            setConsentNotice(null);
            setActiveWorkspaceScreen("consent");
          },
          isEditingClient: clientDetailController.isEditingClient,
          isSavingClient: clientDetailController.isSavingClient,
          clientDetailError: clientDetailController.clientDetailError,
          clientDetailNotice: clientDetailController.clientDetailNotice,
          clientDetailForm: clientDetailController.clientDetailForm,
          clientDetailFormErrors: clientDetailController.clientDetailFormErrors,
          availableClientTags: clientDetailController.availableClientTags,
          onStartEditClient: () => {
            clientJournalController.cancelEditingChart();
            clientDetailController.startEditingClient();
          },
          onCancelEditClient: clientDetailController.cancelEditingClient,
          onClientDetailFormChange: clientDetailController.updateClientDetailForm,
          onToggleClientTag: clientDetailController.toggleClientTag,
          onAddCustomClientTag: clientDetailController.addCustomClientTag,
          onSubmitClientDetails: async () => {
            const updatedClient =
              await clientDetailController.submitClientDetails();

            if (!updatedClient) {
              return false;
            }

            setSelectedClient(updatedClient);
            showSnackbar({
              key: "manual:client-updated",
              message: "Client updated.",
              tone: "success"
            });
            await Promise.all([
              clientListController.refreshClients(),
              workspaceController.refreshWorkspace()
            ]);

            return true;
          },
          onArchiveClient: () =>
            void clientDetailController
              .archiveSelectedClient()
              .then((archivedClient) => {
                if (archivedClient) {
                  setSelectedClient(null);
                  setActiveWorkspaceScreen("clients");
                  showSnackbar({
                    key: "manual:client-archived",
                    message: "Client archived.",
                    tone: "success"
                  });
                  void Promise.all([
                    clientListController.refreshClients(),
                    workspaceController.refreshWorkspace()
                  ]);
                }
              }),
          onStartChart: clientJournalController.startCreatingChart,
          onTakePhoto: () => {
            clientJournalController.startCreatingChart();
            void handleRequestChartImages().then((assets) => {
              if (assets.length > 0) {
                void clientJournalController.uploadChartAssets(assets);
              }
            });
          },
          onCancelChart: clientJournalController.cancelEditingChart,
          onEditChart: clientJournalController.startEditingChart,
          onDeleteChart: (chart: typeof clientJournalController.charts[number]) =>
            void clientJournalController.removeChart(chart),
          onChartFormChange: clientJournalController.updateChartForm,
          onTreatmentAreaFormChange:
            clientJournalController.updateTreatmentAreaForm,
          onAddTreatmentArea: clientJournalController.addTreatmentArea,
          onToggleChartTag: clientJournalController.toggleChartTag,
          onAddCustomChartTag: clientJournalController.addCustomChartTag,
          onPickChartImages: () =>
            void handleRequestChartImages().then((assets) => {
              if (assets.length > 0) {
                void clientJournalController.uploadChartAssets(assets);
              }
            }),
          onRemoveChartImage: (image: typeof clientJournalController.chartForm.images[number]) =>
            void clientJournalController.removeChartImageDraft(image),
          onProbeStyleChange: clientJournalController.setProbeStyle,
          onSubmitChart: () =>
            void clientJournalController.submitChart().then((saved) => {
              if (saved) {
                void Promise.all([
                  clientListController.refreshClients(),
                  workspaceController.refreshWorkspace()
                ]);
              }
            })
        }
      : null,
    settingsStageProps: selectedMembership
      ? {
          organization: selectedMembership.organization,
          membership: selectedMembership.membership,
          provider: providerProfileController.provider,
          isUpdatingPrivacy:
            organizationController.organizationSettingsSubmitting,
          error: organizationController.organizationError,
          notice: organizationController.organizationNotice,
          onOpenAdmin: () => {
            setAdminOrigin("settings");
            setActiveWorkspaceScreen("admin");
          },
          onToggleProtectSensitiveScreens: (nextValue: boolean) =>
            void organizationController.updateSelectedOrganizationPrivacy(nextValue)
        }
      : null,
    moreStageProps: selectedMembership ? {} : null,
    providerHomeStageProps: selectedMembership
      ? {
          organization: selectedMembership.organization,
          membership: selectedMembership.membership,
          summary: workspaceController.workspaceSummary,
          clients: workspaceController.workspaceClients,
          charts: workspaceController.workspaceCharts,
          dailyFolioClients: workspaceController.dailyFolioClients,
          isLoading: workspaceController.workspaceLoading,
          isSeeding: workspaceController.workspaceSeeding,
          error:
            organizationController.organizationError ??
            workspaceController.workspaceError,
          notice:
            organizationController.organizationNotice ??
            workspaceController.workspaceNotice,
          onOpenClients: () => setActiveWorkspaceScreen("clients"),
          onSeedDemoData: () => void workspaceController.seedWorkspaceDemoData(),
          onOpenClient: (client: ClientRecord) => {
            openClientJournal(client, "workspace");
          },
          onAddFolioClient: (client: ClientRecord) => {
            void workspaceController.addFolioClient(client);
          },
          onRemoveFolioClient: (client: ClientRecord) => {
            void workspaceController.removeFolioClient(client);
          }
        }
      : null
  };
}
