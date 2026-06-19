/**
 * Mobile Swift-parity client journal screen with a lightweight chart editor.
 */
import React from "react";
import { Text, View } from "react-native";
import type { ChartEntryRecord, ClientRecord } from "@pluckr/supabase";

import { PaperCard } from "./PaperCard";
import { PluckrButton } from "./PluckrButton";
import { PluckrTextField } from "./PluckrTextField";
import { styles } from "./mobileClientJournalStyles";

type MobileClientJournalStageProps = {
  client: ClientRecord;
  charts: ChartEntryRecord[];
  isLoading: boolean;
  error: string | null;
  notice: string | null;
  isEditingChart: boolean;
  isSavingChart: boolean;
  chartForm: {
    modality: string;
    treatmentArea: string;
    treatmentSummary: string;
    notes: string;
    tags: string;
  };
  onBack: () => void;
  onLogout: () => void;
  onStartChart: () => void;
  onCancelChart: () => void;
  onEditChart: (chart: ChartEntryRecord) => void;
  onDeleteChart: (chart: ChartEntryRecord) => void;
  onChartFormChange: (
    key: "modality" | "treatmentArea" | "treatmentSummary" | "notes" | "tags",
    value: string
  ) => void;
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

export function MobileClientJournalStage({
  client,
  charts,
  isLoading,
  error,
  notice,
  isEditingChart,
  isSavingChart,
  chartForm,
  onBack,
  onLogout,
  onStartChart,
  onCancelChart,
  onEditChart,
  onDeleteChart,
  onChartFormChange,
  onSubmitChart
}: MobileClientJournalStageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.link} onPress={onBack}>
          ← Client List
        </Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <PaperCard>
        <Text style={styles.eyebrow}>Client Journal</Text>
        <Text style={styles.title}>
          {client.first_name} {client.last_name}
        </Text>
        <Text style={styles.subtitle}>
          {client.notes || "No care summary yet. Start the first chart entry below."}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaChip}>{client.pronouns || "Client"}</Text>
          <Text style={styles.metaCopy}>
            {client.email || client.phone || "No direct contact on file"}
          </Text>
        </View>
        <View style={styles.heroActions}>
          <PluckrButton label="New Chart Entry" onPress={() => onStartChart()} />
        </View>
      </PaperCard>

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? (
        <Text style={[styles.message, styles.success]}>{notice}</Text>
      ) : null}

      {isEditingChart ? (
        <PaperCard>
          <View style={styles.formStack}>
            <Text style={styles.sectionTitle}>Chart Entry</Text>
            <PluckrTextField
              label="Modality"
              placeholder="Modality"
              value={chartForm.modality}
              onChangeText={(value) => onChartFormChange("modality", value)}
            />
            <PluckrTextField
              label="Treatment Area"
              placeholder="Treatment Area"
              value={chartForm.treatmentArea}
              onChangeText={(value) => onChartFormChange("treatmentArea", value)}
            />
            <PluckrTextField
              label="Treatment Summary"
              placeholder="Treatment Summary"
              multiline
              value={chartForm.treatmentSummary}
              onChangeText={(value) =>
                onChartFormChange("treatmentSummary", value)
              }
            />
            <PluckrTextField
              label="Clinical Notes"
              placeholder="Clinical Notes"
              multiline
              value={chartForm.notes}
              onChangeText={(value) => onChartFormChange("notes", value)}
            />
            <PluckrTextField
              label="Tags"
              placeholder="follow-up, intake"
              value={chartForm.tags}
              onChangeText={(value) => onChartFormChange("tags", value)}
            />
            <PluckrButton
              label={isSavingChart ? "Saving..." : "Save Chart"}
              disabled={isSavingChart}
              onPress={() => onSubmitChart()}
            />
            <PluckrButton
              label="Cancel"
              variant="secondary"
              disabled={isSavingChart}
              onPress={() => onCancelChart()}
            />
          </View>
        </PaperCard>
      ) : null}

      <PaperCard>
        {isLoading ? (
          <Text style={styles.emptyState}>Loading journal...</Text>
        ) : charts.length === 0 ? (
          <Text style={styles.emptyState}>
            No chart entries yet. Create the first one to start this client's history.
          </Text>
        ) : (
          <View style={styles.listStack}>
            {charts.map((chart) => (
              <PaperCard key={chart.id} compact>
                <Text style={styles.cardTitle}>
                  {chart.treatment_area || chart.modality || "Chart Entry"}
                </Text>
                <Text style={styles.cardBody}>
                  {chart.treatment_summary || chart.notes || "No summary added yet."}
                </Text>
                <Text style={styles.cardMeta}>{formatDateTime(chart.created_at)}</Text>
                <View style={styles.tagRow}>
                  {chart.tags.length > 0 ? (
                    chart.tags.map((tag) => (
                      <Text key={tag} style={styles.metaChip}>
                        {tag}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.metaCopy}>No tags yet</Text>
                  )}
                </View>
                <View style={styles.entryActions}>
                  <Text style={styles.link} onPress={() => onEditChart(chart)}>
                    Edit
                  </Text>
                  <Text style={styles.logoutLink} onPress={() => onDeleteChart(chart)}>
                    Delete
                  </Text>
                </View>
              </PaperCard>
            ))}
          </View>
        )}
      </PaperCard>
    </View>
  );
}
