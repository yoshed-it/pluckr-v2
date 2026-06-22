import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { RecentChartRecord } from "@pluckr/domain";

import { PluckrCard } from "../../primitives/Card";
import { PluckrSectionHeader } from "../../composite/SectionHeader";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

type PluckrRecentActivityPanelProps = {
  charts: RecentChartRecord[];
  count: number;
  isLoading: boolean;
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

export function PluckrRecentActivityPanel({
  charts,
  count,
  isLoading
}: PluckrRecentActivityPanelProps) {
  return (
    <PluckrCard compact>
      <View style={styles.stack}>
        <PluckrSectionHeader title="Recent Chart Activity" count={count} />
        {isLoading ? (
          <Text style={styles.emptyState}>Loading chart activity...</Text>
        ) : charts.length === 0 ? (
          <Text style={styles.emptyState}>
            Chart activity will appear here once providers begin documenting
            sessions.
          </Text>
        ) : (
          <View style={styles.list}>
            {charts.map((chart) => (
              <View key={chart.id} style={styles.activityRow}>
                <Text style={styles.clientName}>
                  {chart.client
                    ? `${chart.client.first_name} ${chart.client.last_name}`
                    : "Client"}
                </Text>
                <Text numberOfLines={2} style={styles.clientMeta}>
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
      </View>
    </PluckrCard>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: pluckrAppTheme.spacing.sm
  },
  emptyState: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22
  },
  list: {
    gap: 0
  },
  activityRow: {
    gap: 4,
    paddingHorizontal: 0,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: pluckrAppTheme.colors.divider
  },
  clientName: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700"
  },
  clientMeta: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  activityMeta: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600"
  }
});
