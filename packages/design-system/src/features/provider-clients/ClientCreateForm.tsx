import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { PluckrTagPickerDrawer } from "../../PluckrTagPickerDrawer";
import { PluckrButton } from "../../primitives/Button";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrClientListStageStyles as styles } from "./ClientListStage.styles";
import { PronounPickerField } from "./PronounPickerField";

type Props = {
  isSavingClient: boolean;
  clientForm: {
    preferredName: string;
    firstName: string;
    lastName: string;
    pronouns: string;
    phone: string;
    email: string;
    careSummary: string;
    clientTags: string[];
    consentSigned: boolean;
  };
  clientFormErrors: Partial<
    Record<"preferredName" | "firstName" | "lastName" | "email" | "phone", string>
  >;
  availableClientTags: string[];
  onCancelCreate: () => void;
  onFormChange: (
    key:
      | "firstName"
      | "preferredName"
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
  clientFormErrors,
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
      <View style={styles.formStack}>
        <View style={styles.intakeSection}>
          <Text style={styles.intakeSectionTitle}>Daily care</Text>
          <Text style={styles.formCopy}>
            Use the name providers should see during treatment. Legal details stay
            in the record, not the primary workspace.
          </Text>
          <PluckrTextField
            label="Name"
            placeholder="Name used in daily care"
            value={clientForm.preferredName}
            autoCapitalize="words"
            textContentType="name"
            error={clientFormErrors.preferredName}
            onChangeText={(value) => onFormChange("preferredName", value)}
          />
          <PronounPickerField
            value={clientForm.pronouns}
            onChange={(value) => onFormChange("pronouns", value)}
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
        </View>

        <View style={styles.intakeSection}>
          <Text style={styles.intakeSectionTitle}>Legal and contact</Text>
          <View style={styles.fieldRow}>
            <PluckrTextField
              label="Legal First"
              placeholder="Legal first name"
              value={clientForm.firstName}
              autoCapitalize="words"
              textContentType="givenName"
              error={clientFormErrors.firstName}
              onChangeText={(value) => onFormChange("firstName", value)}
            />
            <PluckrTextField
              label="Legal Last"
              placeholder="Legal last name"
              value={clientForm.lastName}
              autoCapitalize="words"
              textContentType="familyName"
              error={clientFormErrors.lastName}
              onChangeText={(value) => onFormChange("lastName", value)}
            />
          </View>
          <View style={styles.fieldRow}>
            <PluckrTextField
              label="Phone"
              placeholder="555-555-5555"
              value={clientForm.phone}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              error={clientFormErrors.phone}
              onChangeText={(value) => onFormChange("phone", value)}
            />
          </View>
          <PluckrTextField
            label="Email"
            placeholder="client@example.com"
            value={clientForm.email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            error={clientFormErrors.email}
            onChangeText={(value) => onFormChange("email", value)}
          />
        </View>

        <View style={styles.intakeSection}>
          <Text style={styles.intakeSectionTitle}>Consent and notes</Text>
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
        </View>

        <View style={styles.formActionStack}>
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
      </View>
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
