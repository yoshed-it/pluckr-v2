import { useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createChartEntry,
  deleteChartImage,
  deleteChartEntry,
  listClientCharts,
  uploadChartImage,
  updateChartEntry,
  type ChartEntryRecord,
  type ClientRecord
} from "@pluckr/supabase";
import {
  formatProbeName,
  getChartTreatmentAreas,
  isAppointmentDurationPreset,
  modalityUsesDc,
  modalityUsesRf,
  parseProbeName,
  resolveTreatmentAreaState,
  resolveTreatmentAreaValue,
  selectPreviousChartReference
} from "./charting";
import {
  dedupeTagLabels,
  defaultChartTags,
  mergeTagLibrary
} from "./tags";
import {
  createEmptyChartForm,
  createEmptyTreatmentAreaForm,
  parseSetting,
  type ChartImageDraft,
  type ChartTreatmentAreaFormState,
  type ChartUploadAsset,
  type ChartFormState
} from "./chartFormState";

/**
 * Owns client-journal loading and chart-entry editing so both apps can share
 * the same behavior while the platform screens stay presentation-focused.
 */
export function useClientJournalController(
  client: SupabaseClient,
  organizationId: string | null,
  selectedClient: ClientRecord | null
) {
  const [charts, setCharts] = useState<ChartEntryRecord[]>([]);
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);
  const [journalError, setJournalError] = useState<string | null>(null);
  const [journalNotice, setJournalNotice] = useState<string | null>(null);
  const [isEditingChart, setIsEditingChart] = useState(false);
  const [isSavingChart, setIsSavingChart] = useState(false);
  const [editingChartId, setEditingChartId] = useState<string | null>(null);
  const treatmentAreaSerialRef = useRef(1);
  const [chartForm, setChartForm] = useState<ChartFormState>(() =>
    createEmptyChartForm()
  );

  function createFreshChartForm() {
    treatmentAreaSerialRef.current = 1;
    return createEmptyChartForm("area-1");
  }

  function createNextTreatmentAreaForm() {
    treatmentAreaSerialRef.current += 1;
    return createEmptyTreatmentAreaForm(`area-${treatmentAreaSerialRef.current}`);
  }

  useEffect(() => {
    if (!organizationId || !selectedClient) {
      setCharts([]);
      setJournalError(null);
      setJournalNotice(null);
      setIsEditingChart(false);
      setEditingChartId(null);
      setChartForm(createFreshChartForm());
      return;
    }

    setJournalError(null);
    setJournalNotice(null);
    setIsEditingChart(false);
    setEditingChartId(null);
    setChartForm(createFreshChartForm());
    void loadCharts(organizationId, selectedClient.id);
  }, [client, organizationId, selectedClient]);

  async function loadCharts(nextOrganizationId: string, clientId: string) {
    setIsLoadingCharts(true);
    setJournalError(null);

    try {
      setCharts(await listClientCharts(client, nextOrganizationId, clientId));
    } catch (error) {
      setJournalError(
        error instanceof Error
          ? error.message
          : "Unable to load the client journal right now."
      );
    } finally {
      setIsLoadingCharts(false);
    }
  }

  function updateChartForm<K extends keyof ChartFormState>(
    key: K,
    value: ChartFormState[K]
  ) {
    setChartForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function updateTreatmentAreaForm<K extends keyof ChartTreatmentAreaFormState>(
    areaId: string,
    key: K,
    value: ChartTreatmentAreaFormState[K]
  ) {
    setChartForm((current) => ({
      ...current,
      treatmentAreas: current.treatmentAreas.map((area) =>
        area.id === areaId ? { ...area, [key]: value } : area
      )
    }));
  }

  function addTreatmentArea() {
    setChartForm((current) => ({
      ...current,
      treatmentAreas: [...current.treatmentAreas, createNextTreatmentAreaForm()]
    }));
  }

  function startCreatingChart() {
    setJournalNotice(null);
    setJournalError(null);
    setEditingChartId(null);
    setChartForm(createFreshChartForm());
    setIsEditingChart(true);
  }

  function startEditingChart(chart: ChartEntryRecord) {
    setJournalNotice(null);
    setJournalError(null);
    setEditingChartId(chart.id);
    const treatmentAreas = getChartTreatmentAreas(chart).map((area, index) => {
      const areaState = resolveTreatmentAreaState(area.treatment_area);
      const probeState = parseProbeName(area.probe);

      return {
        id: `area-${index + 1}`,
        treatmentAreaSelection: areaState.selection,
        treatmentAreaOther: areaState.otherValue,
        modality: area.modality ?? "",
        rfLevel:
          typeof area.rf_level === "number" ? area.rf_level.toFixed(1) : "10.0",
        dcLevel:
          typeof area.dc_level === "number" ? area.dc_level.toFixed(1) : "0.1",
        treatmentSeconds:
          typeof area.treatment_seconds === "number"
            ? String(area.treatment_seconds)
            : "3",
        usingOnePiece: area.probe_is_one_piece,
        probeShank: probeState.shank,
        probeSize: probeState.size,
        probeMaterial: probeState.material,
        notes: area.notes ?? ""
      };
    });

    treatmentAreaSerialRef.current = Math.max(1, treatmentAreas.length);
    setChartForm({
      appointmentDurationMinutes:
        typeof chart.appointment_duration_minutes === "number"
          ? String(chart.appointment_duration_minutes)
          : "",
      treatmentAreas:
        treatmentAreas.length > 0
          ? treatmentAreas
          : [createEmptyTreatmentAreaForm("area-1")],
      treatmentSummary: chart.treatment_summary ?? "",
      notes: chart.notes ?? "",
      tags: chart.tags,
      images: (chart.image_paths ?? chart.image_urls).map((value, index) => ({
        storagePath: chart.image_paths?.[index] ?? value,
        previewUrl: chart.image_urls[index] ?? value
      }))
    });
    setIsEditingChart(true);
  }

  function cancelEditingChart() {
    setIsEditingChart(false);
    setEditingChartId(null);
    setJournalError(null);
    setChartForm(createFreshChartForm());
  }

  async function submitChart() {
    if (!organizationId || !selectedClient) {
      return false;
    }

    if (chartForm.treatmentAreas.length === 0) {
      setJournalError("At least one treatment area is required.");
      return false;
    }

    const appointmentDurationMinutes = parseSetting(
      chartForm.appointmentDurationMinutes
    );

    if (!isAppointmentDurationPreset(appointmentDurationMinutes)) {
      setJournalError("Appointment duration is required.");
      return false;
    }

    const treatmentAreas = chartForm.treatmentAreas.map((area, index) => {
      const treatmentArea = resolveTreatmentAreaValue(
        area.treatmentAreaSelection,
        area.treatmentAreaOther
      );
      const probe = formatProbeName({
        shank: area.probeShank,
        size: area.probeSize,
        material: area.probeMaterial
      });

      return {
        index,
        treatmentArea,
        modality: area.modality,
        probe,
        rfLevel: modalityUsesRf(area.modality)
          ? parseSetting(area.rfLevel)
          : null,
        dcLevel: modalityUsesDc(area.modality)
          ? parseSetting(area.dcLevel)
          : null,
        treatmentSeconds: parseSetting(area.treatmentSeconds),
        probeIsOnePiece: area.usingOnePiece,
        notes: area.notes
      };
    });

    for (const area of treatmentAreas) {
      const label = `Treatment Area #${area.index + 1}`;

      if (!area.treatmentArea) {
        setJournalError(`${label} is required.`);
        return false;
      }

      if (!area.modality.trim()) {
        setJournalError(`${label} modality is required.`);
        return false;
      }

      if (!area.probe.trim()) {
        setJournalError(`${label} probe details are required.`);
        return false;
      }
    }

    setIsSavingChart(true);
    setJournalError(null);
    setJournalNotice(null);

    const input = {
      organizationId,
      clientId: selectedClient.id,
      appointmentDurationMinutes,
      treatmentAreas,
      treatmentSummary: chartForm.treatmentSummary,
      notes: chartForm.notes,
      tags: dedupeTagLabels(chartForm.tags),
      imagePaths: chartForm.images.map((image) => image.storagePath)
    };

    try {
      const savedChart = editingChartId
        ? await updateChartEntry(client, editingChartId, input)
        : await createChartEntry(client, input);

      const hydratedChart: ChartEntryRecord = {
        ...savedChart,
        image_paths: chartForm.images.map((image) => image.storagePath),
        image_urls: chartForm.images.map((image) => image.previewUrl)
      };

      setCharts((current) => {
        const nextCharts = editingChartId
          ? current.map((chart) =>
              chart.id === hydratedChart.id ? hydratedChart : chart
            )
          : [hydratedChart, ...current];

        return nextCharts.sort(
          (left, right) =>
            new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
        );
      });
      setJournalNotice(
        editingChartId ? "Chart entry updated." : "Chart entry added."
      );
      setIsEditingChart(false);
      setEditingChartId(null);
      setChartForm(createFreshChartForm());
      return true;
    } catch (error) {
      setJournalError(
        error instanceof Error
          ? error.message
          : "Unable to save the chart entry right now."
      );
      return false;
    } finally {
      setIsSavingChart(false);
    }
  }

  async function removeChart(chart: ChartEntryRecord) {
    if (!organizationId || !selectedClient) {
      return false;
    }

    setJournalError(null);
    setJournalNotice(null);

    try {
      await deleteChartEntry(client, organizationId, selectedClient.id, chart.id);
      setCharts((current) => current.filter((entry) => entry.id !== chart.id));
      setJournalNotice("Chart entry deleted.");
      return true;
    } catch (error) {
      setJournalError(
        error instanceof Error
          ? error.message
          : "Unable to delete the chart entry right now."
      );
      return false;
    }
  }

  function setProbeStyle(areaId: string, usingOnePiece: boolean) {
    setChartForm((current) => ({
      ...current,
      treatmentAreas: current.treatmentAreas.map((area) =>
        area.id === areaId ? { ...area, usingOnePiece } : area
      )
    }));
  }

  function toggleChartTag(tagLabel: string) {
    setChartForm((current) => {
      const exists = current.tags.some(
        (tag) => tag.toLowerCase() === tagLabel.toLowerCase()
      );

      return {
        ...current,
        tags: exists
          ? current.tags.filter(
              (tag) => tag.toLowerCase() !== tagLabel.toLowerCase()
            )
          : [...current.tags, tagLabel]
      };
    });
  }

  function addCustomChartTag(tagLabel: string) {
    const trimmedLabel = tagLabel.trim();

    if (!trimmedLabel) {
      return;
    }

    setChartForm((current) => ({
      ...current,
      tags: dedupeTagLabels([...current.tags, trimmedLabel])
    }));
  }

  async function uploadChartAssets(assets: ChartUploadAsset[]) {
    if (!organizationId || !selectedClient) {
      return false;
    }

    if (!selectedClient.consent_signed_at) {
      setJournalError("Image consent is required before photos can be added.");
      return false;
    }

    setJournalError(null);
    setJournalNotice(null);
    setIsSavingChart(true);

    try {
      const uploadedImages = await Promise.all(
        assets.map((asset) =>
          uploadChartImage(client, {
            organizationId,
            clientId: selectedClient.id,
            fileName: asset.fileName,
            mimeType: asset.mimeType,
            bytes: asset.bytes
          })
        )
      );

      setChartForm((current) => ({
        ...current,
        images: dedupeImages([
          ...current.images,
          ...uploadedImages.map((image) => ({
            storagePath: image.storagePath,
            previewUrl: image.signedUrl
          }))
        ])
      }));
      return true;
    } catch (error) {
      setJournalError(
        error instanceof Error
          ? error.message
          : "Unable to upload treatment images right now."
      );
      return false;
    } finally {
      setIsSavingChart(false);
    }
  }

  async function removeChartImageDraft(image: ChartImageDraft) {
    setJournalError(null);

    try {
      if (image.storagePath && !/^https?:\/\//.test(image.storagePath)) {
        await deleteChartImage(client, image.storagePath);
      }
    } catch (error) {
      setJournalError(
        error instanceof Error
          ? error.message
          : "Unable to remove the image right now."
      );
      return false;
    }

    setChartForm((current) => ({
      ...current,
      images: current.images.filter(
        (draft) => draft.storagePath !== image.storagePath
      )
    }));

    return true;
  }

  const previousChartReferencesByAreaId = Object.fromEntries(
    chartForm.treatmentAreas.map((area) => [
      area.id,
      selectPreviousChartReference(
        charts,
        resolveTreatmentAreaValue(
          area.treatmentAreaSelection,
          area.treatmentAreaOther
        ),
        editingChartId
      )
    ])
  );

  return {
    charts,
    isLoadingCharts,
    journalError,
    journalNotice,
    isEditingChart,
    isSavingChart,
    editingChartId,
    previousChartReferencesByAreaId,
    chartForm,
    updateChartForm,
    updateTreatmentAreaForm,
    addTreatmentArea,
    availableChartTags: mergeTagLibrary(defaultChartTags, chartForm.tags),
    toggleChartTag,
    addCustomChartTag,
    uploadChartAssets,
    removeChartImageDraft,
    setProbeStyle,
    startCreatingChart,
    startEditingChart,
    cancelEditingChart,
    submitChart,
    removeChart,
    refreshJournal: () =>
      organizationId && selectedClient
        ? loadCharts(organizationId, selectedClient.id)
        : Promise.resolve()
  };
}

function dedupeImages(images: ChartImageDraft[]) {
  const seen = new Set<string>();
  const deduped: ChartImageDraft[] = [];

  for (const image of images) {
    if (!image.storagePath || seen.has(image.storagePath)) {
      continue;
    }

    seen.add(image.storagePath);
    deduped.push(image);
  }

  return deduped;
}
