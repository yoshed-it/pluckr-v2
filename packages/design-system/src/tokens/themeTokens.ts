export type ThemeMode = "light" | "dark";

export const pluckrColors = {
  light: {
    background: "#FAF9F5",
    backgroundSoft: "#F5F2EA",
    surface: "#FFFFFF",
    surfaceMuted: "#F8F7F2",
    surfaceAccent: "#F1F6F2",
    border: "#E4E5DD",
    divider: "#ECEBE4",
    textPrimary: "#132238",
    textSecondary: "#485C6F",
    textMuted: "#788393",
    sage: "#0F8A7D",
    sageStrong: "#0A6F66",
    mint: "#DDEEE7",
    cream: "#FFFDF9",
    charcoal: "#132238",
    forest: "#2E9C5A",
    sky: "#0F8A7D",
    earth: "#D7A85C",
    success: "#2E9C5A",
    warning: "#C28A3B",
    critical: "#C86A5B",
    info: "#5B8C87",
    accent: "#E8BF63",
    clinicalMemory: "#E8BF63",
    successSurface: "#EAF5EE",
    warningSurface: "#F7EFE1",
    criticalSurface: "#F9ECE8",
    infoSurface: "#EEF6F4",
    accentSurface: "#F8F1DD"
  },
  dark: {
    background: "#0F172A",
    backgroundSoft: "#111827",
    surface: "#1E293B",
    surfaceMuted: "#334155",
    surfaceAccent: "#134E4A",
    border: "#334155",
    divider: "#475569",
    textPrimary: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    sage: "#2DD4BF",
    sageStrong: "#14B8A6",
    mint: "#134E4A",
    cream: "#0F172A",
    charcoal: "#F8FAFC",
    forest: "#22C55E",
    sky: "#2DD4BF",
    earth: "#F4A300",
    success: "#22C55E",
    warning: "#FB923C",
    critical: "#F87171",
    info: "#2DD4BF",
    accent: "#F4A300",
    clinicalMemory: "#F4A300",
    successSurface: "#123524",
    warningSurface: "#43210F",
    criticalSurface: "#3F1D20",
    infoSurface: "#123838",
    accentSurface: "#3F2E12"
  }
} as const;

export const pluckrSpacing = {
  xxs: 4,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 34,
  xxxl: 48
} as const;

export const pluckrRadii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  card: 18,
  button: 14,
  pill: 999,
  full: 999
} as const;

export const pluckrShadows = {
  paperSoft: "0 1px 2px rgba(19, 34, 56, 0.06)",
  paperMedium: "0 6px 18px rgba(19, 34, 56, 0.055)",
  paperStrong: "0 12px 28px rgba(19, 34, 56, 0.075)"
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
    `--color-divider: ${tokens.divider};`,
    `--color-text-primary: ${tokens.textPrimary};`,
    `--color-text-secondary: ${tokens.textSecondary};`,
    `--color-text-muted: ${tokens.textMuted};`,
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
    `--color-info: ${tokens.info};`,
    `--color-accent: ${tokens.accent};`,
    `--color-clinical-memory: ${tokens.clinicalMemory};`,
    `--color-success-surface: ${tokens.successSurface};`,
    `--color-warning-surface: ${tokens.warningSurface};`,
    `--color-critical-surface: ${tokens.criticalSurface};`,
    `--color-info-surface: ${tokens.infoSurface};`,
    `--color-accent-surface: ${tokens.accentSurface};`,
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
