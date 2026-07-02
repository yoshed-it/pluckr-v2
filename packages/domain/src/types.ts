export type OrganizationRole = "owner" | "admin" | "provider" | "viewer";

export type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  stage: string;
  protect_sensitive_screens: boolean;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

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

export type ProviderRecord = {
  id: string;
  organization_id: string;
  membership_id: string | null;
  full_name: string;
  phone: string | null;
  title: string | null;
  handle: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ClientRecord = {
  id: string;
  organization_id: string;
  created_by_membership_id: string | null;
  preferred_name: string | null;
  first_name: string;
  last_name: string;
  pronouns: string | null;
  phone: string | null;
  email: string | null;
  birth_date: string | null;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_region: string | null;
  address_postal_code: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  client_tags: string[];
  consent_signed_at: string | null;
  consent_signature_path: string | null;
  last_seen_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ChartEntryRecord = {
  id: string;
  organization_id: string;
  client_id: string;
  provider_id: string | null;
  treatment_area: string | null;
  modality: string | null;
  rf_level: number | null;
  dc_level: number | null;
  treatment_seconds: number | null;
  appointment_duration_minutes: number | null;
  probe: string | null;
  probe_is_one_piece: boolean;
  notes: string | null;
  treatment_summary: string | null;
  tags: string[];
  image_urls: string[];
  image_paths?: string[];
  treatment_areas?: ChartTreatmentAreaRecord[];
  created_at: string;
  updated_at: string;
};

export type ChartTreatmentAreaRecord = {
  id: string;
  chart_entry_id: string;
  organization_id: string;
  client_id: string;
  sort_order: number;
  treatment_area: string;
  modality: string | null;
  rf_level: number | null;
  dc_level: number | null;
  treatment_seconds: number | null;
  probe: string | null;
  probe_is_one_piece: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RecentChartRecord = ChartEntryRecord & {
  client: Pick<
    ClientRecord,
    "id" | "preferred_name" | "first_name" | "last_name"
  > | null;
};

export type MembershipWithOrganization = {
  membership: MembershipRecord;
  organization: OrganizationRecord;
};

export type AdminProviderRecord = {
  provider: ProviderRecord;
  membership: MembershipRecord | null;
};

export type InviteLinkRecord = {
  id: string;
  organization_id: string;
  email: string;
  role: OrganizationRole;
  token: string;
  expires_at: string | null;
  accepted_at: string | null;
  created_at: string;
};

export type WorkspaceSummary = {
  organizations: number;
  clients: number;
  charts: number;
};

export type WorkspaceSnapshot = {
  summary: WorkspaceSummary;
  clients: ClientRecord[];
  charts: RecentChartRecord[];
  dailyFolioClients: ClientRecord[];
};
