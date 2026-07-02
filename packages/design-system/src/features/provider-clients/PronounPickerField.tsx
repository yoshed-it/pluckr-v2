import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PluckrOptionDrawer } from "../../PluckrOptionDrawer";
import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

const pronounOptions = [
  "He/Him",
  "She/Her",
  "They/Them"
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function PronounPickerField({
  value,
  onChange
}: Props) {
  const [visible, setVisible] = useState(false);
  const displayValue = value.trim() || "Select pronouns";

  function openPicker() {
    setVisible(true);
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
        options={[
          ...pronounOptions.map((option) => ({
            label: option,
            selected: option === value,
            onPress: () => {
              onChange(option);
              setVisible(false);
            }
          }))
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
  }
});
