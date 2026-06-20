"use client";

import { useRef, useState } from "react";
import type { ChartUploadAsset } from "@pluckr/app-core";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function requestChartImages() {
    return new Promise<ChartUploadAsset[]>((resolve) => {
      const input = fileInputRef.current;

      if (!input) {
        resolve([]);
        return;
      }

      input.onchange = async () => {
        const files = Array.from(input.files ?? []);

        if (files.length === 0) {
          resolve([]);
          return;
        }

        const assets = await Promise.all(
          files.map(async (file) => ({
            fileName: file.name,
            mimeType: file.type || "image/jpeg",
            bytes: await file.arrayBuffer()
          }))
        );

        input.value = "";
        resolve(assets);
      };

      input.click();
    });
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />
      <PluckrAppShell
        supabase={supabase}
        storage={browserStorage}
        logoSource={{ uri: "/pluckr-logo.png" }}
        onRequestChartImages={requestChartImages}
      />
    </>
  );
}
