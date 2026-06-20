/**
 * Shared mobile text field styled to mirror the Swift `pluckrTextField`
 * helper without forcing every screen to rebuild the same form chrome.
 */
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps
} from "react-native";

import { mobileTheme } from "../theme";

type PluckrTextFieldProps = TextInputProps & {
  label: string;
};

export function PluckrTextField({
  label,
  multiline = false,
  style,
  ...inputProps
}: PluckrTextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        multiline={multiline}
        placeholderTextColor={mobileTheme.colors.textSecondary}
        style={[
          styles.input,
          multiline ? styles.multilineInput : null,
          style as object
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: mobileTheme.spacing.xs
  },
  label: {
    color: mobileTheme.colors.sageStrong,
    fontSize: mobileTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  input: {
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    borderRadius: mobileTheme.radii.sm,
    backgroundColor: mobileTheme.colors.surface,
    color: mobileTheme.colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: mobileTheme.typography.body
  },
  multilineInput: {
    minHeight: 104,
    textAlignVertical: "top"
  }
});
