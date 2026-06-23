import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  getChartTreatmentAreas,
  type ChartEntryRecord,
  modalityUsesDc,
  modalityUsesRf
} from "@pluckr/domain";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";
import { PluckrCard } from "../../primitives/Card";
import { PluckrIcon } from "../../primitives/Icon";
import { StatusChip } from "../../primitives/StatusChip";
import { TagChip } from "../../primitives/TagChip";

type Props = {
  chart: ChartEntryRecord;
  onOpen: () => void;
};

function formatCalendarBits(value: string) {
  const date = new Date(value);
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date).toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit"
    }).format(date)
  };
}

export function ChartEntrySummaryCard({
  chart,
  onOpen
}: Props) {
  const calendar = formatCalendarBits(chart.created_at);
  const treatmentAreas = getChartTreatmentAreas(chart);
  const primaryArea = treatmentAreas[0] ?? null;
  const detailChips = [
    primaryArea?.probe,
    modalityUsesRf(primaryArea?.modality ?? "") &&
    typeof primaryArea?.rf_level === "number"
      ? `${primaryArea.rf_level.toFixed(1)} RF`
      : null,
    modalityUsesDc(primaryArea?.modality ?? "") &&
    typeof primaryArea?.dc_level === "number"
      ? `${primaryArea.dc_level.toFixed(1)} DC`
      : null,
    typeof primaryArea?.treatment_seconds === "number"
      ? `${primaryArea.treatment_seconds} sec`
      : null,
    typeof chart.appointment_duration_minutes === "number"
      ? `${chart.appointment_duration_minutes} min appt`
      : null
  ].filter(Boolean) as string[];
  const tagChips = (chart.tags ?? []).slice(0, 3);

  return (
    <Pressable accessibilityRole="button" onPress={onOpen}>
      {({ pressed }) => (
        <View style={pressed ? styles.pressed : null}>
          <PluckrCard compact>
            <View style={styles.row}>
              <View style={styles.dateColumn}>
                <Text style={styles.month}>{calendar.month}</Text>
                <Text style={styles.day}>{calendar.day}</Text>
                <Text style={styles.time}>{calendar.time}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.body}>
                <View style={styles.headerRow}>
                  <Text style={styles.title}>
                    {primaryArea?.modality || "Treatment"}{" "}
                    <Text style={styles.dot}>•</Text>{" "}
                    {primaryArea?.treatment_area || "Area not recorded"}
                    {treatmentAreas.length > 1
                      ? ` + ${treatmentAreas.length - 1}`
                      : ""}
                  </Text>
                  <StatusChip label="Complete" tone="success" />
                </View>
                <View style={styles.chipRow}>
                  {detailChips.map((chip) => (
                    <TagChip key={chip} label={chip} />
                  ))}
                </View>
                {tagChips.length > 0 ? (
                  <View style={styles.tagRow}>
                    {tagChips.map((tag) => (
                      <TagChip key={tag} label={tag} variant="outline" />
                    ))}
                  </View>
                ) : null}
                <Text style={styles.notes}>
                  {chart.treatment_summary ||
                    primaryArea?.notes ||
                    chart.notes ||
                    "No notes"}
                </Text>
              </View>
              <View style={styles.chevronWrap}>
                <PluckrIcon
                  name="open"
                  size={pluckrAppTheme.iconSizes.md}
                  color={pluckrAppTheme.colors.textMuted}
                />
              </View>
            </View>
          </PluckrCard>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12
  },
  dateColumn: {
    width: 48,
    alignItems: "flex-start",
    gap: 4
  },
  month: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
    letterSpacing: 0.8
  },
  day: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800"
  },
  time: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500"
  },
  divider: {
    width: 1,
    backgroundColor: pluckrAppTheme.colors.divider
  },
  body: {
    flex: 1,
    gap: 8
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8
  },
  title: {
    flex: 1,
    flexShrink: 1,
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800"
  },
  dot: {
    color: pluckrAppTheme.colors.textMuted
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  notes: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18
  },
  chevronWrap: {
    justifyContent: "center"
  },
  pressed: {
    opacity: 0.78
  }
});
