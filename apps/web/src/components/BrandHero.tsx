/**
 * Recreates the stacked Pluckr header used across the Swift auth and
 * onboarding flow so the rebuild keeps the same emotional first impression.
 */
import Image from "next/image";

type BrandHeroProps = {
  title: string;
  subtitle: string;
  logoSize?: number;
  compact?: boolean;
};

export function BrandHero({
  title,
  subtitle,
  logoSize = 120,
  compact = false
}: BrandHeroProps) {
  return (
    <div className={`brand-hero ${compact ? "brand-hero-compact" : ""}`}>
      <Image
        src="/pluckr-logo.png"
        alt="Pluckr logo"
        width={logoSize}
        height={logoSize}
        className="brand-logo"
        priority
      />
      <div className="brand-copy">
        <h1 className="brand-title">{title}</h1>
        <p className="brand-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
