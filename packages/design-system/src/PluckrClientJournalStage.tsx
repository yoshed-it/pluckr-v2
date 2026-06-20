import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import {
  modalityUsesDc,
  modalityUsesRf,
  type ChartImageDraft
} from "@pluckr/app-core";
import type { ChartEntryRecord, ClientRecord } from "@pluckr/supabase";

import { PluckrButton } from "./PluckrButton";
import { PluckrCard } from "./PluckrCard";
import { PluckrChartDetailPanel } from "./PluckrChartDetailPanel";
import { PluckrChartEntryEditor } from "./PluckrChartEntryEditor";
import { PluckrConfirmDialog } from "./PluckrConfirmDialog";
import { PluckrFullScreenImageModal } from "./PluckrFullScreenImageModal";
import { PluckrNoticeBanner } from "./PluckrNoticeBanner";
import { PluckrTagPickerDrawer } from "./PluckrTagPickerDrawer";
import { PluckrTextField } from "./PluckrTextField";
import { pluckrClientJournalStageStyles as styles } from "./PluckrClientJournalStage.styles";

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
    firstName: string;
    lastName: string;
    pronouns: string;
    phone: string;
    email: string;
    notes: string;
    clientTags: string[];
  };
  availableClientTags: string[];
  chartForm: {
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
    images: ChartImageDraft[];
  };
  availableChartTags: string[];
  onBack: () => void;
  onLogout: () => void;
  onOpenConsent: () => void;
  onStartEditClient: () => void;
  onCancelEditClient: () => void;
  onClientDetailFormChange: (
    key:
      | "firstName"
      | "lastName"
      | "pronouns"
      | "phone"
      | "email"
      | "notes",
    value: string
  ) => void;
  onToggleClientTag: (tagLabel: string) => void;
  onAddCustomClientTag: (tagLabel: string) => void;
  onSubmitClientDetails: () => void;
  onArchiveClient: () => void;
  onStartChart: () => void;
  onCancelChart: () => void;
  onEditChart: (chart: ChartEntryRecord) => void;
  onDeleteChart: (chart: ChartEntryRecord) => void;
  onChartFormChange: (
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
      | "treatmentSummary"
      | "notes",
    value: string
  ) => void;
  onToggleChartTag: (tagLabel: string) => void;
  onAddCustomChartTag: (tagLabel: string) => void;
  onPickChartImages: () => void;
  onRemoveChartImage: (image: ChartImageDraft) => void;
  onProbeStyleChange: (usingOnePiece: boolean) => void;
  onSubmitChart: () => void;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

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
  availableClientTags,
  chartForm,
  availableChartTags,
  onBack,
  onLogout,
  onOpenConsent,
  onStartEditClient,
  onCancelEditClient,
  onClientDetailFormChange,
  onToggleClientTag,
  onAddCustomClientTag,
  onSubmitClientDetails,
  onArchiveClient,
  onStartChart,
  onCancelChart,
  onEditChart,
  onDeleteChart,
  onChartFormChange,
  onToggleChartTag,
  onAddCustomChartTag,
  onPickChartImages,
  onRemoveChartImage,
  onProbeStyleChange,
  onSubmitChart
}: PluckrClientJournalStageProps) {
  const [showClientTagPicker, setShowClientTagPicker] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartEntryRecord | null>(null);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [chartPendingDelete, setChartPendingDelete] = useState<ChartEntryRecord | null>(null);

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
      <View style={styles.toolbar}>
        <Text style={styles.link} onPress={onBack}>
          ← Client List
        </Text>
        <View style={styles.toolbarActions}>
          <Pressable
            accessibilityRole="button"
            style={styles.contextButton}
            onPress={onStartEditClient}
          >
            <Text style={styles.contextButtonLabel}>Edit Client</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.contextButton}
            onPress={onOpenConsent}
          >
            <Text style={styles.contextButtonLabel}>
              {client.consent_signed_at ? "View Consent" : "Sign Consent"}
            </Text>
          </Pressable>
          <Text style={styles.logoutLink} onPress={onLogout}>
            Log Out
          </Text>
        </View>
      </View>

      <PluckrCard>
        <Text style={styles.eyebrow}>Client Journal</Text>
        <Text style={styles.title}>{client.first_name} {client.last_name}</Text>
        <View style={styles.contactStack}>
          {client.phone ? <Text style={styles.metaCopy}>Phone: {client.phone}</Text> : null}
          {client.email ? <Text style={styles.metaCopy}>Email: {client.email}</Text> : null}
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaChips}>
            <Text style={styles.metaChip}>{client.pronouns || "Client"}</Text>
            {client.consent_signed_at ? (
              <Text style={styles.metaChip}>Image Consent Signed</Text>
            ) : null}
            {(client.client_tags ?? []).map((tag) => (
              <Text key={tag} style={styles.metaChip}>{tag}</Text>
            ))}
          </View>
          <Text style={styles.subtitle}>
            {client.notes || "No care summary yet. Add notes or start the first chart entry below."}
          </Text>
          <Text style={styles.metaCopy}>Last seen {formatDateTime(client.last_seen_at || client.created_at)}</Text>
        </View>
        <View style={styles.heroActions}>
          <View style={styles.primaryActionWrap}>
            <PluckrButton label="New Chart Entry" onPress={() => onStartChart()} />
          </View>
        </View>
      </PluckrCard>

      {error ? <PluckrNoticeBanner tone="error" message={error} /> : null}
      {notice ? <PluckrNoticeBanner tone="success" message={notice} /> : null}
      {clientDetailError ? (
        <PluckrNoticeBanner tone="error" message={clientDetailError} />
      ) : null}
      {clientDetailNotice ? (
        <PluckrNoticeBanner tone="success" message={clientDetailNotice} />
      ) : null}

      {isEditingClient ? (
        <PluckrCard>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Edit Client</Text>
          </View>
          <View style={styles.detailEditorStack}>
            <View style={styles.fieldRow}>
              <PluckrTextField
                label="First Name"
                placeholder="First name"
                value={clientDetailForm.firstName}
                onChangeText={(value) => onClientDetailFormChange("firstName", value)}
              />
              <PluckrTextField
                label="Last Name"
                placeholder="Last name"
                value={clientDetailForm.lastName}
                onChangeText={(value) => onClientDetailFormChange("lastName", value)}
              />
            </View>
            <View style={styles.fieldRow}>
              <PluckrTextField
                label="Pronouns"
                placeholder="They/Them"
                value={clientDetailForm.pronouns}
                onChangeText={(value) => onClientDetailFormChange("pronouns", value)}
              />
              <PluckrTextField
                label="Phone"
                placeholder="Phone"
                value={clientDetailForm.phone}
                onChangeText={(value) => onClientDetailFormChange("phone", value)}
              />
            </View>
            <PluckrTextField
              label="Email"
              placeholder="Email"
              value={clientDetailForm.email}
              onChangeText={(value) => onClientDetailFormChange("email", value)}
            />
            <PluckrTextField
              label="Client Tags"
              placeholder="Client Tags"
              value={clientDetailForm.clientTags.join(", ")}
              editable={false}
              onChangeText={() => undefined}
            />
            <Pressable
              accessibilityRole="button"
              style={styles.tagSelector}
              onPress={() => setShowClientTagPicker(true)}
            >
              <Text style={styles.tagSelectorLabel}>Edit Client Tags</Text>
              <Text style={styles.tagSelectorValue}>
                {clientDetailForm.clientTags.length > 0
                  ? `${clientDetailForm.clientTags.length} selected`
                  : "Select tags"}
              </Text>
            </Pressable>
            {clientDetailForm.clientTags.length > 0 ? (
              <View style={styles.tagRow}>
                {clientDetailForm.clientTags.map((tag) => (
                  <Text key={tag} style={styles.metaChip}>{tag}</Text>
                ))}
              </View>
            ) : null}
            <PluckrTextField
              label="Notes"
              placeholder="History, care plan, reactions, reminders..."
              multiline
              value={clientDetailForm.notes}
              onChangeText={(value) => onClientDetailFormChange("notes", value)}
            />
            <View style={styles.detailActionRow}>
              <PluckrButton
                label={isSavingClient ? "Saving..." : "Save Client"}
                disabled={isSavingClient}
                onPress={onSubmitClientDetails}
              />
              <PluckrButton
                label="Cancel"
                variant="secondary"
                disabled={isSavingClient}
                onPress={onCancelEditClient}
              />
              <Pressable
                accessibilityRole="button"
                style={styles.archiveButton}
                onPress={() => setShowArchiveConfirm(true)}
              >
                <Text style={styles.archiveButtonLabel}>Archive</Text>
              </Pressable>
            </View>
          </View>
        </PluckrCard>
      ) : null}

      {isEditingChart ? (
        <PluckrChartEntryEditor
          client={client}
          isSavingChart={isSavingChart}
          chartForm={chartForm}
          availableChartTags={availableChartTags}
          onChartFormChange={onChartFormChange}
          onToggleChartTag={onToggleChartTag}
          onAddCustomChartTag={onAddCustomChartTag}
          onPickImages={onPickChartImages}
          onRemoveImage={onRemoveChartImage}
          onProbeStyleChange={onProbeStyleChange}
          onSubmitChart={onSubmitChart}
          onCancelChart={onCancelChart}
        />
      ) : null}

      <PluckrCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chart Entries</Text>
        </View>
        {isLoading ? (
          <Text style={styles.emptyState}>Loading journal...</Text>
        ) : charts.length === 0 ? (
          <View style={styles.emptyStateStack}>
            <Text style={styles.emptyStateTitle}>No chart entries yet</Text>
            <Text style={styles.emptyState}>Create the first one to start this client's history.</Text>
            <PluckrButton label="New Chart Entry" variant="secondary" onPress={() => onStartChart()} />
          </View>
        ) : (
          <View style={styles.listStack}>
            {charts.map((chart) => (
              <PluckrCard key={chart.id} compact>
                <Text style={styles.cardDate}>{formatDateTime(chart.created_at)}</Text>
                <Metric label="Modality" value={chart.modality || "Not recorded"} />
                <Metric label="Treatment Area" value={chart.treatment_area || "Not recorded"} />
                <Metric
                  label="Probe"
                  value={
                    chart.probe ||
                    `${chart.probe_is_one_piece ? "One-Piece" : "Two-Piece"} not recorded`
                  }
                />
                {modalityUsesRf(chart.modality ?? "") ? (
                  <Metric
                    label="RF"
                    value={
                      typeof chart.rf_level === "number"
                        ? `${chart.rf_level.toFixed(1)} Volts`
                        : "Not recorded"
                    }
                  />
                ) : null}
                {modalityUsesDc(chart.modality ?? "") ? (
                  <Metric
                    label="DC"
                    value={
                      typeof chart.dc_level === "number"
                        ? `${chart.dc_level.toFixed(1)} mA`
                        : "Not recorded"
                    }
                  />
                ) : null}
                {typeof chart.treatment_seconds === "number" ? (
                  <Metric
                    label="Time"
                    value={`${chart.treatment_seconds} sec`}
                  />
                ) : null}
                <Text style={styles.cardBody}>
                  {chart.treatment_summary || chart.notes || "No notes added yet."}
                </Text>
                <View style={styles.tagRow}>
                  {chart.tags.length > 0 ? (
                    chart.tags.map((tag) => (
                      <Text key={tag} style={styles.metaChip}>{tag}</Text>
                    ))
                  ) : (
                    <Text style={styles.metaCopy}>No tags yet</Text>
                  )}
                </View>
                {chart.image_urls.length > 0 ? (
                  <View style={styles.imageSection}>
                    <Text style={styles.imageMetaLabel}>
                      {chart.image_urls.length} photo{chart.image_urls.length === 1 ? "" : "s"}
                    </Text>
                    <View style={styles.imagePreviewRow}>
                      {chart.image_urls.slice(0, 3).map((imageUrl) => (
                        <Pressable
                          key={imageUrl}
                          accessibilityRole="button"
                          onPress={() => setSelectedImageUrl(imageUrl)}
                        >
                          <Image
                            source={{ uri: imageUrl }}
                            style={styles.imagePreview}
                            resizeMode="cover"
                          />
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ) : null}
                <View style={styles.entryActions}>
                  <Text style={styles.link} onPress={() => setSelectedChart(chart)}>Open</Text>
                  <Text style={styles.link} onPress={() => onEditChart(chart)}>Edit</Text>
                  <Text
                    style={styles.logoutLink}
                    onPress={() => setChartPendingDelete(chart)}
                  >
                    Delete
                  </Text>
                </View>
              </PluckrCard>
            ))}
          </View>
        )}
      </PluckrCard>

      <PluckrTagPickerDrawer
        visible={showClientTagPicker}
        title="Client Tags"
        selectedTags={clientDetailForm.clientTags}
        availableTags={availableClientTags}
        onToggleTag={onToggleClientTag}
        onAddCustomTag={onAddCustomClientTag}
        onClose={() => setShowClientTagPicker(false)}
      />
      <PluckrFullScreenImageModal
        visible={Boolean(selectedImageUrl)}
        imageUrl={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />
      <PluckrConfirmDialog
        visible={showArchiveConfirm}
        title="Archive Client?"
        message="The client will be removed from active lists but kept in the organization record."
        confirmLabel="Archive"
        onCancel={() => setShowArchiveConfirm(false)}
        onConfirm={() => {
          setShowArchiveConfirm(false);
          onArchiveClient();
        }}
      />
      <PluckrConfirmDialog
        visible={Boolean(chartPendingDelete)}
        title="Delete Chart Entry?"
        message="This treatment entry and its linked chart record will be removed from the journal."
        confirmLabel="Delete"
        onCancel={() => setChartPendingDelete(null)}
        onConfirm={() => {
          if (chartPendingDelete) {
            onDeleteChart(chartPendingDelete);
          }
          setChartPendingDelete(null);
        }}
      />
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.chartMetricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}
