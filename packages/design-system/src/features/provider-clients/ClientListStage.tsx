import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { ClientRecord } from "@pluckr/domain";

import { ClientCreateForm } from "./ClientCreateForm";
import { PluckrSectionHeader } from "../../composite/SectionHeader";
import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { pluckrClientListStageStyles as styles } from "./ClientListStage.styles";
import { pluckrAppTheme } from "../../pluckrAppTheme";

type PluckrClientListStageProps = {
  clients: ClientRecord[];
  searchText: string;
  isLoading: boolean;
  error: string | null;
  notice: string | null;
  isCreatingClient: boolean;
  isSavingClient: boolean;
  hideToolbar?: boolean;
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
  onBack: () => void;
  onLogout: () => void;
  onSelectClient: (client: ClientRecord) => void;
  onSearchChange: (value: string) => void;
  onStartCreate: () => void;
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
    value: string
      | boolean
  ) => void;
  onToggleClientTag: (tagLabel: string) => void;
  onAddCustomClientTag: (tagLabel: string) => void;
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
  hideToolbar = false,
  clientForm,
  availableClientTags,
  onBack,
  onLogout,
  onSelectClient,
  onSearchChange,
  onStartCreate,
  onCancelCreate,
  onFormChange,
  onToggleClientTag,
  onAddCustomClientTag,
  onSubmitClient
}: PluckrClientListStageProps) {
  return (
    <View style={styles.container}>
      {!hideToolbar ? (
        <View style={styles.toolbar}>
          <Text style={styles.link} onPress={onBack}>
            ← Dashboard
          </Text>
          <Text style={styles.logoutLink} onPress={onLogout}>
            Log Out
          </Text>
        </View>
      ) : null}

      <PluckrCard>
        <PluckrSectionHeader title="Directory" count={clients.length} />
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search clients..."
            placeholderTextColor={pluckrAppTheme.colors.textSecondary}
            style={styles.searchField}
            value={searchText}
            onChangeText={onSearchChange}
          />
        </View>
        <View style={styles.heroActions}>
          <PluckrButton label="Add Client" onPress={() => onStartCreate()} />
        </View>
      </PluckrCard>

      {isCreatingClient ? (
        <ClientCreateForm
          isSavingClient={isSavingClient}
          clientForm={clientForm}
          availableClientTags={availableClientTags}
          onCancelCreate={onCancelCreate}
          onFormChange={onFormChange}
          onToggleClientTag={onToggleClientTag}
          onAddCustomClientTag={onAddCustomClientTag}
          onSubmitClient={onSubmitClient}
        />
      ) : null}

      <PluckrCard>
        <PluckrSectionHeader title="Results" count={clients.length} />
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
                      <View style={styles.rowChips}>
                        {client.pronouns ? (
                          <Text style={styles.tagChip}>{client.pronouns}</Text>
                        ) : null}
                        {client.consent_signed_at ? (
                          <Text style={styles.tagChip}>Consent signed</Text>
                        ) : null}
                        {(client.client_tags ?? []).slice(0, 2).map((tag) => (
                          <Text key={tag} style={styles.tagChip}>
                            {tag}
                          </Text>
                        ))}
                      </View>
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
