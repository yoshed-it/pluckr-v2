import React, { type PropsWithChildren } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

type SafeAreaContainerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Web fallback for the app shell safe area.
 *
 * Native devices use the `.native` implementation so web builds do not import
 * native safe-area internals through Next/Turbopack.
 */
export function SafeAreaContainer({
  children,
  style
}: SafeAreaContainerProps) {
  return <View style={style}>{children}</View>;
}
