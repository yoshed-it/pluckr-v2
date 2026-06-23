import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import {
  type ChartUploadAsset,
  usePluckrAppShellModel
} from "@pluckr/app-core";
import { PluckrAppShell } from "@pluckr/design-system/app-shell";
import { getSupabaseNativeClient } from "@pluckr/supabase";

import { PluckrCameraCaptureModal } from "./PluckrCameraCaptureModal";
import { usePluckrPrivacyGuard } from "./usePluckrPrivacyGuard";

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
  const pendingCaptureResolveRef = useRef<
    ((assets: ChartUploadAsset[]) => void) | null
  >(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const shellModel = usePluckrAppShellModel({
    supabase,
    onRequestChartImages: requestChartImages
  });
  const { privacyCurtainVisible } = usePluckrPrivacyGuard({
    isSensitiveScreen: shellModel.isSensitiveScreen,
    protectSensitiveScreens: shellModel.protectSensitiveScreens
  });

  function requestChartImages(): Promise<ChartUploadAsset[]> {
    setIsCameraVisible(true);

    return new Promise((resolve) => {
      pendingCaptureResolveRef.current = resolve;
    });
  }

  function handleCloseCamera() {
    setIsCameraVisible(false);
    pendingCaptureResolveRef.current?.([]);
    pendingCaptureResolveRef.current = null;
  }

  function handleConfirmCapture(asset: ChartUploadAsset) {
    setIsCameraVisible(false);
    pendingCaptureResolveRef.current?.([asset]);
    pendingCaptureResolveRef.current = null;
  }

  return (
    <>
      <PluckrAppShell
        model={shellModel}
        logoSource={logoSource}
        privacyCurtainVisible={privacyCurtainVisible}
      />
      <PluckrCameraCaptureModal
        visible={isCameraVisible}
        onClose={handleCloseCamera}
        onConfirmCapture={handleConfirmCapture}
      />
    </>
  );
}
