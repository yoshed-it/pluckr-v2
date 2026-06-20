import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getProviderProfile,
  updateProviderProfile,
  type MembershipWithOrganization,
  type ProviderRecord
} from "@pluckr/supabase";

const emptyProviderProfileForm = {
  fullName: "",
  phone: ""
};

/**
 * Owns provider setup gating for the selected organization.
 *
 * The org bootstrap trigger creates a provider row automatically, but the app
 * still needs the clinician to complete their profile before entering the
 * dashboard, matching the old Swift flow.
 */
export function useProviderProfileController(
  client: SupabaseClient,
  selectedMembership: MembershipWithOrganization | undefined
) {
  const [provider, setProvider] = useState<ProviderRecord | null>(null);
  const [isLoadingProvider, setIsLoadingProvider] = useState(false);
  const [isSavingProvider, setIsSavingProvider] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [providerNotice, setProviderNotice] = useState<string | null>(null);
  const [providerProfileForm, setProviderProfileForm] = useState(
    emptyProviderProfileForm
  );

  useEffect(() => {
    if (!selectedMembership?.membership.id) {
      setProvider(null);
      setProviderError(null);
      setProviderNotice(null);
      setProviderProfileForm(emptyProviderProfileForm);
      return;
    }

    void loadProvider();
  }, [
    client,
    selectedMembership?.membership.id,
    selectedMembership?.organization.id,
    selectedMembership?.membership.display_name
  ]);

  async function loadProvider() {
    if (!selectedMembership?.membership.id) {
      return;
    }

    setIsLoadingProvider(true);
    setProviderError(null);

    try {
      const record = await getProviderProfile(
        client,
        selectedMembership.organization.id,
        selectedMembership.membership.id
      );

      setProvider(record);
      setProviderProfileForm({
        fullName:
          record?.full_name ??
          selectedMembership.membership.display_name?.trim() ??
          "",
        phone: record?.phone ?? ""
      });
    } catch (error) {
      setProviderError(
        error instanceof Error
          ? error.message
          : "Unable to load the provider profile right now."
      );
    } finally {
      setIsLoadingProvider(false);
    }
  }

  function updateProviderProfileForm(
    key: keyof typeof emptyProviderProfileForm,
    value: string
  ) {
    setProviderProfileForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function submitProviderProfile() {
    if (!selectedMembership?.membership.id) {
      return null;
    }

    if (!providerProfileForm.fullName.trim()) {
      setProviderError("Full name is required.");
      return null;
    }

    if (!providerProfileForm.phone.trim()) {
      setProviderError("Phone number is required.");
      return null;
    }

    setIsSavingProvider(true);
    setProviderError(null);
    setProviderNotice(null);

    try {
      const updatedProvider = await updateProviderProfile(client, {
        organizationId: selectedMembership.organization.id,
        membershipId: selectedMembership.membership.id,
        fullName: providerProfileForm.fullName,
        phone: providerProfileForm.phone
      });

      setProvider(updatedProvider);
      setProviderProfileForm({
        fullName: updatedProvider.full_name,
        phone: updatedProvider.phone ?? ""
      });
      setProviderNotice("Provider profile saved.");
      return updatedProvider;
    } catch (error) {
      setProviderError(
        error instanceof Error
          ? error.message
          : "Unable to save the provider profile right now."
      );
      return null;
    } finally {
      setIsSavingProvider(false);
    }
  }

  const providerSetupRequired =
    !!selectedMembership &&
    (!provider?.full_name?.trim() || !provider?.phone?.trim());

  return {
    provider,
    isLoadingProvider,
    isSavingProvider,
    providerError,
    providerNotice,
    providerProfileForm,
    providerSetupRequired,
    updateProviderProfileForm,
    submitProviderProfile,
    refreshProviderProfile: loadProvider
  };
}
