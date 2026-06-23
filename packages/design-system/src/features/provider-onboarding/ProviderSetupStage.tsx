import React from "react";
import { StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

import { PluckrBrandHeader } from "../../composite/BrandHeader";
import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrAppTheme } from "../../pluckrAppTheme";

type PluckrProviderSetupStageProps = {
  logoSource: ImageSourcePropType;
  fullName: string;
  phone: string;
  error: string | null;
  notice: string | null;
  isSaving: boolean;
  onLogout: () => void;
  onFormChange: (key: "fullName" | "phone", value: string) => void;
  onSubmit: () => void;
};

export function PluckrProviderSetupStage({
  logoSource,
  fullName,
  phone,
  error,
  notice,
  isSaving,
  onLogout,
  onFormChange,
  onSubmit
}: PluckrProviderSetupStageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View />
        <Text style={styles.logoutLink} onPress={onLogout}>
          Log Out
        </Text>
      </View>

      <PluckrBrandHeader
        title="Provider Profile"
        subtitle="Complete your profile before entering the clinical journal."
        logoSource={logoSource}
        compact
      />

      <PluckrCard>
        <View style={styles.stack}>
          <Text style={styles.sectionTitle}>Set Up Your Provider Profile</Text>
          <PluckrTextField
            label="Full Name"
            placeholder="Full Name"
            autoCapitalize="words"
            value={fullName}
            onChangeText={(value) => onFormChange("fullName", value)}
          />
          <PluckrTextField
            label="Phone Number"
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(value) => onFormChange("phone", value)}
          />
          <PluckrButton
            label={isSaving ? "Saving..." : "Save Profile"}
            disabled={!fullName.trim() || !phone.trim() || isSaving}
            onPress={onSubmit}
          />
        </View>
      </PluckrCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.md
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logoutLink: {
    color: pluckrAppTheme.colors.critical,
    fontSize: 15,
    fontWeight: "600"
  },
  stack: {
    gap: pluckrAppTheme.spacing.md
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.subheading,
    lineHeight: 26,
    fontWeight: "700"
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20
  },
  error: {
    color: pluckrAppTheme.colors.critical
  },
  success: {
    color: pluckrAppTheme.colors.success
  }
});
