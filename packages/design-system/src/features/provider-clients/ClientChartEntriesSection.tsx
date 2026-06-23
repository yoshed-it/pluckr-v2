import React from "react";
import { Text, View } from "react-native";
import { type ChartEntryRecord } from "@pluckr/domain";

import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { pluckrClientJournalStageStyles as styles } from "./ClientJournalStage.styles";
import { ChartEntrySummaryCard } from "./ChartEntrySummaryCard";

type Props = {
  charts: ChartEntryRecord[];
  isLoading: boolean;
  onStartChart: () => void;
  onOpenChart: (chart: ChartEntryRecord) => void;
};

export function ClientChartEntriesSection({
  charts,
  isLoading,
  onStartChart,
  onOpenChart
}: Props) {
  if (isLoading) {
    return (
      <PluckrCard compact>
        <Text style={styles.emptyState}>Loading chart entries...</Text>
      </PluckrCard>
    );
  }

  if (charts.length === 0) {
    return (
      <PluckrCard compact>
        <View style={styles.emptyStateStack}>
          <Text style={styles.emptyStateTitle}>No chart entries yet</Text>
          <Text style={styles.emptyState}>
            Start treatment or add the first chart entry to begin this client record.
          </Text>
          <PluckrButton
            label="Add Chart Entry"
            variant="secondary"
            onPress={onStartChart}
          />
        </View>
      </PluckrCard>
    );
  }

  return (
    <View style={styles.chartSummaryStack}>
      {charts.slice(0, 3).map((chart) => (
        <ChartEntrySummaryCard
          key={chart.id}
          chart={chart}
          onOpen={() => onOpenChart(chart)}
        />
      ))}
      {charts.length > 3 ? (
        <View style={styles.chartFooter}>
          <Text style={styles.chartFooterLabel}>View All Chart Entries</Text>
        </View>
      ) : null}
    </View>
  );
}
