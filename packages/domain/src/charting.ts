import type { ChartEntryRecord, ChartTreatmentAreaRecord } from "./types";

export const chartModalities = ["Thermolysis", "Galvanic", "Blend"] as const;

export type ChartModality = (typeof chartModalities)[number];

export const probeShankOptions = ["F", "K"] as const;
export const probeSizeOptions = ["1", "2", "3", "4", "5"] as const;
export const probeMaterialOptions = [
  "Stainless",
  "Insulated",
  "Gold"
] as const;

export const treatmentAreaOptions = [
  "Upper lip",
  "Chin",
  "Neck",
  "Cheeks",
  "Jawline",
  "Sideburns",
  "Chest",
  "Abdomen",
  "Bikini",
  "Genitals / surgical prep",
  "Legs",
  "Arms",
  "Other"
] as const;

export const appointmentDurationPresets = [
  15,
  30,
  45,
  60,
  75,
  90,
  120
] as const;

export type AppointmentDurationPreset =
  (typeof appointmentDurationPresets)[number];

export type ChartImageDraft = {
  storagePath: string;
  previewUrl: string;
};

export function isAppointmentDurationPreset(
  value: number | null | undefined
): value is AppointmentDurationPreset {
  return appointmentDurationPresets.some((preset) => preset === value);
}

export function modalityUsesRf(modality: string) {
  return modality === "Thermolysis" || modality === "Blend";
}

export function modalityUsesDc(modality: string) {
  return modality === "Galvanic" || modality === "Blend";
}

export function getChartTreatmentAreas(chart: ChartEntryRecord) {
  if (chart.treatment_areas && chart.treatment_areas.length > 0) {
    return chart.treatment_areas;
  }

  if (
    !chart.treatment_area &&
    !chart.modality &&
    !chart.probe &&
    typeof chart.rf_level !== "number" &&
    typeof chart.dc_level !== "number" &&
    typeof chart.treatment_seconds !== "number"
  ) {
    return [];
  }

  return [
    {
      id: `${chart.id}:legacy-area`,
      chart_entry_id: chart.id,
      organization_id: chart.organization_id,
      client_id: chart.client_id,
      sort_order: 0,
      treatment_area: chart.treatment_area || "Area not recorded",
      modality: chart.modality,
      rf_level: chart.rf_level,
      dc_level: chart.dc_level,
      treatment_seconds: chart.treatment_seconds,
      probe: chart.probe,
      probe_is_one_piece: chart.probe_is_one_piece,
      notes: chart.notes,
      created_at: chart.created_at,
      updated_at: chart.updated_at
    }
  ];
}

export function getPrimaryChartTreatmentArea(
  chart: ChartEntryRecord
): ChartTreatmentAreaRecord | null {
  return getChartTreatmentAreas(chart)[0] ?? null;
}

export function resolveTreatmentAreaState(value: string | null | undefined) {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return {
      selection: "",
      otherValue: ""
    };
  }

  const matchedOption = treatmentAreaOptions.find(
    (option) => option.toLowerCase() === trimmedValue.toLowerCase()
  );

  if (matchedOption && matchedOption !== "Other") {
    return {
      selection: matchedOption,
      otherValue: ""
    };
  }

  return {
    selection: "Other",
    otherValue: trimmedValue
  };
}

export function resolveTreatmentAreaValue(
  selection: string,
  otherValue: string
) {
  if (selection === "Other") {
    return otherValue.trim();
  }

  return selection.trim();
}

export function formatProbeName({
  shank,
  size,
  material
}: {
  shank: string;
  size: string;
  material: string;
}) {
  if (!shank || !size || !material) {
    return "";
  }

  return `${shank}${size} ${material}`.trim();
}

export function parseProbeName(value: string | null | undefined) {
  const trimmedValue = value?.trim() ?? "";
  const match = trimmedValue.match(/^([FK])\s?([1-5])\s+(.+)$/i);

  if (!match) {
    return {
      shank: "F",
      size: "3",
      material: "Gold"
    };
  }

  const [, rawShank, rawSize, rawMaterial] = match;
  const normalizedMaterial = probeMaterialOptions.find(
    (option) => option.toLowerCase() === rawMaterial.toLowerCase()
  );

  return {
    shank: rawShank.toUpperCase(),
    size: rawSize,
    material: normalizedMaterial ?? "Gold"
  };
}
