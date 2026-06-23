import React from "react";
import { StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

import { PluckrBrandHeader } from "../../composite/BrandHeader";
import { PluckrButton } from "../../primitives/Button";
import { PluckrCard } from "../../primitives/Card";
import { PluckrTextField } from "../../primitives/TextField";
import { pluckrAppTheme } from "../../pluckrAppTheme";

export type PluckrAuthMode = "signin" | "signup" | "forgot";

type PluckrAuthStageProps = {
  mode: PluckrAuthMode;
  logoSource: ImageSourcePropType;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  notice: string | null;
  isSubmitting: boolean;
  onModeChange: (mode: PluckrAuthMode) => void;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

function getCopy(mode: PluckrAuthMode) {
  switch (mode) {
    case "signup":
      return {
        title: "Create Account",
        subtitle: "Create your account first, then finish onboarding with your workspace invite.",
        primaryLabel: "Create Account"
      };
    case "forgot":
      return {
        title: "Reset Password",
        subtitle: "Enter your email and we will send a reset link.",
        primaryLabel: "Send Reset Link"
      };
    default:
      return {
        title: "Pluckr",
        subtitle: "Provider Workspace",
        primaryLabel: "Sign In"
      };
  }
}

export function PluckrAuthStage({
  mode,
  logoSource,
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
}: PluckrAuthStageProps) {
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
      <PluckrBrandHeader
        title={copy.title}
        subtitle={copy.subtitle}
        logoSource={logoSource}
      />

      <PluckrCard>
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
      </PluckrCard>
    </View>
  );
}

const styles = StyleSheet.create({
  formStack: {
    gap: pluckrAppTheme.spacing.md
  },
  inlineActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: pluckrAppTheme.spacing.md
  },
  message: {
    paddingHorizontal: pluckrAppTheme.spacing.xs,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
  error: {
    color: pluckrAppTheme.colors.critical
  },
  success: {
    color: pluckrAppTheme.colors.success
  },
  link: {
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "600"
  },
  centerLink: {
    textAlign: "center",
    color: pluckrAppTheme.colors.sageStrong,
    fontSize: pluckrAppTheme.typography.body,
    fontWeight: "600"
  }
});
