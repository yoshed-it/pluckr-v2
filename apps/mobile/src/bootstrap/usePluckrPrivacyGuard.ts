import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import * as ScreenCapture from "expo-screen-capture";

type PluckrPrivacyGuardInput = {
  isSensitiveScreen: boolean;
  protectSensitiveScreens: boolean;
};

const PRIVACY_GUARD_KEY = "pluckr-sensitive-screens";

/**
 * Coordinates screen-capture blocking and emergency concealment for the
 * mobile shell without leaking Expo-specific code into shared UI packages.
 */
export function usePluckrPrivacyGuard({
  isSensitiveScreen,
  protectSensitiveScreens
}: PluckrPrivacyGuardInput) {
  const [privacyCurtainVisible, setPrivacyCurtainVisible] = useState(false);
  const concealmentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldProtect = protectSensitiveScreens && isSensitiveScreen;

  useEffect(() => {
    let isMounted = true;

    async function syncScreenCaptureProtection() {
      if (!isMounted) {
        return;
      }

      if (!shouldProtect) {
        setPrivacyCurtainVisible(false);
        await ScreenCapture.allowScreenCaptureAsync(PRIVACY_GUARD_KEY);
        if (Platform.OS === "ios") {
          await ScreenCapture.disableAppSwitcherProtectionAsync();
        }
        return;
      }

      await ScreenCapture.preventScreenCaptureAsync(PRIVACY_GUARD_KEY);
      if (Platform.OS === "ios") {
        await ScreenCapture.enableAppSwitcherProtectionAsync(1);
      }
    }

    void syncScreenCaptureProtection();

    return () => {
      isMounted = false;
    };
  }, [shouldProtect]);

  useEffect(() => {
    if (!shouldProtect) {
      return;
    }

    const subscription = AppState.addEventListener("change", (nextState) => {
      setPrivacyCurtainVisible(nextState !== "active");
    });

    return () => {
      subscription.remove();
    };
  }, [shouldProtect]);

  useEffect(() => {
    if (!shouldProtect || Platform.OS !== "ios") {
      return;
    }

    const subscription = ScreenCapture.addScreenshotListener(() => {
      setPrivacyCurtainVisible(true);

      if (concealmentTimerRef.current) {
        clearTimeout(concealmentTimerRef.current);
      }

      concealmentTimerRef.current = setTimeout(() => {
        setPrivacyCurtainVisible(false);
        concealmentTimerRef.current = null;
      }, 2500);
    });

    return () => {
      subscription.remove();
      if (concealmentTimerRef.current) {
        clearTimeout(concealmentTimerRef.current);
        concealmentTimerRef.current = null;
      }
    };
  }, [shouldProtect]);

  useEffect(
    () => () => {
      if (concealmentTimerRef.current) {
        clearTimeout(concealmentTimerRef.current);
      }
      void ScreenCapture.allowScreenCaptureAsync(PRIVACY_GUARD_KEY);
      if (Platform.OS === "ios") {
        void ScreenCapture.disableAppSwitcherProtectionAsync();
      }
    },
    []
  );

  return {
    privacyCurtainVisible
  };
}
