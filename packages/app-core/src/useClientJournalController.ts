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

type ChartFormState = {
  modality: string;
  treatmentArea: string;
  treatmentSummary: string;
  notes: string;
  tags: string;
};

const emptyChartForm: ChartFormState = {
  modality: "",
  treatmentArea: "",
  treatmentSummary: "",
  notes: "",
  tags: ""
};

function stringifyTags(tags: string[]) {
  return tags.join(", ");
}

function parseTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

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
      modality: chart.modality ?? "",
      treatmentArea: chart.treatment_area ?? "",
      treatmentSummary: chart.treatment_summary ?? "",
      notes: chart.notes ?? "",
      tags: stringifyTags(chart.tags)
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

    if (!chartForm.modality.trim() && !chartForm.treatmentArea.trim()) {
      setJournalError("Add at least a modality or treatment area.");
      return false;
    }

    setIsSavingChart(true);
    setJournalError(null);
    setJournalNotice(null);

    const input = {
      organizationId,
      clientId: selectedClient.id,
      modality: chartForm.modality,
      treatmentArea: chartForm.treatmentArea,
      treatmentSummary: chartForm.treatmentSummary,
      notes: chartForm.notes,
      tags: parseTags(chartForm.tags)
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
