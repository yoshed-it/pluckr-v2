import React from "react";
import { Pressable, Text, View } from "react-native";
import type { ClientRecord } from "@pluckr/domain";

import { pluckrClientJournalStageStyles as styles } from "./ClientJournalStage.styles";

type Props = {
  client: ClientRecord;
  onBack: () => void;
  onLogout: () => void;
  onOpenConsent: () => void;
  onOpenDetails: () => void;
};

export function ClientWorkspaceToolbar({
  client,
  onBack,
  onLogout,
  onOpenConsent,
  onOpenDetails
}: Props) {
  return (
    <View style={styles.toolbar}>
      <Text style={styles.link} onPress={onBack}>
        ← Back
      </Text>
      <View style={styles.toolbarActions}>
        <Pressable
          accessibilityRole="button"
          style={styles.contextButton}
          onPress={onOpenDetails}
        >
          <Text style={styles.contextButtonLabel}>Client Details</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={styles.contextButton}
          onPress={onOpenConsent}
        >
          <Text style={styles.contextButtonLabel}>
            {client.consent_signed_at ? "View Consent" : "Sign Consent"}
          </Text>
        </Pressable>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>
    </View>
  );
}
