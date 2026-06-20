import type { SupabaseClient } from "@supabase/supabase-js";

type UploadChartImageInput = {
  organizationId: string;
  clientId: string;
  fileName: string;
  mimeType: string;
  bytes: ArrayBuffer;
};

type UploadedChartImage = {
  storagePath: string;
  signedUrl: string;
};

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function createUploadId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function createSignedUrls(
  client: SupabaseClient,
  storagePaths: string[]
) {
  if (storagePaths.length === 0) {
    return [];
  }

  const { data, error } = await client.storage
    .from("client-media")
    .createSignedUrls(storagePaths, 60 * 60);

  if (error) {
    throw error;
  }

  return data.map((entry) => entry.signedUrl);
}

/**
 * Uploads one chart image into the private client-media bucket and returns the
 * storage path plus a temporary signed URL for immediate preview.
 */
export async function uploadChartImage(
  client: SupabaseClient,
  input: UploadChartImageInput
): Promise<UploadedChartImage> {
  const storagePath = [
    "organizations",
    input.organizationId,
    "clients",
    input.clientId,
    "draft-images",
    `${createUploadId()}-${sanitizeFileName(input.fileName)}`
  ].join("/");

  const { error } = await client.storage
    .from("client-media")
    .upload(storagePath, input.bytes, {
      contentType: input.mimeType,
      upsert: false
    });

  if (error) {
    throw error;
  }

  const [signedUrl] = await createSignedUrls(client, [storagePath]);

  return {
    storagePath,
    signedUrl: signedUrl ?? storagePath
  };
}

/**
 * Deletes one uploaded chart image from private storage.
 */
export async function deleteChartImage(
  client: SupabaseClient,
  storagePath: string
) {
  const { error } = await client.storage
    .from("client-media")
    .remove([storagePath]);

  if (error) {
    throw error;
  }
}

/**
 * Resolves stored private-media paths into signed URLs so the shared UI can
 * render images without leaking storage implementation details.
 */
export async function resolveChartImageUrls(
  client: SupabaseClient,
  storagePaths: string[]
) {
  const privatePaths = storagePaths.filter((path) => !/^https?:\/\//.test(path));
  const signedUrls = await createSignedUrls(client, privatePaths);
  const signedUrlMap = new Map(
    privatePaths.map((path, index) => [path, signedUrls[index] ?? path])
  );

  return storagePaths.map((path) =>
    /^https?:\/\//.test(path) ? path : signedUrlMap.get(path) ?? path
  );
}

/**
 * Keeps the relational chart_images table in sync with the chart entry's image
 * paths so later gallery and reporting work can rely on explicit rows.
 */
export async function syncChartImages(
  client: SupabaseClient,
  input: {
    organizationId: string;
    clientId: string;
    chartEntryId: string;
    storagePaths: string[];
  }
) {
  const { error: deleteError } = await client
    .from("chart_images")
    .delete()
    .eq("organization_id", input.organizationId)
    .eq("client_id", input.clientId)
    .eq("chart_entry_id", input.chartEntryId);

  if (deleteError) {
    throw deleteError;
  }

  if (input.storagePaths.length === 0) {
    return;
  }

  const { error: insertError } = await client.from("chart_images").insert(
    input.storagePaths.map((storagePath) => ({
      organization_id: input.organizationId,
      client_id: input.clientId,
      chart_entry_id: input.chartEntryId,
      storage_path: storagePath
    }))
  );

  if (insertError) {
    throw insertError;
  }
}

export async function listChartImagePaths(
  client: SupabaseClient,
  input: {
    organizationId: string;
    chartEntryIds: string[];
  }
) {
  if (input.chartEntryIds.length === 0) {
    return new Map<string, string[]>();
  }

  const { data, error } = await client
    .from("chart_images")
    .select("chart_entry_id, storage_path")
    .eq("organization_id", input.organizationId)
    .in("chart_entry_id", input.chartEntryIds);

  if (error) {
    throw error;
  }

  const pathsByChartId = new Map<string, string[]>();

  for (const row of data ?? []) {
    const existing = pathsByChartId.get(row.chart_entry_id) ?? [];
    existing.push(row.storage_path);
    pathsByChartId.set(row.chart_entry_id, existing);
  }

  return pathsByChartId;
}
