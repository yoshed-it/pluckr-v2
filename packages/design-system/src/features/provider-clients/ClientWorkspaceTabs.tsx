import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";

export type ClientWorkspaceTabId =
  | "chartEntries"
  | "timeline"
  | "photos"
  | "documents"
  | "workflows";

type Props = {
  activeTab: ClientWorkspaceTabId;
  onChange: (tab: ClientWorkspaceTabId) => void;
};

const tabs: { id: ClientWorkspaceTabId; label: string }[] = [
  { id: "chartEntries", label: "Chart Entries" },
  { id: "timeline", label: "Timeline" },
  { id: "photos", label: "Photos" },
  { id: "documents", label: "Documents" },
  { id: "workflows", label: "Workflows" }
];

export function ClientWorkspaceTabs({
  activeTab,
  onChange
}: Props) {
  return (
    <View style={styles.row}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const active = tab.id === activeTab;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              onPress={() => onChange(tab.id)}
              style={styles.tab}
            >
              <Text style={[styles.label, active ? styles.activeLabel : null]}>
                {tab.label}
              </Text>
              <View style={[styles.indicator, active ? styles.activeIndicator : null]} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    borderBottomColor: pluckrAppTheme.colors.divider
  },
  scrollContent: {
    gap: 20,
    paddingRight: 8
  },
  tab: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 10
  },
  label: {
    color: pluckrAppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600"
  },
  activeLabel: {
    color: pluckrAppTheme.colors.sageStrong
  },
  indicator: {
    height: 3,
    width: "100%",
    minWidth: 28,
    backgroundColor: "transparent",
    borderRadius: pluckrAppTheme.radii.full
  },
  activeIndicator: {
    backgroundColor: pluckrAppTheme.colors.sageStrong
  }
});
