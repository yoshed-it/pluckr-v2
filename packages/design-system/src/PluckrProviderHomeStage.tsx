import React from "react";
import { Pressable, Text, View } from "react-native";
import type {
  ClientRecord,
  MembershipWithOrganization,
  RecentChartRecord,
  WorkspaceSummary
} from "@pluckr/supabase";

import { PluckrButton } from "./PluckrButton";
import { PluckrCard } from "./PluckrCard";
import { pluckrProviderHomeStageStyles as styles } from "./PluckrProviderHomeStage.styles";

type PluckrProviderHomeStageProps = {
  organization: MembershipWithOrganization["organization"];
  membership: MembershipWithOrganization["membership"];
  summary: WorkspaceSummary;
  clients: ClientRecord[];
  charts: RecentChartRecord[];
  isLoading: boolean;
  isSeeding: boolean;
  error: string | null;
  notice: string | null;
  onOpenClients: () => void;
  onSeedDemoData: () => void;
  onOpenClient: (client: ClientRecord) => void;
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
  isLoading,
  isSeeding,
  error,
  notice,
  onOpenClients,
  onSeedDemoData,
  onOpenClient,
  onLogout
}: PluckrProviderHomeStageProps) {
  const recentClients = clients.slice(0, 8);
  const folioClients = clients.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.infoCopy}>Provider Home</Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome{membership.display_name ? `, ${membership.display_name}` : ""}
        </Text>
        <Text style={styles.organizationName}>{organization.name}</Text>
        <Text style={styles.subtitle}>Your clinical journal awaits</Text>
      </View>

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? <Text style={[styles.message, styles.success]}>{notice}</Text> : null}

      <PluckrCard accent>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Folio</Text>
          <Text style={styles.roleChip}>{membership.role}</Text>
        </View>
        {isLoading ? (
          <Text style={styles.emptyState}>Loading today's focus...</Text>
        ) : folioClients.length === 0 ? (
          <View style={styles.actionStack}>
            <Text style={styles.emptyState}>
              No folio clients yet. Seed demo data or open the client list to get
              started.
            </Text>
            <PluckrButton
              label={isSeeding ? "Seeding..." : "Seed Demo Data"}
              variant="secondary"
              disabled={isSeeding}
              onPress={() => onSeedDemoData()}
            />
          </View>
        ) : (
          <View style={styles.cardStack}>
            {folioClients.map((client) => (
              <Pressable
                key={client.id}
                accessibilityRole="button"
                style={styles.clientRow}
                onPress={() => onOpenClient(client)}
              >
                <View>
                  <Text style={styles.clientName}>
                    {client.first_name} {client.last_name}
                  </Text>
                  <Text style={styles.clientMeta}>
                    {client.pronouns || "Client"} • Last seen{" "}
                    {formatDateLabel(client.last_seen_at)}
                  </Text>
                </View>
                <Text style={styles.rowLink}>Open</Text>
              </Pressable>
            ))}
          </View>
        )}
      </PluckrCard>

      <PluckrCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Clients</Text>
          <Text style={styles.countChip}>{summary.clients}</Text>
        </View>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Chart Activity</Text>
          <Text style={styles.countChip}>{summary.charts}</Text>
        </View>
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
    </View>
  );
}
