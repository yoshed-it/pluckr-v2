import React, { useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import {
  appointmentDurationPresets,
  chartModalities,
  type ChartEntryRecord,
  type ChartImageDraft,
  type ClientRecord,
  modalityUsesDc,
  modalityUsesRf,
  formatProbeName,
  treatmentAreaOptions
} from "@pluckr/domain";

import { PluckrOptionDrawer } from "../../PluckrOptionDrawer";
import { PluckrStepPickerDrawer } from "../../PluckrStepPickerDrawer";
import { PluckrTagPickerDrawer } from "../../PluckrTagPickerDrawer";
import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrChartEntryEditorStyles as styles } from "./ChartEntryEditor.styles";
import { PluckrProbeDrawer } from "./ProbeDrawer";
import { PreviousChartReference } from "./PreviousChartReference";

type ChartEditorProps = {
  client: ClientRecord;
  isSavingChart: boolean;
  chartForm: {
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
    notes: string;
    tags: string[];
    images: ChartImageDraft[];
  };
  availableChartTags: string[];
  previousChartReference: ChartEntryRecord | null;
  onChartFormChange: (
    key:
      | "modality"
      | "rfLevel"
      | "dcLevel"
      | "treatmentSeconds"
      | "appointmentDurationMinutes"
      | "probeShank"
      | "probeSize"
      | "probeMaterial"
      | "treatmentAreaSelection"
      | "treatmentAreaOther"
      | "notes",
    value: string
  ) => void;
  onToggleChartTag: (tagLabel: string) => void;
  onAddCustomChartTag: (tagLabel: string) => void;
  onPickImages: () => void;
  onRemoveImage: (image: ChartImageDraft) => void;
  onProbeStyleChange: (usingOnePiece: boolean) => void;
  onSubmitChart: () => void;
  onCancelChart: () => void;
};

/**
 * Shared chart editor for the parity shell.
 *
 * Electrologists already know the workflow, so the UI stays compact and avoids
 * explanatory labels that slow them down.
 */
