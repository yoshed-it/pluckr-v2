export type ChartFormState = {
  modality: string;
  rfLevel: string;
  dcLevel: string;
  treatmentSeconds: string;
  usingOnePiece: boolean;
  probeShank: string;
  probeSize: string;
  probeMaterial: string;
  treatmentAreaSelection: string;
  treatmentAreaOther: string;
  treatmentSummary: string;
  notes: string;
  tags: string[];
};

export const emptyChartForm: ChartFormState = {
  modality: "",
  rfLevel: "10.0",
  dcLevel: "0.1",
  treatmentSeconds: "3",
  usingOnePiece: true,
  probeShank: "F",
  probeSize: "3",
  probeMaterial: "Gold",
  treatmentAreaSelection: "",
  treatmentAreaOther: "",
  treatmentSummary: "",
  notes: "",
  tags: []
};

export function parseSetting(value: string) {
  const numericValue = Number.parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}
