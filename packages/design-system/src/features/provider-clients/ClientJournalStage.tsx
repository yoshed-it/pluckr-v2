import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import {
  getPrimaryChartTreatmentArea,
  type ChartEntryRecord,
  type ChartImageDraft,
  type ClientRecord
} from "@pluckr/domain";

import { PluckrConfirmDialog } from "../../PluckrConfirmDialog";
import { PluckrFullScreenImageModal } from "../../PluckrFullScreenImageModal";
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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

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
            key: "add-chart",
            label: "Add\nEntry",
            icon: "document",
            onPress: onStartChart,
            accent: true
          },
          {
            key: "take-photo",
            label: "Take\nPhoto",
            icon: "camera",
            onPress: onTakePhoto
          },
          {
            key: "consent",
            label: client.consent_signed_at ? "Review\nConsent" : "Sign\nConsent",
            icon: "consent",
            onPress: onOpenConsent
          },
          {
            key: "details",
            label: "Details",
            icon: "details",
            onPress: onStartEditClient
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
      ) : activeTab === "photos" ? (
        <ClientPhotoGallery
          charts={charts}
          isLoading={isLoading}
          onOpenImage={setSelectedImageUrl}
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
      <PluckrFullScreenImageModal
        visible={Boolean(selectedImageUrl)}
        imageUrl={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />
    </View>
  );
}

function ClientPhotoGallery({
  charts,
  isLoading,
  onOpenImage
}: {
  charts: ChartEntryRecord[];
  isLoading: boolean;
  onOpenImage: (imageUrl: string) => void;
}) {
  const galleryItems = charts.flatMap((chart) =>
    chart.image_urls.map((imageUrl, index) => {
      const primaryArea = getPrimaryChartTreatmentArea(chart);

      return {
        id: `${chart.id}:${chart.image_paths?.[index] ?? imageUrl}`,
        imageUrl,
        chart,
        area: primaryArea?.treatment_area ?? chart.treatment_area,
        modality: primaryArea?.modality ?? chart.modality
      };
    })
  );

  if (isLoading) {
    return (
      <PluckrCard>
        <Text style={styles.emptyStateTitle}>Photos</Text>
        <Text style={styles.emptyState}>Loading client photos...</Text>
      </PluckrCard>
    );
  }

  if (galleryItems.length === 0) {
    return (
      <PluckrCard>
        <Text style={styles.emptyStateTitle}>Photos</Text>
        <Text style={styles.emptyState}>
          Treatment photos attached to chart entries will appear here.
        </Text>
      </PluckrCard>
    );
  }

  return (
    <View style={styles.galleryStack}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <Text style={styles.countChip}>
          {galleryItems.length} {galleryItems.length === 1 ? "photo" : "photos"}
        </Text>
      </View>
      <View style={styles.galleryGrid}>
        {galleryItems.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            style={styles.galleryTile}
            onPress={() => onOpenImage(item.imageUrl)}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.galleryImage}
              resizeMode="cover"
            />
            <View style={styles.galleryMeta}>
              <Text style={styles.galleryDate}>
                {formatSnapshotDate(item.chart.created_at)}
              </Text>
              <Text style={styles.galleryContext} numberOfLines={1}>
                {[item.area, item.modality].filter(Boolean).join(" • ") ||
                  "Chart photo"}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
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
