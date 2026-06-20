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

export function modalityUsesRf(modality: string) {
  return modality === "Thermolysis" || modality === "Blend";
}

export function modalityUsesDc(modality: string) {
  return modality === "Galvanic" || modality === "Blend";
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
