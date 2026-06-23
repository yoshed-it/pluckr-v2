import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getClientDisplayName, type ClientRecord } from "@pluckr/domain";

import { PluckrBottomDrawer } from "../../primitives/BottomSheet";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

type PluckrFolioPickerDrawerProps = {
  visible: boolean;
  clients: ClientRecord[];
  selectedClientIds: string[];
  onAddClient: (client: ClientRecord) => void;
  onClose: () => void;
};

export function PluckrFolioPickerDrawer({
  visible,
  clients,
  selectedClientIds,
  onAddClient,
  onClose
}: PluckrFolioPickerDrawerProps) {
  const [searchText, setSearchText] = useState("");

  const filteredClients = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((client) =>
      [
        getClientDisplayName(client),
        client.first_name,
        client.last_name,
        client.phone ?? "",
        client.email ?? ""
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [clients, searchText]);

  return (
    <PluckrBottomDrawer
      visible={visible}
      title="Add to Daily Folio"
      subtitle="Choose clients for today's workflow."
      onClose={onClose}
    >
      <PluckrTextField
        label="Search Clients"
        placeholder="Search clients"
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredClients.map((client) => {
        const inFolio = selectedClientIds.includes(client.id);

        return (
          <Pressable
            key={client.id}
            accessibilityRole="button"
            disabled={inFolio}
            style={[styles.row, inFolio ? styles.rowDisabled : null]}
            onPress={() => onAddClient(client)}
          >
            <View style={styles.copy}>
              <Text style={styles.name}>
                {getClientDisplayName(client)}
              </Text>
              <Text style={styles.meta}>
                {client.pronouns || "Client"} •{" "}
                {client.phone || client.email || "No direct contact on file"}
              </Text>
            </View>
            <Text style={[styles.action, inFolio ? styles.actionMuted : null]}>
              {inFolio ? "In Folio" : "Add"}
            </Text>
          </Pressable>
        );
      })}
      {filteredClients.length === 0 ? (
        <Text style={styles.emptyState}>No clients match this search yet.</Text>
      ) : null}
    </PluckrBottomDrawer>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pluckrAppTheme.spacing.md,
    minHeight: 64,
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.03)"
  },
  rowDisabled: {
    opacity: 0.55
  },
  copy: {
    flex: 1,
    gap: 2
  },
  name: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700"
  },
  meta: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18
  },
  action: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  actionMuted: {
    color: pluckrAppTheme.colors.textSecondary
  },
  emptyState: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingVertical: pluckrAppTheme.spacing.md
  }
});
