import React from "react";
import { Text, View } from "react-native";
import type {
  ClientRecord,
  MembershipWithOrganization,
  RecentChartRecord,
  WorkspaceSummary
} from "@pluckr/supabase";

import { PluckrButton } from "./PluckrButton";
import { PluckrCard } from "./PluckrCard";
import { pluckrWorkspaceStageStyles as styles } from "./PluckrWorkspaceStage.styles";

type PluckrWorkspaceStageProps = {
  organization: MembershipWithOrganization["organization"];
  membership: MembershipWithOrganization["membership"];
  summary: WorkspaceSummary;
  clients: ClientRecord[];
  charts: RecentChartRecord[];
  isLoading: boolean;
  isSeeding: boolean;
  error: string | null;
  notice: string | null;
  onBack: () => void;
  onOpenClients: () => void;
  onSeedDemoData: () => void;
  onLogout: () => void;
};

function formatDateLabel(value: string | null) {
  if (!value) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function PluckrWorkspaceStage({
  organization,
  membership,
  summary,
  clients,
  charts,
  isLoading,
  isSeeding,
  error,
  notice,
  onBack,
  onOpenClients,
  onSeedDemoData,
  onLogout
}: PluckrWorkspaceStageProps) {
  const metrics = [
    ["Organizations", String(summary.organizations)],
    ["Clients", String(summary.clients)],
    ["Charts", String(summary.charts)],
    ["Role", membership.role]
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.link} onPress={onBack}>
          ← Organizations
        </Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <PluckrCard>
        <Text style={styles.eyebrow}>Current Organization</Text>
        <Text style={styles.title}>{organization.name}</Text>
        <Text style={styles.subtitle}>
          {organization.description ||
            "Clinical journal flow ready for provider notes, client tracking, and a calm investor demo."}
        </Text>

        <View style={styles.metricGrid}>
          {metrics.map(([label, value]) => (
            <PluckrCard key={label} compact accent>
              <Text style={styles.metricLabel}>{label}</Text>
              <Text style={styles.metricValue}>{value}</Text>
            </PluckrCard>
          ))}
        </View>

        <View style={styles.heroActions}>
          <PluckrButton
            label="Open Client List"
            variant="secondary"
            onPress={() => onOpenClients()}
          />
          <Text style={styles.heroBadge}>
            {clients.length === 0 ? "Ready for demo seeding" : "Live demo data"}
          </Text>
          <PluckrButton
            label={isSeeding ? "Seeding..." : "Seed Demo Data"}
            variant="secondary"
            disabled={isSeeding}
            onPress={() => onSeedDemoData()}
          />
        </View>
      </PluckrCard>

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? <Text style={[styles.message, styles.success]}>{notice}</Text> : null}

      <PluckrCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Client List</Text>
          <Text style={styles.countChip}>{clients.length}</Text>
        </View>
        {isLoading ? (
          <Text style={styles.emptyState}>Loading clients...</Text>
        ) : clients.length === 0 ? (
          <Text style={styles.emptyState}>
            Seed demo data to create the first three investor-ready client records.
          </Text>
        ) : (
          <View style={styles.listStack}>
            {clients.map((client) => (
              <PluckrCard key={client.id} compact>
                <Text style={styles.cardTitle}>
                  {client.first_name} {client.last_name}
                </Text>
                <Text style={styles.cardBody}>
                  {client.notes || "No care notes yet."}
                </Text>
                <Text style={styles.cardMeta}>
                  Last seen {formatDateLabel(client.last_seen_at)}
                </Text>
              </PluckrCard>
            ))}
          </View>
        )}
      </PluckrCard>

      <PluckrCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Charts</Text>
          <Text style={styles.countChip}>{charts.length}</Text>
        </View>
        {isLoading ? (
          <Text style={styles.emptyState}>Loading chart activity...</Text>
        ) : charts.length === 0 ? (
          <Text style={styles.emptyState}>
            Chart activity will appear here after the first session notes are created.
          </Text>
        ) : (
          <View style={styles.listStack}>
            {charts.map((chart) => (
              <PluckrCard key={chart.id} compact>
                <Text style={styles.cardTitle}>
                  {chart.client
                    ? `${chart.client.first_name} ${chart.client.last_name}`
                    : "Client"}
                </Text>
                <Text style={styles.cardBody}>
                  {chart.treatment_summary ||
                    chart.notes ||
                    "Recent session details coming soon."}
                </Text>
                <Text style={styles.cardMeta}>
                  {chart.treatment_area || "Treatment"} on{" "}
                  {formatDateLabel(chart.created_at)}
                </Text>
              </PluckrCard>
            ))}
          </View>
        )}
      </PluckrCard>
    </View>
  );
}
