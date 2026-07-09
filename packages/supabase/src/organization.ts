import type { SupabaseClient } from "@supabase/supabase-js";

import { ensureDemoChartHistory } from "./demo-history";
import { ensureDemoChartMedia } from "./demo-media";
import { listClients } from "./clients";
import type {
  ChartEntryRecord,
  ClientRecord,
  MembershipRecord,
  MembershipWithOrganization,
  OrganizationRecord,
  RecentChartRecord,
  WorkspaceSnapshot,
  WorkspaceSummary
} from "./types";

/**
 * Converts a clinic name into a predictable slug while preserving the
 * gentle human-readable feel used throughout the Swift prototype.
 */
export function slugifyOrganizationName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/**
 * Builds a unique slug candidate without forcing the UI to invent one.
 */
function createSlugCandidates(name: string) {
  const base = slugifyOrganizationName(name) || "organization";

  return [base, `${base}-${Date.now().toString().slice(-6)}`];
}

/**
 * Loads the authenticated user's memberships and the matching organization
 * records so both web and mobile can render the same selector UI.
 */
export async function listMembershipOrganizations(
  client: SupabaseClient,
  userId: string
): Promise<MembershipWithOrganization[]> {
  const { data: memberships, error: membershipsError } = await client
    .from("organization_memberships")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (membershipsError) {
    throw membershipsError;
  }

  const typedMemberships = (memberships ?? []) as MembershipRecord[];

  if (typedMemberships.length === 0) {
    return [];
  }

  const { data: organizations, error: organizationsError } = await client
    .from("organizations")
    .select("*")
    .in(
      "id",
      typedMemberships.map((membership) => membership.organization_id)
    );

  if (organizationsError) {
    throw organizationsError;
  }

  const organizationMap = new Map(
    ((organizations ?? []) as OrganizationRecord[]).map((organization) => [
      organization.id,
      organization
    ])
  );

  return typedMemberships
    .map((membership) => {
      const organization = organizationMap.get(membership.organization_id);

      if (!organization) {
        return null;
      }

      return {
        membership,
        organization
      };
    })
    .filter((record): record is MembershipWithOrganization => record !== null);
}

/**
 * Creates a new organization row. The matching owner membership and provider
 * rows are created automatically by the Supabase migration trigger.
 */
