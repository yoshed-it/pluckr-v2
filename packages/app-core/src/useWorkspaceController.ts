import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getClientDisplayName } from "@pluckr/domain";
import {
  addClientToDailyFolio,
  loadWorkspaceSnapshot,
  removeClientFromDailyFolio,
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
  selectedOrganizationId: string | null,
  selectedMembershipId: string | null
) {
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceSeeding, setWorkspaceSeeding] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [workspaceNotice, setWorkspaceNotice] = useState<string | null>(null);
  const [workspaceSummary, setWorkspaceSummary] =
    useState<WorkspaceSummary>(emptySummary);
  const [workspaceClients, setWorkspaceClients] = useState<ClientRecord[]>([]);
  const [workspaceCharts, setWorkspaceCharts] = useState<RecentChartRecord[]>([]);
  const [dailyFolioClients, setDailyFolioClients] = useState<ClientRecord[]>([]);

  useEffect(() => {
    if (!workspaceNotice) {
      return;
    }

    const timer = setTimeout(() => {
      setWorkspaceNotice(null);
    }, 4200);

    return () => clearTimeout(timer);
  }, [workspaceNotice]);

  useEffect(() => {
    if (!selectedOrganizationId || memberships.length === 0) {
      setWorkspaceSummary(emptySummary);
      setWorkspaceClients([]);
      setWorkspaceCharts([]);
      setDailyFolioClients([]);
      return;
    }

    if (
      !memberships.some(
        (record) => record.organization.id === selectedOrganizationId
      )
    ) {
      return;
    }

    if (!selectedMembershipId) {
      return;
    }

    void loadWorkspace(selectedOrganizationId, selectedMembershipId);
  }, [client, memberships, selectedMembershipId, selectedOrganizationId]);

  async function loadWorkspace(organizationId: string, membershipId: string) {
    setWorkspaceLoading(true);
    setWorkspaceError(null);

    try {
      const snapshot = await loadWorkspaceSnapshot(
        client,
        memberships,
        organizationId,
        membershipId
      );
      setWorkspaceSummary(snapshot.summary);
      setWorkspaceClients(snapshot.clients);
      setWorkspaceCharts(snapshot.charts);
      setDailyFolioClients(snapshot.dailyFolioClients);
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

      if (selectedMembershipId) {
        await loadWorkspace(selectedOrganizationId, selectedMembershipId);
      }
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

  async function addFolioClient(nextClient: ClientRecord) {
    if (!selectedOrganizationId || !selectedMembershipId) {
      return false;
    }

    setWorkspaceError(null);
    setWorkspaceNotice(null);

    try {
      await addClientToDailyFolio(client, {
        organizationId: selectedOrganizationId,
        membershipId: selectedMembershipId,
        clientId: nextClient.id
      });
      setDailyFolioClients((current) =>
        current.some((clientRecord) => clientRecord.id === nextClient.id)
          ? current
          : [...current, nextClient]
      );
      setWorkspaceNotice(`${getClientDisplayName(nextClient)} added to today's folio.`);
      return true;
    } catch (error) {
      setWorkspaceError(
        error instanceof Error
          ? error.message
          : "Unable to add the client to today's folio."
      );
      return false;
    }
  }

  async function removeFolioClient(nextClient: ClientRecord) {
    if (!selectedOrganizationId || !selectedMembershipId) {
      return false;
    }

    setWorkspaceError(null);
    setWorkspaceNotice(null);

    try {
      await removeClientFromDailyFolio(client, {
        organizationId: selectedOrganizationId,
        membershipId: selectedMembershipId,
        clientId: nextClient.id
      });
      setDailyFolioClients((current) =>
        current.filter((clientRecord) => clientRecord.id !== nextClient.id)
      );
      setWorkspaceNotice(`${getClientDisplayName(nextClient)} removed from today's folio.`);
      return true;
    } catch (error) {
      setWorkspaceError(
        error instanceof Error
          ? error.message
          : "Unable to remove the client from today's folio."
      );
      return false;
    }
  }

  return {
    workspaceLoading,
    workspaceSeeding,
    workspaceError,
    workspaceNotice,
    workspaceSummary,
    workspaceClients,
    workspaceCharts,
    dailyFolioClients,
    refreshWorkspace: () =>
      selectedOrganizationId && selectedMembershipId
        ? loadWorkspace(selectedOrganizationId, selectedMembershipId)
        : Promise.resolve(),
    seedWorkspaceDemoData,
    addFolioClient,
    removeFolioClient,
    resetWorkspaceView
  };
}
