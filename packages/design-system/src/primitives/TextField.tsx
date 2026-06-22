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
        placeholderTextColor={pluckrAppTheme.colors.textMuted}
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
  multilineInput: {
    minHeight: 104,
    textAlignVertical: "top"
  }
});
