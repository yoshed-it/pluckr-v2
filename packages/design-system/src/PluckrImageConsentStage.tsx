import React from "react";
import { Text, View } from "react-native";
import type { ClientRecord } from "@pluckr/supabase";

import { PluckrButton } from "./PluckrButton";
import { PluckrCard } from "./PluckrCard";
import {
  PluckrSignaturePad,
  SignaturePreview
} from "./PluckrSignaturePad";
import { PluckrTextField } from "./PluckrTextField";
import { pluckrImageConsentStageStyles as styles } from "./PluckrImageConsentStage.styles";

type PluckrImageConsentStageProps = {
  client: ClientRecord;
  signerName: string;
  signatureValue: string | null;
  isSaving: boolean;
  error: string | null;
  notice: string | null;
  onBack: () => void;
  onLogout: () => void;
  onSignerNameChange: (value: string) => void;
  onSignatureChange: (value: string | null) => void;
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
  signatureValue,
  isSaving,
  error,
  notice,
  onBack,
  onLogout,
  onSignerNameChange,
  onSignatureChange,
  onSignConsent
}: PluckrImageConsentStageProps) {
  const hasExistingSignature = client.consent_signature_path?.startsWith(
    "data:image/svg+xml;utf8,"
  );

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
            Capture the client signature once and keep the consent record tied
            to the charting workflow before any treatment images are added.
          </Text>
          {hasExistingSignature ? (
            <View style={styles.previewStack}>
              <Text style={styles.detailLabel}>Current Signature On File</Text>
              <SignaturePreview value={client.consent_signature_path} />
            </View>
          ) : null}
          <PluckrTextField
            label="Signer Name"
            placeholder="Client full name"
            value={signerName}
            onChangeText={onSignerNameChange}
          />
          <PluckrSignaturePad
            value={signatureValue}
            onChange={onSignatureChange}
          />
          <PluckrButton
            label={isSaving ? "Saving..." : "Sign Consent"}
            disabled={!signerName.trim() || !signatureValue || isSaving}
            onPress={() => onSignConsent()}
          />
        </View>
      </PluckrCard>
    </View>
  );
}
