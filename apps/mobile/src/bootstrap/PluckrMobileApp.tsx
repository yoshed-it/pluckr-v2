import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { PluckrAppShell } from "@pluckr/design-system";
import { getSupabaseNativeClient } from "@pluckr/supabase";

const logoSource = require("../../assets/pluckr-logo.png");

/**
 * Mobile wrapper around the shared product shell.
 *
 * The app-specific responsibilities here are intentionally small:
 * provide the native Supabase client, native storage adapter, and the local
 * logo asset. The product UI itself lives in the shared Expo React Native layer.
 */
export function PluckrMobileApp() {
  const supabase = useState(() => getSupabaseNativeClient(AsyncStorage))[0];

  return (
    <PluckrAppShell
      supabase={supabase}
      storage={AsyncStorage}
      logoSource={logoSource}
    />
  );
}
