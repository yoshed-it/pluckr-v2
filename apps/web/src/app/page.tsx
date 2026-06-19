import { investorDemoMetrics } from "@pluckr/design-system";

import { MetricPill } from "../components/MetricPill";
import { PaperPanel } from "../components/PaperPanel";

const pillars = [
  {
    title: "Provider Journal",
    body:
      "A clinical note-taking flow that feels calm, premium, and easy to trust during treatment."
  },
  {
    title: "Clinic Command",
    body:
      "A lightweight operations surface for invites, provider roles, onboarding, and growth visibility."
  },
  {
    title: "Foundational Rebuild",
    body:
      "Shared tokens, shared data access, and a clean repo shape so the next ideas compound instead of colliding."
  }
];

const roadmap = [
  ["Foundation", "Shared tokens, web shell, mobile shell, Supabase schema"],
  ["Core Flows", "Auth, org context, client list, chart entry creation"],
  ["Prototype Polish", "Investor story, seeded demo data, refined motion and copy"],
  ["Operational Layer", "Invites, provider settings, clinic dashboard"]
] as const;

const previewNotes = [
  "Styling intentionally mirrors the current Swift prototype instead of jumping to a generic startup dashboard aesthetic.",
  "The product story is clearer now: mobile for treatment-time use, web for clinic and investor demos.",
  "Supabase fits the org → provider → client → chart model far better than continuing to improvise around the old structure."
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-stack">
          <span className="brand-kicker">Pluckr</span>
          <span className="brand-name">v2 Prototype Workspace</span>
        </div>
        <div className="topbar-badges">
          <span className="topbar-chip">React Native</span>
          <span className="topbar-chip">Next.js</span>
          <span className="topbar-chip">Supabase</span>
        </div>
      </header>

      <section className="hero-grid">
        <PaperPanel className="hero-panel">
          <span className="section-eyebrow">Investor Prototype</span>
          <h1 className="hero-title">
            Clinical journaling, rebuilt without losing the soul of the first app.
          </h1>
          <p className="hero-copy">
            This workspace keeps the soft paper-and-sage identity from the
            current prototype while moving the product onto a cleaner web +
            mobile architecture that can actually scale with your ideas.
          </p>

          <div className="metric-grid">
            {investorDemoMetrics.map((metric) => (
              <MetricPill
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>
        </PaperPanel>

        <PaperPanel className="status-panel">
          <span className="section-eyebrow">Build Status</span>
          <ul className="soft-list">
            <li>
              <span className="status-dot" />
              Shared design tokens translated from Swift
            </li>
            <li>
              <span className="status-dot" />
              Mobile and web shells scaffolded
            </li>
            <li>
              <span className="status-dot" />
              Supabase schema outlined for the next build slice
            </li>
          </ul>
          <div className="note-block">
            <strong>Immediate next move</strong>
            <p>
              Build auth plus org-aware routing, then seed one believable clinic
              workflow end to end.
            </p>
          </div>
        </PaperPanel>
      </section>

      <section className="feature-grid">
        {pillars.map((pillar) => (
          <PaperPanel key={pillar.title}>
            <span className="section-eyebrow">Pillar</span>
            <h2 className="panel-title">{pillar.title}</h2>
            <p className="panel-copy">{pillar.body}</p>
          </PaperPanel>
        ))}
      </section>

      <section className="preview-grid">
        <PaperPanel>
          <span className="section-eyebrow">Continuity Notes</span>
          <h2 className="panel-title">What we preserved on purpose</h2>
          <ul className="soft-list">
            {previewNotes.map((note) => (
              <li key={note}>
                <span className="status-dot" />
                {note}
              </li>
            ))}
          </ul>
        </PaperPanel>

        <PaperPanel>
          <span className="section-eyebrow">Build Roadmap</span>
          <h2 className="panel-title">Short path to a demoable v2</h2>
          <div className="ledger-table">
            {roadmap.map(([phase, detail]) => (
              <div key={phase} className="ledger-row">
                <strong>{phase}</strong>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </PaperPanel>
      </section>
    </main>
  );
}
