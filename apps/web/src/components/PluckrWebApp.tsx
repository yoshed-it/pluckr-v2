"use client";

import { useRef, useState } from "react";
import {
  type ChartUploadAsset,
  usePluckrAppShellModel
} from "@pluckr/app-core";
import { PluckrAppShell } from "@pluckr/design-system/app-shell";
import { getSupabaseBrowserClient } from "@pluckr/supabase";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Web wrapper around the shared product shell.
 *
 * Next remains responsible for hosting, routing, and server-side features, but
 * the product UI itself now renders through the shared Expo React Native layer.
 */
export function PluckrWebApp() {
  const supabase = useState(() =>
    getSupabaseBrowserClient({
      url: requireWebEnv(
        "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL",
        supabaseUrl
      ),
      publishableKey: requireWebEnv(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        supabasePublishableKey
      )
    })
  )[0];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const shellModel = usePluckrAppShellModel({
    supabase,
    onRequestChartImages: requestChartImages
  });

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
        model={shellModel}
        logoSource={{ uri: "/pluckr-logo.png" }}
      />
    </>
  );
}

function requireWebEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
