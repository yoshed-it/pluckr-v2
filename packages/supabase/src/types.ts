/**
 * Shared Pluckr domain types.
 *
 * These types intentionally mirror the first v2 workflow:
 * authentication, organization selection, provider membership,
 * client lists, and recent chart activity.
 */

export type OrganizationRole = "owner" | "admin" | "provider" | "viewer";

/**
 * Represents a clinic or business account within Pluckr.
 */
export type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  stage: string;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Represents the authenticated user's relationship to one organization.
 */
export type MembershipRecord = {
  id: string;
  organization_id: string;
  user_id: string | null;
  email: string | null;
  display_name: string | null;
  role: OrganizationRole;
  created_at: string;
  updated_at: string;
};

/**
 * Represents an organization-scoped provider profile.
 */
export type ProviderRecord = {
  id: string;
  organization_id: string;
  membership_id: string | null;
  full_name: string;
  title: string | null;
  handle: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Represents a Pluckr client row displayed in lists and summary cards.
 */
export type ClientRecord = {
  id: string;
  organization_id: string;
  created_by_membership_id: string | null;
  first_name: string;
  last_name: string;
  pronouns: string | null;
  phone: string | null;
  email: string | null;
  birth_date: string | null;
  notes: string | null;
  consent_signed_at: string | null;
  consent_signature_path: string | null;
  last_seen_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Input payload for creating a client record in the v2 app.
 */
export type ClientInput = {
  organizationId: string;
  firstName: string;
  lastName: string;
  pronouns?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
};

/**
 * Represents a chart entry row displayed in recent activity summaries.
 */
export type ChartEntryRecord = {
  id: string;
  organization_id: string;
  client_id: string;
  provider_id: string | null;
  treatment_area: string | null;
  modality: string | null;
  notes: string | null;
  treatment_summary: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

/**
 * Input payload for creating or updating a chart entry.
 *
 * The fields mirror the first chart-entry rebuild slice rather than every
 * legacy Swift field so we can translate the workflow in stable steps.
 */
export type ChartEntryInput = {
  organizationId: string;
  clientId: string;
  treatmentArea?: string | null;
  modality?: string | null;
  treatmentSummary?: string | null;
  notes?: string | null;
  tags?: string[];
};

/**
 * Represents a recent chart entry with the client name joined in for
 * workspace lists on both web and mobile.
 */
export type RecentChartRecord = ChartEntryRecord & {
  client: Pick<ClientRecord, "id" | "first_name" | "last_name"> | null;
};

/**
 * Combined view model used by the UI to render an organization selector.
 */
export type MembershipWithOrganization = {
  membership: MembershipRecord;
  organization: OrganizationRecord;
};

/**
 * Summary counts used by the first workspace dashboard.
 */
export type WorkspaceSummary = {
  organizations: number;
  clients: number;
  charts: number;
};

/**
 * Bundles the lightweight data needed for the first workspace dashboard.
 */
export type WorkspaceSnapshot = {
  summary: WorkspaceSummary;
  clients: ClientRecord[];
  charts: RecentChartRecord[];
};
