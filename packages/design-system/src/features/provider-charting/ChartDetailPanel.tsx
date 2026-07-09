import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getChartTreatmentAreas,
  type ChartEntryRecord,
  type ChartTreatmentAreaRecord,
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
  const treatmentAreas = getChartTreatmentAreas(chart);

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
        <Text style={styles.sectionTitle}>Appointment</Text>
        <View style={styles.metricStack}>
          <Metric
            label="Appointment Duration"
            value={
              typeof chart.appointment_duration_minutes === "number"
                ? `${chart.appointment_duration_minutes} min`
                : "Not recorded"
            }
          />
          <Metric label="Created" value={formatDateTime(chart.created_at)} />
          <Metric label="Last Edited" value={formatDateTime(chart.updated_at)} />
        </View>
      </PluckrCard>

      <PluckrCard>
        <Text style={styles.sectionTitle}>Treatment Areas</Text>
        {treatmentAreas.length > 0 ? (
          <View style={styles.areaStack}>
            {treatmentAreas.map((area, index) => (
              <TreatmentAreaDetail
                key={area.id}
                area={area}
                index={index}
                treatmentAreaCount={treatmentAreas.length}
                showDivider={index > 0}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.notesCopy}>
            No treatment-area details were recorded.
          </Text>
        )}
      </PluckrCard>

      {chart.treatment_summary || chart.notes ? (
        <PluckrCard>
          <Text style={styles.sectionTitle}>Session Notes</Text>
          {chart.treatment_summary ? (
            <Text style={styles.notesCopy}>{chart.treatment_summary}</Text>
          ) : null}
          {chart.notes ? (
            <Text style={styles.notesCopy}>{chart.notes}</Text>
          ) : null}
        </PluckrCard>
      ) : null}

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
        title={formatDateTime(chart.created_at)}
        subtitle={getChartPhotoContext(chart)}
        details={buildChartPhotoDetails(chart)}
        onClose={() => setSelectedImageUrl(null)}
      />
    </View>
  );
}

function TreatmentAreaDetail({
  area,
  index,
  treatmentAreaCount,
  showDivider
}: {
  area: ChartTreatmentAreaRecord;
  index: number;
  treatmentAreaCount: number;
  showDivider: boolean;
}) {
  return (
    <View style={styles.areaDetail}>
      {showDivider ? <View style={styles.areaDivider} /> : null}
      <View style={styles.areaHeader}>
        <Text style={styles.areaTitle}>
          {treatmentAreaCount > 1
            ? `Treatment Area ${index + 1}`
            : "Treatment Area"}
        </Text>
        <Text style={styles.areaName}>{area.treatment_area}</Text>
      </View>
      <View style={styles.metricStack}>
        <Metric label="Modality" value={area.modality || "Not recorded"} />
        <Metric label="Probe" value={area.probe || "Not recorded"} />
        {modalityUsesRf(area.modality ?? "") ? (
          <Metric
            label="RF Level"
            value={
              typeof area.rf_level === "number"
                ? `${area.rf_level.toFixed(1)} Volts`
                : "Not recorded"
            }
          />
        ) : null}
        {modalityUsesDc(area.modality ?? "") ? (
          <Metric
            label="DC Level"
            value={
              typeof area.dc_level === "number"
                ? `${area.dc_level.toFixed(1)} mA`
                : "Not recorded"
            }
          />
        ) : null}
        {typeof area.treatment_seconds === "number" ? (
          <Metric
            label="Treatment Seconds"
            value={`${area.treatment_seconds} sec`}
          />
        ) : null}
      </View>
      {area.notes ? <Text style={styles.notesCopy}>{area.notes}</Text> : null}
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

function getChartPhotoContext(chart: ChartEntryRecord) {
  const primaryArea = getChartTreatmentAreas(chart)[0];

  return [primaryArea?.treatment_area ?? chart.treatment_area, primaryArea?.modality ?? chart.modality]
    .filter(Boolean)
    .join(" - ") || "Chart photo";
}

function buildChartPhotoDetails(chart: ChartEntryRecord) {
  const primaryArea = getChartTreatmentAreas(chart)[0];

  return [
    {
      label: "Date",
      value: formatDateTime(chart.created_at)
    },
    primaryArea?.treatment_area || chart.treatment_area
      ? {
          label: "Area",
          value: primaryArea?.treatment_area ?? chart.treatment_area ?? ""
        }
      : null,
    primaryArea?.modality || chart.modality
      ? {
          label: "Mode",
          value: primaryArea?.modality ?? chart.modality ?? ""
        }
      : null,
    chart.tags.length > 0
      ? {
          label: "Tags",
          value: chart.tags.slice(0, 3).join(", ")
        }
      : null
  ].filter((detail): detail is { label: string; value: string } => detail !== null);
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
  areaStack: {
    gap: pluckrAppTheme.spacing.md
  },
  areaDetail: {
    gap: pluckrAppTheme.spacing.sm
  },
  areaDivider: {
    height: 1,
    backgroundColor: pluckrAppTheme.colors.divider
  },
  areaHeader: {
    gap: 2
  },
  areaTitle: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  areaName: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "800"
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
