import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getClientDisplayName, type ClientRecord } from "@pluckr/domain";

import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { PluckrSectionHeader } from "../../composite/SectionHeader";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

type PluckrRecentClientsPanelProps = {
  clients: ClientRecord[];
  count: number;
  isLoading: boolean;
  onOpenClient: (client: ClientRecord) => void;
  onOpenClients: () => void;
};

export function PluckrRecentClientsPanel({
  clients,
  count,
  isLoading,
  onOpenClient,
  onOpenClients
}: PluckrRecentClientsPanelProps) {
  return (
    <PluckrCard compact>
      <View style={styles.stack}>
        <PluckrSectionHeader title="Recent Clients" count={count} />
        {isLoading ? (
          <Text style={styles.emptyState}>Loading recent clients...</Text>
        ) : clients.length === 0 ? (
          <Text style={styles.emptyState}>
            Recent charted clients will appear here after the first session is
            recorded.
          </Text>
        ) : (
          <View style={styles.list}>
            {clients.map((client) => (
              <Pressable
                key={client.id}
                accessibilityRole="button"
                style={styles.clientRow}
                onPress={() => onOpenClient(client)}
              >
                <Text style={styles.clientName}>{getClientDisplayName(client)}</Text>
                <Text numberOfLines={2} style={styles.clientMeta}>
                  {client.notes || "No care summary yet."}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        <PluckrButton
          label="See All Clients"
          variant="secondary"
          onPress={() => onOpenClients()}
        />
      </View>
    </PluckrCard>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: pluckrAppTheme.spacing.sm
  },
  emptyState: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22
  },
  list: {
    gap: 0
  },
  clientRow: {
    gap: 4,
    paddingHorizontal: 0,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: pluckrAppTheme.colors.divider
  },
  clientName: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700"
  },
  clientMeta: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  }
});
