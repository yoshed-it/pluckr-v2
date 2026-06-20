export const defaultClientTags = [
  "Phalloplasty Prep",
  "Top Surgery",
  "Sensitive Client",
  "No-Show Risk",
  "Prefers Evenings",
  "Coarse Hair",
  "Dry Skin",
  "New Client",
  "Returning Client",
  "VIP"
] as const;

export const defaultChartTags = [
  "Sensitive",
  "Bleeding",
  "Consult",
  "Numbness",
  "Healed Well",
  "Follow-up",
  "Complications",
  "Quick Session",
  "Extended Session",
  "Test Patch"
] as const;

export function dedupeTagLabels(tags: string[]) {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const tag of tags) {
    const trimmed = tag.trim();
    const normalized = trimmed.toLowerCase();

    if (!trimmed || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    deduped.push(trimmed);
  }

  return deduped;
}

export function mergeTagLibrary(baseTags: readonly string[], selectedTags: string[]) {
  return dedupeTagLabels([...baseTags, ...selectedTags]).sort((left, right) =>
    left.localeCompare(right)
  );
}
