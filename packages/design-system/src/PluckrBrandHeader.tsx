import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType
} from "react-native";

import { pluckrAppTheme } from "./pluckrAppTheme";

type PluckrBrandHeaderProps = {
  title: string;
  subtitle: string;
  logoSource: ImageSourcePropType;
  compact?: boolean;
};

export function PluckrBrandHeader({
  title,
  subtitle,
  logoSource,
  compact = false
}: PluckrBrandHeaderProps) {
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
    gap: pluckrAppTheme.spacing.md,
    marginBottom: pluckrAppTheme.spacing.lg
  },
  compact: {
    marginBottom: pluckrAppTheme.spacing.md
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
    gap: pluckrAppTheme.spacing.xs,
    alignItems: "center"
  },
  title: {
    color: pluckrAppTheme.colors.textPrimary,
    fontSize: pluckrAppTheme.typography.display,
    lineHeight: 40,
    fontWeight: "700",
    textAlign: "center"
  },
  subtitle: {
    color: pluckrAppTheme.colors.textSecondary,
    fontSize: pluckrAppTheme.typography.body,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 320
  }
});
