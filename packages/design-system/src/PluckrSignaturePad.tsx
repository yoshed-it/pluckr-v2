import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { pluckrAppTheme } from "./pluckrAppTheme";

const PAD_WIDTH = 320;
const PAD_HEIGHT = 180;

type PluckrSignaturePadProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

/**
 * Lightweight shared signature pad for consent flows.
 *
 * We persist the signature as an SVG data URI so the app can preview and reuse
 * it without introducing a larger document pipeline yet.
 */
export function PluckrSignaturePad({
  value,
  onChange
}: PluckrSignaturePadProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const activePathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPaths([]);
      return;
    }

    const restoredPaths = extractPathsFromDataUri(value);
    setPaths(restoredPaths);
  }, [value]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          activePathRef.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
          setPaths((current) => [...current, activePathRef.current ?? ""]);
        },
        onPanResponderMove: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          activePathRef.current = `${activePathRef.current ?? ""} L ${locationX.toFixed(
            1
          )} ${locationY.toFixed(1)}`;
          setPaths((current) => {
            const nextPaths = [...current];
            nextPaths[nextPaths.length - 1] = activePathRef.current ?? "";
            return nextPaths;
          });
        },
        onPanResponderRelease: () => {
          activePathRef.current = null;
        },
        onPanResponderTerminate: () => {
          activePathRef.current = null;
        }
      }),
    []
  );

  useEffect(() => {
    if (paths.length === 0) {
      onChange(null);
      return;
    }

    onChange(createSignatureDataUri(paths));
  }, [onChange, paths]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Signature</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.clearButton}
          onPress={() => setPaths([])}
        >
          <Text style={styles.clearLabel}>Clear</Text>
        </Pressable>
      </View>
      <View style={styles.padShell} {...panResponder.panHandlers}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${PAD_WIDTH} ${PAD_HEIGHT}`}>
          {paths.map((path) => (
            <Path
              key={path}
              d={path}
              stroke={pluckrAppTheme.colors.textPrimary}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </Svg>
        {paths.length === 0 ? (
          <View pointerEvents="none" style={styles.emptyState}>
            <Text style={styles.emptyCopy}>Sign here with your finger or stylus</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function SignaturePreview({ value }: { value: string | null }) {
  const paths = value ? extractPathsFromDataUri(value) : [];

  if (paths.length === 0) {
    return null;
  }

  return (
    <View style={styles.previewShell}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${PAD_WIDTH} ${PAD_HEIGHT}`}>
        {paths.map((path) => (
          <Path
            key={path}
            d={path}
            stroke={pluckrAppTheme.colors.textPrimary}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
}

function createSignatureDataUri(paths: string[]) {
  const xml = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PAD_WIDTH} ${PAD_HEIGHT}">`,
    ...paths.map(
      (path) =>
        `<path d="${path}" stroke="#24353f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />`
    ),
    "</svg>"
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(xml)}`;
}

function extractPathsFromDataUri(value: string) {
  if (!value.startsWith("data:image/svg+xml;utf8,")) {
    return [];
  }

  try {
    const encoded = value.replace(/^data:image\/svg\+xml;utf8,/, "");
    const xml = decodeURIComponent(encoded);
    const matches = [...xml.matchAll(/<path d="([^"]+)"/g)];

    return matches.map((match) => match[1]).filter(Boolean);
  } catch {
    return [];
  }
}

const styles = StyleSheet.create({
  container: {
    gap: pluckrAppTheme.spacing.xs
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.caption,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  clearButton: {
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: "rgba(44, 62, 80, 0.05)"
  },
  clearLabel: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  padShell: {
    height: PAD_HEIGHT,
    borderRadius: pluckrAppTheme.radii.lg,
    borderWidth: 1,
    borderColor: "rgba(44, 62, 80, 0.1)",
    backgroundColor: "#fffdf8",
    overflow: "hidden"
  },
  emptyState: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18
  },
  previewShell: {
    height: 120,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "#fffdf8",
    overflow: "hidden"
  }
});
