import type { ChartImageDraft } from "@pluckr/domain";

export type { ChartImageDraft } from "@pluckr/domain";

export type ChartUploadAsset = {
  fileName: string;
  mimeType: string;
  bytes: ArrayBuffer;
};

export type ChartFormState = {
  modality: string;
  rfLevel: string;
  dcLevel: string;
  treatmentSeconds: string;
  appointmentDurationMinutes: string;
  usingOnePiece: boolean;
  probeShank: string;
  probeSize: string;
  probeMaterial: string;
  treatmentAreaSelection: string;
  treatmentAreaOther: string;
  treatmentSummary: string;
  notes: string;
  tags: string[];
  images: ChartImageDraft[];
};

export const emptyChartForm: ChartFormState = {
  modality: "",
  rfLevel: "10.0",
  dcLevel: "0.1",
  treatmentSeconds: "3",
  appointmentDurationMinutes: "",
  usingOnePiece: true,
  probeShank: "F",
  probeSize: "3",
  probeMaterial: "Gold",
  treatmentAreaSelection: "",
  treatmentAreaOther: "",
  treatmentSummary: "",
  notes: "",
  tags: [],
  images: []
};

export function parseSetting(value: string) {
  const numericValue = Number.parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}
