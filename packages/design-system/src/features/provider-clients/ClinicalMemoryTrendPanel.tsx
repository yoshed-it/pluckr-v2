import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { ChartEntryRecord } from "@pluckr/domain";

import {
  averageTrend,
  buildAreaOptions,
  buildTrendPoints,
  formatTrendDelta,
  formatTrendValue,
  trendMetrics,
  type MetricKey,
  type TrendPoint
} from "./ClinicalMemoryTrendPanel.logic";
import { clinicalMemoryTrendStyles as styles } from "./ClinicalMemoryTrendPanel.styles";

type Props = {
  charts: ChartEntryRecord[];
  onOpenChart: (chart: ChartEntryRecord) => void;
};

/**
 * Area-aware graph surface for Clinical Memory. The chart does not copy prior
 * values into today's note; it makes historic settings glanceable and opens
 * the source chart when a provider taps a data point.
 */
export function ClinicalMemoryTrendPanel({ charts, onOpenChart }: Props) {
  const areaOptions = useMemo(() => buildAreaOptions(charts), [charts]);
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("rf");
  const selectedMetricConfig =
    trendMetrics.find((metric) => metric.key === selectedMetric) ?? trendMetrics[0];
  const points = useMemo(
    () => buildTrendPoints(charts, selectedArea, selectedMetric),
    [charts, selectedArea, selectedMetric]
  );
  const latestPoint = points.at(-1) ?? null;
  const previousPoint = points.at(-2) ?? null;
  const trendDelta =
    latestPoint && previousPoint ? latestPoint.value - previousPoint.value : null;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Clinical Memory</Text>
          <Text style={styles.title}>Settings Trends</Text>
        </View>
        {latestPoint ? (
          <View style={styles.latestPill}>
            <Text style={styles.latestLabel}>Latest</Text>
            <Text style={styles.latestValue}>
              {formatTrendValue(latestPoint.value, selectedMetricConfig.suffix)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.chipRow}>
        {areaOptions.map((area) => (
          <Pressable
            key={area}
            accessibilityRole="button"
            style={[styles.filterChip, selectedArea === area ? styles.filterChipActive : null]}
            onPress={() => setSelectedArea(area)}
          >
            <Text
              style={[
                styles.filterChipLabel,
                selectedArea === area ? styles.filterChipLabelActive : null
              ]}
            >
              {area}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.metricRow}>
        {trendMetrics.map((metric) => (
          <Pressable
            key={metric.key}
            accessibilityRole="button"
            style={[
              styles.metricChip,
              selectedMetric === metric.key ? styles.metricChipActive : null
            ]}
            onPress={() => setSelectedMetric(metric.key)}
          >
            <Text
              style={[
                styles.metricChipLabel,
                selectedMetric === metric.key ? styles.metricChipLabelActive : null
              ]}
            >
              {metric.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {points.length >= 2 ? (
        <TrendChart
          points={points}
          suffix={selectedMetricConfig.suffix}
          onOpenChart={onOpenChart}
        />
      ) : (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyTitle}>Not enough history yet</Text>
          <Text style={styles.emptyCopy}>
            Add at least two matching sessions to see this trend.
          </Text>
        </View>
      )}

      <View style={styles.memoryRow}>
        <MemoryStat label="Sessions" value={String(points.length)} />
        <MemoryStat
          label="Average"
          value={
            points.length > 0
              ? formatTrendValue(averageTrend(points), selectedMetricConfig.suffix)
              : "—"
          }
        />
        <MemoryStat
          label="Change"
          value={
            trendDelta === null
              ? "—"
              : formatTrendDelta(trendDelta, selectedMetricConfig.suffix)
          }
        />
      </View>
    </View>
  );
}

function TrendChart({
  points,
  suffix,
  onOpenChart
}: {
  points: TrendPoint[];
  suffix: string;
  onOpenChart: (chart: ChartEntryRecord) => void;
}) {
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const plotted = points.map((point) => ({
    ...point,
    percentFromTop: 100 - ((point.value - min) / range) * 84
  }));

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartScale}>
        <Text style={styles.scaleLabel}>{formatTrendValue(max, suffix)}</Text>
        <Text style={styles.scaleLabel}>{formatTrendValue(min, suffix)}</Text>
      </View>
      <View style={styles.chartGrid}>
        <View style={styles.gridLineTop} />
        <View style={styles.gridLineMid} />
        <View style={styles.gridLineBottom} />
        {plotted.map((point) => (
          <Pressable
            key={point.chart.id}
            accessibilityRole="button"
            accessibilityLabel={`Open chart from ${point.date.toLocaleDateString()}`}
            style={styles.pointColumn}
            onPress={() => onOpenChart(point.chart)}
          >
            <View
              style={[
                styles.pointStem,
                { height: `${Math.max(8, 100 - point.percentFromTop)}%` }
              ]}
            />
            <View
              style={[
                styles.pointDot,
                { top: `${Math.max(4, Math.min(point.percentFromTop, 90))}%` }
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function MemoryStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.memoryStat}>
      <Text style={styles.memoryLabel}>{label}</Text>
      <Text style={styles.memoryValue}>{value}</Text>
    </View>
  );
}
