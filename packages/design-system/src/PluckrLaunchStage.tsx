import React from "react";
import { StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

import { PluckrBrandHeader } from "./composite/BrandHeader";
import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrLaunchStageProps = {
  logoSource: ImageSourcePropType;
};

/**
 * Mirrors the calm branded launch gate from the Swift app before auth and
 * organization state settle.
 */
export function PluckrLaunchStage({ logoSource }: PluckrLaunchStageProps) {
  return (
    <View style={styles.container}>
      <PluckrBrandHeader
        title="Pluckr"
        subtitle="Clinical Journal"
        logoSource={logoSource}
      />
      <Text style={styles.caption}>Preparing your clinical journal...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 520,
    justifyContent: "center",
    gap: pluckrAppTheme.spacing.md
  },
  caption: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24,
    textAlign: "center"
  }
});
