import type { SupabaseClient } from "@supabase/supabase-js";

import type { ProviderProfileInput, ProviderRecord } from "./types";

/**
 * Loads the provider row tied to the current membership inside one
 * organization so routing can decide whether setup is complete.
 */
export async function getProviderProfile(
  client: SupabaseClient,
  organizationId: string,
  membershipId: string
) {
  const { data, error } = await client
    .from("providers")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("membership_id", membershipId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as ProviderRecord | null;
}

/**
 * Updates the current provider's own setup fields.
 */
export async function updateProviderProfile(
  client: SupabaseClient,
  input: ProviderProfileInput
) {
  const { data, error } = await client
    .from("providers")
    .update({
      full_name: input.fullName.trim(),
      phone: input.phone.trim()
    })
    .eq("organization_id", input.organizationId)
    .eq("membership_id", input.membershipId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ProviderRecord;
}
