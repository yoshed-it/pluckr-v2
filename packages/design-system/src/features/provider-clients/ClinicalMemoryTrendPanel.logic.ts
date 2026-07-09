import {
  getChartTreatmentAreas,
  type ChartEntryRecord,
  type ChartTreatmentAreaRecord
} from "@pluckr/domain";

export type MetricKey = "rf" | "dc" | "seconds" | "duration";

export type TrendPoint = {
  chart: ChartEntryRecord;
  area: ChartTreatmentAreaRecord | null;
  date: Date;
  value: number;
};

export const trendMetrics: Array<{
  key: MetricKey;
  label: string;
  suffix: string;
}> = [
  { key: "rf", label: "RF", suffix: "RF" },
  { key: "dc", label: "DC", suffix: "DC" },
  { key: "seconds", label: "Seconds", suffix: "sec" },
  { key: "duration", label: "Duration", suffix: "min" }
];

export function buildAreaOptions(charts: ChartEntryRecord[]) {
  const areas = new Set<string>();
  charts.forEach((chart) =>
    getChartTreatmentAreas(chart).forEach((area) => areas.add(area.treatment_area))
  );
  return ["All", ...Array.from(areas).slice(0, 6)];
}

export function buildTrendPoints(
  charts: ChartEntryRecord[],
  selectedArea: string,
  metric: MetricKey
) {
  return charts
    .flatMap((chart) => {
      const areas = getChartTreatmentAreas(chart);
      const matchingAreas =
        selectedArea === "All"
          ? [areas[0] ?? null]
          : areas.filter((area) => area.treatment_area === selectedArea);

      return matchingAreas.map((area): TrendPoint | null => {
        const value = getMetricValue(chart, area, metric);
        return typeof value === "number"
          ? { chart, area, date: new Date(chart.created_at), value }
          : null;
      });
    })
    .filter(isTrendPoint)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function averageTrend(points: TrendPoint[]) {
  return points.reduce((sum, point) => sum + point.value, 0) / points.length;
}

export function formatTrendValue(value: number, suffix: string) {
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${formatted} ${suffix}`;
}

export function formatTrendDelta(value: number, suffix: string) {
  if (value === 0) {
    return `0 ${suffix}`;
  }

  return `${value > 0 ? "+" : ""}${formatTrendValue(value, suffix)}`;
}

function isTrendPoint(point: TrendPoint | null): point is TrendPoint {
  return point !== null;
}

function getMetricValue(
  chart: ChartEntryRecord,
  area: ChartTreatmentAreaRecord | null,
  metric: MetricKey
) {
  if (metric === "duration") {
    return chart.appointment_duration_minutes;
  }

  if (metric === "rf") {
    return area?.rf_level ?? chart.rf_level;
  }

  if (metric === "dc") {
    return area?.dc_level ?? chart.dc_level;
  }

  return area?.treatment_seconds ?? chart.treatment_seconds;
}
