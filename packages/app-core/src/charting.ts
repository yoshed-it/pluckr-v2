import {
  getChartTreatmentAreas,
  type ChartEntryRecord,
  type ChartTreatmentAreaRecord
} from "@pluckr/domain";

export * from "@pluckr/domain";

function normalizeTreatmentArea(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

/**
 * Finds the prior treatment that is most useful as read-only charting context.
 *
 * The selector never copies values into the active form. It prefers the latest
 * same-area treatment when an area is selected, then falls back to the latest
 * eligible chart for the client.
 */
export function selectPreviousChartReference(
  entries: ChartEntryRecord[],
  currentTreatmentArea: string,
  excludedChartId: string | null
): ChartEntryRecord | null {
  const eligibleEntries = entries.filter((entry) => entry.id !== excludedChartId);
  const normalizedArea = normalizeTreatmentArea(currentTreatmentArea);

  if (normalizedArea) {
    for (const entry of eligibleEntries) {
      const sameArea = getChartTreatmentAreas(entry).find(
        (area) => normalizeTreatmentArea(area.treatment_area) === normalizedArea
      );

      if (sameArea) {
        return createTreatmentAreaReference(entry, sameArea);
      }
    }
  }

  const fallbackEntry = eligibleEntries[0] ?? null;

  if (!fallbackEntry) {
    return null;
  }

  return createTreatmentAreaReference(
    fallbackEntry,
    getChartTreatmentAreas(fallbackEntry)[0] ?? null
  );
}

function createTreatmentAreaReference(
  entry: ChartEntryRecord,
  area: ChartTreatmentAreaRecord | null
): ChartEntryRecord {
  if (!area) {
    return entry;
  }

  return {
    ...entry,
    treatment_area: area.treatment_area,
    modality: area.modality,
    rf_level: area.rf_level,
    dc_level: area.dc_level,
    treatment_seconds: area.treatment_seconds,
    probe: area.probe,
    probe_is_one_piece: area.probe_is_one_piece,
    notes: area.notes
  };
}
