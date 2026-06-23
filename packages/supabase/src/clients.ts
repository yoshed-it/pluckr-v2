import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClientInput, ClientRecord, ClientUpdateInput } from "./types";

/**
 * Loads the current organization's clients in the same ordering used by the
 * Swift app: most recently seen clients first, newest records next.
 */
export async function listClients(
  client: SupabaseClient,
  organizationId: string
) {
  const { data, error } = await client
    .from("clients")
    .select("*")
    .eq("organization_id", organizationId)
    .is("archived_at", null)
    .order("last_seen_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ClientRecord[];
}

/**
 * Creates a new client record while attaching the current user's membership
 * when possible so later audit and ownership features have the right anchor.
 */
export async function createClient(
  client: SupabaseClient,
  input: ClientInput
) {
  const {
    data: membership,
    error: membershipError
  } = await client
    .from("organization_memberships")
    .select("id")
    .eq("organization_id", input.organizationId)
    .eq("user_id", (await client.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  const { data, error } = await client
    .from("clients")
    .insert({
      organization_id: input.organizationId,
      created_by_membership_id: membership?.id ?? null,
      preferred_name: input.preferredName?.trim() || null,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      pronouns: input.pronouns?.trim() || null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      notes: input.notes?.trim() || null,
      client_tags: input.clientTags ?? [],
      consent_signed_at: input.consentSignedAt ?? null,
      last_seen_at: new Date().toISOString()
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ClientRecord;
}

/**
 * Updates a client's core profile details so the journal can match the
 * original Swift flow without embedding persistence directly in UI code.
 */
export async function updateClient(
  client: SupabaseClient,
  input: ClientUpdateInput
) {
  const { data, error } = await client
    .from("clients")
    .update({
      preferred_name: input.preferredName?.trim() || null,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      pronouns: input.pronouns?.trim() || null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      notes: input.notes?.trim() || null,
      client_tags: input.clientTags ?? [],
      updated_at: new Date().toISOString()
    })
    .eq("organization_id", input.organizationId)
    .eq("id", input.clientId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ClientRecord;
}

/**
 * Soft-archives a client so the record is preserved while the client list
 * matches the old app's active-only default behavior.
 */
export async function archiveClient(
  client: SupabaseClient,
  input: {
    organizationId: string;
    clientId: string;
  }
) {
  const { data, error } = await client
    .from("clients")
    .update({
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("organization_id", input.organizationId)
    .eq("id", input.clientId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ClientRecord;
}

/**
 * Updates one client's consent state so the rebuilt journal can match the old
 * consent-gated image flow without embedding persistence inside UI code.
 */
export async function updateClientConsent(
  client: SupabaseClient,
  input: {
    organizationId: string;
    clientId: string;
    consentSignedAt: string | null;
    consentSignaturePath?: string | null;
  }
) {
  const { data, error } = await client
    .from("clients")
    .update({
      consent_signed_at: input.consentSignedAt,
      consent_signature_path: input.consentSignaturePath ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("organization_id", input.organizationId)
    .eq("id", input.clientId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ClientRecord;
}
