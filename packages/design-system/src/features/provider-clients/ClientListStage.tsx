import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { getClientDisplayName, type ClientRecord } from "@pluckr/domain";

import { ClientCreateForm } from "./ClientCreateForm";
import type { AdminContactFieldKey } from "./AdminContactFields";
import { PluckrSectionHeader } from "../../composite/SectionHeader";
import { PluckrBottomDrawer } from "../../primitives/BottomSheet";
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
    preferredName: string;
    firstName: string;
    lastName: string;
    birthDate: string;
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
  onBack: () => void;
  onLogout: () => void;
  onSelectClient: (client: ClientRecord) => void;
  onSearchChange: (value: string) => void;
  onStartCreate: () => void;
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
      | "internalNotes"
      | AdminContactFieldKey,
    value: string
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

const visibleListTagLimit = 2;

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
  clientFormErrors,
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
  const isSearching = searchText.trim().length > 0;

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
            accessibilityLabel="Search clients"
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

      <PluckrBottomDrawer
        visible={isCreatingClient}
        title="Add a new client"
        subtitle="Create the client record. Clinical intake, insurance, photos, and consent live in their own workflows."
        actionLabel="×"
        onAction={onCancelCreate}
        onClose={onCancelCreate}
      >
        <ClientCreateForm
          isSavingClient={isSavingClient}
          clientForm={clientForm}
          clientFormErrors={clientFormErrors}
          availableClientTags={availableClientTags}
          onCancelCreate={onCancelCreate}
          onFormChange={onFormChange}
          onToggleClientTag={onToggleClientTag}
          onAddCustomClientTag={onAddCustomClientTag}
          onSubmitClient={onSubmitClient}
        />
      </PluckrBottomDrawer>

      <PluckrCard>
        <PluckrSectionHeader title="Results" count={clients.length} />
        {isLoading ? (
          <Text style={styles.emptyState}>Loading clients...</Text>
        ) : clients.length === 0 ? (
          <View style={styles.emptyStateStack}>
            <Text style={styles.emptyStateTitle}>
              {isSearching ? "No matching clients" : "No clients yet"}
            </Text>
            <Text style={styles.emptyState}>
              {isSearching
                ? "Try a different name, phone, email, or care tag."
                : "Add your first client to start charting care."}
            </Text>
            {!isSearching ? (
              <PluckrButton label="Add Client" onPress={() => onStartCreate()} />
            ) : null}
          </View>
        ) : (
          <View style={styles.listStack}>
            {clients.map((client) => {
              const visibleTags = (client.client_tags ?? []).slice(
                0,
                visibleListTagLimit
              );
              const hiddenTagCount = Math.max(
                (client.client_tags ?? []).length - visibleTags.length,
                0
              );

              return (
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
                          {getClientDisplayName(client)}
                        </Text>
                        <View style={styles.rowChips}>
                          {client.pronouns ? (
                            <Text style={styles.tagChip}>{client.pronouns}</Text>
                          ) : null}
                          {client.consent_signed_at ? (
                            <Text style={styles.tagChip}>Consent signed</Text>
                          ) : null}
                          {visibleTags.map((tag) => (
                            <Text key={tag} style={styles.tagChip}>
                              {tag}
                            </Text>
                          ))}
                          {hiddenTagCount > 0 ? (
                            <Text style={styles.tagChip}>+{hiddenTagCount} tags</Text>
                          ) : null}
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
              );
            })}
          </View>
        )}
      </PluckrCard>
    </View>
  );
}
