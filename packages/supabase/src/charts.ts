import type { SupabaseClient } from "@supabase/supabase-js";

import {
  listChartImagePaths,
  resolveChartImageUrls,
  syncChartImages
} from "./media";
import type {
  ChartEntryInput,
  ChartEntryRecord,
  ChartTreatmentAreaInput,
  ChartTreatmentAreaRecord
} from "./types";

/**
 * Loads chart entries for one client in reverse chronological order so the
 * journal experience matches the Swift app's "latest first" behavior.
 */
export async function listClientCharts(
  client: SupabaseClient,
  organizationId: string,
  clientId: string
) {
  const { data, error } = await client
    .from("chart_entries")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as ChartEntryRecord[];
  return hydrateCharts(client, organizationId, rows);
}

async function hydrateCharts(
  client: SupabaseClient,
  organizationId: string,
  rows: ChartEntryRecord[]
) {
  const imagePathsByChartId = await listChartImagePaths(client, {
    organizationId,
    chartEntryIds: rows.map((row) => row.id)
  });
  const treatmentAreasByChartId = await listChartTreatmentAreas(client, {
    organizationId,
    chartEntryIds: rows.map((row) => row.id)
  });

  const resolvedCharts = await Promise.all(
    rows.map(async (row) => {
      const imagePaths =
        imagePathsByChartId.get(row.id) ??
        row.image_urls.filter((value) => Boolean(value));
      const imageUrls = await resolveChartImageUrls(client, imagePaths);

      return {
        ...row,
        treatment_areas: treatmentAreasByChartId.get(row.id) ?? [],
        image_paths: imagePaths,
        image_urls: imageUrls
      };
    })
  );

  return resolvedCharts;
}

async function listChartTreatmentAreas(
  client: SupabaseClient,
  {
    organizationId,
    chartEntryIds
  }: {
    organizationId: string;
    chartEntryIds: string[];
  }
) {
  if (chartEntryIds.length === 0) {
    return new Map<string, ChartTreatmentAreaRecord[]>();
  }

  const { data, error } = await client
    .from("chart_entry_treatment_areas")
    .select("*")
    .eq("organization_id", organizationId)
    .in("chart_entry_id", chartEntryIds)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const areasByChartId = new Map<string, ChartTreatmentAreaRecord[]>();

  for (const area of (data ?? []) as ChartTreatmentAreaRecord[]) {
    const currentAreas = areasByChartId.get(area.chart_entry_id) ?? [];
    currentAreas.push(area);
    areasByChartId.set(area.chart_entry_id, currentAreas);
  }

  return areasByChartId;
}

function sanitizeChartInput(input: ChartEntryInput) {
  const primaryArea = getPrimaryTreatmentAreaInput(input);

  return {
    organization_id: input.organizationId,
    client_id: input.clientId,
    treatment_area:
      primaryArea?.treatmentArea.trim() || input.treatmentArea?.trim() || null,
    modality: primaryArea?.modality?.trim() || input.modality?.trim() || null,
    rf_level:
      typeof primaryArea?.rfLevel === "number" && Number.isFinite(primaryArea.rfLevel)
        ? primaryArea.rfLevel
        : typeof input.rfLevel === "number" && Number.isFinite(input.rfLevel)
          ? input.rfLevel
          : null,
    dc_level:
      typeof primaryArea?.dcLevel === "number" && Number.isFinite(primaryArea.dcLevel)
        ? primaryArea.dcLevel
        : typeof input.dcLevel === "number" && Number.isFinite(input.dcLevel)
          ? input.dcLevel
          : null,
    treatment_seconds:
      typeof primaryArea?.treatmentSeconds === "number" &&
      Number.isFinite(primaryArea.treatmentSeconds)
        ? primaryArea.treatmentSeconds
        : typeof input.treatmentSeconds === "number" &&
            Number.isFinite(input.treatmentSeconds)
          ? input.treatmentSeconds
          : null,
    appointment_duration_minutes:
      typeof input.appointmentDurationMinutes === "number" &&
      Number.isFinite(input.appointmentDurationMinutes)
        ? input.appointmentDurationMinutes
        : null,
    probe: primaryArea?.probe?.trim() || input.probe?.trim() || null,
    probe_is_one_piece: primaryArea?.probeIsOnePiece ?? input.probeIsOnePiece ?? true,
    treatment_summary: input.treatmentSummary?.trim() || null,
    notes: input.notes?.trim() || null,
    tags: input.tags ?? [],
    image_urls: input.imagePaths ?? []
  };
}

function getPrimaryTreatmentAreaInput(input: ChartEntryInput) {
  return input.treatmentAreas?.[0] ?? null;
}

