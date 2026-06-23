import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps
} from "react-native";

import { pluckrAppTheme } from "../tokens/pluckrAppTheme";

type PluckrTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function PluckrTextField({
  label,
  error,
  multiline = false,
  style,
  ...inputProps
}: PluckrTextFieldProps) {
  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        multiline={multiline}
        placeholderTextColor={pluckrAppTheme.colors.textMuted}
        style={[
          styles.input,
          hasError ? styles.inputError : null,
          multiline ? styles.multilineInput : null,
          style as object
        ]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.xs
  },
  label: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  input: {
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    borderRadius: 12,
    backgroundColor: pluckrAppTheme.colors.surface,
    color: pluckrAppTheme.colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 17,
    lineHeight: 22
  },
  inputError: {
    borderColor: pluckrAppTheme.colors.critical,
    backgroundColor: "rgba(200, 106, 91, 0.06)"
  },
  multilineInput: {
    minHeight: 104,
    textAlignVertical: "top"
  },
  errorText: {
    color: pluckrAppTheme.colors.critical,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  }
});
