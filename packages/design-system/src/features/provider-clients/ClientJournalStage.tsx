import React, { useState } from "react";
import { Text, View } from "react-native";
import {
  getPrimaryChartTreatmentArea,
  type ChartEntryRecord,
  type ChartImageDraft,
  type ClientRecord
} from "@pluckr/domain";

import { PluckrConfirmDialog } from "../../PluckrConfirmDialog";
import { PluckrTagPickerDrawer } from "../../PluckrTagPickerDrawer";
import { PluckrCard } from "../../primitives/Card";
import { CareSnapshotStrip } from "./CareSnapshotStrip";
import { ClientActionsDrawer } from "./ClientActionsDrawer";
import { ClientChartEntriesSection } from "./ClientChartEntriesSection";
import { ClientDetailsSheet } from "./ClientDetailsSheet";
import { ClientHeaderCard } from "./ClientHeaderCard";
import { ClientWorkspaceTabs, type ClientWorkspaceTabId } from "./ClientWorkspaceTabs";
import { ClientWorkspaceToolbar } from "./ClientWorkspaceToolbar";
import { ClientWorkspaceTopBar } from "./ClientWorkspaceTopBar";
import { QuickActionGrid } from "./QuickActionGrid";
import { PluckrChartDetailPanel } from "../provider-charting/ChartDetailPanel";
import { PluckrChartEntryEditor } from "../provider-charting/ChartEntryEditor";
import type { AdminContactFieldKey } from "./AdminContactFields";
import { pluckrClientJournalStageStyles as styles } from "./ClientJournalStage.styles";

type PluckrClientJournalStageProps = {
  client: ClientRecord;
  charts: ChartEntryRecord[];
  isLoading: boolean;
  error: string | null;
  notice: string | null;
  isEditingChart: boolean;
  isSavingChart: boolean;
  isEditingClient: boolean;
  isSavingClient: boolean;
  clientDetailError: string | null;
  clientDetailNotice: string | null;
  clientDetailForm: {
    preferredName: string;
    firstName: string;
    lastName: string;
    pronouns: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    addressCity: string;
    addressRegion: string;
    addressPostalCode: string;
    emergencyContactName: string;
    emergencyContactRelationship: string;
    emergencyContactPhone: string;
    notes: string;
    clientTags: string[];
  };
  clientDetailFormErrors: Partial<
    Record<"preferredName" | "firstName" | "lastName" | "email" | "phone", string>
  >;
  availableClientTags: string[];
  chartForm: {
    appointmentDurationMinutes: string;
    treatmentAreas: Array<{
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
    }>;
    treatmentSummary: string;
    notes: string;
    tags: string[];
    images: ChartImageDraft[];
  };
  availableChartTags: string[];
  previousChartReferencesByAreaId: Record<string, ChartEntryRecord | null>;
  hideToolbar?: boolean;
  backLabel?: string | null;
  onBack: () => void;
  onLogout: () => void;
  onOpenConsent: () => void;
  onStartEditClient: () => void;
  onCancelEditClient: () => void;
  onClientDetailFormChange: (
    key:
      | "preferredName"
      | "firstName"
      | "lastName"
      | "pronouns"
      | "phone"
      | "email"
      | "notes"
      | AdminContactFieldKey,
    value: string
  ) => void;
  onToggleClientTag: (tagLabel: string) => void;
  onAddCustomClientTag: (tagLabel: string) => void;
  onSubmitClientDetails: () => boolean | Promise<boolean>;
  onSubmitClientTags: () => boolean | Promise<boolean>;
  onArchiveClient: () => void;
  onStartChart: () => void;
  onTakePhoto: () => void;
  onCancelChart: () => void;
  onEditChart: (chart: ChartEntryRecord) => void;
  onDeleteChart: (chart: ChartEntryRecord) => void;
  onChartFormChange: (
    key:
      | "treatmentSummary"
      | "appointmentDurationMinutes"
      | "notes",
    value: string
  ) => void;
  onTreatmentAreaFormChange: (
    areaId: string,
    key:
      | "modality"
      | "rfLevel"
      | "dcLevel"
      | "treatmentSeconds"
      | "probeShank"
      | "probeSize"
      | "probeMaterial"
      | "treatmentAreaSelection"
      | "treatmentAreaOther"
      | "notes",
    value: string
  ) => void;
  onAddTreatmentArea: () => void;
  onToggleChartTag: (tagLabel: string) => void;
  onAddCustomChartTag: (tagLabel: string) => void;
  onPickChartImages: () => void;
  onRemoveChartImage: (image: ChartImageDraft) => void;
  onProbeStyleChange: (areaId: string, usingOnePiece: boolean) => void;
  onSubmitChart: () => void;
};

