import type { SupabaseClient } from "@supabase/supabase-js";

import {
  listChartImagePaths,
  resolveChartImageUrls,
  syncChartImages
} from "./media";
import type { ChartEntryInput, ChartEntryRecord } from "./types";

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
  const imagePathsByChartId = await listChartImagePaths(client, {
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
        image_paths: imagePaths,
        image_urls: imageUrls
      };
    })
  );

  return resolvedCharts;
}

function sanitizeChartInput(input: ChartEntryInput) {
  return {
    organization_id: input.organizationId,
    client_id: input.clientId,
    treatment_area: input.treatmentArea?.trim() || null,
    modality: input.modality?.trim() || null,
    rf_level:
      typeof input.rfLevel === "number" && Number.isFinite(input.rfLevel)
        ? input.rfLevel
        : null,
    dc_level:
      typeof input.dcLevel === "number" && Number.isFinite(input.dcLevel)
        ? input.dcLevel
        : null,
    treatment_seconds:
      typeof input.treatmentSeconds === "number" &&
      Number.isFinite(input.treatmentSeconds)
        ? input.treatmentSeconds
        : null,
    probe: input.probe?.trim() || null,
    probe_is_one_piece: input.probeIsOnePiece ?? true,
    treatment_summary: input.treatmentSummary?.trim() || null,
    notes: input.notes?.trim() || null,
    tags: input.tags ?? [],
    image_urls: input.imagePaths ?? []
  };
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

  return data as ChartEntryRecord;
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

  return data as ChartEntryRecord;
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
