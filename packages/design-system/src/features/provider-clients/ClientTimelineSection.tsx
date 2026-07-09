import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getChartTreatmentAreas,
  getPrimaryChartTreatmentArea,
  type ChartEntryRecord,
  modalityUsesDc,
  modalityUsesRf
} from "@pluckr/domain";

import { PluckrCard } from "../../primitives/Card";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";
import { ClinicalMemoryTrendPanel } from "./ClinicalMemoryTrendPanel";

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
 * Shows the client record as a chronological clinical story: each appointment
 * keeps its chart and related media together so providers do not have to hunt
 * across separate screens during review.
 */
export function ClientTimelineSection({
  charts,
  isLoading,
  onOpenChart,
  onOpenImage
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
          Chart entries and attached treatment photos will build this timeline.
        </Text>
      </PluckrCard>
    );
  }

  return (
    <View style={styles.stack}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Timeline</Text>
          <Text style={styles.subtitle}>
            Charts and photos grouped by appointment.
          </Text>
        </View>
        <Text style={styles.count}>{charts.length}</Text>
      </View>

      <ClinicalMemoryTrendPanel charts={charts} onOpenChart={onOpenChart} />

      {charts.map((chart) => {
        const photoItems = buildTimelinePhotoItems(chart);
        const calendar = formatCalendarBits(chart.created_at);
        const treatmentAreas = getChartTreatmentAreas(chart);
        const primaryArea = treatmentAreas[0] ?? null;
        const detailChips = buildDetailChips(chart);
        const visibleTags = (chart.tags ?? []).slice(0, 3);
        const hiddenTagCount = Math.max((chart.tags ?? []).length - visibleTags.length, 0);

        return (
          <View key={chart.id} style={styles.timelineItem}>
            <View style={styles.rail}>
              <Text style={styles.month}>{calendar.month}</Text>
              <Text style={styles.day}>{calendar.day}</Text>
              <Text style={styles.time}>{calendar.time}</Text>
              <View style={styles.railLine} />
            </View>
            <View style={styles.eventColumn}>
              <Pressable
                accessibilityRole="button"
                style={styles.event}
                onPress={() => onOpenChart(chart)}
              >
                {({ pressed }) => (
                  <View style={pressed ? styles.pressed : null}>
                    <View style={styles.eventHeader}>
                      <View style={styles.eventCopy}>
                        <Text style={styles.eventTitle}>
                          {primaryArea?.treatment_area || "Treatment"}
                          {treatmentAreas.length > 1
                            ? ` + ${treatmentAreas.length - 1}`
                            : ""}
                        </Text>
                        <Text style={styles.eventMeta}>
                          {[
                            primaryArea?.modality ?? chart.modality,
                            typeof chart.appointment_duration_minutes === "number"
                              ? `${chart.appointment_duration_minutes} min appointment`
                              : null
                          ]
                            .filter(Boolean)
                            .join(" • ")}
                        </Text>
                      </View>
                      <Text style={styles.openLabel}>Open</Text>
                    </View>

                    {detailChips.length > 0 ? (
                      <View style={styles.detailRow}>
                        {detailChips.map((chip) => (
                          <Text key={chip} style={styles.detailChip}>
                            {chip}
                          </Text>
                        ))}
                      </View>
                    ) : null}

                    {visibleTags.length > 0 ? (
                      <View style={styles.tagRow}>
                        {visibleTags.map((tag) => (
                          <Text key={tag} style={styles.tagChip}>
                            {tag}
                          </Text>
                        ))}
                        {hiddenTagCount > 0 ? (
                          <Text style={styles.tagChip}>+{hiddenTagCount}</Text>
                        ) : null}
                      </View>
                    ) : null}

                    <Text numberOfLines={2} style={styles.notes}>
                      {chart.treatment_summary ||
                        primaryArea?.notes ||
                        chart.notes ||
                        "No notes recorded."}
                    </Text>
                  </View>
                )}
              </Pressable>
              {photoItems.length > 0 ? (
                <View style={styles.photoStrip}>
                  <View style={styles.photoStripHeader}>
                    <Text style={styles.photoStripLabel}>
                      {photoItems.length} attached photo
                      {photoItems.length === 1 ? "" : "s"}
                    </Text>
                    <Text style={styles.photoStripHint}>Tap to review</Text>
                  </View>
                  <View style={styles.photoRow}>
                    {photoItems.slice(0, 4).map((item) => (
                      <Pressable
                        key={item.id}
                        accessibilityRole="button"
                        style={styles.photoButton}
                        onPress={() => onOpenImage(item)}
                      >
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.photo}
                          resizeMode="cover"
                        />
                      </Pressable>
                    ))}
                    {photoItems.length > 4 ? (
                      <View style={styles.morePhotos}>
                        <Text style={styles.morePhotosLabel}>
                          +{photoItems.length - 4}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function buildTimelinePhotoItems(chart: ChartEntryRecord) {
  const primaryArea = getPrimaryChartTreatmentArea(chart);

  return chart.image_urls.map((imageUrl, index) => ({
    id: `${chart.id}:${chart.image_paths?.[index] ?? imageUrl}`,
    imageUrl,
    chart,
    area: primaryArea?.treatment_area ?? chart.treatment_area,
    modality: primaryArea?.modality ?? chart.modality
  }));
}

function buildDetailChips(chart: ChartEntryRecord) {
  const primaryArea = getPrimaryChartTreatmentArea(chart);
  const modality = primaryArea?.modality ?? chart.modality ?? "";

  return [
    primaryArea?.probe ?? chart.probe,
    modalityUsesRf(modality) && typeof primaryArea?.rf_level === "number"
      ? `${primaryArea.rf_level.toFixed(1)} RF`
      : null,
    modalityUsesDc(modality) && typeof primaryArea?.dc_level === "number"
      ? `${primaryArea.dc_level.toFixed(1)} DC`
      : null,
    typeof primaryArea?.treatment_seconds === "number"
      ? `${primaryArea.treatment_seconds} sec`
      : null,
    chart.image_urls.length > 0
      ? `${chart.image_urls.length} photo${chart.image_urls.length === 1 ? "" : "s"}`
      : null
  ].filter((chip): chip is string => Boolean(chip));
}

function formatCalendarBits(value: string) {
  const date = new Date(value);

  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" })
      .format(date)
      .toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit"
    }).format(date)
  };
}

const styles = StyleSheet.create({
  stack: {
    gap: pluckrAppTheme.spacing.sm
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm,
    paddingHorizontal: 2
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800"
  },
  subtitle: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 2
  },
  count: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    backgroundColor: "rgba(127, 183, 133, 0.16)"
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: pluckrAppTheme.spacing.sm
  },
  rail: {
    width: 50,
    alignItems: "center",
    paddingTop: 2,
    alignSelf: "stretch"
  },
  month: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
    letterSpacing: 0.7
  },
  day: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 24,
    lineHeight: 27,
    fontWeight: "900"
  },
  time: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600"
  },
  railLine: {
    flex: 1,
    width: 1,
    minHeight: 20,
    marginTop: 8,
    backgroundColor: pluckrAppTheme.colors.divider
  },
  event: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(228, 229, 221, 0.82)",
    backgroundColor: "rgba(255, 255, 255, 0.64)"
  },
  eventColumn: {
    flex: 1,
    minWidth: 0,
    gap: 6
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  eventCopy: {
    flex: 1,
    minWidth: 0
  },
  eventTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900"
  },
  eventMeta: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 2
  },
  openLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900"
  },
  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 9
  },
  detailChip: {
    color: pluckrAppTheme.colors.textPrimary,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 7
  },
  tagChip: {
    color: pluckrAppTheme.colors.sageStrong,
    backgroundColor: "rgba(127, 183, 133, 0.13)",
    borderRadius: pluckrAppTheme.radii.full,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800"
  },
  notes: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 8
  },
  pressed: {
    opacity: 0.72
  },
  photoStrip: {
    marginLeft: 10,
    marginRight: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
    borderLeftWidth: 1,
    borderLeftColor: pluckrAppTheme.colors.divider,
    backgroundColor: "rgba(255, 255, 255, 0.44)"
  },
  photoStripHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.xs
  },
  photoStripLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800"
  },
  photoStripHint: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700"
  },
  photoRow: {
    flexDirection: "row",
    gap: 8
  },
  photoButton: {
    borderRadius: 12,
    overflow: "hidden"
  },
  photo: {
    width: 58,
    height: 58,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  morePhotos: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted
  },
  morePhotosLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900"
  },
  emptyTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    marginBottom: 6
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  }
});
