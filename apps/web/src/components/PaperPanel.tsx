/**
 * Shared paper card wrapper that keeps the web rebuild visually anchored
 * to the current Swift prototype's soft card treatment.
 */
import type { PropsWithChildren } from "react";

type PaperPanelProps = PropsWithChildren<{
  className?: string;
}>;

export function PaperPanel({ className, children }: PaperPanelProps) {
  const classes = ["paper-panel", className].filter(Boolean).join(" ");

  return <section className={classes}>{children}</section>;
}
