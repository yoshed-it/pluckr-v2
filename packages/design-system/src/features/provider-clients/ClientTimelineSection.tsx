import React from "react";
import { Text, View } from "react-native";
import type { ChartEntryRecord } from "@pluckr/domain";

import { PluckrCard } from "../../primitives/Card";
import { ClinicalMemoryTrendPanel } from "./ClinicalMemoryTrendPanel";
import {
  buildTimelineInsights,
  type BreakdownItem
} from "./ClientTimelineSection.logic";
import { clientTimelineSectionStyles as styles } from "./ClientTimelineSection.styles";

export type ClientTimelinePhotoItem = {
  id: string;
  imageUrl: string;
  chart: ChartEntryRecord;
  area: string | null;
  modality: string | null;
};

type Props = {
  charts: ChartEntryRecord[];
  isLoading: boolean;
  onOpenChart: (chart: ChartEntryRecord) => void;
  onOpenImage: (item: ClientTimelinePhotoItem) => void;
};

/**
 * Client-level reporting surface for Clinical Memory. Chart Entries owns the
 * appointment list; Timeline summarizes how care is changing over time.
 */
export function ClientTimelineSection({
  charts,
  isLoading,
  onOpenChart
}: Props) {
  if (isLoading) {
    return (
      <PluckrCard compact>
        <Text style={styles.emptyCopy}>Loading timeline...</Text>
      </PluckrCard>
    );
  }

  if (charts.length === 0) {
    return (
      <PluckrCard compact>
        <Text style={styles.emptyTitle}>Timeline</Text>
        <Text style={styles.emptyCopy}>
          Treatment trends, area history, and Clinical Memory will appear after
          the first few chart entries.
        </Text>
      </PluckrCard>
    );
  }

  const insights = buildTimelineInsights(charts);

  return (
    <View style={styles.stack}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Timeline</Text>
          <Text style={styles.subtitle}>
            Clinical Memory, trends, and treatment stats.
          </Text>
        </View>
        <Text style={styles.count}>{charts.length}</Text>
      </View>

      <ClinicalMemoryTrendPanel charts={charts} onOpenChart={onOpenChart} />

      <View style={styles.metricsGrid}>
        <InsightMetric label="Sessions" value={String(charts.length)} />
        <InsightMetric label="Total Time" value={insights.totalTimeLabel} />
        <InsightMetric label="Avg Visit" value={insights.averageDurationLabel} />
        <InsightMetric label="Photos" value={String(insights.photoCount)} />
      </View>

      <PluckrCard compact>
        <View style={styles.snapshotStack}>
          <Text style={styles.sectionTitle}>Latest Clinical Memory</Text>
          <Text style={styles.latestTitle}>{insights.latestTitle}</Text>
          <Text style={styles.latestMeta}>{insights.latestMeta}</Text>
          {insights.latestSettings.length > 0 ? (
            <View style={styles.chipRow}>
              {insights.latestSettings.map((setting) => (
                <Text key={setting} style={styles.settingChip}>
                  {setting}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      </PluckrCard>

      <View style={styles.breakdownGrid}>
        <BreakdownCard title="Treatment Areas" items={insights.areaBreakdown} />
        <BreakdownCard title="Modalities" items={insights.modalityBreakdown} />
      </View>

      <PluckrCard compact>
        <View style={styles.snapshotStack}>
          <Text style={styles.sectionTitle}>Documentation Coverage</Text>
          <View style={styles.coverageRow}>
            <CoverageStat label="With notes" value={insights.notesCoverageLabel} />
            <CoverageStat label="With photos" value={insights.photoCoverageLabel} />
          </View>
          <Text style={styles.helperCopy}>
            These numbers help spot gaps before reporting, insurance, or progress
            reviews depend on the record.
          </Text>
        </View>
      </PluckrCard>
    </View>
  );
}

function InsightMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function BreakdownCard({
  title,
  items
}: {
  title: string;
  items: BreakdownItem[];
}) {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <PluckrCard compact>
      <View style={styles.snapshotStack}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.length > 0 ? (
          items.slice(0, 5).map((item) => (
            <View key={item.label} style={styles.breakdownRow}>
              <View style={styles.breakdownLabelRow}>
                <Text numberOfLines={1} style={styles.breakdownLabel}>
                  {item.label}
                </Text>
                <Text style={styles.breakdownCount}>{item.count}</Text>
              </View>
              <View style={styles.breakdownTrack}>
                <View
                  style={[
                    styles.breakdownFill,
                    { width: `${Math.max((item.count / maxCount) * 100, 8)}%` }
                  ]}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.helperCopy}>No data recorded yet.</Text>
        )}
      </View>
    </PluckrCard>
  );
}

function CoverageStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.coverageStat}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.coverageValue}>{value}</Text>
    </View>
  );
}
