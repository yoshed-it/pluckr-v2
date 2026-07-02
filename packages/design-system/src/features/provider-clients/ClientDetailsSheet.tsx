import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { ClientRecord } from "@pluckr/domain";

import { PluckrTagPickerDrawer } from "../../PluckrTagPickerDrawer";
import { PluckrBottomDrawer } from "../../primitives/BottomSheet";
import { PluckrButton } from "../../primitives/Button";
import { PluckrTextField } from "../../primitives/TextField";
import { AdminContactFields, type AdminContactFieldKey } from "./AdminContactFields";
import { pluckrClientJournalStageStyles as styles } from "./ClientJournalStage.styles";
import { PronounPickerField } from "./PronounPickerField";

type ClientDetailField =
  | "preferredName"
  | "firstName"
  | "lastName"
  | "pronouns"
  | "phone"
  | "email"
  | "notes"
  | AdminContactFieldKey;

type Props = {
  visible: boolean;
  client: ClientRecord;
  form: {
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
  formErrors: Partial<
    Record<"preferredName" | "firstName" | "lastName" | "email" | "phone", string>
  >;
  availableClientTags: string[];
  isSavingClient: boolean;
  onClose: () => void;
  onFieldChange: (key: ClientDetailField, value: string) => void;
  onToggleClientTag: (tagLabel: string) => void;
  onAddCustomClientTag: (tagLabel: string) => void;
  onSubmit: () => void | Promise<unknown>;
  onArchiveClient: () => void;
};

const visibleDetailTagLimit = 4;

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
}

export function ClientDetailsSheet({
  visible,
  client,
  form,
  formErrors,
  availableClientTags,
  isSavingClient,
  onClose,
  onFieldChange,
  onToggleClientTag,
  onAddCustomClientTag,
  onSubmit,
  onArchiveClient
}: Props) {
  const [showClientTagPicker, setShowClientTagPicker] = useState(false);
  const visibleClientTags = form.clientTags.slice(0, visibleDetailTagLimit);
  const hiddenClientTagCount = Math.max(
    form.clientTags.length - visibleClientTags.length,
    0
  );

  return (
    <>
      <PluckrBottomDrawer
        visible={visible}
        title="Client details"
        subtitle="Daily care context stays visible. Legal and admin details stay here."
        actionLabel="×"
        onAction={onClose}
        onClose={onClose}
      >
        <View style={styles.detailEditorStack}>
          <View style={styles.contextMetaRow}>
            <Text style={styles.metaCopy}>
              Last seen {formatDateTime(client.last_seen_at || client.created_at)}
            </Text>
            <Text style={styles.metaCopy}>
              Client since {formatDate(client.created_at.slice(0, 10))}
            </Text>
            {client.consent_signed_at ? (
              <Text style={styles.metaCopy}>Image consent signed</Text>
            ) : (
              <Text style={styles.metaCopy}>Image consent pending</Text>
            )}
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Daily care</Text>
            <Text style={styles.detailSectionCopy}>
              This is the client context providers see while charting.
            </Text>
            <PluckrTextField
              label="Name"
              placeholder="Name used in daily care"
              value={form.preferredName}
              autoCapitalize="words"
              textContentType="name"
              error={formErrors.preferredName}
              onChangeText={(value) => onFieldChange("preferredName", value)}
            />
            <PronounPickerField
              value={form.pronouns}
              onChange={(value) => onFieldChange("pronouns", value)}
            />
            <Pressable
              accessibilityRole="button"
              style={styles.tagSelector}
              onPress={() => setShowClientTagPicker(true)}
            >
              <Text style={styles.tagSelectorLabel}>Care Tags</Text>
              <Text style={styles.tagSelectorValue}>
                {form.clientTags.length > 0
                  ? `${form.clientTags.length} selected`
                  : "Select tags"}
              </Text>
            </Pressable>
            {form.clientTags.length > 0 ? (
              <View style={styles.tagRow}>
                {visibleClientTags.map((tag) => (
                  <Text key={tag} style={styles.metaChip}>
                    {tag}
                  </Text>
                ))}
                {hiddenClientTagCount > 0 ? (
                  <Text style={styles.metaChip}>+{hiddenClientTagCount} more</Text>
                ) : null}
              </View>
            ) : null}
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Legal and contact</Text>
            {client.birth_date ? (
              <Text style={styles.metaCopy}>
                Date of birth {formatDate(client.birth_date)}
              </Text>
            ) : null}
            <View style={styles.fieldRow}>
              <PluckrTextField
                label="Legal First"
                placeholder="Legal first name"
                value={form.firstName}
                autoCapitalize="words"
                textContentType="givenName"
                error={formErrors.firstName}
                onChangeText={(value) => onFieldChange("firstName", value)}
              />
              <PluckrTextField
                label="Legal Last"
                placeholder="Legal last name"
                value={form.lastName}
                autoCapitalize="words"
                textContentType="familyName"
                error={formErrors.lastName}
                onChangeText={(value) => onFieldChange("lastName", value)}
              />
            </View>
            <PluckrTextField
              label="Phone"
              placeholder="555-555-5555"
              value={form.phone}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              error={formErrors.phone}
              onChangeText={(value) => onFieldChange("phone", value)}
            />
            <PluckrTextField
              label="Email"
              placeholder="client@example.com"
              value={form.email}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              error={formErrors.email}
              onChangeText={(value) => onFieldChange("email", value)}
            />
            <AdminContactFields form={form} onFieldChange={onFieldChange} />
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Internal Notes</Text>
            <PluckrTextField
              label="Notes"
              placeholder="Private context for the practice..."
              multiline
              value={form.notes}
              onChangeText={(value) => onFieldChange("notes", value)}
            />
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Admin</Text>
            <View style={styles.detailActionRow}>
              <PluckrButton
                label={isSavingClient ? "Saving..." : "Save Client"}
                disabled={isSavingClient}
                onPress={onSubmit}
              />
              <PluckrButton
                label="Close"
                variant="secondary"
                disabled={isSavingClient}
                onPress={onClose}
              />
              <Pressable
                accessibilityRole="button"
                style={styles.archiveButton}
                onPress={onArchiveClient}
              >
                <Text style={styles.archiveButtonLabel}>Archive Client</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </PluckrBottomDrawer>

      <PluckrTagPickerDrawer
        visible={showClientTagPicker}
        title="Client Tags"
        selectedTags={form.clientTags}
        availableTags={availableClientTags}
        onToggleTag={onToggleClientTag}
        onAddCustomTag={onAddCustomClientTag}
        onClose={() => setShowClientTagPicker(false)}
      />
    </>
  );
}
