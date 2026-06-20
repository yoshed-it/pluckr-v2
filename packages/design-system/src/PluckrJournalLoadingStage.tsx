import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { PluckrCard } from "./PluckrCard";
import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrJournalLoadingStageProps = {
  message: string;
};

/**
 * Shared loading surface for auth-to-organization and organization-to-home
 * transitions so the rebuilt shell feels closer to the original app gates.
 */
export function PluckrJournalLoadingStage({
  message
}: PluckrJournalLoadingStageProps) {
  return (
    <View style={styles.container}>
      <PluckrCard accent>
        <View style={styles.content}>
          <ActivityIndicator
            color={pluckrAppTheme.colors.sageStrong}
            size="large"
          />
          <Text style={styles.title}>Opening your journal</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </PluckrCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 520,
    justifyContent: "center"
  },
  content: {
    alignItems: "center",
    gap: pluckrAppTheme.spacing.md
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.heading,
    lineHeight: 34,
    fontWeight: "700",
    textAlign: "center"
  },
  message: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24,
    textAlign: "center"
  }
});
