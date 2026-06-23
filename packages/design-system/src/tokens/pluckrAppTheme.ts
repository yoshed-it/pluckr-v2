import {
  getPluckrColors,
  pluckrRadii,
  pluckrShadows,
  pluckrSpacing
} from "./themeTokens";

/**
 * Shared React Native-friendly theme tokens for the rebuilt product screens.
 *
 * These sit on top of the design tokens so iOS, Android, and web can render
 * the same product UI without each app redefining spacing, radii, or colors.
 */
export const pluckrAppTheme = {
  colors: getPluckrColors("light"),
  radii: pluckrRadii,
  spacing: pluckrSpacing,
  shadows: pluckrShadows,
  typography: {
    display: 31,
    heading: 24,
    subheading: 18,
    body: 15,
    caption: 12
  },
  iconSizes: {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 26
  },
  navigation: {
    topBarHeight: 42,
    bottomBarHeight: 78,
    floatingActionSize: 56
  }
} as const;