export async function createOrganization(
  client: SupabaseClient,
  input: { name: string; description?: string | null }
): Promise<OrganizationRecord> {
  const candidates = createSlugCandidates(input.name);
  let lastError: Error | null = null;

  for (const candidate of candidates) {
    const { error: insertError } = await client
      .from("organizations")
      .insert({
        name: input.name.trim(),
        description: input.description?.trim() || null,
        slug: candidate
      });

    if (insertError) {
      lastError = insertError;
      continue;
    }

    const { data, error: selectError } = await client
      .from("organizations")
      .select("*")
      .eq("slug", candidate)
      .single();

    if (selectError) {
      lastError = selectError;
      continue;
    }

    if (data) {
      return data as OrganizationRecord;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("Failed to create organization right now.");
}

/**
 * Accepts an invite token or full invite URL and joins the authenticated user
 * to the organization referenced by that invite.
 */
export async function joinOrganizationWithInvite(
  client: SupabaseClient,
  inviteTokenOrLink: string
) {
  const normalizedToken = extractInviteToken(inviteTokenOrLink);

  const { data, error } = await client.rpc("accept_invite_link", {
    invite_token_input: normalizedToken
  });

  if (error) {
    throw error;
  }

  return data as {
    organization_id: string;
    organization_name: string;
    membership_id: string;
    role: string;
    provider_id: string;
  };
}

/**
 * Updates privacy-related organization settings that affect how the mobile app
 * protects sensitive clinical screens.
 */
export async function updateOrganizationPrivacy(
  client: SupabaseClient,
  input: {
    organizationId: string;
    protectSensitiveScreens: boolean;
  }
): Promise<OrganizationRecord> {
  const { data, error } = await client
    .from("organizations")
    .update({
      protect_sensitive_screens: input.protectSensitiveScreens
    })
    .eq("id", input.organizationId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as OrganizationRecord;
}

/**
 * Calls the database seed function that creates demo clients and chart entries
 * for investor-ready walkthroughs.
 */
export async function seedDemoOrganization(
  client: SupabaseClient,
  organizationId: string
) {
  const { data, error } = await client.rpc("seed_demo_organization", {
    target_organization_id: organizationId
  });

  if (error) {
    throw error;
  }

  const seedResult = data as {
    status: "seeded" | "skipped";
    clients_created?: number;
    charts_created?: number;
    reason?: string;
  };

  const historyResult = await ensureDemoChartHistory(client, organizationId);
  const mediaResult = await ensureDemoChartMedia(client, organizationId);

  return {
    ...seedResult,
    charts_seeded: historyResult.charts_seeded,
    photos_seeded: mediaResult.photos_seeded
  };
}

/**
 * Loads recent clients for the selected organization, mirroring the Swift
 * app's habit of surfacing the most relevant records first.
 */
export async function listOrganizationClients(
  client: SupabaseClient,
  organizationId: string
) {
  return (await listClients(client, organizationId)).slice(0, 12) as ClientRecord[];
}

export async function listAllOrganizationClients(
  client: SupabaseClient,
  organizationId: string
) {
  return (await listClients(client, organizationId)) as ClientRecord[];
}

/**
 * Loads recent chart entries for a selected organization so the first v2
 * workspace can tell the same recent-activity story as the Swift prototype.
 */
export async function listRecentCharts(
  client: SupabaseClient,
  organizationId: string
) {
  const { data, error } = await client
    .from("chart_entries")
    .select("*, client:clients(id, preferred_name, first_name, last_name)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    throw error;
  }

  return (data ?? []) as RecentChartRecord[];
}

/**
 * Produces lightweight counts for the workspace hero cards.
 */
export async function getWorkspaceSummary(
  client: SupabaseClient,
  organizations: MembershipWithOrganization[],
  organizationId: string
): Promise<WorkspaceSummary> {
  const [clientsResult, chartsResult] = await Promise.all([
    client
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .is("archived_at", null),
    client
      .from("chart_entries")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
  ]);

  if (clientsResult.error) {
    throw clientsResult.error;
  }

  if (chartsResult.error) {
    throw chartsResult.error;
  }

  return {
    organizations: organizations.length,
    clients: clientsResult.count ?? 0,
    charts: chartsResult.count ?? 0
  };
}

/**
 * Loads the first dashboard slice in one shared helper so web and mobile
 * stay behaviorally aligned while we rebuild the product surface.
 */
export async function loadWorkspaceSnapshot(
  client: SupabaseClient,
  organizations: MembershipWithOrganization[],
  organizationId: string,
  membershipId: string
): Promise<WorkspaceSnapshot> {
  const [summary, clients, charts, dailyFolioClients] = await Promise.all([
    getWorkspaceSummary(client, organizations, organizationId),
    listOrganizationClients(client, organizationId),
    listRecentCharts(client, organizationId),
    listDailyFolioClients(client, organizationId, membershipId)
  ]);

  return {
    summary,
    clients,
    charts,
    dailyFolioClients
  };
}

export async function listDailyFolioClients(
  client: SupabaseClient,
  organizationId: string,
  membershipId: string
) {
  const providerId = await getProviderIdForMembership(
    client,
    organizationId,
    membershipId
  );

  if (!providerId) {
    return [] as ClientRecord[];
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await client
    .from("daily_folio_entries")
    .select("client:clients(*)")
    .eq("organization_id", organizationId)
    .eq("provider_id", providerId)
    .eq("folio_date", today)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as Array<{ client: ClientRecord | ClientRecord[] | null }>)
    .map((row) =>
      Array.isArray(row.client) ? row.client[0] ?? null : row.client
    )
    .filter((row): row is ClientRecord => row !== null);
}

export async function addClientToDailyFolio(
  client: SupabaseClient,
  input: {
    organizationId: string;
    membershipId: string;
    clientId: string;
  }
) {
  const providerId = await getProviderIdForMembership(
    client,
    input.organizationId,
    input.membershipId
  );

  if (!providerId) {
    throw new Error("Provider profile not found for this organization.");
  }

  const { error } = await client.from("daily_folio_entries").upsert(
    {
      organization_id: input.organizationId,
      provider_id: providerId,
      client_id: input.clientId,
      folio_date: new Date().toISOString().slice(0, 10)
    },
    {
      onConflict: "provider_id,client_id,folio_date",
      ignoreDuplicates: true
    }
  );

  if (error) {
    throw error;
  }
}

export async function removeClientFromDailyFolio(
  client: SupabaseClient,
  input: {
    organizationId: string;
    membershipId: string;
    clientId: string;
  }
) {
  const providerId = await getProviderIdForMembership(
    client,
    input.organizationId,
    input.membershipId
  );

  if (!providerId) {
    throw new Error("Provider profile not found for this organization.");
  }

  const { error } = await client
    .from("daily_folio_entries")
    .delete()
    .eq("organization_id", input.organizationId)
    .eq("provider_id", providerId)
    .eq("client_id", input.clientId)
    .eq("folio_date", new Date().toISOString().slice(0, 10));

  if (error) {
    throw error;
  }
}

function extractInviteToken(value: string) {
  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);
    const token =
      url.searchParams.get("token") ??
      url.searchParams.get("invite") ??
      url.pathname.split("/").filter(Boolean).at(-1);

    return token?.trim() || trimmed;
  } catch {
    return trimmed;
  }
}

async function getProviderIdForMembership(
  client: SupabaseClient,
  organizationId: string,
  membershipId: string
) {
  const { data, error } = await client
    .from("providers")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("membership_id", membershipId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.id as string | undefined) ?? null;
}
