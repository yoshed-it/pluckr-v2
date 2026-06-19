import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  loadWorkspaceSnapshot,
  seedDemoOrganization,
  type ClientRecord,
  type MembershipWithOrganization,
  type RecentChartRecord,
  type WorkspaceSummary
} from "@pluckr/supabase";

const emptySummary: WorkspaceSummary = {
  organizations: 0,
  clients: 0,
  charts: 0
};

/**
 * Owns read-only workspace loading and demo-data seeding behavior.
 */
export function useWorkspaceController(
  client: SupabaseClient,
  memberships: MembershipWithOrganization[],
  selectedOrganizationId: string | null
) {
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceSeeding, setWorkspaceSeeding] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [workspaceNotice, setWorkspaceNotice] = useState<string | null>(null);
  const [workspaceSummary, setWorkspaceSummary] =
    useState<WorkspaceSummary>(emptySummary);
  const [workspaceClients, setWorkspaceClients] = useState<ClientRecord[]>([]);
  const [workspaceCharts, setWorkspaceCharts] = useState<RecentChartRecord[]>([]);

  useEffect(() => {
    if (!selectedOrganizationId || memberships.length === 0) {
      setWorkspaceSummary(emptySummary);
      setWorkspaceClients([]);
      setWorkspaceCharts([]);
      return;
    }

    if (
      !memberships.some(
        (record) => record.organization.id === selectedOrganizationId
      )
    ) {
      return;
    }

    void loadWorkspace(selectedOrganizationId);
  }, [client, memberships, selectedOrganizationId]);

  async function loadWorkspace(organizationId: string) {
    setWorkspaceLoading(true);
    setWorkspaceError(null);

    try {
      const snapshot = await loadWorkspaceSnapshot(
        client,
        memberships,
        organizationId
      );
      setWorkspaceSummary(snapshot.summary);
      setWorkspaceClients(snapshot.clients);
      setWorkspaceCharts(snapshot.charts);
    } catch (error) {
      setWorkspaceError(
        error instanceof Error
          ? error.message
          : "Unable to load workspace data right now."
      );
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function seedWorkspaceDemoData() {
    if (!selectedOrganizationId) {
      return;
    }

    setWorkspaceSeeding(true);
    setWorkspaceError(null);
    setWorkspaceNotice(null);

    try {
      const result = await seedDemoOrganization(client, selectedOrganizationId);

      setWorkspaceNotice(
        result.status === "seeded"
          ? "Demo clients and charts are ready."
          : result.reason ?? "Demo data was already present."
      );

      await loadWorkspace(selectedOrganizationId);
    } catch (error) {
      setWorkspaceError(
        error instanceof Error
          ? error.message
          : "Unable to seed demo data right now."
      );
    } finally {
      setWorkspaceSeeding(false);
    }
  }

  function resetWorkspaceView() {
    setWorkspaceNotice(null);
  }

  return {
    workspaceLoading,
    workspaceSeeding,
    workspaceError,
    workspaceNotice,
    workspaceSummary,
    workspaceClients,
    workspaceCharts,
    seedWorkspaceDemoData,
    resetWorkspaceView
  };
}
