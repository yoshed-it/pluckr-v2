import { getPluckrColors, pluckrRadii, pluckrSpacing } from "./themeTokens";

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
  typography: {
    display: 34,
    heading: 28,
    subheading: 20,
    body: 16,
    caption: 12
  }
} as const;
