import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { getClientDisplayName, type ClientRecord } from "@pluckr/domain";

import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { PluckrIconButton } from "../../primitives/IconButton";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

type PluckrFolioPanelProps = {
  dailyFolioClients: ClientRecord[];
  totalClients: number;
  isLoading: boolean;
  isSeeding: boolean;
  onOpenPicker: () => void;
  onOpenClient: (client: ClientRecord) => void;
  onRemoveClient: (client: ClientRecord) => void;
  onSeedDemoData: () => void;
};

function formatDateLabel(value: string | null) {
  if (!value) {
    return "New client";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function PluckrFolioPanel({
  dailyFolioClients,
  totalClients,
  isLoading,
  isSeeding,
  onOpenPicker,
  onOpenClient,
  onRemoveClient,
  onSeedDemoData
}: PluckrFolioPanelProps) {
  const hasPracticeClients = totalClients > 0;

  return (
    <PluckrCard accent>
      <View style={styles.stack}>
        <View style={styles.topRow}>
          <View style={styles.copyStack}>
            <Text style={styles.eyebrow}>Today</Text>
            <Text style={styles.title}>Folio</Text>
          </View>
          {dailyFolioClients.length > 0 ? (
            <PluckrIconButton
              icon="folio"
              accessibilityLabel="Edit folio"
              tone="accent"
              onPress={onOpenPicker}
            />
          ) : null}
        </View>

        {isLoading ? (
          <Text style={styles.emptyCopy}>Loading today's folio...</Text>
        ) : dailyFolioClients.length === 0 ? (
          <View style={styles.emptyStack}>
            <Text style={styles.emptyTitle}>No active clients yet</Text>
            <Text style={styles.emptyCopy}>
              {hasPracticeClients
                ? "Build today's folio from your existing client list, then jump into charting from here."
                : "You don't have any clients yet. Seed demo data or add a client, then build today's folio."}
            </Text>
            <PluckrButton label="Build Today's Folio" onPress={() => onOpenPicker()} />
            <PluckrButton
              label={
                isSeeding
                  ? "Seeding..."
                  : hasPracticeClients
                    ? "Refresh Demo Data"
                    : "Seed Demo Data"
              }
              variant="secondary"
              disabled={isSeeding}
              onPress={() => onSeedDemoData()}
            />
          </View>
        ) : (
          <View style={styles.activeStack}>
            <Text style={styles.summaryLabel}>
              {dailyFolioClients.length} active today
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              {dailyFolioClients.map((client) => (
                <Pressable
                  key={client.id}
                  accessibilityRole="button"
                  style={styles.clientCard}
                  onPress={() => onOpenClient(client)}
                >
                  <View style={styles.clientCardTopRow}>
                    <Text style={styles.clientBadge}>Active</Text>
                    <PluckrIconButton
                      icon="remove"
                      accessibilityLabel={`Remove ${getClientDisplayName(client)} from folio`}
                      tone="critical"
                      onPress={() => onRemoveClient(client)}
                    />
                  </View>
                  <View style={styles.clientRow}>
                    <View style={styles.clientCopy}>
                      <Text style={styles.clientName}>
                        {getClientDisplayName(client)}
                      </Text>
                      <Text style={styles.clientMeta}>
                        {client.pronouns || "Client"} • Last seen{" "}
                        {formatDateLabel(client.last_seen_at)}
                      </Text>
                    </View>
                    <View style={styles.openHintRow}>
                      <Text style={styles.openHint}>Open chart</Text>
                      <PluckrIconButton
                        icon="open"
                        accessibilityLabel={`Open ${getClientDisplayName(client)}`}
                        onPress={() => onOpenClient(client)}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <PluckrButton
              label={isSeeding ? "Seeding..." : "Refresh Demo Data"}
              variant="secondary"
              disabled={isSeeding}
              onPress={() => onSeedDemoData()}
            />
          </View>
        )}
      </View>
    </PluckrCard>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: pluckrAppTheme.spacing.md
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md
  },
  copyStack: {
    flex: 1,
    gap: 2
  },
  eyebrow: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700"
  },
  addPill: {
    minHeight: 34,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(168, 195, 176, 0.32)"
  },
  addPillLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  emptyStack: {
    gap: pluckrAppTheme.spacing.sm
  },
  emptyTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700"
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  activeStack: {
    gap: pluckrAppTheme.spacing.sm
  },
  summaryLabel: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600"
  },
  listContent: {
    gap: pluckrAppTheme.spacing.sm,
    paddingRight: pluckrAppTheme.spacing.xs
  },
  clientCard: {
    width: 248,
    minHeight: 156,
    padding: 16,
    borderRadius: 14,
    backgroundColor: pluckrAppTheme.colors.surface,
    ...Platform.select({
      web: {
        boxShadow: "0px 6px 14px rgba(15, 23, 42, 0.05)"
      },
      default: {
        shadowColor: "#0F172A",
        shadowOpacity: 0.05,
        shadowRadius: 14,
        shadowOffset: {
          width: 0,
          height: 6
        },
        elevation: 1
      }
    })
  },
  clientCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm,
    paddingBottom: pluckrAppTheme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: pluckrAppTheme.colors.divider
  },
  clientBadge: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.9
  },
  clientRow: {
    flex: 1,
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md,
    marginTop: pluckrAppTheme.spacing.sm
  },
  clientCopy: {
    gap: 4
  },
  clientName: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700"
  },
  clientMeta: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  openHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.sm
  },
  openHint: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  }
});
