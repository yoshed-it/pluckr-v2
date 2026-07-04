import React, { useState } from "react";
import { View } from "react-native";
import type {
  ClientRecord,
  MembershipWithOrganization,
  RecentChartRecord,
  WorkspaceSummary
} from "@pluckr/domain";

import { PluckrFolioPanel } from "./FolioPanel";
import { PluckrFolioPickerDrawer } from "./FolioPickerDrawer";
import { PluckrProviderHomeHero } from "./ProviderHomeHero";
import { PluckrRecentActivityPanel } from "./RecentActivityPanel";
import { PluckrRecentClientsPanel } from "./RecentClientsPanel";
import { pluckrProviderHomeStageStyles as styles } from "./providerDashboardStyles";

type PluckrProviderHomeStageProps = {
  organization: MembershipWithOrganization["organization"];
  membership: MembershipWithOrganization["membership"];
  summary: WorkspaceSummary;
  clients: ClientRecord[];
  charts: RecentChartRecord[];
  dailyFolioClients: ClientRecord[];
  isLoading: boolean;
  isSeeding: boolean;
  error: string | null;
  notice: string | null;
  onOpenClients: () => void;
  onSeedDemoData: () => void;
  onOpenClient: (client: ClientRecord) => void;
  onOpenChart: (chart: RecentChartRecord) => void;
  onAddFolioClient: (client: ClientRecord) => void;
  onRemoveFolioClient: (client: ClientRecord) => void;
};

export function PluckrProviderHomeStage({
  organization,
  membership,
  summary,
  clients,
  charts,
  dailyFolioClients,
  isLoading,
  isSeeding,
  error,
  notice,
  onOpenClients,
  onSeedDemoData,
  onOpenClient,
  onOpenChart,
  onAddFolioClient,
  onRemoveFolioClient
}: PluckrProviderHomeStageProps) {
  const [showFolioPicker, setShowFolioPicker] = useState(false);
  const recentClients = clients.slice(0, 8);
  const recentCharts = charts.slice(0, 5);

  return (
    <View style={styles.container}>
      <PluckrProviderHomeHero
        organizationName={organization.name}
        displayName={membership.display_name}
      />

      <PluckrFolioPanel
        dailyFolioClients={dailyFolioClients}
        totalClients={clients.length}
        isLoading={isLoading}
        isSeeding={isSeeding}
        onOpenPicker={() => setShowFolioPicker(true)}
        onOpenClient={onOpenClient}
        onRemoveClient={onRemoveFolioClient}
        onSeedDemoData={onSeedDemoData}
      />

      <PluckrRecentClientsPanel
        clients={recentClients}
        count={summary.clients}
        isLoading={isLoading}
        onOpenClient={onOpenClient}
        onOpenClients={onOpenClients}
      />

      <PluckrRecentActivityPanel
        charts={recentCharts}
        count={summary.charts}
        isLoading={isLoading}
        onOpenChart={onOpenChart}
      />

      <PluckrFolioPickerDrawer
        visible={showFolioPicker}
        clients={clients}
        selectedClientIds={dailyFolioClients.map((client) => client.id)}
        onAddClient={(client) => {
          onAddFolioClient(client);
          setShowFolioPicker(false);
        }}
        onClose={() => setShowFolioPicker(false)}
      />
    </View>
  );
}
