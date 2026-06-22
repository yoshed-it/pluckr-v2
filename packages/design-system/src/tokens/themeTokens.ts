export type ThemeMode = "light" | "dark";

export const pluckrColors = {
  light: {
    background: "#F4F7F8",
    backgroundSoft: "#EDF2F5",
    surface: "#FDFEFE",
    surfaceMuted: "#F5F8FA",
    surfaceAccent: "#F2F7F6",
    border: "#E2E8F0",
    divider: "#D7E0E8",
    textPrimary: "#1E293B",
    textSecondary: "#334155",
    textMuted: "#64748B",
    sage: "#0D9488",
    sageStrong: "#0F766E",
    mint: "#CCFBF1",
    cream: "#F8FAFC",
    charcoal: "#1E293B",
    forest: "#15803D",
    sky: "#0D9488",
    earth: "#F4A300",
    success: "#15803D",
    warning: "#EA580C",
    critical: "#DC2626",
    info: "#0D9488",
    accent: "#F4A300",
    clinicalMemory: "#F4A300",
    successSurface: "#EEF8F1",
    warningSurface: "#FFF2E8",
    criticalSurface: "#FEF0EE",
    infoSurface: "#EEF8F7",
    accentSurface: "#FFF7E5"
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
  paperSoft: "0 8px 20px rgba(15, 23, 42, 0.045)",
  paperMedium: "0 12px 24px rgba(15, 23, 42, 0.06)",
  paperStrong: "0 16px 32px rgba(15, 23, 42, 0.09)"
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
