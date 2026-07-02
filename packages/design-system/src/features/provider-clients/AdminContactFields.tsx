import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { PluckrTextField } from "../../primitives/TextField";
import { pluckrAppTheme } from "../../pluckrAppTheme";

export type AdminContactFieldKey =
  | "addressLine1"
  | "addressLine2"
  | "addressCity"
  | "addressRegion"
  | "addressPostalCode"
  | "emergencyContactName"
  | "emergencyContactRelationship"
  | "emergencyContactPhone";

type AdminContactForm = Record<AdminContactFieldKey, string>;

type Props = {
  form: AdminContactForm;
  onFieldChange: (key: AdminContactFieldKey, value: string) => void;
};

export function AdminContactFields({ form, onFieldChange }: Props) {
  return (
    <View style={styles.stack}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <PluckrTextField
          label="Street Address"
          placeholder="Street address"
          value={form.addressLine1}
          textContentType="streetAddressLine1"
          onChangeText={(value) => onFieldChange("addressLine1", value)}
        />
        <PluckrTextField
          label="Apt / Suite"
          placeholder="Apartment, suite, unit"
          value={form.addressLine2}
          textContentType="streetAddressLine2"
          onChangeText={(value) => onFieldChange("addressLine2", value)}
        />
        <View style={styles.row}>
          <View style={styles.flex}>
            <PluckrTextField
              label="City"
              placeholder="City"
              value={form.addressCity}
              textContentType="addressCity"
              onChangeText={(value) => onFieldChange("addressCity", value)}
            />
          </View>
          <View style={styles.regionField}>
            <PluckrTextField
              label="State"
              placeholder="CA"
              value={form.addressRegion}
              autoCapitalize="characters"
              textContentType="addressState"
              onChangeText={(value) => onFieldChange("addressRegion", value)}
            />
          </View>
        </View>
        <PluckrTextField
          label="Postal Code"
          placeholder="ZIP / postal code"
          value={form.addressPostalCode}
          textContentType="postalCode"
          onChangeText={(value) => onFieldChange("addressPostalCode", value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <PluckrTextField
          label="Name"
          placeholder="Contact name"
          value={form.emergencyContactName}
          textContentType="name"
          onChangeText={(value) => onFieldChange("emergencyContactName", value)}
        />
        <PluckrTextField
          label="Relationship"
          placeholder="Relationship"
          value={form.emergencyContactRelationship}
          onChangeText={(value) =>
            onFieldChange("emergencyContactRelationship", value)
          }
        />
        <PluckrTextField
          label="Phone"
          placeholder="555-555-5555"
          value={form.emergencyContactPhone}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={(value) => onFieldChange("emergencyContactPhone", value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: pluckrAppTheme.spacing.md
  },
  section: {
    gap: pluckrAppTheme.spacing.sm
  },
  sectionTitle: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800"
  },
  row: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.sm
  },
  flex: {
    flex: 1
  },
  regionField: {
    width: 96
  }
});
