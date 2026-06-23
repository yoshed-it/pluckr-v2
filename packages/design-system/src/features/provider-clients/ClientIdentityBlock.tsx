import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";
import { StatusChip } from "../../primitives/StatusChip";

type Props = {
  preferredName: string;
  pronouns?: string | null;
  isActive: boolean;
};

export function ClientIdentityBlock({
  preferredName,
  pronouns,
  isActive
}: Props) {
  return (
    <View style={styles.stack}>
      <Text style={styles.name}>{preferredName}</Text>
      <View style={styles.metaRow}>
        {pronouns ? <Text style={styles.pronouns}>{pronouns}</Text> : null}
        <StatusChip
          label={isActive ? "Active Client" : "Archived Client"}
          tone={isActive ? "success" : "neutral"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 6,
    flex: 1
  },
  name: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "800"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8
  },
  pronouns: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600"
  }
});
