import React, { useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import {
  appointmentDurationPresets,
  chartModalities,
  type ChartEntryRecord,
  type ChartImageDraft,
  type ClientRecord,
  formatProbeName,
  modalityUsesDc,
  modalityUsesRf,
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

type TreatmentAreaForm = {
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

type TreatmentAreaFormKey =
  | "modality"
  | "rfLevel"
  | "dcLevel"
  | "treatmentSeconds"
  | "probeShank"
  | "probeSize"
  | "probeMaterial"
  | "treatmentAreaSelection"
  | "treatmentAreaOther"
  | "notes";

type ActiveDrawer =
  | null
  | { type: "duration" | "tags" }
  | { type: "area" | "probe" | "rf" | "dc" | "time"; areaId: string };

type ChartEditorProps = {
  client: ClientRecord;
  isSavingChart: boolean;
  chartForm: {
    appointmentDurationMinutes: string;
    treatmentAreas: TreatmentAreaForm[];
    treatmentSummary: string;
    notes: string;
    tags: string[];
    images: ChartImageDraft[];
  };
  availableChartTags: string[];
  previousChartReferencesByAreaId: Record<string, ChartEntryRecord | null>;
  onChartFormChange: (
    key: "appointmentDurationMinutes" | "treatmentSummary" | "notes",
    value: string
  ) => void;
  onTreatmentAreaFormChange: (
    areaId: string,
    key: TreatmentAreaFormKey,
    value: string
  ) => void;
  onAddTreatmentArea: () => void;
  onToggleChartTag: (tagLabel: string) => void;
  onAddCustomChartTag: (tagLabel: string) => void;
  onPickImages: () => void;
  onRemoveImage: (image: ChartImageDraft) => void;
  onProbeStyleChange: (areaId: string, usingOnePiece: boolean) => void;
  onOpenPreviousChart?: (chart: ChartEntryRecord) => void;
  onSubmitChart: () => void;
  onCancelChart: () => void;
};

/**
 * Shared chart editor for one appointment/session.
 *
 * A session owns appointment-level metadata and one or more treatment-area
 * blocks. Each area keeps independent settings so providers can document
 * multiple body areas without creating separate appointments.
 */
export function PluckrChartEntryEditor({
  client,
  isSavingChart,
  chartForm,
  availableChartTags,
  previousChartReferencesByAreaId,
  onChartFormChange,
  onTreatmentAreaFormChange,
  onAddTreatmentArea,
  onToggleChartTag,
  onAddCustomChartTag,
  onPickImages,
  onRemoveImage,
  onProbeStyleChange,
  onOpenPreviousChart,
  onSubmitChart,
  onCancelChart
}: ChartEditorProps) {
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const activeTreatmentArea = useMemo(() => {
    if (!activeDrawer || !("areaId" in activeDrawer)) {
      return null;
    }

    return (
      chartForm.treatmentAreas.find((area) => area.id === activeDrawer.areaId) ??
      null
    );
  }, [activeDrawer, chartForm.treatmentAreas]);

  return (
    <PluckrCard>
      <View style={styles.editorShell}>
        <View style={styles.editorHeader}>
          <Text style={styles.kicker}>Treatment Log</Text>
          <Text style={styles.title}>Chart Entry</Text>
          <Text style={styles.copy}>One appointment, multiple areas.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment</Text>
          <SelectionField
            label="Duration"
            value={
              chartForm.appointmentDurationMinutes
                ? `${chartForm.appointmentDurationMinutes} min`
                : "Select duration"
            }
            hint="Required"
            onPress={() => setActiveDrawer({ type: "duration" })}
          />
        </View>

        {chartForm.treatmentAreas.map((area, index) => (
          <TreatmentAreaSection
            key={area.id}
            area={area}
            index={index}
            treatmentAreaCount={chartForm.treatmentAreas.length}
            previousChartReference={
              previousChartReferencesByAreaId[area.id] ?? null
            }
            onOpenDrawer={setActiveDrawer}
            onFieldChange={onTreatmentAreaFormChange}
            onOpenPreviousChart={onOpenPreviousChart}
          />
        ))}

        <Pressable
          accessibilityRole="button"
          style={styles.addTreatmentAreaButton}
          onPress={onAddTreatmentArea}
        >
          <Text style={styles.addTreatmentAreaLabel}>+ Add Treatment Area</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chart Tags</Text>
          <SelectionField
            label="Tags"
            value={
              chartForm.tags.length > 0
                ? `${chartForm.tags.length} selected`
                : "Select tags"
            }
            onPress={() => setActiveDrawer({ type: "tags" })}
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
                ? "Consent is on file. Add and review session photos here."
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
        visible={activeDrawer?.type === "probe" && Boolean(activeTreatmentArea)}
        usingOnePiece={activeTreatmentArea?.usingOnePiece ?? true}
        probeShank={activeTreatmentArea?.probeShank ?? "F"}
        probeSize={activeTreatmentArea?.probeSize ?? "3"}
        probeMaterial={activeTreatmentArea?.probeMaterial ?? "Gold"}
        onClose={() => setActiveDrawer(null)}
        onProbeStyleChange={(usingOnePiece) => {
          if (activeTreatmentArea) {
            onProbeStyleChange(activeTreatmentArea.id, usingOnePiece);
          }
        }}
        onProbeChange={(key, value) => {
          if (activeTreatmentArea) {
            onTreatmentAreaFormChange(activeTreatmentArea.id, key, value);
          }
        }}
      />
      <PluckrOptionDrawer
        visible={activeDrawer?.type === "area" && Boolean(activeTreatmentArea)}
        title="Treatment Area"
        onClose={() => setActiveDrawer(null)}
        options={treatmentAreaOptions.map((areaOption) => ({
          label: areaOption,
          selected: activeTreatmentArea?.treatmentAreaSelection === areaOption,
          onPress: () => {
            if (!activeTreatmentArea) {
              return;
            }

            onTreatmentAreaFormChange(
              activeTreatmentArea.id,
              "treatmentAreaSelection",
              areaOption
            );
            if (areaOption !== "Other") {
              onTreatmentAreaFormChange(
                activeTreatmentArea.id,
                "treatmentAreaOther",
                ""
              );
            }
            setActiveDrawer(null);
          }
        }))}
      />
      <PluckrStepPickerDrawer
        visible={activeDrawer?.type === "rf" && Boolean(activeTreatmentArea)}
        title="RF"
        value={Number.parseFloat(activeTreatmentArea?.rfLevel ?? "") || 10}
        unit="Volts"
        step={5}
        min={10}
        max={300}
        onChange={(value) => {
          if (activeTreatmentArea) {
            onTreatmentAreaFormChange(
              activeTreatmentArea.id,
              "rfLevel",
              value.toFixed(1)
            );
          }
        }}
        onClose={() => setActiveDrawer(null)}
      />
      <PluckrStepPickerDrawer
        visible={activeDrawer?.type === "dc" && Boolean(activeTreatmentArea)}
        title="DC"
        value={Number.parseFloat(activeTreatmentArea?.dcLevel ?? "") || 0.1}
        unit="mA"
        step={0.1}
        min={0.1}
        max={300}
        onChange={(value) => {
          if (activeTreatmentArea) {
            onTreatmentAreaFormChange(
              activeTreatmentArea.id,
              "dcLevel",
              value.toFixed(1)
            );
          }
        }}
        onClose={() => setActiveDrawer(null)}
      />
      <PluckrStepPickerDrawer
        visible={activeDrawer?.type === "time" && Boolean(activeTreatmentArea)}
        title="Time"
        subtitle="Scroll to the insertion time."
        value={
          Number.parseFloat(activeTreatmentArea?.treatmentSeconds ?? "") || 3
        }
        unit="sec"
        step={1}
        min={1}
        max={30}
        onChange={(value) => {
          if (activeTreatmentArea) {
            onTreatmentAreaFormChange(
              activeTreatmentArea.id,
              "treatmentSeconds",
              value.toFixed(0)
            );
          }
        }}
        onClose={() => setActiveDrawer(null)}
      />
      <PluckrOptionDrawer
        visible={activeDrawer?.type === "duration"}
        title="Appointment Duration"
        onClose={() => setActiveDrawer(null)}
        options={appointmentDurationPresets.map((duration) => ({
          label: `${duration} min`,
          selected: chartForm.appointmentDurationMinutes === String(duration),
          onPress: () => {
            onChartFormChange("appointmentDurationMinutes", String(duration));
            setActiveDrawer(null);
          }
        }))}
      />
      <PluckrTagPickerDrawer
        visible={activeDrawer?.type === "tags"}
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

function TreatmentAreaSection({
  area,
  index,
  treatmentAreaCount,
  previousChartReference,
  onOpenDrawer,
  onFieldChange,
  onOpenPreviousChart
}: {
  area: TreatmentAreaForm;
  index: number;
  treatmentAreaCount: number;
  previousChartReference: ChartEntryRecord | null;
  onOpenDrawer: (drawer: ActiveDrawer) => void;
  onFieldChange: (
    areaId: string,
    key: TreatmentAreaFormKey,
    value: string
  ) => void;
  onOpenPreviousChart?: (chart: ChartEntryRecord) => void;
}) {
  const selectedProbe = formatProbeName({
    shank: area.probeShank,
    size: area.probeSize,
    material: area.probeMaterial
  });
  const areaValue = useMemo(() => {
    if (area.treatmentAreaSelection === "Other") {
      return area.treatmentAreaOther || "Other";
    }

    return area.treatmentAreaSelection || "Choose treatment area";
  }, [area.treatmentAreaOther, area.treatmentAreaSelection]);

  return (
    <View style={styles.treatmentAreaBlock}>
      {index > 0 ? <View style={styles.areaDivider} /> : null}
      <View style={styles.treatmentAreaHeader}>
        <Text style={styles.sectionTitle}>
          {treatmentAreaCount > 1
            ? `Treatment Area ${index + 1}`
            : "Treatment Area"}
        </Text>
      </View>

      <View style={styles.sectionBody}>
        <SelectionField
          label="Treatment Area"
          value={areaValue}
          onPress={() => onOpenDrawer({ type: "area", areaId: area.id })}
        />
        {area.treatmentAreaSelection === "Other" ? (
          <PluckrTextField
            label="Other"
            placeholder="Enter the treatment area"
            value={area.treatmentAreaOther}
            onChangeText={(value) =>
              onFieldChange(area.id, "treatmentAreaOther", value)
            }
          />
        ) : null}
      </View>

      <PreviousChartReference
        chart={previousChartReference}
        onOpenChart={onOpenPreviousChart}
      />

      <View style={styles.sectionBody}>
        <Text style={styles.sectionTitleSmall}>Modality</Text>
        <View style={styles.modalityRow}>
          {chartModalities.map((modality) => (
            <Pressable
              key={modality}
              accessibilityRole="button"
              style={[
                styles.modalityButton,
                area.modality === modality ? styles.modalityButtonActive : null
              ]}
              onPress={() => onFieldChange(area.id, "modality", modality)}
            >
              <Text
                style={[
                  styles.modalityLabel,
                  area.modality === modality ? styles.modalityLabelActive : null
                ]}
              >
                {modality}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.sectionBody}>
        <Text style={styles.sectionTitleSmall}>Settings</Text>
        <View style={styles.machineGrid}>
          <SelectionField
            label="Probe"
            value={selectedProbe ? `Probe: ${selectedProbe}` : "Set probe"}
            hint={area.usingOnePiece ? "1pc" : "2pc"}
            onPress={() => onOpenDrawer({ type: "probe", areaId: area.id })}
          />
          {modalityUsesRf(area.modality) ? (
            <MachineTile
              label="RF"
              value={area.rfLevel}
              unit="V"
              onPress={() => onOpenDrawer({ type: "rf", areaId: area.id })}
            />
          ) : null}
          {modalityUsesDc(area.modality) ? (
            <MachineTile
              label="DC"
              value={area.dcLevel}
              unit="mA"
              onPress={() => onOpenDrawer({ type: "dc", areaId: area.id })}
            />
          ) : null}
          <MachineTile
            label="Time"
            value={area.treatmentSeconds}
            unit="sec"
            onPress={() => onOpenDrawer({ type: "time", areaId: area.id })}
          />
        </View>
      </View>

      <View style={styles.sectionBody}>
        <Text style={styles.sectionTitleSmall}>Area Notes</Text>
        <PluckrTextField
          label="Area Notes"
          placeholder="Reaction, insertions, blend, follow-up..."
          multiline
          value={area.notes}
          onChangeText={(value) => onFieldChange(area.id, "notes", value)}
        />
      </View>
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
