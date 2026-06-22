import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PluckrBottomDrawer } from "./primitives/BottomSheet";
import { PluckrTextField } from "./primitives/TextField";
import { pluckrAppTheme } from "./pluckrAppTheme";

type Option = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

type PluckrOptionDrawerProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  header?: React.ReactNode;
  options: Option[];
  onClose: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function PluckrOptionDrawer({
  visible,
  title,
  subtitle,
  header,
  options,
  onClose,
  searchable = false,
  searchPlaceholder = "Search"
}: PluckrOptionDrawerProps) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  return (
    <PluckrBottomDrawer
      visible={visible}
      title={title}
      subtitle={subtitle}
      onClose={() => {
        setQuery("");
        onClose();
      }}
    >
      {header}
      {searchable ? (
        <PluckrTextField
          label="Search"
          placeholder={searchPlaceholder}
          value={query}
          onChangeText={setQuery}
        />
      ) : null}
      {filteredOptions.map((option) => (
        <Pressable
          key={option.label}
      style={[styles.option, option.selected ? styles.optionActive : null]}
          onPress={option.onPress}
        >
          <Text style={styles.optionLabel}>{option.label}</Text>
          {option.description ? (
            <Text style={styles.optionDescription}>{option.description}</Text>
          ) : null}
        </Pressable>
      ))}
      {filteredOptions.length === 0 ? (
        <Text style={styles.emptyCopy}>No matches yet.</Text>
      ) : null}
    </PluckrBottomDrawer>
  );
}

export function PluckrToggleButton({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggle, active ? styles.toggleActive : null]}
    >
      <Text style={[styles.toggleLabel, active ? styles.toggleLabelActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function PluckrToggleRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.toggleRow}>{children}</View>;
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
    gap: pluckrAppTheme.spacing.xs
  },
  toggle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    paddingVertical: 8,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    borderWidth: 0
  },
  toggleActive: {
    backgroundColor: pluckrAppTheme.colors.sage,
    borderColor: pluckrAppTheme.colors.sage
  },
  toggleLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700"
  },
  toggleLabelActive: {
    color: "#FFFFFF"
  },
  option: {
    gap: pluckrAppTheme.spacing.xs,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: pluckrAppTheme.colors.surfaceMuted,
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    paddingVertical: 10
  },
  optionActive: {
    backgroundColor: "rgba(127, 183, 133, 0.16)"
  },
  optionLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700"
  },
  optionDescription: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingVertical: pluckrAppTheme.spacing.md
  }
});
