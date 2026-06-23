import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { ClientRecord } from "@pluckr/domain";

import { PluckrTagPickerDrawer } from "../../PluckrTagPickerDrawer";
import { PluckrBottomDrawer } from "../../primitives/BottomSheet";
import { PluckrButton } from "../../primitives/Button";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrClientJournalStageStyles as styles } from "./ClientJournalStage.styles";
import { PronounPickerField } from "./PronounPickerField";

type ClientDetailField =
  | "preferredName"
  | "firstName"
  | "lastName"
  | "pronouns"
  | "phone"
  | "email"
  | "notes";

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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
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

  return (
    <>
      <PluckrBottomDrawer
        visible={visible}
        title="Client details"
        subtitle="Contact info, care context, and charting tags."
        actionLabel="×"
        onAction={onClose}
        onClose={onClose}
      >
        <View style={styles.detailEditorStack}>
          <View style={styles.contextMetaRow}>
            <Text style={styles.metaCopy}>
              Last seen {formatDateTime(client.last_seen_at || client.created_at)}
            </Text>
            {client.consent_signed_at ? (
              <Text style={styles.metaCopy}>Image consent signed</Text>
            ) : (
              <Text style={styles.metaCopy}>Image consent pending</Text>
            )}
          </View>

          <PluckrTextField
            label="Name"
            placeholder="Name used in daily care"
            value={form.preferredName}
            autoCapitalize="words"
            textContentType="name"
            error={formErrors.preferredName}
            onChangeText={(value) => onFieldChange("preferredName", value)}
          />

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

          <View style={styles.fieldRow}>
            <PronounPickerField
              value={form.pronouns}
              onChange={(value) => onFieldChange("pronouns", value)}
            />
            <PluckrTextField
              label="Phone"
              placeholder="555-555-5555"
              value={form.phone}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              error={formErrors.phone}
              onChangeText={(value) => onFieldChange("phone", value)}
            />
          </View>

          <PluckrTextField
            label="Email"
            placeholder="Email"
            value={form.email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            error={formErrors.email}
            onChangeText={(value) => onFieldChange("email", value)}
          />

          <Pressable
            accessibilityRole="button"
            style={styles.tagSelector}
            onPress={() => setShowClientTagPicker(true)}
          >
            <Text style={styles.tagSelectorLabel}>Client Tags</Text>
            <Text style={styles.tagSelectorValue}>
              {form.clientTags.length > 0
                ? `${form.clientTags.length} selected`
                : "Select tags"}
            </Text>
          </Pressable>

          {form.clientTags.length > 0 ? (
            <View style={styles.tagRow}>
              {form.clientTags.map((tag) => (
                <Text key={tag} style={styles.metaChip}>
                  {tag}
                </Text>
              ))}
            </View>
          ) : null}

          <PluckrTextField
            label="Care Summary"
            placeholder="History, care plan, reactions, reminders..."
            multiline
            value={form.notes}
            onChangeText={(value) => onFieldChange("notes", value)}
          />

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
              <Text style={styles.archiveButtonLabel}>Archive</Text>
            </Pressable>
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
