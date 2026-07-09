import type { SupabaseClient } from "@supabase/supabase-js";

type DemoClientEmail =
  | "avery.cruz@example.com"
  | "jordan.lee@example.com";

type DemoPhotoSeed = {
  clientEmail: DemoClientEmail;
  fileName: string;
  caption: string;
  takenAtOffsetDays: number;
  base64Jpeg: string;
};

type DemoClientRecord = {
  id: string;
  email: DemoClientEmail;
};

type DemoChartRecord = {
  id: string;
  client_id: string;
};

type DemoPhotoTarget = {
  photo: DemoPhotoSeed;
  clientId: string;
  chartId: string;
};

const demoPhotos: DemoPhotoSeed[] = [
  {
    clientEmail: "avery.cruz@example.com",
    fileName: "upper-lip-baseline.jpg",
    caption: "Demo baseline photo",
    takenAtOffsetDays: 1,
    base64Jpeg:
      "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"
  },
  {
    clientEmail: "avery.cruz@example.com",
    fileName: "upper-lip-followup.jpg",
    caption: "Demo follow-up photo",
    takenAtOffsetDays: 1,
    base64Jpeg:
      "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"
  },
  {
    clientEmail: "jordan.lee@example.com",
    fileName: "chin-followup.jpg",
    caption: "Demo follow-up photo",
    takenAtOffsetDays: 3,
    base64Jpeg:
      "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"
  }
];

/**
 * Adds clearly synthetic mock images to seeded demo charts. This keeps demo
 * media in the same private storage + chart_images path as real photos.
 */
export async function ensureDemoChartMedia(
  client: SupabaseClient,
  organizationId: string
) {
  const { data: demoClients, error: clientsError } = await client
    .from("clients")
    .select("id, email")
    .eq("organization_id", organizationId)
    .in("email", Array.from(new Set(demoPhotos.map((photo) => photo.clientEmail))));

  if (clientsError) {
    throw clientsError;
  }

  const typedClients = (demoClients ?? []) as DemoClientRecord[];

  if (typedClients.length === 0) {
    return seedPhotosForRecentCharts(client, organizationId);
  }

  const { data: charts, error: chartsError } = await client
    .from("chart_entries")
    .select("id, client_id")
    .eq("organization_id", organizationId)
    .in(
      "client_id",
      typedClients.map((record) => record.id)
    )
    .order("created_at", { ascending: false });

  if (chartsError) {
    throw chartsError;
  }

  const chartsByClientId = new Map<string, DemoChartRecord>();

  for (const chart of (charts ?? []) as DemoChartRecord[]) {
    if (!chartsByClientId.has(chart.client_id)) {
      chartsByClientId.set(chart.client_id, chart);
    }
  }

  let photosSeeded = 0;

  for (const photo of demoPhotos) {
    const demoClient = typedClients.find(
      (record) => record.email === photo.clientEmail
    );
    const chart = demoClient ? chartsByClientId.get(demoClient.id) : null;

    if (!demoClient || !chart) {
      continue;
    }

    photosSeeded += await seedDemoPhoto(client, organizationId, {
      photo,
      clientId: demoClient.id,
      chartId: chart.id
    });
  }

  return { photos_seeded: photosSeeded };
}

async function seedPhotosForRecentCharts(
  client: SupabaseClient,
  organizationId: string
) {
  const { data: charts, error } = await client
    .from("chart_entries")
    .select("id, client_id")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(2);

  if (error) {
    throw error;
  }

  const recentCharts = (charts ?? []) as DemoChartRecord[];
  const primaryChart = recentCharts[0];
  const secondaryChart = recentCharts[1] ?? primaryChart;

  if (!primaryChart) {
    return { photos_seeded: 0 };
  }

  const targets: DemoPhotoTarget[] = [
    {
      photo: demoPhotos[0],
      clientId: primaryChart.client_id,
      chartId: primaryChart.id
    },
    {
      photo: demoPhotos[1],
      clientId: primaryChart.client_id,
      chartId: primaryChart.id
    },
    {
      photo: demoPhotos[2],
      clientId: secondaryChart.client_id,
      chartId: secondaryChart.id
    }
  ];

  let photosSeeded = 0;

  for (const target of targets) {
    photosSeeded += await seedDemoPhoto(client, organizationId, target);
  }

  return { photos_seeded: photosSeeded };
}

async function seedDemoPhoto(
  client: SupabaseClient,
  organizationId: string,
  target: DemoPhotoTarget
) {
  const storagePath = [
    "organizations",
    organizationId,
    "clients",
    target.clientId,
    "demo-images",
    target.photo.fileName
  ].join("/");

  const { data: existingImage, error: existingError } = await client
    .from("chart_images")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("client_id", target.clientId)
    .eq("chart_entry_id", target.chartId)
    .eq("storage_path", storagePath)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingImage) {
    return 0;
  }

  const { error: uploadError } = await client.storage
    .from("client-media")
    .upload(storagePath, decodeBase64Jpeg(target.photo.base64Jpeg), {
      contentType: "image/jpeg",
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  const takenAt = new Date(
    Date.now() - target.photo.takenAtOffsetDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error: insertError } = await client.from("chart_images").insert({
    organization_id: organizationId,
    client_id: target.clientId,
    chart_entry_id: target.chartId,
    storage_path: storagePath,
    caption: target.photo.caption,
    taken_at: takenAt
  });

  if (insertError) {
    throw insertError;
  }

  return 1;
}

function decodeBase64Jpeg(value: string) {
  const binary = globalThis.atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}
