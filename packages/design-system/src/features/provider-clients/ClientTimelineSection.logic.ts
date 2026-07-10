import {
  getChartTreatmentAreas,
  getPrimaryChartTreatmentArea,
  type ChartEntryRecord,
  modalityUsesDc,
  modalityUsesRf
} from "@pluckr/domain";

export type BreakdownItem = {
  label: string;
  count: number;
};

export function buildTimelineInsights(charts: ChartEntryRecord[]) {
  const totalMinutes = charts.reduce(
    (sum, chart) => sum + (chart.appointment_duration_minutes ?? 0),
    0
  );
  const durationCount = charts.filter(
    (chart) => typeof chart.appointment_duration_minutes === "number"
  ).length;
  const latestChart = charts[0];
  const latestArea = getPrimaryChartTreatmentArea(latestChart);
  const photoCount = charts.reduce((sum, chart) => sum + chart.image_urls.length, 0);
  const noteCount = charts.filter((chart) =>
    Boolean(
      chart.treatment_summary ||
        chart.notes ||
        getPrimaryChartTreatmentArea(chart)?.notes
    )
  ).length;
  const photoChartCount = charts.filter((chart) => chart.image_urls.length > 0).length;

  return {
    totalTimeLabel: formatMinutes(totalMinutes),
    averageDurationLabel:
      durationCount > 0 ? `${Math.round(totalMinutes / durationCount)} min` : "—",
    photoCount,
    latestTitle: latestArea?.treatment_area || latestChart.treatment_area || "Treatment",
    latestMeta: [
      latestArea?.modality ?? latestChart.modality,
      formatShortDate(latestChart.created_at)
    ]
      .filter(Boolean)
      .join(" • "),
    latestSettings: buildLatestSettings(latestChart),
    areaBreakdown: buildBreakdown(charts, "area"),
    modalityBreakdown: buildBreakdown(charts, "modality"),
    notesCoverageLabel: formatPercent(noteCount, charts.length),
    photoCoverageLabel: formatPercent(photoChartCount, charts.length)
  };
}

function buildLatestSettings(chart: ChartEntryRecord) {
  const area = getPrimaryChartTreatmentArea(chart);
  const modality = area?.modality ?? chart.modality ?? "";

  return [
    area?.probe ?? chart.probe,
    modalityUsesRf(modality) && typeof area?.rf_level === "number"
      ? `${area.rf_level.toFixed(1)} RF`
      : null,
    modalityUsesDc(modality) && typeof area?.dc_level === "number"
      ? `${area.dc_level.toFixed(1)} DC`
      : null,
    typeof area?.treatment_seconds === "number"
      ? `${area.treatment_seconds} sec`
      : null
  ].filter((value): value is string => Boolean(value));
}

function buildBreakdown(charts: ChartEntryRecord[], key: "area" | "modality") {
  const counts = new Map<string, number>();

  charts.forEach((chart) => {
    getChartTreatmentAreas(chart).forEach((area) => {
      const label = key === "area" ? area.treatment_area : area.modality;

      if (!label) {
        return;
      }

      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function formatMinutes(minutes: number) {
  if (minutes <= 0) {
    return "—";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function formatPercent(count: number, total: number) {
  return total > 0 ? `${Math.round((count / total) * 100)}%` : "—";
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}
