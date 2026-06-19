import { investorDemoMetrics } from "@pluckr/design-system";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

import { PaperCard } from "./src/components/PaperCard";
import { mobileTheme } from "./src/theme";

const prototypeTracks = [
  "Provider journal for charts, photos, and treatment notes",
  "Clinic overview for investors, onboarding, and lightweight admin",
  "Shared design language carried over from the current Swift prototype"
];

const buildNotes = [
  {
    title: "Why v2 exists",
    body:
      "The old app is a strong reference, but this build starts cleaner: shared tokens, shared data access, and a platform shape that can grow."
  },
  {
    title: "What stays the same",
    body:
      "The soft paper background, sage accenting, and clinical-journal tone are preserved so the product still feels like Pluckr immediately."
  },
  {
    title: "What changes next",
    body:
      "We can layer in auth, real data, camera flows, charting, and org-aware navigation without dragging the Swift-era coupling forward."
  }
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Pluckr v2</Text>
          <Text style={styles.title}>Clinical journaling, rebuilt for growth.</Text>
          <Text style={styles.subtitle}>
            This mobile shell keeps the current look and feel intact while we
            move onto a cleaner React Native and Supabase foundation.
          </Text>
        </View>

        <View style={styles.metricGrid}>
          {investorDemoMetrics.map((metric) => (
            <PaperCard key={metric.label} compact>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </PaperCard>
          ))}
        </View>

        <PaperCard>
          <Text style={styles.sectionTitle}>Prototype Tracks</Text>
          {prototypeTracks.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bodyText}>{item}</Text>
            </View>
          ))}
        </PaperCard>

        {buildNotes.map((note) => (
          <PaperCard key={note.title}>
            <Text style={styles.cardTitle}>{note.title}</Text>
            <Text style={styles.bodyText}>{note.body}</Text>
          </PaperCard>
        ))}

        <PaperCard accent>
          <Text style={styles.sectionTitle}>Next Build Slice</Text>
          <Text style={styles.bodyText}>
            Auth, organization switching, client list, and a chart-entry flow
            should be the first end-to-end vertical slice.
          </Text>
        </PaperCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mobileTheme.colors.background
  },
  scrollContent: {
    paddingHorizontal: mobileTheme.spacing.lg,
    paddingTop: mobileTheme.spacing.lg,
    paddingBottom: mobileTheme.spacing.xxxl,
    gap: mobileTheme.spacing.md
  },
  hero: {
    gap: mobileTheme.spacing.sm,
    marginBottom: mobileTheme.spacing.sm
  },
  eyebrow: {
    color: mobileTheme.colors.sageStrong,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  title: {
    color: mobileTheme.colors.textPrimary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700"
  },
  subtitle: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24
  },
  metricGrid: {
    gap: mobileTheme.spacing.sm
  },
  metricLabel: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  metricValue: {
    color: mobileTheme.colors.textPrimary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700"
  },
  sectionTitle: {
    color: mobileTheme.colors.textPrimary,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    marginBottom: mobileTheme.spacing.sm
  },
  cardTitle: {
    color: mobileTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    marginBottom: mobileTheme.spacing.xs
  },
  bodyText: {
    flex: 1,
    color: mobileTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 23
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: mobileTheme.spacing.sm,
    marginBottom: mobileTheme.spacing.sm
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: mobileTheme.radii.full,
    backgroundColor: mobileTheme.colors.sage,
    marginTop: 7
  }
});
