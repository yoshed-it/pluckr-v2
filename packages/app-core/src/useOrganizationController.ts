import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createOrganization,
  joinOrganizationWithInvite,
  listMembershipOrganizations,
  updateOrganizationPrivacy,
  type MembershipWithOrganization
} from "@pluckr/supabase";

import type { OrganizationSelectionStorage } from "./types";

/**
 * Owns organization selection, organization creation, and persisted
 * selection behavior for both web and mobile.
 */
export function useOrganizationController(
  client: SupabaseClient,
  userId: string | undefined,
  selectionStorage: OrganizationSelectionStorage
) {
  const [memberships, setMemberships] = useState<MembershipWithOrganization[]>([]);
  const [membershipsLoading, setMembershipsLoading] = useState(false);
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [organizationNotice, setOrganizationNotice] = useState<string | null>(null);
  const [isCreatingOrganization, setIsCreatingOrganization] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [organizationSubmitting, setOrganizationSubmitting] = useState(false);
  const [organizationSettingsSubmitting, setOrganizationSettingsSubmitting] =
    useState(false);
  const [isJoiningOrganization, setIsJoiningOrganization] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!userId) {
      setMemberships([]);
      setMembershipsLoading(false);
      setOrganizationError(null);
      setOrganizationNotice(null);
      setIsCreatingOrganization(false);
      setOrganizationName("");
      setOrganizationDescription("");
      setInviteToken("");
      setOrganizationSubmitting(false);
      setOrganizationSettingsSubmitting(false);
      setIsJoiningOrganization(false);
      setSelectedOrganizationId(null);
      return;
    }

    void loadMemberships(userId);
  }, [selectionStorage, userId]);

  useEffect(() => {
    if (!selectedOrganizationId) {
      void selectionStorage.clearSelectedOrganizationId();
      return;
    }

    if (
      memberships.some(
        (record) => record.organization.id === selectedOrganizationId
      )
    ) {
      void selectionStorage.setSelectedOrganizationId(selectedOrganizationId);
      return;
    }

    setSelectedOrganizationId(null);
  }, [memberships, selectedOrganizationId, selectionStorage]);

  async function loadMemberships(nextUserId: string) {
    setMembershipsLoading(true);
    setOrganizationError(null);

    try {
      const nextMemberships = await listMembershipOrganizations(client, nextUserId);
      const rememberedOrganizationId =
        await selectionStorage.getSelectedOrganizationId();

      setMemberships(nextMemberships);
      setSelectedOrganizationId(
        rememberedOrganizationId &&
          nextMemberships.some(
            (record) => record.organization.id === rememberedOrganizationId
          )
          ? rememberedOrganizationId
          : null
      );
    } catch (error) {
      setOrganizationError(
        error instanceof Error
          ? error.message
          : "Unable to load organizations right now."
      );
    } finally {
      setMembershipsLoading(false);
    }
  }

  async function submitOrganization() {
    setOrganizationSubmitting(true);
    setOrganizationError(null);
    setOrganizationNotice(null);

    try {
      const organization = await createOrganization(client, {
        name: organizationName,
        description: organizationDescription
      });

      if (userId) {
        await loadMemberships(userId);
      }

      setOrganizationName("");
      setOrganizationDescription("");
      setIsCreatingOrganization(false);
      setIsJoiningOrganization(false);
      setOrganizationNotice(`${organization.name} is ready.`);
      setSelectedOrganizationId(organization.id);
    } catch (error) {
      setOrganizationError(
        error instanceof Error
          ? error.message
          : "Unable to create organization right now."
      );
    } finally {
      setOrganizationSubmitting(false);
    }
  }

  function startCreatingOrganization() {
    setOrganizationNotice(null);
    setOrganizationError(null);
    setIsJoiningOrganization(false);
    setIsCreatingOrganization(true);
  }

  function cancelCreatingOrganization() {
    setIsCreatingOrganization(false);
    setOrganizationError(null);
  }

  function startJoiningOrganization() {
    setOrganizationNotice(null);
    setOrganizationError(null);
    setIsCreatingOrganization(false);
    setIsJoiningOrganization(true);
  }

  function cancelJoiningOrganization() {
    setIsJoiningOrganization(false);
    setOrganizationError(null);
    setInviteToken("");
  }

  async function submitJoinOrganization() {
    setOrganizationSubmitting(true);
    setOrganizationError(null);
    setOrganizationNotice(null);

    try {
      const joined = await joinOrganizationWithInvite(client, inviteToken);

      if (userId) {
        await loadMemberships(userId);
      }

      setInviteToken("");
      setIsJoiningOrganization(false);
      setOrganizationNotice(`${joined.organization_name} joined successfully.`);
      setSelectedOrganizationId(joined.organization_id);
    } catch (error) {
      setOrganizationError(
        error instanceof Error
          ? error.message
          : "Unable to join that organization right now."
      );
    } finally {
      setOrganizationSubmitting(false);
    }
  }

  function resetAfterLogout() {
    setOrganizationNotice(null);
    setIsCreatingOrganization(false);
    setOrganizationName("");
    setOrganizationDescription("");
    setInviteToken("");
    setOrganizationSettingsSubmitting(false);
    setIsJoiningOrganization(false);
    setSelectedOrganizationId(null);
  }

  async function updateSelectedOrganizationPrivacy(
    protectSensitiveScreens: boolean
  ) {
    if (!selectedOrganizationId) {
      return null;
    }

    setOrganizationSettingsSubmitting(true);
    setOrganizationError(null);
    setOrganizationNotice(null);

    try {
      const updatedOrganization = await updateOrganizationPrivacy(client, {
        organizationId: selectedOrganizationId,
        protectSensitiveScreens
      });

      setMemberships((current) =>
        current.map((record) =>
          record.organization.id === updatedOrganization.id
            ? {
                ...record,
                organization: updatedOrganization
              }
            : record
        )
      );
      setOrganizationNotice(
        protectSensitiveScreens
          ? "Sensitive screen protection is on."
          : "Sensitive screen protection is off."
      );
      return updatedOrganization;
    } catch (error) {
      setOrganizationError(
        error instanceof Error
          ? error.message
          : "Unable to update privacy settings right now."
      );
      return null;
    } finally {
      setOrganizationSettingsSubmitting(false);
    }
  }

  return {
    memberships,
    membershipsLoading,
    organizationError,
    organizationNotice,
    isCreatingOrganization,
    isJoiningOrganization,
    organizationName,
    organizationDescription,
    inviteToken,
    organizationSubmitting,
    organizationSettingsSubmitting,
    selectedOrganizationId,
    setOrganizationName,
    setOrganizationDescription,
    setInviteToken,
    setSelectedOrganizationId,
    startCreatingOrganization,
    cancelCreatingOrganization,
    startJoiningOrganization,
    cancelJoiningOrganization,
    submitOrganization,
    submitJoinOrganization,
    updateSelectedOrganizationPrivacy,
    resetAfterLogout
  };
}
