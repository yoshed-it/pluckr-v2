import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  getChartTreatmentAreas,
  getClientDisplayName,
  type RecentChartRecord
} from "@pluckr/domain";

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
                <View style={styles.timelineDot} />
                <View style={styles.activityCopy}>
                  <View style={styles.activityTopRow}>
                    <Text style={styles.clientName}>
                      {chart.client ? getClientDisplayName(chart.client) : "Client"}
                    </Text>
                    <Text style={styles.activityDate}>
                      {formatDateLabel(chart.created_at)}
                    </Text>
                  </View>
                  <Text style={styles.activityMeta}>
                    {formatActivityLabel(chart)}
                    {chart.appointment_duration_minutes
                      ? ` - ${chart.appointment_duration_minutes} min`
                      : ""}
                    {getPhotoCount(chart) > 0
                      ? ` - ${getPhotoCount(chart)} photo${getPhotoCount(chart) === 1 ? "" : "s"}`
                      : ""}
                  </Text>
                  <Text numberOfLines={2} style={styles.clientMeta}>
                    {chart.treatment_summary || chart.notes || "No notes yet."}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </PluckrCard>
  );
}

function formatActivityLabel(chart: RecentChartRecord) {
  const primaryArea = getChartTreatmentAreas(chart)[0] ?? null;

  return [primaryArea?.treatment_area, primaryArea?.modality]
    .filter(Boolean)
    .join(" - ") || "Treatment";
}

function getPhotoCount(chart: RecentChartRecord) {
  return chart.image_paths?.length ?? chart.image_urls.length;
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
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.sm,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: pluckrAppTheme.colors.divider
  },
  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    marginTop: 7,
    backgroundColor: pluckrAppTheme.colors.sageStrong
  },
  activityCopy: {
    flex: 1,
    minWidth: 0,
    gap: 3
  },
  activityTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  clientName: {
    flex: 1,
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
    fontWeight: "700"
  },
  activityDate: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  }
});
