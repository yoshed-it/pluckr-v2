import type { ChartEntryRecord } from "@pluckr/domain";

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
    const sameAreaEntry = eligibleEntries.find(
      (entry) => normalizeTreatmentArea(entry.treatment_area) === normalizedArea
    );

    if (sameAreaEntry) {
      return sameAreaEntry;
    }
  }

  return eligibleEntries[0] ?? null;
}
