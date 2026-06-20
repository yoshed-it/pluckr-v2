import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createInviteLink,
  listAdminProviders,
  listInviteLinks,
  revokeInviteLink,
  updateAdminProviderRole,
  updateAdminProviderStatus,
  type AdminProviderRecord,
  type MembershipWithOrganization,
  type OrganizationRole,
  type InviteLinkRecord
} from "@pluckr/supabase";

const emptyInviteForm = {
  email: "",
  role: "provider" as OrganizationRole
};

export function useAdminController(
  client: SupabaseClient,
  selectedMembership: MembershipWithOrganization | undefined
) {
  const [providers, setProviders] = useState<AdminProviderRecord[]>([]);
  const [inviteLinks, setInviteLinks] = useState<InviteLinkRecord[]>([]);
  const [inviteForm, setInviteForm] = useState(emptyInviteForm);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const canManageAdmin =
    selectedMembership?.membership.role === "owner" ||
    selectedMembership?.membership.role === "admin";

  useEffect(() => {
    if (!selectedMembership?.organization.id || !canManageAdmin) {
      setProviders([]);
      setInviteLinks([]);
      setInviteForm(emptyInviteForm);
      return;
    }

    void loadAdminData();
  }, [canManageAdmin, client, selectedMembership?.organization.id]);

  async function loadAdminData() {
    if (!selectedMembership?.organization.id || !canManageAdmin) {
      return;
    }

    setIsLoadingAdmin(true);
    setAdminError(null);

    try {
      const [nextProviders, nextInviteLinks] = await Promise.all([
        listAdminProviders(client, selectedMembership.organization.id),
        listInviteLinks(client, selectedMembership.organization.id)
      ]);
      setProviders(nextProviders);
      setInviteLinks(nextInviteLinks);
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : "Unable to load admin data right now."
      );
    } finally {
      setIsLoadingAdmin(false);
    }
  }

  function updateInviteForm(
    key: keyof typeof emptyInviteForm,
    value: string | OrganizationRole
  ) {
    setInviteForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function submitInvite() {
    if (!selectedMembership?.organization.id) {
      return false;
    }

    setIsSavingAdmin(true);
    setAdminError(null);
    setAdminNotice(null);

    try {
      const invite = await createInviteLink(client, {
        organizationId: selectedMembership.organization.id,
        email: inviteForm.email,
        role: inviteForm.role
      });
      setInviteLinks((current) => [invite, ...current]);
      setInviteForm(emptyInviteForm);
      setAdminNotice(`Invite created for ${invite.email}.`);
      return true;
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : "Unable to create invite right now."
      );
      return false;
    } finally {
      setIsSavingAdmin(false);
    }
  }

  async function changeProviderRole(
    record: AdminProviderRecord,
    role: OrganizationRole
  ) {
    if (!record.membership) {
      return false;
    }

    setIsSavingAdmin(true);
    setAdminError(null);
    setAdminNotice(null);

    try {
      await updateAdminProviderRole(client, {
        membershipId: record.membership.id,
        role
      });
      await loadAdminData();
      setAdminNotice(`${record.provider.full_name} updated to ${role}.`);
      return true;
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : "Unable to update provider role right now."
      );
      return false;
    } finally {
      setIsSavingAdmin(false);
    }
  }

  async function changeProviderStatus(
    record: AdminProviderRecord,
    isActive: boolean
  ) {
    setIsSavingAdmin(true);
    setAdminError(null);
    setAdminNotice(null);

    try {
      await updateAdminProviderStatus(client, {
        providerId: record.provider.id,
        isActive
      });
      await loadAdminData();
      setAdminNotice(
        `${record.provider.full_name} ${isActive ? "activated" : "deactivated"}.`
      );
      return true;
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : "Unable to update provider status right now."
      );
      return false;
    } finally {
      setIsSavingAdmin(false);
    }
  }

  async function removeInvite(inviteId: string) {
    setIsSavingAdmin(true);
    setAdminError(null);
    setAdminNotice(null);

    try {
      await revokeInviteLink(client, inviteId);
      setInviteLinks((current) => current.filter((invite) => invite.id !== inviteId));
      setAdminNotice("Invite revoked.");
      return true;
    } catch (error) {
      setAdminError(
        error instanceof Error
          ? error.message
          : "Unable to revoke that invite right now."
      );
      return false;
    } finally {
      setIsSavingAdmin(false);
    }
  }

  return {
    providers,
    inviteLinks,
    inviteForm,
    isLoadingAdmin,
    isSavingAdmin,
    adminError,
    adminNotice,
    canManageAdmin,
    updateInviteForm,
    submitInvite,
    changeProviderRole,
    changeProviderStatus,
    removeInvite,
    refreshAdminData: loadAdminData
  };
}
