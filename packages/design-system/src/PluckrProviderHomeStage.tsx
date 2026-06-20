import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type {
  ClientRecord,
  MembershipWithOrganization,
  RecentChartRecord,
  WorkspaceSummary
} from "@pluckr/supabase";

import { PluckrButton } from "./PluckrButton";
import { PluckrCard } from "./PluckrCard";
import { PluckrFolioPanel } from "./PluckrFolioPanel";
import { PluckrFolioPickerDrawer } from "./PluckrFolioPickerDrawer";
import { PluckrSectionHeader } from "./PluckrSectionHeader";
import { pluckrProviderHomeStageStyles as styles } from "./PluckrProviderHomeStage.styles";

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
  hideToolbar?: boolean;
  onOpenClients: () => void;
  onSeedDemoData: () => void;
  onOpenClient: (client: ClientRecord) => void;
  onAddFolioClient: (client: ClientRecord) => void;
  onRemoveFolioClient: (client: ClientRecord) => void;
  onLogout: () => void;
};

function formatDateLabel(value: string | null) {
  if (!value) {
    return "No chart activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

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
  hideToolbar = false,
  onOpenClients,
  onSeedDemoData,
  onOpenClient,
  onAddFolioClient,
  onRemoveFolioClient,
  onLogout
}: PluckrProviderHomeStageProps) {
  const [showFolioPicker, setShowFolioPicker] = useState(false);
  const recentClients = clients.slice(0, 8);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome{membership.display_name ? `, ${membership.display_name}` : ""}
        </Text>
        <Text style={styles.organizationName}>{organization.name}</Text>
        <Text style={styles.subtitle}>Today&apos;s work starts in folio.</Text>
      </View>

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? <Text style={[styles.message, styles.success]}>{notice}</Text> : null}

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

      <PluckrCard>
        <PluckrSectionHeader title="Recent Clients" count={summary.clients} />
        {isLoading ? (
          <Text style={styles.emptyState}>Loading recent clients...</Text>
        ) : recentClients.length === 0 ? (
          <Text style={styles.emptyState}>
            Recent charted clients will appear here after the first session is
            recorded.
          </Text>
        ) : (
          <View style={styles.cardStack}>
            {recentClients.map((client) => (
              <Pressable
                key={client.id}
                accessibilityRole="button"
                style={styles.clientCard}
                onPress={() => onOpenClient(client)}
              >
                <Text style={styles.clientName}>
                  {client.first_name} {client.last_name}
                </Text>
                <Text style={styles.clientMeta}>
                  {client.notes || "No care summary yet."}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        <View style={styles.actionStack}>
          <PluckrButton
            label="See All Clients"
            variant="secondary"
            onPress={() => onOpenClients()}
          />
        </View>
      </PluckrCard>

      <PluckrCard>
        <PluckrSectionHeader title="Recent Chart Activity" count={summary.charts} />
        {isLoading ? (
          <Text style={styles.emptyState}>Loading chart activity...</Text>
        ) : charts.length === 0 ? (
          <Text style={styles.emptyState}>
            Chart activity will appear here once providers begin documenting
            sessions.
          </Text>
        ) : (
          <View style={styles.cardStack}>
            {charts.slice(0, 5).map((chart) => (
              <View key={chart.id} style={styles.activityCard}>
                <Text style={styles.clientName}>
                  {chart.client
                    ? `${chart.client.first_name} ${chart.client.last_name}`
                    : "Client"}
                </Text>
                <Text style={styles.clientMeta}>
                  {chart.treatment_summary || chart.notes || "No summary yet."}
                </Text>
                <Text style={styles.activityMeta}>
                  {chart.treatment_area || chart.modality || "Treatment"} on{" "}
                  {formatDateLabel(chart.created_at)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </PluckrCard>

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
