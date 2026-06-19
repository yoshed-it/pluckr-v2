import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createOrganization,
  listMembershipOrganizations,
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
  const [organizationSubmitting, setOrganizationSubmitting] = useState(false);
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
      setOrganizationSubmitting(false);
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
    setIsCreatingOrganization(true);
  }

  function cancelCreatingOrganization() {
    setIsCreatingOrganization(false);
    setOrganizationError(null);
  }

  function showJoinMessage() {
    setOrganizationNotice(
      "Invite-based organization joining is next on deck. For now, create the first clinic here."
    );
  }

  function resetAfterLogout() {
    setOrganizationNotice(null);
    setIsCreatingOrganization(false);
    setOrganizationName("");
    setOrganizationDescription("");
    setSelectedOrganizationId(null);
  }

  return {
    memberships,
    membershipsLoading,
    organizationError,
    organizationNotice,
    isCreatingOrganization,
    organizationName,
    organizationDescription,
    organizationSubmitting,
    selectedOrganizationId,
    setOrganizationName,
    setOrganizationDescription,
    setSelectedOrganizationId,
    startCreatingOrganization,
    cancelCreatingOrganization,
    submitOrganization,
    showJoinMessage,
    resetAfterLogout
  };
}
