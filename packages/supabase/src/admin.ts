import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AdminProviderRecord,
  InviteLinkRecord,
  OrganizationRole
} from "./types";

export async function listAdminProviders(
  client: SupabaseClient,
  organizationId: string
) {
  const [providersResult, membershipsResult] = await Promise.all([
    client
      .from("providers")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true }),
    client
      .from("organization_memberships")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true })
  ]);

  if (providersResult.error) {
    throw providersResult.error;
  }

  if (membershipsResult.error) {
    throw membershipsResult.error;
  }

  const membershipMap = new Map(
    (membershipsResult.data ?? []).map((membership) => [membership.id, membership])
  );

  return (providersResult.data ?? []).map((provider) => ({
    provider,
    membership: provider.membership_id
      ? membershipMap.get(provider.membership_id) ?? null
      : null
  })) as AdminProviderRecord[];
}

export async function listInviteLinks(
  client: SupabaseClient,
  organizationId: string
) {
  const { data, error } = await client
    .from("invite_links")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as InviteLinkRecord[];
}

export async function createInviteLink(
  client: SupabaseClient,
  input: {
    organizationId: string;
    email: string;
    role: OrganizationRole;
  }
) {
  const { data, error } = await client.rpc("create_org_invite_link", {
    target_organization_id: input.organizationId,
    recipient_email_input: input.email.trim(),
    invite_role_input: input.role
  });

  if (error) {
    throw error;
  }

  return data as InviteLinkRecord;
}

export async function revokeInviteLink(client: SupabaseClient, inviteId: string) {
  const { error } = await client.rpc("revoke_org_invite_link", {
    invite_link_id_input: inviteId
  });

  if (error) {
    throw error;
  }
}

export async function updateAdminProviderRole(
  client: SupabaseClient,
  input: {
    membershipId: string;
    role: OrganizationRole;
  }
) {
  const { error } = await client.rpc("update_org_membership_role", {
    membership_id_input: input.membershipId,
    new_role_input: input.role
  });

  if (error) {
    throw error;
  }
}

export async function updateAdminProviderStatus(
  client: SupabaseClient,
  input: {
    providerId: string;
    isActive: boolean;
  }
) {
  const { error } = await client.rpc("update_org_provider_status", {
    provider_id_input: input.providerId,
    is_active_input: input.isActive
  });

  if (error) {
    throw error;
  }
}
