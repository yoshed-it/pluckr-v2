/**
 * Mobile auth stage that mirrors the Swift login, sign-up, and reset flow
 * without introducing navigation dependencies before we need them.
 */
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BrandHeader } from "./BrandHeader";
import { PaperCard } from "./PaperCard";
import { PluckrButton } from "./PluckrButton";
import { PluckrTextField } from "./PluckrTextField";
import { mobileTheme } from "../theme";

export type MobileAuthMode = "signin" | "signup" | "forgot";

type MobileAuthStageProps = {
  mode: MobileAuthMode;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  notice: string | null;
  isSubmitting: boolean;
  onModeChange: (mode: MobileAuthMode) => void;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

function getCopy(mode: MobileAuthMode) {
  switch (mode) {
    case "signup":
      return {
        title: "Create Account",
        subtitle: "Join Pluckr",
        primaryLabel: "Create Account"
      };
    case "forgot":
      return {
        title: "Reset Password",
        subtitle: "Enter your email and we will send a reset link.",
        primaryLabel: "Send Reset Link"
      };
    case "signin":
    default:
      return {
        title: "Pluckr",
        subtitle: "Clinical Journal",
        primaryLabel: "Sign In"
      };
  }
}

export function MobileAuthStage({
  mode,
  fullName,
  email,
  password,
  confirmPassword,
  error,
  notice,
  isSubmitting,
  onModeChange,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit
}: MobileAuthStageProps) {
  const copy = getCopy(mode);
  const isSignIn = mode === "signin";
  const isSignUp = mode === "signup";
  const isForgot = mode === "forgot";
  const isDisabled =
    isSubmitting ||
    (isSignIn && (!email.trim() || !password)) ||
    (isSignUp &&
      (!fullName.trim() || !email.trim() || !password || !confirmPassword)) ||
    (isForgot && !email.trim());

  return (
    <View>
      <BrandHeader title={copy.title} subtitle={copy.subtitle} />

      <PaperCard>
        <View style={styles.formStack}>
          {isSignUp ? (
            <PluckrTextField
              label="Full Name"
              placeholder="Full Name"
              autoCapitalize="words"
              value={fullName}
              onChangeText={onFullNameChange}
            />
          ) : null}

          <PluckrTextField
            label="Email"
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={onEmailChange}
          />

          {!isForgot ? (
            <PluckrTextField
              label="Password"
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={onPasswordChange}
            />
          ) : null}

          {isSignUp ? (
            <PluckrTextField
              label="Confirm Password"
              placeholder="Confirm Password"
              secureTextEntry
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
            />
          ) : null}

          {error ? <Text style={[styles.message, styles.error]}>{error}</Text> : null}
          {notice ? (
            <Text style={[styles.message, styles.success]}>{notice}</Text>
          ) : null}

          <PluckrButton
            label={isSubmitting ? "Working..." : copy.primaryLabel}
            disabled={isDisabled}
            onPress={() => onSubmit()}
          />

          {isSignIn ? (
            <View style={styles.inlineActions}>
              <Text style={styles.link} onPress={() => onModeChange("signup")}>
                Create Account
              </Text>
              <Text style={styles.link} onPress={() => onModeChange("forgot")}>
                Forgot Password?
              </Text>
            </View>
          ) : (
            <Text style={styles.centerLink} onPress={() => onModeChange("signin")}>
              Back to Login
            </Text>
          )}
        </View>
      </PaperCard>
    </View>
  );
}

const styles = StyleSheet.create({
  formStack: {
    gap: mobileTheme.spacing.md
  },
  inlineActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: mobileTheme.spacing.md
  },
  message: {
    paddingHorizontal: mobileTheme.spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
  error: {
    color: mobileTheme.colors.critical
  },
  success: {
    color: mobileTheme.colors.success
  },
  link: {
    color: mobileTheme.colors.sageStrong,
    fontSize: mobileTheme.typography.body,
    fontWeight: "600"
  },
  centerLink: {
    textAlign: "center",
    color: mobileTheme.colors.sageStrong,
    fontSize: mobileTheme.typography.body,
    fontWeight: "600"
  }
});
