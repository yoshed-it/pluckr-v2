/**
 * Mobile workspace slice that surfaces the same first-use story as the
 * Swift prototype: choose an org, see clients, and review recent charting.
 */
import React from "react";
import { Text, View } from "react-native";
import type {
  ClientRecord,
  MembershipWithOrganization,
  RecentChartRecord,
  WorkspaceSummary
} from "@pluckr/supabase";

import { PaperCard } from "./PaperCard";
import { PluckrButton } from "./PluckrButton";
import { styles } from "./mobileWorkspaceStyles";

type MobileWorkspaceStageProps = {
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

export function MobileWorkspaceStage({
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
}: MobileWorkspaceStageProps) {
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

      <PaperCard>
        <Text style={styles.eyebrow}>Current Organization</Text>
        <Text style={styles.title}>{organization.name}</Text>
        <Text style={styles.subtitle}>
          {organization.description ||
            "Clinical journal flow ready for provider notes, client tracking, and a calm investor demo."}
        </Text>

        <View style={styles.metricGrid}>
          {metrics.map(([label, value]) => (
            <PaperCard key={label} compact accent>
              <Text style={styles.metricLabel}>{label}</Text>
              <Text style={styles.metricValue}>{value}</Text>
            </PaperCard>
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
      </PaperCard>

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? (
        <Text style={[styles.message, styles.success]}>{notice}</Text>
      ) : null}

      <PaperCard>
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
              <PaperCard key={client.id} compact>
                <Text style={styles.cardTitle}>
                  {client.first_name} {client.last_name}
                </Text>
                <Text style={styles.cardBody}>
                  {client.notes || "No care notes yet."}
                </Text>
                <Text style={styles.cardMeta}>
                  Last seen {formatDateLabel(client.last_seen_at)}
                </Text>
              </PaperCard>
            ))}
          </View>
        )}
      </PaperCard>

      <PaperCard>
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
              <PaperCard key={chart.id} compact>
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
              </PaperCard>
            ))}
          </View>
        )}
      </PaperCard>
    </View>
  );
}
