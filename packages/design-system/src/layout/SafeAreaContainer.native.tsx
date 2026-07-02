import React, { type PropsWithChildren } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView
} from "react-native-safe-area-context";

type SafeAreaContainerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Native safe-area boundary for the app shell.
 *
 * Keeping this platform-specific import here avoids leaking native modules into
 * the web bundle while removing deprecated React Native SafeAreaView usage.
 */
export function SafeAreaContainer({
  children,
  style
}: SafeAreaContainerProps) {
  return (
    <SafeAreaProvider style={style}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
