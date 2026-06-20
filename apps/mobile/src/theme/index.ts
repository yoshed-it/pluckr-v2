/**
 * Mobile theme bridge for the first v2 screens.
 *
 * The token values come from the shared design system so both web and
 * mobile stay visually aligned with the Swift prototype.
 */
import { getPluckrColors, pluckrRadii, pluckrSpacing } from "@pluckr/design-system";

export const mobileTheme = {
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