export function PluckrClientJournalStage({
  client,
  charts,
  isLoading,
  error,
  notice,
  isEditingChart,
  isSavingChart,
  isEditingClient,
  isSavingClient,
  clientDetailError,
  clientDetailNotice,
  clientDetailForm,
  clientDetailFormErrors,
  availableClientTags,
  chartForm,
  availableChartTags,
  previousChartReferencesByAreaId,
  hideToolbar = false,
  backLabel,
  onBack,
  onLogout,
  onOpenConsent,
  onStartEditClient,
  onCancelEditClient,
  onClientDetailFormChange,
  onToggleClientTag,
  onAddCustomClientTag,
  onSubmitClientDetails,
  onSubmitClientTags,
  onArchiveClient,
  onStartChart,
  onTakePhoto,
  onCancelChart,
  onEditChart,
  onDeleteChart,
  onChartFormChange,
  onTreatmentAreaFormChange,
  onAddTreatmentArea,
  onToggleChartTag,
  onAddCustomChartTag,
  onPickChartImages,
  onRemoveChartImage,
  onProbeStyleChange,
  onSubmitChart
}: PluckrClientJournalStageProps) {
  const [selectedChart, setSelectedChart] = useState<ChartEntryRecord | null>(null);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showClientActions, setShowClientActions] = useState(false);
  const [showClientTagPicker, setShowClientTagPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<ClientWorkspaceTabId>("chartEntries");

  function handleShowCharts() {
    setActiveTab("chartEntries");

    if (isEditingChart) {
      onCancelChart();
    }
  }

  function handleCloseClientTagPicker() {
    setShowClientTagPicker(false);
    onCancelEditClient();
  }

  async function handleSaveClientTags() {
    const didSave = await onSubmitClientTags();

    if (didSave) {
      setShowClientTagPicker(false);
    }
  }

  if (selectedChart && !isEditingChart) {
    return (
      <PluckrChartDetailPanel
        chart={selectedChart}
        onBack={() => setSelectedChart(null)}
        onEdit={(chart) => {
          setSelectedChart(null);
          onEditChart(chart);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {!hideToolbar ? (
        <ClientWorkspaceToolbar
          client={client}
          onBack={onBack}
          onLogout={onLogout}
          onOpenConsent={onOpenConsent}
          onOpenDetails={onStartEditClient}
        />
      ) : null}

      <ClientWorkspaceTopBar
        onBack={onBack}
        onMore={() => setShowClientActions(true)}
        backLabel={backLabel ?? "Clients"}
      />

      <ClientHeaderCard
        client={client}
        onOpenDetails={onStartEditClient}
        onOpenConsent={onOpenConsent}
        onOpenTagPicker={() => setShowClientTagPicker(true)}
      />

      <CareSnapshotStrip items={buildCareSnapshotItems(client, charts)} />

      <QuickActionGrid
        actions={[
          {
            key: "charts",
            label: "Charts",
            icon: "reports",
            onPress: handleShowCharts,
            accent: true
          },
          {
            key: "add-chart",
            label: "Add\nEntry",
            icon: "document",
            onPress: onStartChart
          },
          {
            key: "take-photo",
            label: "Take\nPhoto",
            icon: "camera",
            onPress: onTakePhoto
          },
          {
            key: "upload-document",
            label: "Upload\nDocument",
            icon: "upload",
            disabled: true
          },
          {
            key: "more",
            label: "More",
            icon: "more",
            onPress: () => setShowClientActions(true)
          }
        ]}
      />

      <ClientWorkspaceTabs activeTab={activeTab} onChange={setActiveTab} />

      <ClientDetailsSheet
        visible={isEditingClient}
        client={client}
        form={clientDetailForm}
        formErrors={clientDetailFormErrors}
        availableClientTags={availableClientTags}
        isSavingClient={isSavingClient}
        onClose={onCancelEditClient}
        onFieldChange={onClientDetailFormChange}
        onToggleClientTag={onToggleClientTag}
        onAddCustomClientTag={onAddCustomClientTag}
        onSubmit={() => {
          void onSubmitClientDetails();
        }}
        onArchiveClient={() => setShowArchiveConfirm(true)}
      />

      <ClientActionsDrawer
        visible={showClientActions}
        client={client}
        onClose={() => setShowClientActions(false)}
        onArchiveClient={() => setShowArchiveConfirm(true)}
      />

      <PluckrTagPickerDrawer
        visible={showClientTagPicker}
        title="Client Tags"
        selectedTags={clientDetailForm.clientTags}
        availableTags={availableClientTags}
        actionLabel={isSavingClient ? "Saving..." : "Save"}
        actionDisabled={isSavingClient}
        onAction={() => void handleSaveClientTags()}
        onToggleTag={onToggleClientTag}
        onAddCustomTag={onAddCustomClientTag}
        onClose={handleCloseClientTagPicker}
      />

      {isEditingChart && activeTab === "chartEntries" ? (
        <PluckrChartEntryEditor
          client={client}
          isSavingChart={isSavingChart}
          chartForm={chartForm}
          availableChartTags={availableChartTags}
          previousChartReferencesByAreaId={previousChartReferencesByAreaId}
          onChartFormChange={onChartFormChange}
          onTreatmentAreaFormChange={onTreatmentAreaFormChange}
          onAddTreatmentArea={onAddTreatmentArea}
          onToggleChartTag={onToggleChartTag}
          onAddCustomChartTag={onAddCustomChartTag}
          onPickImages={onPickChartImages}
          onRemoveImage={onRemoveChartImage}
          onProbeStyleChange={onProbeStyleChange}
          onSubmitChart={onSubmitChart}
          onCancelChart={onCancelChart}
        />
      ) : activeTab === "chartEntries" ? (
        <ClientChartEntriesSection
          charts={charts}
          isLoading={isLoading}
          onStartChart={onStartChart}
          onOpenChart={setSelectedChart}
        />
      ) : (
        <PluckrCard>
          <Text style={styles.emptyStateTitle}>{getTabLabel(activeTab)}</Text>
          <Text style={styles.emptyState}>
            This section is next in the client workspace rollout. Chart entries are live now.
          </Text>
        </PluckrCard>
      )}
      <PluckrConfirmDialog
        visible={showArchiveConfirm}
        title="Archive Client?"
        message="The client will be removed from active lists but kept in the workspace record."
        confirmLabel="Archive"
        onCancel={() => setShowArchiveConfirm(false)}
        onConfirm={() => {
          setShowArchiveConfirm(false);
          onArchiveClient();
        }}
      />
    </View>
  );
}

function buildCareSnapshotItems(client: ClientRecord, charts: ChartEntryRecord[]) {
  const latestChart = charts[0] ?? null;
  const primaryArea = latestChart
    ? getPrimaryChartTreatmentArea(latestChart)
    : null;
  const lastVisitSource =
    latestChart?.created_at ?? client.last_seen_at ?? client.created_at;

  return [
    {
      label: "Last Visit",
      value: formatSnapshotDate(lastVisitSource)
    },
    {
      label: "Sessions",
      value: String(charts.length)
    },
    {
      label: "Primary Area",
      value: primaryArea?.treatment_area || "Not recorded"
    }
  ];
}

function formatSnapshotDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  const isSameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isSameDay) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

function getTabLabel(tab: ClientWorkspaceTabId) {
  switch (tab) {
    case "timeline":
      return "Timeline";
    case "photos":
      return "Photos";
    case "documents":
      return "Documents";
    case "workflows":
      return "Workflows";
    default:
      return "Chart Entries";
  }
}
