import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType
} from "react-native";

import { PluckrAdminStage } from "../features/admin/AdminStage";
import { PluckrAuthStage } from "../features/provider-onboarding/AuthStage";
import { PluckrClientJournalStage } from "../features/provider-clients/ClientJournalStage";
import { PluckrClientListStage } from "../features/provider-clients/ClientListStage";
import { PluckrImageConsentStage } from "../features/provider-clients/ImageConsentStage";
import { PluckrJournalLoadingStage } from "../PluckrJournalLoadingStage";
import { PluckrLaunchStage } from "../PluckrLaunchStage";
import { PluckrNavigationBar } from "../PluckrNavigationBar";
import { PluckrOrganizationStage } from "../features/provider-onboarding/OrganizationGate";
import { PluckrProviderHomeStage } from "../features/provider-dashboard/ProviderDashboard";
import { PluckrProviderSetupStage } from "../features/provider-onboarding/ProviderSetupStage";
import { PluckrSettingsStage } from "../features/settings/SettingsStage";
import { PluckrUtilityBar } from "../PluckrUtilityBar";
import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

export type PluckrPrivacyState = {
  isSensitiveScreen: boolean;
  protectSensitiveScreens: boolean;
};

type PluckrAppShellModel = {
  showLaunchStage: boolean;
  isBooting: boolean;
  isHydratingOrganization: boolean;
  showProviderLoading: boolean;
  shouldShowAuth: boolean;
  shouldShowOrganizationGate: boolean;
  shouldShowProviderSetupGate: boolean;
  shouldShowUtilityBar: boolean;
  shouldShowShellNavigationBar: boolean;
  showAdminStage: boolean;
  showClientListStage: boolean;
  showConsentStage: boolean;
  showClientJournalStage: boolean;
  showSettingsStage: boolean;
  showProviderHomeStage: boolean;
  previousScreenLabel: string | null;
  navigationBackAction: (() => void) | null;
  navigationTitle: string;
  navigationSubtitle: string | null;
  utilityActions: React.ComponentProps<typeof PluckrUtilityBar>["actions"];
  protectSensitiveScreens: boolean;
  isSensitiveScreen: boolean;
  authStageProps: Omit<
    React.ComponentProps<typeof PluckrAuthStage>,
    "logoSource"
  >;
  organizationStageProps: Omit<
    React.ComponentProps<typeof PluckrOrganizationStage>,
    "logoSource"
  >;
  providerSetupStageProps: Omit<
    React.ComponentProps<typeof PluckrProviderSetupStage>,
    "logoSource"
  >;
  adminStageProps: React.ComponentProps<typeof PluckrAdminStage> | null;
  clientListStageProps: React.ComponentProps<typeof PluckrClientListStage>;
  consentStageProps: React.ComponentProps<typeof PluckrImageConsentStage> | null;
  clientJournalStageProps:
    | React.ComponentProps<typeof PluckrClientJournalStage>
    | null;
  settingsStageProps: React.ComponentProps<typeof PluckrSettingsStage> | null;
  providerHomeStageProps:
    | React.ComponentProps<typeof PluckrProviderHomeStage>
    | null;
};

type PluckrAppShellProps = {
  model: PluckrAppShellModel;
  logoSource: ImageSourcePropType;
  privacyCurtainVisible?: boolean;
};

/**
 * Shared cross-platform product shell presentation.
 *
 * Business logic and navigation state are supplied from app-core so the design
 * system stays presentation-focused.
 */
export function PluckrAppShell({
  model,
  logoSource,
  privacyCurtainVisible = false
}: PluckrAppShellProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {model.shouldShowUtilityBar ? (
          <PluckrUtilityBar
            backLabel={model.previousScreenLabel}
            onBack={model.navigationBackAction}
            actions={model.utilityActions}
          />
        ) : null}
        {model.shouldShowShellNavigationBar ? (
          <PluckrNavigationBar
            title={model.navigationTitle}
            subtitle={model.navigationSubtitle}
          />
        ) : null}
        {model.showLaunchStage ? (
          <PluckrLaunchStage logoSource={logoSource} />
        ) : model.isBooting ? (
          <PluckrJournalLoadingStage message="Restoring your session..." />
        ) : model.shouldShowAuth ? (
          <PluckrAuthStage {...model.authStageProps} logoSource={logoSource} />
        ) : model.isHydratingOrganization ? (
          <PluckrJournalLoadingStage message="Loading your organizations..." />
        ) : model.showProviderLoading ? (
          <PluckrJournalLoadingStage message="Loading your provider profile..." />
        ) : model.shouldShowOrganizationGate ? (
          <PluckrOrganizationStage
            {...model.organizationStageProps}
            logoSource={logoSource}
          />
        ) : model.shouldShowProviderSetupGate ? (
          <PluckrProviderSetupStage
            {...model.providerSetupStageProps}
            logoSource={logoSource}
          />
        ) : model.showAdminStage && model.adminStageProps ? (
          <PluckrAdminStage {...model.adminStageProps} />
        ) : model.showClientListStage ? (
          <PluckrClientListStage {...model.clientListStageProps} />
        ) : model.showConsentStage && model.consentStageProps ? (
          <PluckrImageConsentStage {...model.consentStageProps} />
        ) : model.showClientJournalStage && model.clientJournalStageProps ? (
          <PluckrClientJournalStage {...model.clientJournalStageProps} />
        ) : model.showSettingsStage && model.settingsStageProps ? (
          <PluckrSettingsStage {...model.settingsStageProps} />
        ) : model.showProviderHomeStage && model.providerHomeStageProps ? (
          <PluckrProviderHomeStage {...model.providerHomeStageProps} />
        ) : (
          <PluckrJournalLoadingStage message="Refreshing organization context..." />
        )}
      </ScrollView>
      {privacyCurtainVisible &&
      model.isSensitiveScreen &&
      model.protectSensitiveScreens ? (
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
    backgroundColor: pluckrAppTheme.colors.backgroundSoft
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
    backgroundColor: "rgba(244, 247, 248, 0.96)"
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
