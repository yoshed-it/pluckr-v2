import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createChartEntry,
  deleteChartEntry,
  listClientCharts,
  updateChartEntry,
  type ChartEntryRecord,
  type ClientRecord
} from "@pluckr/supabase";
import {
  formatProbeName,
  modalityUsesDc,
  modalityUsesRf,
  parseProbeName,
  resolveTreatmentAreaState,
  resolveTreatmentAreaValue
} from "./charting";
import {
  dedupeTagLabels,
  defaultChartTags,
  mergeTagLibrary
} from "./tags";
import {
  emptyChartForm,
  parseSetting,
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
  const [chartForm, setChartForm] = useState<ChartFormState>(emptyChartForm);

  useEffect(() => {
    if (!organizationId || !selectedClient) {
      setCharts([]);
      setJournalError(null);
      setJournalNotice(null);
      setIsEditingChart(false);
      setEditingChartId(null);
      setChartForm(emptyChartForm);
      return;
    }

    setJournalError(null);
    setJournalNotice(null);
    setIsEditingChart(false);
    setEditingChartId(null);
    setChartForm(emptyChartForm);
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

  function startCreatingChart() {
    setJournalNotice(null);
    setJournalError(null);
    setEditingChartId(null);
    setChartForm(emptyChartForm);
    setIsEditingChart(true);
  }

  function startEditingChart(chart: ChartEntryRecord) {
    setJournalNotice(null);
    setJournalError(null);
    setEditingChartId(chart.id);
    setChartForm({
      treatmentAreaSelection: resolveTreatmentAreaState(chart.treatment_area).selection,
      treatmentAreaOther: resolveTreatmentAreaState(chart.treatment_area).otherValue,
      modality: chart.modality ?? "",
      rfLevel:
        typeof chart.rf_level === "number" ? chart.rf_level.toFixed(1) : "10.0",
      dcLevel:
        typeof chart.dc_level === "number" ? chart.dc_level.toFixed(1) : "0.1",
      treatmentSeconds:
        typeof chart.treatment_seconds === "number"
          ? String(chart.treatment_seconds)
          : "3",
      usingOnePiece: chart.probe_is_one_piece,
      probeShank: parseProbeName(chart.probe).shank,
      probeSize: parseProbeName(chart.probe).size,
      probeMaterial: parseProbeName(chart.probe).material,
      treatmentSummary: chart.treatment_summary ?? "",
      notes: chart.notes ?? "",
      tags: chart.tags
    });
    setIsEditingChart(true);
  }

  function cancelEditingChart() {
    setIsEditingChart(false);
    setEditingChartId(null);
    setJournalError(null);
    setChartForm(emptyChartForm);
  }

  async function submitChart() {
    if (!organizationId || !selectedClient) {
      return false;
    }

    const selectedProbe = formatProbeName({
      shank: chartForm.probeShank,
      size: chartForm.probeSize,
      material: chartForm.probeMaterial
    });

    if (!chartForm.modality.trim()) {
      setJournalError("Treatment modality is required.");
      return false;
    }

    if (!selectedProbe.trim()) {
      setJournalError("Complete the probe details before saving the chart entry.");
      return false;
    }

    const treatmentArea = resolveTreatmentAreaValue(
      chartForm.treatmentAreaSelection,
      chartForm.treatmentAreaOther
    );

    if (!treatmentArea) {
      setJournalError("Treatment area is required.");
      return false;
    }

    setIsSavingChart(true);
    setJournalError(null);
    setJournalNotice(null);

    const input = {
      organizationId,
      clientId: selectedClient.id,
      modality: chartForm.modality,
      rfLevel: modalityUsesRf(chartForm.modality)
        ? parseSetting(chartForm.rfLevel)
        : null,
      dcLevel: modalityUsesDc(chartForm.modality)
        ? parseSetting(chartForm.dcLevel)
        : null,
      treatmentSeconds: parseSetting(chartForm.treatmentSeconds),
      probe: selectedProbe,
      probeIsOnePiece: chartForm.usingOnePiece,
      treatmentArea,
      treatmentSummary: chartForm.treatmentSummary,
      notes: chartForm.notes,
      tags: dedupeTagLabels(chartForm.tags)
    };

    try {
      const savedChart = editingChartId
        ? await updateChartEntry(client, editingChartId, input)
        : await createChartEntry(client, input);

      setCharts((current) => {
        const nextCharts = editingChartId
          ? current.map((chart) => (chart.id === savedChart.id ? savedChart : chart))
          : [savedChart, ...current];

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
      setChartForm(emptyChartForm);
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

  function setProbeStyle(usingOnePiece: boolean) {
    setChartForm((current) => ({
      ...current,
      usingOnePiece
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

  return {
    charts,
    isLoadingCharts,
    journalError,
    journalNotice,
    isEditingChart,
    isSavingChart,
    editingChartId,
    chartForm,
    updateChartForm,
    availableChartTags: mergeTagLibrary(defaultChartTags, chartForm.tags),
    toggleChartTag,
    addCustomChartTag,
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
