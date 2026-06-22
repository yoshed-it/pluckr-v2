import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  type ChartEntryRecord,
  modalityUsesDc,
  modalityUsesRf
} from "@pluckr/domain";

import { PluckrFullScreenImageModal } from "../../PluckrFullScreenImageModal";
import { PluckrCard } from "../../primitives/Card";
import { pluckrAppTheme } from "../../pluckrAppTheme";

type PluckrChartDetailPanelProps = {
  chart: ChartEntryRecord;
  onBack: () => void;
  onEdit: (chart: ChartEntryRecord) => void;
};

/**
 * Mirrors the old Swift chart detail surface so entries can be reviewed
 * cleanly without forcing providers to parse the condensed journal card.
 */
export function PluckrChartDetailPanel({
  chart,
  onBack,
  onEdit
}: PluckrChartDetailPanelProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.link} onPress={onBack}>
          ← Chart Entries
        </Text>
        <Pressable
          accessibilityRole="button"
          style={styles.editButton}
          onPress={() => onEdit(chart)}
        >
          <Text style={styles.editLabel}>Edit</Text>
        </Pressable>
      </View>

      <PluckrCard>
        <Text style={styles.eyebrow}>Chart Details</Text>
        <Text style={styles.title}>{formatDateTime(chart.created_at)}</Text>
        <Text style={styles.subtitle}>
          Review the exact treatment settings, notes, and images from this log.
        </Text>
      </PluckrCard>

      <PluckrCard>
        <Text style={styles.sectionTitle}>Treatment Details</Text>
        <View style={styles.metricStack}>
          <Metric label="Modality" value={chart.modality || "Not recorded"} />
          {modalityUsesRf(chart.modality ?? "") ? (
            <Metric
              label="RF Level"
              value={
                typeof chart.rf_level === "number"
                  ? `${chart.rf_level.toFixed(1)} Volts`
                  : "Not recorded"
              }
            />
          ) : null}
          {modalityUsesDc(chart.modality ?? "") ? (
            <Metric
              label="DC Level"
              value={
                typeof chart.dc_level === "number"
                  ? `${chart.dc_level.toFixed(1)} mA`
                  : "Not recorded"
              }
            />
          ) : null}
          {typeof chart.treatment_seconds === "number" ? (
            <Metric label="Time" value={`${chart.treatment_seconds} sec`} />
          ) : null}
          <Metric label="Probe" value={chart.probe || "Not recorded"} />
          <Metric
            label="Treatment Area"
            value={chart.treatment_area || "Not specified"}
          />
        </View>
      </PluckrCard>

      {chart.tags.length > 0 ? (
        <PluckrCard>
          <Text style={styles.sectionTitle}>Chart Tags</Text>
          <View style={styles.tagRow}>
            {chart.tags.map((tag) => (
              <Text key={tag} style={styles.tagChip}>
                {tag}
              </Text>
            ))}
          </View>
        </PluckrCard>
      ) : null}

      {chart.notes ? (
        <PluckrCard>
          <Text style={styles.sectionTitle}>Clinical Notes</Text>
          <Text style={styles.notesCopy}>{chart.notes}</Text>
        </PluckrCard>
      ) : null}

      <PluckrCard>
        <Text style={styles.sectionTitle}>Chart Information</Text>
        <View style={styles.metricStack}>
          <Metric label="Created" value={formatDateTime(chart.created_at)} />
          <Metric label="Last Edited" value={formatDateTime(chart.updated_at)} />
        </View>
      </PluckrCard>

      {chart.image_urls.length > 0 ? (
        <PluckrCard>
          <Text style={styles.sectionTitle}>Chart Images</Text>
          <View style={styles.imageRow}>
            {chart.image_urls.map((imageUrl) => (
              <Pressable
                key={imageUrl}
                accessibilityRole="button"
                onPress={() => setSelectedImageUrl(imageUrl)}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>
        </PluckrCard>
      ) : null}

      <PluckrFullScreenImageModal
        visible={Boolean(selectedImageUrl)}
        imageUrl={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  container: { gap: pluckrAppTheme.spacing.md },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  link: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 15,
    fontWeight: "600"
  },
  editButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(44, 62, 80, 0.05)"
  },
  editLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  eyebrow: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: pluckrAppTheme.spacing.xs
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700"
  },
  subtitle: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24,
    marginTop: pluckrAppTheme.spacing.sm
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700",
    marginBottom: pluckrAppTheme.spacing.md
  },
  metricStack: { gap: pluckrAppTheme.spacing.sm },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md
  },
  metricLabel: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  metricValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  tagChip: {
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.16)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    fontSize: 11,
    fontWeight: "700"
  },
  notesCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.sm
  },
  imagePreview: {
    width: 92,
    height: 92,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  }
});
