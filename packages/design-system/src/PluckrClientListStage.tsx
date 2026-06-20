import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { ClientRecord } from "@pluckr/supabase";

import { PluckrButton } from "./PluckrButton";
import { PluckrCard } from "./PluckrCard";
import { PluckrTextField } from "./PluckrTextField";
import { pluckrClientListStageStyles as styles } from "./PluckrClientListStage.styles";
import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrClientListStageProps = {
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

export function PluckrClientListStage({
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
}: PluckrClientListStageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.link} onPress={onBack}>
          ← Provider Home
        </Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <PluckrCard>
        <Text style={styles.eyebrow}>All Clients</Text>
        <Text style={styles.title}>Client List</Text>
        <Text style={styles.subtitle}>
          Search clients, review recent activity, or add a new record to the
          journal.
        </Text>
        <View style={styles.heroActions}>
          <PluckrButton label="Add Client" onPress={() => onStartCreate()} />
        </View>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search clients..."
            placeholderTextColor={pluckrAppTheme.colors.textSecondary}
            style={styles.searchField}
            value={searchText}
            onChangeText={onSearchChange}
          />
          <Text style={styles.countChip}>{clients.length}</Text>
        </View>
      </PluckrCard>

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? <Text style={[styles.message, styles.success]}>{notice}</Text> : null}

      {isCreatingClient ? (
        <PluckrCard>
          <View style={styles.formStack}>
            <Text style={styles.sectionTitle}>Add New Client</Text>
            <Text style={styles.formCopy}>
              Create a new clinical record with the same essentials the Swift
              app asked for first.
            </Text>
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
        </PluckrCard>
      ) : null}

      <PluckrCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Clients</Text>
          <Text style={styles.countChip}>{clients.length}</Text>
        </View>
        {isLoading ? (
          <Text style={styles.emptyState}>Loading clients...</Text>
        ) : clients.length === 0 ? (
          <View style={styles.emptyStateStack}>
            <Text style={styles.emptyStateTitle}>No clients yet</Text>
            <Text style={styles.emptyState}>
              Add your first client to get started.
            </Text>
            <PluckrButton label="Add Client" onPress={() => onStartCreate()} />
          </View>
        ) : (
          <View style={styles.listStack}>
            {clients.map((client) => (
              <Pressable
                key={client.id}
                accessibilityRole="button"
                style={styles.cardButton}
                onPress={() => onSelectClient(client)}
              >
                <PluckrCard compact>
                  <View style={styles.clientRow}>
                    <View style={styles.clientCopy}>
                      <Text style={styles.cardTitle}>
                        {client.first_name} {client.last_name}
                      </Text>
                      {client.pronouns ? (
                        <Text style={styles.pronounsText}>{client.pronouns}</Text>
                      ) : null}
                      <Text style={styles.cardBody}>
                        {client.notes || "No care notes yet."}
                      </Text>
                      <Text style={styles.cardMeta}>
                        Last seen {formatDateLabel(client.last_seen_at)}
                      </Text>
                    </View>
                    <View style={styles.rowAccessory}>
                      <Text style={styles.openGlyph}>›</Text>
                    </View>
                  </View>
                </PluckrCard>
              </Pressable>
            ))}
          </View>
        )}
      </PluckrCard>
    </View>
  );
}
