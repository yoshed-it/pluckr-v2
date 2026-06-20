/**
 * Shared Pluckr logo stack for the mobile auth and onboarding flow.
 */
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../theme";

type BrandHeaderProps = {
  title: string;
  subtitle: string;
  compact?: boolean;
};

const logoSource = require("../../assets/pluckr-logo.png");

export function BrandHeader({
  title,
  subtitle,
  compact = false
}: BrandHeaderProps) {
  return (
    <View style={[styles.container, compact ? styles.compact : null]}>
      <Image
        source={logoSource}
        style={[styles.logo, compact ? styles.logoCompact : null]}
        resizeMode="contain"
      />
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: mobileTheme.spacing.md,
    marginBottom: mobileTheme.spacing.lg
  },
  compact: {
    marginBottom: mobileTheme.spacing.md
  },
  logo: {
    width: 120,
    height: 120
  },
  logoCompact: {
    width: 92,
    height: 92
  },
  copy: {
    gap: mobileTheme.spacing.xs,
    alignItems: "center"
  },
  title: {
    color: mobileTheme.colors.textPrimary,
    fontSize: mobileTheme.typography.display,
    lineHeight: 40,
    fontWeight: "700",
    textAlign: "center"
  },
  subtitle: {
    color: mobileTheme.colors.textSecondary,
    fontSize: mobileTheme.typography.body,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 320
  }
});
