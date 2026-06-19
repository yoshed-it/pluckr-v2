"use client";

/**
 * First dashboard slice for the rebuild.
 *
 * This intentionally stays close to the Swift prototype's calm card rhythm
 * while surfacing the data that matters for a believable investor walkthrough.
 */
import type {
  ClientRecord,
  MembershipWithOrganization,
  RecentChartRecord,
  WorkspaceSummary
} from "@pluckr/supabase";

import { MetricPill } from "./MetricPill";
import { PaperPanel } from "./PaperPanel";

type WorkspaceStageProps = {
  organization: MembershipWithOrganization["organization"];
  membership: MembershipWithOrganization["membership"];
  summary: WorkspaceSummary;
  clients: ClientRecord[];
  charts: RecentChartRecord[];
  isLoading: boolean;
  isSeeding: boolean;
  error: string | null;
  notice: string | null;
  onBack: () => void;
  onOpenClients: () => void;
  onSeedDemoData: () => void;
  onLogout: () => void;
};

function formatDateLabel(value: string | null) {
  if (!value) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function WorkspaceStage({
  organization,
  membership,
  summary,
  clients,
  charts,
  isLoading,
  isSeeding,
  error,
  notice,
  onBack,
  onOpenClients,
  onSeedDemoData,
  onLogout
}: WorkspaceStageProps) {
  const metrics = [
    { label: "Organizations", value: String(summary.organizations) },
    { label: "Clients", value: String(summary.clients) },
    { label: "Charts", value: String(summary.charts) },
    { label: "Role", value: membership.role }
  ];

  return (
    <main className="swift-shell">
      <div className="stage-column stage-column-wide">
        <div className="stage-toolbar">
          <button className="swift-link-button" type="button" onClick={onBack}>
            ← Organizations
          </button>
          <button className="swift-link-button danger-link" onClick={onLogout}>
            Log Out
          </button>
        </div>

        <section className="workspace-hero">
          <PaperPanel className="workspace-hero-panel">
            <span className="section-eyebrow">Current Organization</span>
            <h1 className="hero-title">{organization.name}</h1>
            <p className="hero-copy">
              {organization.description ||
                "Clinical journal flow ready for provider notes, client tracking, and a calm investor demo."}
            </p>

            <div className="metric-grid">
              {metrics.map((metric) => (
                <MetricPill
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                />
              ))}
            </div>

            <div className="hero-footer">
              <span className="hero-badge">
                {clients.length === 0 ? "Ready for demo seeding" : "Live demo data"}
              </span>
              <div className="client-form-actions">
                <button
                  className="swift-button swift-button-secondary"
                  type="button"
                  onClick={onOpenClients}
                >
                  Open Client List
                </button>
                <button
                  className="swift-button swift-button-secondary"
                  type="button"
                  disabled={isSeeding}
                  onClick={onSeedDemoData}
                >
                  {isSeeding ? "Seeding..." : "Seed Demo Data"}
                </button>
              </div>
            </div>
          </PaperPanel>
        </section>

        {error ? <p className="message-banner message-error">{error}</p> : null}
        {notice ? <p className="message-banner message-success">{notice}</p> : null}

        <section className="workspace-grid">
          <PaperPanel>
            <div className="panel-header-row">
              <h2 className="panel-title panel-title-small">Client List</h2>
              <span className="count-chip">{clients.length}</span>
            </div>

            {isLoading ? (
              <p className="empty-state">Loading clients...</p>
            ) : clients.length === 0 ? (
              <p className="empty-state">
                Seed demo data to create the first three investor-ready client
                records.
              </p>
            ) : (
              <div className="workspace-list">
                {clients.map((client) => (
                  <article key={client.id} className="workspace-list-card">
                    <div className="workspace-list-header">
                      <strong>
                        {client.first_name} {client.last_name}
                      </strong>
                      <span className="tag-chip muted-chip">
                        {client.pronouns || "Client"}
                      </span>
                    </div>
                    <p className="workspace-list-copy">
                      {client.notes || "No care notes yet."}
                    </p>
                    <span className="workspace-list-meta">
                      Last seen {formatDateLabel(client.last_seen_at)}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </PaperPanel>

          <PaperPanel>
            <div className="panel-header-row">
              <h2 className="panel-title panel-title-small">Recent Charts</h2>
              <span className="count-chip">{charts.length}</span>
            </div>

            {isLoading ? (
              <p className="empty-state">Loading chart activity...</p>
            ) : charts.length === 0 ? (
              <p className="empty-state">
                Chart activity will appear here after the first session notes are
                created.
              </p>
            ) : (
              <div className="workspace-list">
                {charts.map((chart) => (
                  <article key={chart.id} className="workspace-list-card">
                    <div className="workspace-list-header">
                      <strong>
                        {chart.client
                          ? `${chart.client.first_name} ${chart.client.last_name}`
                          : "Client"}
                      </strong>
                      <span className="tag-chip">
                        {chart.modality || "Chart"}
                      </span>
                    </div>
                    <p className="workspace-list-copy">
                      {chart.treatment_summary ||
                        chart.notes ||
                        "Recent session details coming soon."}
                    </p>
                    <span className="workspace-list-meta">
                      {chart.treatment_area || "Treatment"} on{" "}
                      {formatDateLabel(chart.created_at)}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </PaperPanel>
        </section>
      </div>
    </main>
  );
}
