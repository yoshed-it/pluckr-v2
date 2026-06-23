import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createOrganization,
  joinOrganizationWithInvite,
  listMembershipOrganizations,
  updateOrganizationPrivacy,
  type MembershipWithOrganization
} from "@pluckr/supabase";

/**
 * Owns practice bootstrap and membership loading for both web and mobile.
 *
 * Pluckr currently resolves the first attached workspace automatically instead
 * of exposing workspace switching as part of the daily provider flow.
 */
export function useOrganizationController(
  client: SupabaseClient,
  userId: string | undefined
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
      return;
    }

    void loadMemberships(userId);
  }, [userId]);

  async function loadMemberships(nextUserId: string) {
    setMembershipsLoading(true);
    setOrganizationError(null);

    try {
      setMemberships(await listMembershipOrganizations(client, nextUserId));
    } catch (error) {
      setOrganizationError(
        error instanceof Error
          ? error.message
          : "Unable to load workspaces right now."
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
    } catch (error) {
      setOrganizationError(
        error instanceof Error
          ? error.message
          : "Unable to create a workspace right now."
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
    } catch (error) {
      setOrganizationError(
        error instanceof Error
          ? error.message
          : "Unable to join that workspace right now."
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
  }

  async function updateSelectedOrganizationPrivacy(
    protectSensitiveScreens: boolean
  ) {
    const selectedOrganizationId = memberships[0]?.organization.id ?? null;

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
    setOrganizationName,
    setOrganizationDescription,
    setInviteToken,
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
