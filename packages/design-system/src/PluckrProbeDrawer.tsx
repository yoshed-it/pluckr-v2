import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  probeMaterialOptions,
  probeShankOptions,
  probeSizeOptions
} from "@pluckr/app-core";

import { PluckrBottomDrawer } from "./PluckrBottomDrawer";
import { PluckrToggleButton, PluckrToggleRow } from "./PluckrOptionDrawer";
import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrProbeDrawerProps = {
  visible: boolean;
  usingOnePiece: boolean;
  probeShank: string;
  probeSize: string;
  probeMaterial: string;
  onClose: () => void;
  onProbeStyleChange: (usingOnePiece: boolean) => void;
  onProbeChange: (
    key: "probeShank" | "probeSize" | "probeMaterial",
    value: string
  ) => void;
};

/**
 * Keeps probe setup in one compact drawer so providers can adjust the probe
 * like a single decision instead of hopping through multiple pickers.
 */
export function PluckrProbeDrawer({
  visible,
  usingOnePiece,
  probeShank,
  probeSize,
  probeMaterial,
  onClose,
  onProbeStyleChange,
  onProbeChange
}: PluckrProbeDrawerProps) {
  return (
    <PluckrBottomDrawer
      visible={visible}
      title="Probe"
      subtitle="Set the piece style, shank, size, and type."
      onClose={onClose}
    >
      <View style={styles.section}>
        <Text style={styles.label}>Piece</Text>
        <PluckrToggleRow>
          <PluckrToggleButton
            label="1pc"
            active={usingOnePiece}
            onPress={() => onProbeStyleChange(true)}
          />
          <PluckrToggleButton
            label="2pc"
            active={!usingOnePiece}
            onPress={() => onProbeStyleChange(false)}
          />
        </PluckrToggleRow>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Shank</Text>
        <View style={styles.optionRow}>
          {probeShankOptions.map((shank) => (
            <ProbePill
              key={shank}
              label={shank}
              active={probeShank === shank}
              onPress={() => onProbeChange("probeShank", shank)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Size</Text>
        <View style={styles.optionRow}>
          {probeSizeOptions.map((size) => (
            <ProbePill
              key={size}
              label={size}
              active={probeSize === size}
              onPress={() => onProbeChange("probeSize", size)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.stack}>
          {probeMaterialOptions.map((material) => (
            <Pressable
              key={material}
              accessibilityRole="button"
              style={[
                styles.listOption,
                probeMaterial === material ? styles.listOptionActive : null
              ]}
              onPress={() => onProbeChange("probeMaterial", material)}
            >
              <Text style={styles.listOptionLabel}>{material}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </PluckrBottomDrawer>
  );
}

function ProbePill({
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
      accessibilityRole="button"
      style={[styles.pill, active ? styles.pillActive : null]}
      onPress={onPress}
    >
      <Text style={[styles.pillLabel, active ? styles.pillLabelActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: pluckrAppTheme.spacing.xs
  },
  label: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: pluckrAppTheme.spacing.xs
  },
  stack: {
    gap: pluckrAppTheme.spacing.xs
  },
  pill: {
    minWidth: 48,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  pillActive: {
    backgroundColor: "rgba(127, 183, 133, 0.16)"
  },
  pillLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700"
  },
  pillLabelActive: {
    color: pluckrAppTheme.colors.sageStrong
  },
  listOption: {
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.sm,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "rgba(44, 62, 80, 0.04)"
  },
  listOptionActive: {
    backgroundColor: "rgba(127, 183, 133, 0.16)"
  },
  listOptionLabel: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700"
  }
});
