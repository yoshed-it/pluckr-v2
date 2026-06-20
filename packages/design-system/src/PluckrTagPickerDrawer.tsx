import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PluckrBottomDrawer } from "./PluckrBottomDrawer";
import { PluckrButton } from "./PluckrButton";
import { PluckrTextField } from "./PluckrTextField";
import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrTagPickerDrawerProps = {
  visible: boolean;
  title: string;
  selectedTags: string[];
  availableTags: string[];
  onToggleTag: (tagLabel: string) => void;
  onAddCustomTag: (tagLabel: string) => void;
  onClose: () => void;
};

/**
 * Shared tag picker for client and chart flows.
 *
 * The old app used a dedicated tag modal rather than freeform text entry, so
 * the rebuilt flow keeps selection and custom-tag creation in one place.
 */
export function PluckrTagPickerDrawer({
  visible,
  title,
  selectedTags,
  availableTags,
  onToggleTag,
  onAddCustomTag,
  onClose
}: PluckrTagPickerDrawerProps) {
  const [customTag, setCustomTag] = useState("");

  const selectedLabels = useMemo(
    () => new Set(selectedTags.map((tag) => tag.toLowerCase())),
    [selectedTags]
  );

  return (
    <PluckrBottomDrawer
      visible={visible}
      title={title}
      subtitle="Tap to select tags or add a custom one."
      onClose={() => {
        setCustomTag("");
        onClose();
      }}
    >
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Selected</Text>
        {selectedTags.length > 0 ? (
          <View style={styles.tagWrap}>
            {selectedTags.map((tag) => (
              <Pressable
                key={tag}
                accessibilityRole="button"
                style={[styles.tagChip, styles.tagChipActive]}
                onPress={() => onToggleTag(tag)}
              >
                <Text style={[styles.tagChipLabel, styles.tagChipLabelActive]}>
                  {tag}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyCopy}>No tags selected yet.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Library</Text>
        <View style={styles.tagWrap}>
          {availableTags.map((tag) => {
            const selected = selectedLabels.has(tag.toLowerCase());

            return (
              <Pressable
                key={tag}
                accessibilityRole="button"
                style={[styles.tagChip, selected ? styles.tagChipActive : null]}
                onPress={() => onToggleTag(tag)}
              >
                <Text
                  style={[
                    styles.tagChipLabel,
                    selected ? styles.tagChipLabelActive : null
                  ]}
                >
                  {tag}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Custom Tag</Text>
        <PluckrTextField
          label="Label"
          placeholder="Add a custom tag"
          value={customTag}
          onChangeText={setCustomTag}
        />
        <PluckrButton
          label="Add Custom Tag"
          variant="secondary"
          onPress={() => {
            onAddCustomTag(customTag);
            setCustomTag("");
          }}
        />
      </View>
    </PluckrBottomDrawer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: pluckrAppTheme.spacing.xs
  },
  sectionLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  tagChip: {
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(44, 62, 80, 0.05)"
  },
  tagChipActive: {
    backgroundColor: "rgba(127, 183, 133, 0.18)"
  },
  tagChipLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  },
  tagChipLabelActive: {
    color: pluckrAppTheme.colors.sageStrong
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18
  }
});
