/**
 * Local Expo entrypoint for the mobile workspace.
 *
 * In a hoisted npm workspace, pointing directly at `expo/AppEntry` can make
 * Metro resolve `../../App` from the repo root instead of `apps/mobile`.
 * This local file keeps resolution anchored to the mobile app package.
 */
import { registerRootComponent } from "expo";

import App from "./App";

registerRootComponent(App);
