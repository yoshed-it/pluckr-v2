import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  type ChartEntryRecord,
  modalityUsesDc,
  modalityUsesRf
} from "@pluckr/domain";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

type PreviousChartReferenceProps = {
  chart: ChartEntryRecord | null;
};

export function PreviousChartReference({
  chart
}: PreviousChartReferenceProps) {
  const [expanded, setExpanded] = useState(false);

  if (!chart) {
    return (
      <View style={styles.referenceStrip}>
        <Text style={styles.eyebrow}>Previous Treatment</Text>
        <Text style={styles.emptyCopy}>No previous treatment yet.</Text>
      </View>
    );
  }

  const settingItems = buildSettingItems(chart);
  const photoCount = chart.image_paths?.length ?? chart.image_urls.length;

  return (
    <View style={styles.referenceStrip}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Previous Treatment</Text>
          <Text numberOfLines={1} style={styles.summary}>
            {formatChartDate(chart.created_at)} |{" "}
            {chart.treatment_area || "Area not recorded"} |{" "}
            {chart.modality || "Modality not recorded"}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={styles.expandButton}
          onPress={() => setExpanded((current) => !current)}
        >
          <Text style={styles.expandLabel}>
            {expanded ? "Hide" : "View"}
          </Text>
        </Pressable>
      </View>

      {settingItems.length > 0 ? (
        <View style={styles.inlineRow}>
          {settingItems.map((item) => (
            <Text key={item.label} style={styles.inlineItem}>
              <Text style={styles.inlineLabel}>{item.label}</Text> {item.value}
            </Text>
          ))}
        </View>
      ) : null}

      {expanded ? (
        <View style={styles.expandedStack}>
          {chart.notes ? (
            <Text numberOfLines={2} style={styles.notesPreview}>
              {chart.notes}
            </Text>
          ) : (
            <Text style={styles.notesPreview}>No notes recorded.</Text>
          )}
          <View style={styles.inlineRow}>
            {chart.tags.map((tag) => (
              <Text key={tag} style={styles.tagChip}>
                {tag}
              </Text>
            ))}
            {photoCount > 0 ? (
              <Text style={styles.tagChip}>
                {photoCount} {photoCount === 1 ? "photo" : "photos"}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function buildSettingItems(chart: ChartEntryRecord) {
  return [
    chart.probe ? { label: "Probe", value: chart.probe } : null,
    modalityUsesRf(chart.modality ?? "") && typeof chart.rf_level === "number"
      ? { label: "RF", value: chart.rf_level.toFixed(1) }
      : null,
    modalityUsesDc(chart.modality ?? "") && typeof chart.dc_level === "number"
      ? { label: "DC", value: chart.dc_level.toFixed(1) }
      : null,
    typeof chart.treatment_seconds === "number"
      ? { label: "Seconds", value: `${chart.treatment_seconds}` }
      : null
  ].filter((item): item is { label: string; value: string } => item !== null);
}

function formatChartDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  referenceStrip: {
    gap: 6,
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: pluckrAppTheme.colors.divider,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: pluckrAppTheme.spacing.sm
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2
  },
  eyebrow: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  summary: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  expandButton: {
    minHeight: 26,
    justifyContent: "center",
    paddingHorizontal: 9,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  expandLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800"
  },
  inlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5
  },
  inlineItem: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.surface
  },
  inlineLabel: {
    color: pluckrAppTheme.colors.textPrimary
  },
  expandedStack: {
    gap: 6
  },
  notesPreview: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  tagChip: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.mint,
    overflow: "hidden"
  }
});
