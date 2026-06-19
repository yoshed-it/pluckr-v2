import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { AuthMode } from "./types";

/**
 * Keeps auth form state and auth actions out of the UI components.
 */
export function useAuthController(client: SupabaseClient) {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function changeAuthMode(mode: AuthMode) {
    setAuthMode(mode);
    setAuthError(null);
    setAuthNotice(null);
  }

  async function signIn() {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthNotice(null);

    const { error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      setAuthError(error.message);
      setAuthSubmitting(false);
      return;
    }

    setAuthSubmitting(false);
  }

  async function signUp() {
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    setAuthSubmitting(true);
    setAuthError(null);
    setAuthNotice(null);

    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: fullName.trim(),
          full_name: fullName.trim()
        }
      }
    });

    if (error) {
      setAuthError(error.message);
      setAuthSubmitting(false);
      return;
    }

    if (!data.session) {
      setAuthNotice("Account created. Check your email to confirm the sign-in.");
      setAuthSubmitting(false);
      setAuthMode("signin");
      return;
    }

    setAuthNotice("Account created successfully.");
    setAuthSubmitting(false);
  }

  async function sendPasswordReset() {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthNotice(null);

    const { error } = await client.auth.resetPasswordForEmail(email.trim());

    if (error) {
      setAuthError(error.message);
      setAuthSubmitting(false);
      return;
    }

    setAuthNotice(`Reset link sent to ${email.trim()}.`);
    setAuthSubmitting(false);
  }

  function resetAfterLogout() {
    setAuthMode("signin");
    setAuthSubmitting(false);
    setAuthError(null);
    setAuthNotice(null);
  }

  return {
    authMode,
    authSubmitting,
    authError,
    authNotice,
    fullName,
    email,
    password,
    confirmPassword,
    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    changeAuthMode,
    signIn,
    signUp,
    sendPasswordReset,
    resetAfterLogout
  };
}
