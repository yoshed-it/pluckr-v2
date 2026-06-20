import React from "react";
import { Text, View } from "react-native";
import type { ClientRecord } from "@pluckr/supabase";

import { PluckrButton } from "./PluckrButton";
import { PluckrCard } from "./PluckrCard";
import { PluckrTextField } from "./PluckrTextField";
import { pluckrImageConsentStageStyles as styles } from "./PluckrImageConsentStage.styles";

type PluckrImageConsentStageProps = {
  client: ClientRecord;
  signerName: string;
  isSaving: boolean;
  error: string | null;
  notice: string | null;
  onBack: () => void;
  onLogout: () => void;
  onSignerNameChange: (value: string) => void;
  onSignConsent: () => void;
};

function formatTimestamp(value: string | null) {
  if (!value) {
    return "No signed consent on file";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(value));
}

export function PluckrImageConsentStage({
  client,
  signerName,
  isSaving,
  error,
  notice,
  onBack,
  onLogout,
  onSignerNameChange,
  onSignConsent
}: PluckrImageConsentStageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.link} onPress={onBack}>
          ← Client Journal
        </Text>
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <PluckrCard>
        <Text style={styles.eyebrow}>Image Consent</Text>
        <Text style={styles.title}>
          {client.first_name} {client.last_name}
        </Text>
        <Text style={styles.subtitle}>
          By signing below, the client consents to secure capture and storage of
          treatment images for clinical documentation.
        </Text>
      </PluckrCard>

      {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
      {notice ? <Text style={[styles.message, styles.success]}>{notice}</Text> : null}

      <PluckrCard>
        <Text style={styles.sectionTitle}>Consent Information</Text>
        <View style={styles.detailStack}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>
              {client.consent_signed_at ? "Consent Given" : "Consent Required"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Signed At</Text>
            <Text style={styles.detailValue}>
              {formatTimestamp(client.consent_signed_at)}
            </Text>
          </View>
        </View>
      </PluckrCard>

      <PluckrCard accent>
        <View style={styles.formStack}>
          <Text style={styles.sectionTitle}>Digital Signature</Text>
          <Text style={styles.formCopy}>
            This pass records the signer name and consent timestamp so the new
            journal keeps the same gated behavior while we wire the full
            signature canvas next.
          </Text>
          <PluckrTextField
            label="Signer Name"
            placeholder="Client full name"
            value={signerName}
            onChangeText={onSignerNameChange}
          />
          <PluckrButton
            label={isSaving ? "Saving..." : "Sign Consent"}
            disabled={!signerName.trim() || isSaving}
            onPress={() => onSignConsent()}
          />
        </View>
      </PluckrCard>
    </View>
  );
}