function resolveTreatmentAreaInputs(input: ChartEntryInput) {
  if (input.treatmentAreas && input.treatmentAreas.length > 0) {
    return input.treatmentAreas;
  }

  if (!input.treatmentArea) {
    return [];
  }

  return [
    {
      treatmentArea: input.treatmentArea,
      modality: input.modality,
      rfLevel: input.rfLevel,
      dcLevel: input.dcLevel,
      treatmentSeconds: input.treatmentSeconds,
      probe: input.probe,
      probeIsOnePiece: input.probeIsOnePiece,
      notes: input.notes
    }
  ];
}

function sanitizeTreatmentAreaInput({
  chartEntryId,
  organizationId,
  clientId,
  sortOrder,
  area
}: {
  chartEntryId: string;
  organizationId: string;
  clientId: string;
  sortOrder: number;
  area: ChartTreatmentAreaInput;
}) {
  return {
    chart_entry_id: chartEntryId,
    organization_id: organizationId,
    client_id: clientId,
    sort_order: sortOrder,
    treatment_area: area.treatmentArea.trim(),
    modality: area.modality?.trim() || null,
    rf_level:
      typeof area.rfLevel === "number" && Number.isFinite(area.rfLevel)
        ? area.rfLevel
        : null,
    dc_level:
      typeof area.dcLevel === "number" && Number.isFinite(area.dcLevel)
        ? area.dcLevel
        : null,
    treatment_seconds:
      typeof area.treatmentSeconds === "number" &&
      Number.isFinite(area.treatmentSeconds)
        ? area.treatmentSeconds
        : null,
    probe: area.probe?.trim() || null,
    probe_is_one_piece: area.probeIsOnePiece ?? true,
    notes: area.notes?.trim() || null
  };
}

async function syncChartTreatmentAreas(
  client: SupabaseClient,
  chartId: string,
  input: ChartEntryInput
) {
  const { error: deleteError } = await client
    .from("chart_entry_treatment_areas")
    .delete()
    .eq("chart_entry_id", chartId)
    .eq("organization_id", input.organizationId)
    .eq("client_id", input.clientId);

  if (deleteError) {
    throw deleteError;
  }

  const treatmentAreas = resolveTreatmentAreaInputs(input).map((area, index) =>
    sanitizeTreatmentAreaInput({
      chartEntryId: chartId,
      organizationId: input.organizationId,
      clientId: input.clientId,
      sortOrder: index,
      area
    })
  );

  if (treatmentAreas.length === 0) {
    return;
  }

  const { error: insertError } = await client
    .from("chart_entry_treatment_areas")
    .insert(treatmentAreas);

  if (insertError) {
    throw insertError;
  }
}

/**
 * Creates a chart entry using the rebuilt v2 schema.
 */
export async function createChartEntry(
  client: SupabaseClient,
  input: ChartEntryInput
) {
  const { data, error } = await client
    .from("chart_entries")
    .insert(sanitizeChartInput(input))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  await syncChartImages(client, {
    organizationId: input.organizationId,
    clientId: input.clientId,
    chartEntryId: data.id,
    storagePaths: input.imagePaths ?? []
  });
  await syncChartTreatmentAreas(client, data.id, input);

  const [hydratedChart] = await hydrateCharts(client, input.organizationId, [
    data as ChartEntryRecord
  ]);

  return hydratedChart;
}

/**
 * Updates an existing chart entry while keeping the shared form logic outside
 * the platform-specific screens.
 */
export async function updateChartEntry(
  client: SupabaseClient,
  chartId: string,
  input: ChartEntryInput
) {
  const { data, error } = await client
    .from("chart_entries")
    .update(sanitizeChartInput(input))
    .eq("id", chartId)
    .eq("organization_id", input.organizationId)
    .eq("client_id", input.clientId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  await syncChartImages(client, {
    organizationId: input.organizationId,
    clientId: input.clientId,
    chartEntryId: chartId,
    storagePaths: input.imagePaths ?? []
  });
  await syncChartTreatmentAreas(client, chartId, input);

  const [hydratedChart] = await hydrateCharts(client, input.organizationId, [
    data as ChartEntryRecord
  ]);

  return hydratedChart;
}

/**
 * Removes a chart entry from the client journal.
 */
export async function deleteChartEntry(
  client: SupabaseClient,
  organizationId: string,
  clientId: string,
  chartId: string
) {
  const { error } = await client
    .from("chart_entries")
    .delete()
    .eq("id", chartId)
    .eq("organization_id", organizationId)
    .eq("client_id", clientId);

  if (error) {
    throw error;
  }
}
