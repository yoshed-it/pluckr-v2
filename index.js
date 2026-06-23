/**
 * Root Expo entrypoint.
 *
 * This keeps `npx expo start` from the repo root pointed at the actual mobile
 * workspace instead of falling back to Expo's default AppEntry resolution.
 */
import "./apps/mobile/index";
