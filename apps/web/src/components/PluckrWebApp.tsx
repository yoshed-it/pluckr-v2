"use client";

import { useState } from "react";
import { PluckrAppShell } from "@pluckr/design-system";
import { getSupabaseBrowserClient } from "@pluckr/supabase";

const browserStorage = {
  getItem: (key: string) =>
    typeof window === "undefined" ? null : window.localStorage.getItem(key),
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  }
};

/**
 * Web wrapper around the shared product shell.
 *
 * Next remains responsible for hosting, routing, and server-side features, but
 * the product UI itself now renders through the shared Expo React Native layer.
 */
export function PluckrWebApp() {
  const supabase = useState(() => getSupabaseBrowserClient())[0];

  return (
    <PluckrAppShell
      supabase={supabase}
      storage={browserStorage}
      logoSource={{ uri: "/pluckr-logo.png" }}
    />
  );
}
