import type { SupabaseClient } from "@supabase/supabase-js";

type DemoSeedClient = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  email: string | null;
};

type DemoHistoryScenario = {
  daysAgo: number;
  durationMinutes: number;
  area: string;
  modality: string;
  probe: string;
  rfLevel: number | null;
  dcLevel: number | null;
  treatmentSeconds: number;
  summary: string;
  notes: string;
  tags: string[];
};

const demoHistoryTag = "demo-history";

const demoHistoryScenarios: DemoHistoryScenario[] = [
  {
    daysAgo: 42,
    durationMinutes: 60,
    area: "Upper lip",
    modality: "Blend",
    probe: "F3 Insulated",
    rfLevel: 0.7,
    dcLevel: 0.2,
    treatmentSeconds: 3,
    summary: "Baseline upper lip session with conservative settings.",
    notes: "Mild redness. Client tolerated Blend well with shorter insertions.",
    tags: ["baseline", "photo-ready", demoHistoryTag]
  },
  {
    daysAgo: 28,
    durationMinutes: 75,
    area: "Upper lip",
    modality: "Blend",
    probe: "F4 Gold",
    rfLevel: 0.8,
    dcLevel: 0.3,
    treatmentSeconds: 3,
    summary: "Improved release after moving to F4 Gold.",
    notes: "Good follicle release. Slight warmth reported near center line.",
    tags: ["good-release", "watch-redness", demoHistoryTag]
  },
  {
    daysAgo: 14,
    durationMinutes: 45,
    area: "Chin",
    modality: "Thermolysis",
    probe: "F3 Insulated",
    rfLevel: 1.1,
    dcLevel: null,
    treatmentSeconds: 2,
    summary: "Shorter chin session focused on comfort.",
    notes: "Reduced RF after first pass. Comfort improved immediately.",
    tags: ["sensitivity", "settings-adjusted", demoHistoryTag]
  },
  {
    daysAgo: 3,
    durationMinutes: 90,
    area: "Jawline",
    modality: "Galvanic",
    probe: "F4 Gold",
    rfLevel: null,
    dcLevel: 0.4,
    treatmentSeconds: 4,
    summary: "Longer jawline session with stable galvanic settings.",
    notes: "Slow but consistent release. Good aftercare adherence.",
    tags: ["stable-settings", "follow-up", demoHistoryTag]
  }
];

/**
 * Creates longitudinal demo charts so Clinical Memory, recent activity, and
 * photo comparison have realistic history to display during demos.
 */
export async function ensureDemoChartHistory(
  client: SupabaseClient,
  organizationId: string
) {
  const seedClients = await listDemoSeedClients(client, organizationId);
  let chartsSeeded = 0;

  for (const seedClient of seedClients) {
    const alreadySeeded = await hasDemoHistory(client, organizationId, seedClient.id);

    if (alreadySeeded) {
      continue;
    }

    chartsSeeded += await seedClientHistory(client, organizationId, seedClient.id);
  }

  return { charts_seeded: chartsSeeded };
}

async function listDemoSeedClients(
  client: SupabaseClient,
  organizationId: string
) {
  const { data: preferredDemoClients, error: preferredError } = await client
    .from("clients")
    .select("id, first_name, last_name, preferred_name, email")
    .eq("organization_id", organizationId)
    .is("archived_at", null)
    .in("email", [
      "avery.cruz@example.com",
      "jordan.lee@example.com",
      "maya.thompson@example.com"
    ])
    .limit(3);

  if (preferredError) {
    throw preferredError;
  }

  if ((preferredDemoClients ?? []).length > 0) {
    return preferredDemoClients as DemoSeedClient[];
  }

  const { data: fallbackClients, error: fallbackError } = await client
    .from("clients")
    .select("id, first_name, last_name, preferred_name, email")
    .eq("organization_id", organizationId)
    .is("archived_at", null)
    .order("created_at", { ascending: true })
    .limit(3);

  if (fallbackError) {
    throw fallbackError;
  }

  return (fallbackClients ?? []) as DemoSeedClient[];
}

async function hasDemoHistory(
  client: SupabaseClient,
  organizationId: string,
  clientId: string
) {
  const { count, error } = await client
    .from("chart_entries")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("client_id", clientId)
    .contains("tags", [demoHistoryTag]);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}

async function seedClientHistory(
  client: SupabaseClient,
  organizationId: string,
  clientId: string
) {
  let chartsSeeded = 0;

  for (const [index, scenario] of demoHistoryScenarios.entries()) {
    const createdAt = new Date(
      Date.now() - scenario.daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: chart, error: chartError } = await client
      .from("chart_entries")
      .insert({
        organization_id: organizationId,
        client_id: clientId,
        treatment_area: scenario.area,
        modality: scenario.modality,
        rf_level: scenario.rfLevel,
        dc_level: scenario.dcLevel,
        treatment_seconds: scenario.treatmentSeconds,
        appointment_duration_minutes: scenario.durationMinutes,
        probe: scenario.probe,
        probe_is_one_piece: true,
        treatment_summary: scenario.summary,
        notes: scenario.notes,
        tags: scenario.tags,
        created_at: createdAt,
        updated_at: createdAt
      })
      .select("id")
      .single();

    if (chartError) {
      throw chartError;
    }

    const { error: areaError } = await client
      .from("chart_entry_treatment_areas")
      .insert({
        chart_entry_id: chart.id,
        organization_id: organizationId,
        client_id: clientId,
        sort_order: index,
        treatment_area: scenario.area,
        modality: scenario.modality,
        rf_level: scenario.rfLevel,
        dc_level: scenario.dcLevel,
        treatment_seconds: scenario.treatmentSeconds,
        probe: scenario.probe,
        probe_is_one_piece: true,
        notes: scenario.notes,
        created_at: createdAt,
        updated_at: createdAt
      });

    if (areaError) {
      throw areaError;
    }

    chartsSeeded += 1;
  }

  return chartsSeeded;
}
