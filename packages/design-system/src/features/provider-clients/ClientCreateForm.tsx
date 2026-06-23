import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { PluckrTagPickerDrawer } from "../../PluckrTagPickerDrawer";
import { PluckrSectionHeader } from "../../composite/SectionHeader";
import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrClientListStageStyles as styles } from "./ClientListStage.styles";
import { PronounPickerField } from "./PronounPickerField";

type Props = {
  isSavingClient: boolean;
  clientForm: {
    firstName: string;
    lastName: string;
    pronouns: string;
    phone: string;
    email: string;
    careSummary: string;
    clientTags: string[];
    consentSigned: boolean;
  };
  availableClientTags: string[];
  onCancelCreate: () => void;
  onFormChange: (
    key:
      | "firstName"
      | "lastName"
      | "pronouns"
      | "phone"
      | "email"
      | "careSummary"
      | "consentSigned",
    value: string | boolean
  ) => void;
  onToggleClientTag: (tagLabel: string) => void;
  onAddCustomClientTag: (tagLabel: string) => void;
  onSubmitClient: () => void;
};

export function ClientCreateForm({
  isSavingClient,
  clientForm,
  availableClientTags,
  onCancelCreate,
  onFormChange,
  onToggleClientTag,
  onAddCustomClientTag,
  onSubmitClient
}: Props) {
  const [showClientTagPicker, setShowClientTagPicker] = useState(false);

  return (
    <>
      <PluckrCard>
        <View style={styles.formStack}>
          <PluckrSectionHeader title="New Client" />
          <Text style={styles.formCopy}>
            Start with the care details you need to open treatment quickly.
          </Text>
          <View style={styles.fieldRow}>
            <PluckrTextField
              label="First Name"
              placeholder="First Name"
              value={clientForm.firstName}
              onChangeText={(value) => onFormChange("firstName", value)}
            />
            <PluckrTextField
              label="Last Name"
              placeholder="Last Name"
              value={clientForm.lastName}
              onChangeText={(value) => onFormChange("lastName", value)}
            />
          </View>
          <View style={styles.fieldRow}>
            <PronounPickerField
              value={clientForm.pronouns}
              onChange={(value) => onFormChange("pronouns", value)}
            />
            <PluckrTextField
              label="Phone Number"
              placeholder="Phone Number"
              value={clientForm.phone}
              onChangeText={(value) => onFormChange("phone", value)}
            />
          </View>
          <PluckrTextField
            label="Email Address"
            placeholder="Email Address"
            value={clientForm.email}
            onChangeText={(value) => onFormChange("email", value)}
          />
          <Pressable
            accessibilityRole="button"
            style={styles.tagSelector}
            onPress={() => setShowClientTagPicker(true)}
          >
            <Text style={styles.tagSelectorLabel}>Care Tags</Text>
            <Text style={styles.tagSelectorValue}>
              {clientForm.clientTags.length > 0
                ? `${clientForm.clientTags.length} selected`
                : "Select tags"}
            </Text>
          </Pressable>
          {clientForm.clientTags.length > 0 ? (
            <View style={styles.tagRow}>
              {clientForm.clientTags.map((tag) => (
                <Text key={tag} style={styles.tagChip}>
                  {tag}
                </Text>
              ))}
            </View>
          ) : null}
          <View style={styles.segmentRow}>
            <Pressable
              accessibilityRole="button"
              style={[
                styles.segmentButton,
                clientForm.consentSigned ? styles.segmentButtonActive : null
              ]}
              onPress={() => onFormChange("consentSigned", true)}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  clientForm.consentSigned ? styles.segmentLabelActive : null
                ]}
              >
                Consent signed
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[
                styles.segmentButton,
                !clientForm.consentSigned ? styles.segmentButtonActive : null
              ]}
              onPress={() => onFormChange("consentSigned", false)}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  !clientForm.consentSigned ? styles.segmentLabelActive : null
                ]}
              >
                Consent pending
              </Text>
            </Pressable>
          </View>
          <PluckrTextField
            label="Care Summary"
            placeholder="Primary treatment reason, care flags, reminders..."
            multiline
            value={clientForm.careSummary}
            onChangeText={(value) => onFormChange("careSummary", value)}
          />
          <PluckrButton
            label={isSavingClient ? "Saving..." : "Save Client"}
            disabled={isSavingClient}
            onPress={() => onSubmitClient()}
          />
          <PluckrButton
            label="Cancel"
            variant="secondary"
            disabled={isSavingClient}
            onPress={() => onCancelCreate()}
          />
        </View>
      </PluckrCard>
      <PluckrTagPickerDrawer
        visible={showClientTagPicker}
        title="Client Tags"
        selectedTags={clientForm.clientTags}
        availableTags={availableClientTags}
        onToggleTag={onToggleClientTag}
        onAddCustomTag={onAddCustomClientTag}
        onClose={() => setShowClientTagPicker(false)}
      />
    </>
  );
}
