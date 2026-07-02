export type {
  AdminProviderRecord,
  ChartEntryRecord,
  ChartTreatmentAreaRecord,
  ClientRecord,
  InviteLinkRecord,
  MembershipRecord,
  MembershipWithOrganization,
  OrganizationRecord,
  OrganizationRole,
  ProviderRecord,
  RecentChartRecord,
  WorkspaceSnapshot,
  WorkspaceSummary
} from "@pluckr/domain";

export type ProviderProfileInput = {
  organizationId: string;
  membershipId: string;
  fullName: string;
  phone: string;
};

/**
 * Input payload for creating a client record in the v2 app.
 */
export type ClientInput = {
  organizationId: string;
  preferredName?: string | null;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  pronouns?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  clientTags?: string[];
  consentSignedAt?: string | null;
};

export type ClientUpdateInput = {
  organizationId: string;
  clientId: string;
  preferredName?: string | null;
  firstName: string;
  lastName: string;
  pronouns?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  clientTags?: string[];
};

/**
 * Represents a chart entry row displayed in recent activity summaries.
 */
/**
 * Input payload for creating or updating a chart entry.
 *
 * The fields mirror the first chart-entry rebuild slice rather than every
 * legacy Swift field so we can translate the workflow in stable steps.
 */
export type ChartEntryInput = {
  organizationId: string;
  clientId: string;
  treatmentAreas?: ChartTreatmentAreaInput[];
  treatmentArea?: string | null;
  modality?: string | null;
  rfLevel?: number | null;
  dcLevel?: number | null;
  treatmentSeconds?: number | null;
  appointmentDurationMinutes?: number | null;
  probe?: string | null;
  probeIsOnePiece?: boolean;
  treatmentSummary?: string | null;
  notes?: string | null;
  tags?: string[];
  imagePaths?: string[];
};

export type ChartTreatmentAreaInput = {
  treatmentArea: string;
  modality?: string | null;
  rfLevel?: number | null;
  dcLevel?: number | null;
  treatmentSeconds?: number | null;
  probe?: string | null;
  probeIsOnePiece?: boolean;
  notes?: string | null;
};
