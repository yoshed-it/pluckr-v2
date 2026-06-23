import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PluckrOptionDrawer } from "../../PluckrOptionDrawer";
import { PluckrButton } from "../../primitives/Button";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

const pronounOptions = [
  "He/Him",
  "She/Her",
  "They/Them"
];
const customOptionLabel = "Other / Custom";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function PronounPickerField({
  value,
  onChange
}: Props) {
  const [visible, setVisible] = useState(false);
  const [isCustomEntryVisible, setIsCustomEntryVisible] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const displayValue = value.trim() || "Select pronouns";
  const isKnownOption = pronounOptions.includes(value);

  function openPicker() {
    setCustomValue(isKnownOption ? "" : value);
    setIsCustomEntryVisible(false);
    setVisible(true);
  }

  function saveCustomValue() {
    const trimmedValue = customValue.trim();

    if (!trimmedValue) {
      return;
    }

    onChange(trimmedValue);
    setVisible(false);
    setIsCustomEntryVisible(false);
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        style={styles.field}
        onPress={openPicker}
      >
        <Text style={styles.label}>Pronouns</Text>
        <Text style={[styles.value, value ? null : styles.placeholder]}>
          {displayValue}
        </Text>
      </Pressable>

      <PluckrOptionDrawer
        visible={visible}
        title="Pronouns"
        header={
          isCustomEntryVisible ? (
            <View style={styles.customStack}>
              <PluckrTextField
                label="Custom pronouns"
                placeholder="Enter pronouns"
                value={customValue}
                onChangeText={setCustomValue}
              />
              <PluckrButton
                label="Use Custom"
                disabled={!customValue.trim()}
                onPress={saveCustomValue}
              />
            </View>
          ) : null
        }
        options={[
          ...pronounOptions.map((option) => ({
            label: option,
            selected: option === value,
            onPress: () => {
              onChange(option);
              setVisible(false);
              setIsCustomEntryVisible(false);
            }
          })),
          {
            label: customOptionLabel,
            description: !isKnownOption && value ? value : "Enter a custom value",
            selected: !isKnownOption && Boolean(value),
            onPress: () => {
              setCustomValue(isKnownOption ? "" : value);
              setIsCustomEntryVisible(true);
            }
          }
        ]}
        onClose={() => setVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 50,
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: pluckrAppTheme.colors.border,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: pluckrAppTheme.colors.surface,
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.sm
  },
  label: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  value: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600"
  },
  placeholder: {
    color: pluckrAppTheme.colors.textMuted,
    fontWeight: "500"
  },
  customStack: {
    gap: pluckrAppTheme.spacing.sm,
    marginBottom: pluckrAppTheme.spacing.sm
  }
});
