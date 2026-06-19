import type { SupabaseClient } from "@supabase/supabase-js";

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

  for (const candidate of candidates) {
    const { data, error } = await client
      .from("organizations")
      .insert({
        name: input.name.trim(),
        description: input.description?.trim() || null,
        slug: candidate
      })
      .select("*")
      .single();

    if (!error && data) {
      return data as OrganizationRecord;
    }
  }

  throw new Error("Failed to create organization. Please try a different name.");
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

  return data as {
    status: "seeded" | "skipped";
    clients_created?: number;
    charts_created?: number;
    reason?: string;
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
    .select("*, client:clients(id, first_name, last_name)")
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
  organizationId: string
): Promise<WorkspaceSnapshot> {
  const [summary, clients, charts] = await Promise.all([
    getWorkspaceSummary(client, organizations, organizationId),
    listOrganizationClients(client, organizationId),
    listRecentCharts(client, organizationId)
  ]);

  return {
    summary,
    clients,
    charts
  };
}
