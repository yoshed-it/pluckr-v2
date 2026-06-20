export type ThemeMode = "light" | "dark";

export const pluckrColors = {
  light: {
    background: "#FEFCF7",
    backgroundSoft: "#FBF8F3",
    surface: "#FFFFFF",
    surfaceMuted: "#F4F0E7",
    surfaceAccent: "#E8F5E9",
    border: "rgba(44, 62, 80, 0.12)",
    textPrimary: "#2C3E50",
    textSecondary: "rgba(60, 60, 60, 0.72)",
    sage: "#7FB785",
    sageStrong: "#5D7C6B",
    mint: "#E8F5E9",
    cream: "#FBF8F3",
    charcoal: "#2C3E50",
    forest: "#5D7C6B",
    sky: "#A8DADC",
    earth: "#8B7355",
    success: "#6ABF69",
    warning: "#E6B566",
    critical: "#E07A5F"
  },
  dark: {
    background: "#1C1C1C",
    backgroundSoft: "#2B2927",
    surface: "#242220",
    surfaceMuted: "#2E332D",
    surfaceAccent: "#525D53",
    border: "rgba(255, 255, 255, 0.1)",
    textPrimary: "#F8F8F8",
    textSecondary: "rgba(235, 235, 235, 0.72)",
    sage: "#A3CDA1",
    sageStrong: "#7EA791",
    mint: "#525D53",
    cream: "#2B2927",
    charcoal: "#E0E0E0",
    forest: "#7EA791",
    sky: "#739EAB",
    earth: "#A99273",
    success: "#8FD28E",
    warning: "#E6C982",
    critical: "#F0A68D"
  }
} as const;

export const pluckrSpacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
} as const;

export const pluckrRadii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999
} as const;

export const pluckrShadows = {
  paperSoft: "0 16px 32px rgba(44, 62, 80, 0.08)",
  paperMedium: "0 18px 40px rgba(44, 62, 80, 0.12)",
  paperStrong: "0 22px 48px rgba(44, 62, 80, 0.16)"
} as const;

export const pluckrTypography = {
  web: {
    display: "var(--font-display), ui-serif, Georgia, serif",
    body: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace"
  },
  mobile: {
    display: "System",
    body: "System"
  }
} as const;

export const investorDemoMetrics = [
  { label: "Prototype Focus", value: "Mobile + Web" },
  { label: "Current Priority", value: "Investor Story" },
  { label: "Backend Shape", value: "Supabase" },
  { label: "Brand Direction", value: "Journal Clinical" }
] as const;

function createCssBlock(mode: ThemeMode) {
  const tokens = pluckrColors[mode];

  return [
    `--color-background: ${tokens.background};`,
    `--color-background-soft: ${tokens.backgroundSoft};`,
    `--color-surface: ${tokens.surface};`,
    `--color-surface-muted: ${tokens.surfaceMuted};`,
    `--color-surface-accent: ${tokens.surfaceAccent};`,
    `--color-border: ${tokens.border};`,
    `--color-text-primary: ${tokens.textPrimary};`,
    `--color-text-secondary: ${tokens.textSecondary};`,
    `--color-sage: ${tokens.sage};`,
    `--color-sage-strong: ${tokens.sageStrong};`,
    `--color-mint: ${tokens.mint};`,
    `--color-cream: ${tokens.cream};`,
    `--color-charcoal: ${tokens.charcoal};`,
    `--color-forest: ${tokens.forest};`,
    `--color-sky: ${tokens.sky};`,
    `--color-earth: ${tokens.earth};`,
    `--color-success: ${tokens.success};`,
    `--color-warning: ${tokens.warning};`,
    `--color-critical: ${tokens.critical};`,
    `--radius-sm: ${pluckrRadii.sm}px;`,
    `--radius-md: ${pluckrRadii.md}px;`,
    `--radius-lg: ${pluckrRadii.lg}px;`,
    `--radius-xl: ${pluckrRadii.xl}px;`,
    `--shadow-paper-soft: ${pluckrShadows.paperSoft};`,
    `--shadow-paper-medium: ${pluckrShadows.paperMedium};`,
    `--shadow-paper-strong: ${pluckrShadows.paperStrong};`
  ].join("");
}

export function buildPluckrThemeCss() {
  return `
    :root {
      ${createCssBlock("light")}
    }

    @media (prefers-color-scheme: dark) {
      :root {
        ${createCssBlock("dark")}
      }
    }
  `;
}

export function getPluckrColors(mode: ThemeMode = "light") {
  return pluckrColors[mode];
}
