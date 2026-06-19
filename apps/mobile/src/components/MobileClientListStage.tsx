/**
 * Mobile Swift-parity client list screen with search and add-client flow.
 */
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { ClientRecord } from "@pluckr/supabase";

import { PaperCard } from "./PaperCard";
import { PluckrButton } from "./PluckrButton";
import { PluckrTextField } from "./PluckrTextField";
import { styles } from "./mobileClientListStyles";
import { mobileTheme } from "../theme";

type MobileClientListStageProps = {
  clients: ClientRecord[];
  searchText: string;
  isLoading: boolean;
  error: string | null;
  notice: string | null;
  isCreatingClient: boolean;
  isSavingClient: boolean;
  clientForm: {
    firstName: string;
    lastName: string;
    pronouns: string;
    phone: string;
    email: string;
    notes: string;
  };
  onBack: () => void;
  onLogout: () => void;
  onSelectClient: (client: ClientRecord) => void;
  onSearchChange: (value: string) => void;
  onStartCreate: () => void;
  onCancelCreate: () => void;
  onFormChange: (
    key: "firstName" | "lastName" | "pronouns" | "phone" | "email" | "notes",
    value: string
  ) => void;
  onSubmitClient: () => void;
};

function formatDateLabel(value: string | null) {
  if (!value) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function MobileClientListStage({
  clients,
  searchText,
  isLoading,
  error,
  notice,
  isCreatingClient,
  isSavingClient,
  clientForm,
  onBack,
  onLogout,
  onSelectClient,
  onSearchChange,
  onStartCreate,
  onCancelCreate,
  onFormChange,
  onSubmitClient
}: MobileClientListStageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.link} onPress={onBack}>
          ← Workspace
        </Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <PaperCard>
        <Text style={styles.eyebrow}>All Clients</Text>
        <Text style={styles.title}>Client List</Text>
        <Text style={styles.subtitle}>
          Search clients or create a new record the same way the Swift app does.
        </Text>
        <View style={styles.heroActions}>
          <PluckrButton label="Add Client" onPress={() => onStartCreate()} />
        </View>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search clients..."
            placeholderTextColor={mobileTheme.colors.textSecondary}
            style={styles.searchField}
            value={searchText}
            onChangeText={onSearchChange}
          />
          <Text style={styles.countChip}>{clients.length}</Text>
        </View>
      </PaperCard>

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? (
        <Text style={[styles.message, styles.success]}>{notice}</Text>
      ) : null}

      {isCreatingClient ? (
        <PaperCard>
          <View style={styles.formStack}>
            <Text style={styles.sectionTitle}>Add New Client</Text>
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
            <PluckrTextField
              label="Pronouns"
              placeholder="Pronouns"
              value={clientForm.pronouns}
              onChangeText={(value) => onFormChange("pronouns", value)}
            />
            <PluckrTextField
              label="Phone Number"
              placeholder="Phone Number"
              value={clientForm.phone}
              onChangeText={(value) => onFormChange("phone", value)}
            />
            <PluckrTextField
              label="Email Address"
              placeholder="Email Address"
              value={clientForm.email}
              onChangeText={(value) => onFormChange("email", value)}
            />
            <PluckrTextField
              label="Notes"
              placeholder="Notes (optional)"
              multiline
              value={clientForm.notes}
              onChangeText={(value) => onFormChange("notes", value)}
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
        </PaperCard>
      ) : null}

      <PaperCard>
        {isLoading ? (
          <Text style={styles.emptyState}>Loading clients...</Text>
        ) : clients.length === 0 ? (
          <Text style={styles.emptyState}>
            No clients yet. Add your first client to get started.
          </Text>
        ) : (
          <View style={styles.listStack}>
            {clients.map((client) => (
              <Pressable
                key={client.id}
                accessibilityRole="button"
                style={styles.cardButton}
                onPress={() => onSelectClient(client)}
              >
                <PaperCard compact>
                <Text style={styles.cardTitle}>
                  {client.first_name} {client.last_name}
                </Text>
                <Text style={styles.cardBody}>
                  {client.notes || "No care notes yet."}
                </Text>
                <Text style={styles.cardMeta}>
                  Last seen {formatDateLabel(client.last_seen_at)}
                </Text>
                </PaperCard>
              </Pressable>
            ))}
          </View>
        )}
      </PaperCard>
    </View>
  );
}
