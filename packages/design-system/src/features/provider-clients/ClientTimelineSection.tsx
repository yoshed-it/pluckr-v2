import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getPrimaryChartTreatmentArea,
  type ChartEntryRecord
} from "@pluckr/domain";

import { PluckrCard } from "../../primitives/Card";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";
import { ChartEntrySummaryCard } from "./ChartEntrySummaryCard";

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

      {charts.map((chart) => {
        const photoItems = buildTimelinePhotoItems(chart);

        return (
          <View key={chart.id} style={styles.timelineItem}>
            <ChartEntrySummaryCard
              chart={chart}
              onOpen={() => onOpenChart(chart)}
            />
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
    gap: 6
  },
  photoStrip: {
    marginLeft: 62,
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
