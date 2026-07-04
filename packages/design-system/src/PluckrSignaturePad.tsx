import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

const PAD_WIDTH = 320;
const PAD_HEIGHT = 180;

type PluckrSignaturePadProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

/**
 * Cross-platform signature fallback used during the stabilization sprint.
 *
 * The native drawing pad can return later, but this version keeps consent
 * capture functional on both web and mobile without a platform-specific SVG
 * dependency in the shared UI layer.
 */
export function PluckrSignaturePad({
  value,
  onChange
}: PluckrSignaturePadProps) {
  const [signatureText, setSignatureText] = useState("");
  const shouldRenderImagePreview = isSignatureDataUri(value);

  useEffect(() => {
    setSignatureText(extractSignatureText(value));
  }, [value]);

  function handleChange(nextValue: string) {
    setSignatureText(nextValue);
    onChange(nextValue.trim() ? createSignatureDataUri(nextValue.trim()) : null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Signature</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.clearButton}
          onPress={() => handleChange("")}
        >
          <Text style={styles.clearLabel}>Clear</Text>
        </Pressable>
      </View>
      <View style={styles.padShell}>
        <TextInput
          placeholder="Type full name to sign"
          placeholderTextColor={pluckrAppTheme.colors.textSecondary}
          style={styles.input}
          value={signatureText}
          onChangeText={handleChange}
        />
        {shouldRenderImagePreview ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: value }} style={styles.previewImage} />
          </View>
        ) : signatureText ? (
          <View style={styles.textPreview}>
            <Text style={styles.textPreviewValue}>{signatureText}</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyCopy}>
              Type the signature to record consent during the stabilization
              sprint.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function SignaturePreview({ value }: { value: string | null }) {
  if (!isSignatureDataUri(value)) {
    return null;
  }

  return (
    <View style={styles.previewShell}>
      <Image source={{ uri: value }} style={styles.previewImage} />
    </View>
  );
}

function createSignatureDataUri(signatureText: string) {
  const escaped = escapeXml(signatureText);
  const xml = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PAD_WIDTH} ${PAD_HEIGHT}">`,
    `<rect width="${PAD_WIDTH}" height="${PAD_HEIGHT}" fill="#fffdf8" />`,
    `<text x="24" y="98" font-size="28" font-family="Georgia, serif" fill="#24353f">${escaped}</text>`,
    "</svg>"
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(xml)}`;
}

function extractSignatureText(value: string | null) {
  if (!value) {
    return "";
  }

  if (value.startsWith("signature:")) {
    return decodeURIComponent(value.replace(/^signature:/, ""));
  }

  if (!isSignatureDataUri(value)) {
    return "";
  }

  try {
    const encoded = value.replace(/^data:image\/svg\+xml;utf8,/, "");
    const xml = decodeURIComponent(encoded);
    const match = xml.match(/<text [^>]*>([^<]+)<\/text>/);
    return match?.[1] ?? "";
  } catch {
    return "";
  }
}

function isSignatureDataUri(value: string | null): value is string {
  return Boolean(value?.startsWith("data:image/svg+xml;utf8,"));
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
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
    minHeight: PAD_HEIGHT,
    borderRadius: pluckrAppTheme.radii.lg,
    borderWidth: 1,
    borderColor: "rgba(44, 62, 80, 0.1)",
    backgroundColor: "#fffdf8",
    overflow: "hidden"
  },
  input: {
    minHeight: 52,
    paddingHorizontal: pluckrAppTheme.spacing.md,
    paddingVertical: pluckrAppTheme.spacing.sm,
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 22,
    lineHeight: 30,
    fontFamily: "Georgia"
  },
  emptyState: {
    pointerEvents: "none",
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.md
  },
  emptyCopy: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center"
  },
  previewWrap: {
    height: 108,
    marginHorizontal: pluckrAppTheme.spacing.md,
    marginBottom: pluckrAppTheme.spacing.md,
    borderRadius: pluckrAppTheme.radii.md,
    overflow: "hidden"
  },
  previewShell: {
    height: 120,
    borderRadius: pluckrAppTheme.radii.md,
    backgroundColor: "#fffdf8",
    overflow: "hidden"
  },
  previewImage: {
    width: "100%",
    height: "100%"
  },
  textPreview: {
    minHeight: 96,
    justifyContent: "center",
    paddingHorizontal: pluckrAppTheme.spacing.md
  },
  textPreviewValue: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: "Georgia"
  }
});
