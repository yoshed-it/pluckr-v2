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
      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCABkAKADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAECAwUE/8QAMBAAAgIABQMDBAECBwAAAAAAAAECEQMSMVGRBCFxIkFCBRNSYRUGFCQzNGKCocH/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EABgRAQEBAQEAAAAAAAAAAAAAAAABEgIR/9oADAMBAAIRAxEAPwDrh39lyDWnkqjyPcXq2XI/VsuSqHQEerZcjqWy5LoKAmpbLkKlsuTRRbHkIM6lsuQ9Wy5Ncg8iKMfVsuQqWy5NsiFkQGNS2XIVLZcm2QlwYGVS2XIvVsuTVqhUBn6tlyL1bLk0oVAZ99uGGpdEV6mEU13j5KSE9Y+SkgoSHQ0i4x3IJUbLUUiqHRQqCgUXnbzOmtC6IM1GWd21lrsqKoqh0BFBRdCoCKCi6FQEUS4bGlCooxaolo2aIlGiDNomvU/CNGiPk/CKG9Y+SiXrHyWiCor3NEJDRQppuNRV3+6K9Skkkstd3fcaGQA6GhoBUOgbyxb23HC3BOSVtewVDzZ0kllruxl0Zynh4XZtRvuEOhUNNSSadpikrTW4E2no0xMUMP7d97spgSyWimJlGTVMj5PwjWaMvk/CAHrHz/4WtUQ9Y+S0QaoU5rDjcv8AoE7Q5RU1UlaKKhJTipLRlExSikkqSKIKQ0SgzNTUcrprUDTXUZmpptpO2tRqVtrYKsyxMGGJJOV9i7JlbXpaT/YD0VIQ7JYQpNRVt0kK7Vob7ruJgJksbI+5FycU++xQS0Mvk/CNJsy+T8IBPWPktGb1j5LTA0i/YtGI44sXLLfcDZMpMhMdgXY7IsdkFIdkWJJKTl3tqtQNLCybFYFd3orDLL8Xwe3okvtZq7t6npNzli9ORll+L4E4y/F8Hvw/qPRY0JzwurwJxhHPKUcRNRju+/ZBD6h0eIouHV4ElKSgqxE7k9F5/Rcptz3GX4vgy+xlm55ZX4OvPq+ng8VTx8OLwUniJzXoT0vYMLqMLqYfcwMWGJC6zQkmuUMm3GlafdNeSPk/COp9QjF4GZrun2Zyvk/CM2eNS+pesfJVkP2/Q070I00TJWHFTze4WOwLUqLU0ZWOyDax2Yp0POwNbCzPP+gzoo0sLM86DOB1eif+HXlnoZxcPqcTBvI6v2Zp/IY28eDc6jneb65eLhYvU/090uBhdPjrG6fopxxM2FKL/wAlxyK13bk1p+Pg9H1BdR9QwOlUc2Ji4XUPEi1008JRawpuLea/lXf9o9f9/jbx4F/IY28eC7jOK52HgY8vqE+vxOnxsmJLCxsSDg7aTxUlW8U8Nta9jrdFeJ13VdRGE8PBxFCKU4OLlJXcqffRxX/Ex/kMb/bwH8hjbx4GoTivX1/+lflHI+T8I1x+pnjV9xql7GK1bMW+unM8IdJ6pABGhlWy4HlWy4AAHlWy4HlWy4AADLHZcDyx2XAAAZY/iuAyx2XAAQGWOy4DLH8VwAAGWP4rgWWOy4ACgyrZcCyrZcAACyrZcCyrZcAABST7JCAAP//Z"
  },
  {
    clientEmail: "avery.cruz@example.com",
    fileName: "upper-lip-followup.jpg",
    caption: "Demo follow-up photo",
    takenAtOffsetDays: 1,
    base64Jpeg:
      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCABkAKADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAECAwUE/8QAMRAAAgECAwcCBgICAwAAAAAAAAECAxESUpEEIjFRccHhITIFFEFDYYETIwYzNEKC/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAYEQEBAQEBAAAAAAAAAAAAAAAAARESAv/aAAwDAQACEQMRAD8A7HALyfCOrsEl6xXNl2PI9qd7KtfA97KtfBVirARv5Y6+A38sdfBpYdguM9/LHXwPfyx18FtOzwq7/JSg/qBlv5Y6+A38sdfBtgHgQGG/ljr4Dfyx18G+BCwIDHfyx18C38sdfBvgE4MDDfyx18Bv5Y6+DRevP9hYGMt/KtfAt7KtfBrY88nVVdJLc6BFb31iv0w4q6LsSlvy6JgN+6PXsy0iX7odezLSAEirAkWo8wpKNylFIqw7AKwWKsOwE2Cw/S9rq/IqwEWCxdhWAiwWLsKwENEuPI0sKwGLViN7E/RYeZu0RKNgM2iPuPou5q0Z/cfRdwhv3Q69maIh+6HXsy0Fi4r6lowouq5SU1ZL8G6AaHYEDi24tSas+C+oDsVYEMDKNFKpjv8Ao1sOw7BU2CxViXF41LE7JcOYCsKxQmEQ0JlMTAlktFMTAyaszP7kui7m0kZfcfRdwB+6HXszRcUZP3Q69maIEaoaJTuikBSGiUUgKQ0SmVcCkMzs8alidkuHMbmoq7diKsQrhcAZLGS2VAyWNiYCZLGxMCZcDH7j6LuazZl9yXRdwE/dDr2ZaM37odezLTBGkX9C0YplqXMDRMq5CY7gXcdyLjuBdwIuO4FXC5Dkkrt2QXuBXELPkz2bEl/E5W9W7XPTc1PLnfVcmz5Mlp8me+n8R2KtCc6W10JxhHHKUaiajHm/X0Qo/ENjqpYNroSUpKCtUTvJ8Fx4/gvJ256eJeiegNPk9DovaNmouqpV6adJJ1LzW4nwvyHS2iltNP8AkoVYVYXtihJNaocndciV7+qsZ/cfRdzqfEIxdFStvJ8TlfcfRdzNmNS6lv1j17Mu5m/o1xTuUpJ8GRWiY7kXHcK0UrFKSMrjuBtcdzFMeNga3C5nj/AYwNLhczxhjA6mxP8Ao/Z6HwONT2mpSvgdrl/P18y0Nz1HO+brlVqVXaf8e2WhS2euq2z7FONTFSlF/wClxwK69W5NcMvQ9PxFbT8QobKo4qlWltDqRa2adJRapTcW8V/+1vX8o9fz1bMtBfP1ua0L1GeK51KhXl8Qnt9TZq2CpKlWqQcHdpOqkrc4p021x9DrbFept21bRGnOnRqRhFKcHFykr3lZ+vBxX/kx+frc1oHz9bmtB1CeK9e3/wDG/aORf+x9F3Nq20Tq2dSSsv0jBcXLmZt108zADinxSfVABloYI5VoPBHKtAAqZDwRyx0HgjljoAEMgwRyx0HgjljoAAyDBHLHQMEcsdAALkGCOWOgYI5Y6AAMgwRyx0DBHLHQACZCwRyx0FgjljoAAyFgjlWgYI5VoAAyFhindRSfQAAK/9k="
  },
  {
    clientEmail: "jordan.lee@example.com",
    fileName: "chin-followup.jpg",
    caption: "Demo follow-up photo",
    takenAtOffsetDays: 3,
    base64Jpeg:
      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCABkAKADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAECAwUE/8QAMRAAAgIBAgUCBQIGAwAAAAAAAAECEQMSUQQhMXGRIkEFFUJSYWKhBhMjMjM0gYKx/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAZEQEBAQEBAQAAAAAAAAAAAAAAARIRAhP/2gAMAwEAAhEDEQA/AOiHP2XkbXTuUkeR7k89l5HT2Xkqh0Dieey8j57LyVQ6II9Wy8j9Wy8lqLZWgDL1bLyFS2Xk20INKKMalsvIerZeTfSthaEBj6tl5Fz2Xk10PU+mmuoODAy57LyLnsvJo1QqIM6ey8i57LyaUKijPnt+4dS2ia9TAdc13LoT6x7lAFDoEjSMa6kVKjZaikMdFQqHQ6HQVNDoYONtfgBUKi6JTTbSvk66AKhUKWRLJor/AJLoImiXBF0KgMXGhUbNESjXYgzomvU+xZP1PsUD6x7lol9V3KRBcV7liRSKBFCQ3dqkq9wp0OgQyBOKbTauug6CLbb5NV+4/VrSSWmubsBUFFUFAZuKu6V7hRQmBImUSyiRNFMQRlJUyPqfY1muRl9T7AD6ruXHqiH1XcpEBlxSySi1Kq/Y3Ic1GKbvnsUiiou4ptV+CiUMKWVzUP6a52XjcnBOf9wJjsgoZNjsBykoptukiaTalftuD5qmTqWSPol79UA2nqTt1sJjsTYCYmAmAmIbI0rU3ztlQS6GP1PsazZl9T7AJ9Y9ykQ+q7lAaxfsWYplxluQaJjsmx2UVY7JsLCrsLJsLIKsOS6E2JpalLnaAtW+ib7Bol9r8Hv4GKWHVXNvmz02bnlzvpxtEvtfgWif2y8HRx/EODzQnPFxeCcYR1SlHImord7IUfiHCTinj4rDPVJQWnIncn0Xf8Fym3O0T+2XgThP7JeDqy4vBB5FPPji8STyJzXoT6XsGLiMXEw14MsMkLrVCSa/YZNuJNNP1JruZ/U+x1viMYvh9TXqT5M5H1PsYs43L0r5ruUmQ/8AwadhV2OybHYVak0WpJmNjsiN7CzFOitbKNbCzLX+B60BpYWZ60GsDr8D/rLuz0PocPFxWTC3ofX2Zp8yz7x8G56jnfN652XFl4n+H+FwYuHzrNw/BTjk1YpRf+Fx0K1zbk10+3sej4hHiOPwcMo6smTFneSLXDTxKLWObi3qv6q5/lHo+Y5/0+A+Y5/0+C7jPzrwY8GeXxCfHZOHy6MksWbJBwdtJ5UlW8U8ba68jrcHeTjeK4iMJww5FCKU4OLlJXcqfPo4r/qef5jn/T4F8xz/AKfA1FxXt+If6su6ONfqfY1z8Vkz1/Mapey6GPu2Yt63JwgpPqgAjR0tkOlsgAB6VsvAaVsvAAA9K2XgNK2XgAAelbLwGlbLwAEBpWy8BpWy8AAC0rZeA0rZeAAA0rZeBaVsvAAUKlshUtkAAKkvZAAAf//Z"
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
  const normalizedValue = value
    .replace(/^data:image\/jpeg;base64,/, "")
    .replace(/\s/g, "");
  const binary = globalThis.atob(normalizedValue);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}
