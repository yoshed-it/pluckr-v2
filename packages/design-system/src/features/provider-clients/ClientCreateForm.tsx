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
    birthDate: string;
    pronouns: string;
    phone: string;
    email: string;
    internalNotes: string;
    clientTags: string[];
  };
  clientFormErrors: Partial<
    Record<
      | "preferredName"
      | "firstName"
      | "lastName"
      | "birthDate"
      | "email"
      | "phone"
      | "contact",
      string
    >
  >;
  availableClientTags: string[];
  onCancelCreate: () => void;
  onFormChange: (
    key:
      | "firstName"
      | "preferredName"
      | "lastName"
      | "birthDate"
      | "pronouns"
      | "phone"
      | "email"
      | "internalNotes",
    value: string
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
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  return (
    <>
      <View style={styles.formStack}>
        <View style={styles.profileAvatarRow}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarGlyph}>+</Text>
          </View>
          <Text style={styles.formCopy}>
            Add only the client identity and contact details needed to start care.
          </Text>
        </View>

        <View style={styles.intakeSection}>
          <Text style={styles.intakeSectionTitle}>Required</Text>
          <PluckrTextField
            label="Preferred Name"
            placeholder="Name used during care"
            value={clientForm.preferredName}
            autoCapitalize="words"
            textContentType="name"
            error={clientFormErrors.preferredName}
            onChangeText={(value) => onFormChange("preferredName", value)}
          />
          <View style={styles.fieldRow}>
            <View style={styles.fieldColumn}>
              <PluckrTextField
                label="Legal First"
                placeholder="e.g. John"
                value={clientForm.firstName}
                autoCapitalize="words"
                textContentType="givenName"
                error={clientFormErrors.firstName}
                onChangeText={(value) => onFormChange("firstName", value)}
              />
            </View>
            <View style={styles.fieldColumn}>
              <PluckrTextField
                label="Legal Last"
                placeholder="e.g. Hancock"
                value={clientForm.lastName}
                autoCapitalize="words"
                textContentType="familyName"
                error={clientFormErrors.lastName}
                onChangeText={(value) => onFormChange("lastName", value)}
              />
            </View>
          </View>
          <PluckrTextField
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            value={clientForm.birthDate}
            keyboardType="numbers-and-punctuation"
            error={clientFormErrors.birthDate}
            onChangeText={(value) => onFormChange("birthDate", value)}
          />
        </View>

        <View style={styles.intakeSection}>
          <Text style={styles.intakeSectionTitle}>Contact</Text>
          <Text style={styles.formCopy}>Mobile phone or email is required.</Text>
          <PluckrTextField
            label="Email"
            placeholder="example@domain.com"
            value={clientForm.email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            error={clientFormErrors.email}
            onChangeText={(value) => onFormChange("email", value)}
          />
          <PluckrTextField
            label="Mobile Phone"
            placeholder="555-555-5555"
            value={clientForm.phone}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            error={clientFormErrors.phone}
            onChangeText={(value) => onFormChange("phone", value)}
          />
          {clientFormErrors.contact ? (
            <Text style={styles.inlineError}>{clientFormErrors.contact}</Text>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.optionalToggle}
          onPress={() => setShowOptionalFields((current) => !current)}
        >
          <View>
            <Text style={styles.optionalToggleTitle}>Optional details</Text>
            <Text style={styles.optionalToggleCopy}>
              Pronouns, tags, and internal notes.
            </Text>
          </View>
          <Text style={styles.optionalToggleIcon}>
            {showOptionalFields ? "−" : "+"}
          </Text>
        </Pressable>

        {showOptionalFields ? (
          <View style={styles.intakeSection}>
            <PronounPickerField
              value={clientForm.pronouns}
              onChange={(value) => onFormChange("pronouns", value)}
            />
            <Pressable
              accessibilityRole="button"
              style={styles.tagSelector}
              onPress={() => setShowClientTagPicker(true)}
            >
              <Text style={styles.tagSelectorLabel}>Tags</Text>
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
            <PluckrTextField
              label="Internal Notes"
              placeholder="Private context for the practice..."
              multiline
              value={clientForm.internalNotes}
              onChangeText={(value) => onFormChange("internalNotes", value)}
            />
          </View>
        ) : null}

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