export function PluckrChartEntryEditor({
  client,
  isSavingChart,
  chartForm,
  availableChartTags,
  previousChartReference,
  onChartFormChange,
  onToggleChartTag,
  onAddCustomChartTag,
  onPickImages,
  onRemoveImage,
  onProbeStyleChange,
  onSubmitChart,
  onCancelChart
}: ChartEditorProps) {
  const [activeDrawer, setActiveDrawer] = useState<
    null | "probe" | "area" | "rf" | "dc" | "time" | "tags"
  >(null);

  const selectedProbe = formatProbeName({
    shank: chartForm.probeShank,
    size: chartForm.probeSize,
    material: chartForm.probeMaterial
  });
  const areaValue = useMemo(() => {
    if (chartForm.treatmentAreaSelection === "Other") {
      return chartForm.treatmentAreaOther || "Other";
    }

    return chartForm.treatmentAreaSelection || "Choose treatment area";
  }, [chartForm.treatmentAreaOther, chartForm.treatmentAreaSelection]);

  return (
    <PluckrCard>
      <View style={styles.editorShell}>
        <View style={styles.editorHeader}>
          <Text style={styles.kicker}>Treatment Log</Text>
          <Text style={styles.title}>Chart Entry</Text>
          <Text style={styles.copy}>Fast charting, nothing extra.</Text>
        </View>

        <PreviousChartReference chart={previousChartReference} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment</Text>
          <DurationPresetSelector
            value={chartForm.appointmentDurationMinutes}
            onChange={(nextValue) =>
              onChartFormChange("appointmentDurationMinutes", nextValue)
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modality</Text>
          <View style={styles.modalityRow}>
            {chartModalities.map((modality) => (
              <Pressable
                key={modality}
                accessibilityRole="button"
                style={[
                  styles.modalityButton,
                  chartForm.modality === modality ? styles.modalityButtonActive : null
                ]}
                onPress={() => onChartFormChange("modality", modality)}
              >
                <Text
                  style={[
                    styles.modalityLabel,
                    chartForm.modality === modality ? styles.modalityLabelActive : null
                  ]}
                >
                  {modality}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {(modalityUsesRf(chartForm.modality) ||
          modalityUsesDc(chartForm.modality) ||
          Boolean(chartForm.modality)) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.machineGrid}>
              {modalityUsesRf(chartForm.modality) ? (
                <MachineTile
                  label="RF"
                  value={chartForm.rfLevel}
                  unit="V"
                  onPress={() => setActiveDrawer("rf")}
                />
              ) : null}
              {modalityUsesDc(chartForm.modality) ? (
                <MachineTile
                  label="DC"
                  value={chartForm.dcLevel}
                  unit="mA"
                  onPress={() => setActiveDrawer("dc")}
                />
              ) : null}
              <MachineTile
                label="Seconds"
                value={chartForm.treatmentSeconds}
                unit="sec"
                onPress={() => setActiveDrawer("time")}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Probe</Text>
          <SelectionField
            label="Probe"
            value={selectedProbe ? `Probe: ${selectedProbe}` : "Set probe"}
            hint={chartForm.usingOnePiece ? "1pc" : "2pc"}
            onPress={() => setActiveDrawer("probe")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Treatment Area</Text>
          <View style={styles.sectionBody}>
            <SelectionField
              label="Area"
              value={areaValue}
              onPress={() => setActiveDrawer("area")}
            />
            {chartForm.treatmentAreaSelection === "Other" ? (
              <PluckrTextField
                label="Other"
                placeholder="Enter the treatment area"
                value={chartForm.treatmentAreaOther}
                onChangeText={(value) =>
                  onChartFormChange("treatmentAreaOther", value)
                }
              />
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <PluckrTextField
            label="Notes"
            placeholder="Reaction, insertions, blend, follow-up..."
            multiline
            value={chartForm.notes}
            onChangeText={(value) => onChartFormChange("notes", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chart Tags</Text>
          <SelectionField
            label="Tags"
            value={
              chartForm.tags.length > 0
                ? `${chartForm.tags.length} selected`
                : "Select tags"
            }
            onPress={() => setActiveDrawer("tags")}
          />
          {chartForm.tags.length > 0 ? (
            <View style={styles.tagWrap}>
              {chartForm.tags.map((tag) => (
                <Pressable
                  key={tag}
                  accessibilityRole="button"
                  style={styles.tagChip}
                  onPress={() => onToggleChartTag(tag)}
                >
                  <Text style={styles.tagChipLabel}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.imageCallout}>
            <Text style={styles.imageTitle}>Treatment Photos</Text>
            <Text style={styles.imageCopy}>
              {client.consent_signed_at
                ? "Consent is on file. Add and review treatment photos here."
                : "Image consent is required before photos can be added."}
            </Text>
            <View style={styles.imageActionRow}>
              <PluckrButton
                label={client.consent_signed_at ? "Add Photos" : "Open Consent"}
                variant="secondary"
                disabled={isSavingChart}
                onPress={onPickImages}
              />
            </View>
            {chartForm.images.length > 0 ? (
              <View style={styles.imagePreviewGrid}>
                {chartForm.images.map((image) => (
                  <View key={image.storagePath} style={styles.imagePreviewCard}>
                    <Image
                      source={{ uri: image.previewUrl }}
                      style={styles.imagePreview}
                      resizeMode="cover"
                    />
                    <Pressable
                      accessibilityRole="button"
                      style={styles.imageRemoveButton}
                      onPress={() => onRemoveImage(image)}
                    >
                      <Text style={styles.imageRemoveLabel}>Remove</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.actionRow}>
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
      </View>

      <PluckrProbeDrawer
        visible={activeDrawer === "probe"}
        usingOnePiece={chartForm.usingOnePiece}
        probeShank={chartForm.probeShank}
        probeSize={chartForm.probeSize}
        probeMaterial={chartForm.probeMaterial}
        onClose={() => setActiveDrawer(null)}
        onProbeStyleChange={onProbeStyleChange}
        onProbeChange={onChartFormChange}
      />
      <PluckrOptionDrawer
        visible={activeDrawer === "area"}
        title="Treatment Area"
        onClose={() => setActiveDrawer(null)}
        options={treatmentAreaOptions.map((area) => ({
          label: area,
          selected: chartForm.treatmentAreaSelection === area,
          onPress: () => {
            onChartFormChange("treatmentAreaSelection", area);
            if (area !== "Other") {
              onChartFormChange("treatmentAreaOther", "");
            }
            setActiveDrawer(null);
          }
        }))}
      />
      <PluckrStepPickerDrawer
        visible={activeDrawer === "rf"}
        title="RF"
        value={Number.parseFloat(chartForm.rfLevel) || 10}
        unit="Volts"
        step={5}
        min={10}
        max={300}
        onChange={(value) => onChartFormChange("rfLevel", value.toFixed(1))}
        onClose={() => setActiveDrawer(null)}
      />
      <PluckrStepPickerDrawer
        visible={activeDrawer === "dc"}
        title="DC"
        value={Number.parseFloat(chartForm.dcLevel) || 0.1}
        unit="mA"
        step={0.1}
        min={0.1}
        max={300}
        onChange={(value) => onChartFormChange("dcLevel", value.toFixed(1))}
        onClose={() => setActiveDrawer(null)}
      />
      <PluckrStepPickerDrawer
        visible={activeDrawer === "time"}
        title="Insertion Seconds"
        subtitle="Scroll to the insertion time."
        value={Number.parseFloat(chartForm.treatmentSeconds) || 3}
        unit="sec"
        step={1}
        min={1}
        max={30}
        onChange={(value) =>
          onChartFormChange("treatmentSeconds", value.toFixed(0))
        }
        onClose={() => setActiveDrawer(null)}
      />
      <PluckrTagPickerDrawer
        visible={activeDrawer === "tags"}
        title="Chart Tags"
        selectedTags={chartForm.tags}
        availableTags={availableChartTags}
        onToggleTag={onToggleChartTag}
        onAddCustomTag={onAddCustomChartTag}
        onClose={() => setActiveDrawer(null)}
      />
    </PluckrCard>
  );
}

function DurationPresetSelector({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.durationPresetGroup}>
      <View style={styles.durationPresetRow}>
        {appointmentDurationPresets.map((duration) => {
          const label = `${duration} min`;
          const selected = value === String(duration);

          return (
            <Pressable
              key={duration}
              accessibilityLabel={`Appointment duration ${label}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[
                styles.durationPresetChip,
                selected ? styles.durationPresetChipActive : null
              ]}
              onPress={() => onChange(String(duration))}
            >
              <Text
                style={[
                  styles.durationPresetLabel,
                  selected ? styles.durationPresetLabelActive : null
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.requiredHint}>Required for every chart entry.</Text>
    </View>
  );
}

function SelectionField({
  label,
  value,
  hint,
  onPress
}: {
  label: string;
  value: string;
  hint?: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" style={styles.compactField} onPress={onPress}>
      <Text style={styles.compactLabel}>{label}</Text>
      <Text style={styles.compactValue}>{value}</Text>
      {hint ? <Text style={styles.compactHint}>{hint}</Text> : null}
    </Pressable>
  );
}

function MachineTile({
  label,
  value,
  unit,
  onPress
}: {
  label: string;
  value: string;
  unit: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" style={styles.machineTile} onPress={onPress}>
      <Text style={styles.machineLabel}>{label}</Text>
      <View style={styles.machineValueRow}>
        <Text style={styles.machineValue}>{value}</Text>
        <Text style={styles.machineUnit}>{unit}</Text>
      </View>
    </Pressable>
  );
}
