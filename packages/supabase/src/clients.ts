import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClientInput, ClientRecord } from "./types";

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
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      pronouns: input.pronouns?.trim() || null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      notes: input.notes?.trim() || null,
      last_seen_at: new Date().toISOString()
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ClientRecord;
}
