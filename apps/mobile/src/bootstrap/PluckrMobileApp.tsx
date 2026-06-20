import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import type { ChartUploadAsset } from "@pluckr/app-core";
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

  async function requestChartImages(): Promise<ChartUploadAsset[]> {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return [];
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      mediaTypes: ["images"],
      quality: 0.7
    });

    if (result.canceled) {
      return [];
    }

    return Promise.all(
      result.assets.map(async (asset, index) => {
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        return {
          fileName: asset.fileName ?? `chart-image-${index + 1}.jpg`,
          mimeType: asset.mimeType ?? blob.type ?? "image/jpeg",
          bytes: await blob.arrayBuffer()
        };
      })
    );
  }

  return (
    <PluckrAppShell
      supabase={supabase}
      storage={AsyncStorage}
      logoSource={logoSource}
      onRequestChartImages={requestChartImages}
    />
  );
}
