import { getPluckrColors, pluckrRadii, pluckrSpacing } from "@pluckr/design-system";

export const mobileTheme = {
  colors: getPluckrColors("light"),
  radii: pluckrRadii,
  spacing: pluckrSpacing
} as const;
