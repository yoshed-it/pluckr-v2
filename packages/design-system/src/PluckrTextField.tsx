import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps
} from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

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
        placeholderTextColor={pluckrAppTheme.colors.textSecondary}
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
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  input: {
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    borderRadius: pluckrAppTheme.radii.sm,
    backgroundColor: pluckrAppTheme.colors.surface,
    color: pluckrAppTheme.colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: pluckrAppTheme.typography.body
  },
  multilineInput: {
    minHeight: 104,
    textAlignVertical: "top"
  }
});
