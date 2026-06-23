import type { ChartImageDraft } from "@pluckr/domain";

export type { ChartImageDraft } from "@pluckr/domain";

export type ChartUploadAsset = {
  fileName: string;
  mimeType: string;
  bytes: ArrayBuffer;
};

export type ChartTreatmentAreaFormState = {
  id: string;
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
  notes: string;
};

export type ChartFormState = {
  appointmentDurationMinutes: string;
  treatmentAreas: ChartTreatmentAreaFormState[];
  treatmentSummary: string;
  notes: string;
  tags: string[];
  images: ChartImageDraft[];
};

export function createEmptyTreatmentAreaForm(
  id: string
): ChartTreatmentAreaFormState {
  return {
    id,
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
    notes: ""
  };
}

export function createEmptyChartForm(firstAreaId = "area-1"): ChartFormState {
  return {
    appointmentDurationMinutes: "",
    treatmentAreas: [createEmptyTreatmentAreaForm(firstAreaId)],
    treatmentSummary: "",
    notes: "",
    tags: [],
    images: []
  };
}

export const emptyChartForm: ChartFormState = createEmptyChartForm();

export function parseSetting(value: string) {
  const numericValue = Number.parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}
