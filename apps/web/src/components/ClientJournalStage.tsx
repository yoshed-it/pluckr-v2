"use client";

/**
 * Swift-parity client journal screen for the web app.
 *
 * This screen is the bridge between the client list and the chart-entry flow:
 * client context at the top, recent chart history in the middle, and a simple
 * chart editor tucked into the same calm paper stack as the Swift prototype.
 */
import type { ChartEntryRecord, ClientRecord } from "@pluckr/supabase";

import { PaperPanel } from "./PaperPanel";

type ClientJournalStageProps = {
  client: ClientRecord;
  charts: ChartEntryRecord[];
  isLoading: boolean;
  error: string | null;
  notice: string | null;
  isEditingChart: boolean;
  isSavingChart: boolean;
  chartForm: {
    modality: string;
    treatmentArea: string;
    treatmentSummary: string;
    notes: string;
    tags: string;
  };
  onBack: () => void;
  onLogout: () => void;
  onStartChart: () => void;
  onCancelChart: () => void;
  onEditChart: (chart: ChartEntryRecord) => void;
  onDeleteChart: (chart: ChartEntryRecord) => void;
  onChartFormChange: (
    key: "modality" | "treatmentArea" | "treatmentSummary" | "notes" | "tags",
    value: string
  ) => void;
  onSubmitChart: () => void;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function ClientJournalStage({
  client,
  charts,
  isLoading,
  error,
  notice,
  isEditingChart,
  isSavingChart,
  chartForm,
  onBack,
  onLogout,
  onStartChart,
  onCancelChart,
  onEditChart,
  onDeleteChart,
  onChartFormChange,
  onSubmitChart
}: ClientJournalStageProps) {
  return (
    <main className="swift-shell">
      <div className="stage-column stage-column-wide">
        <div className="stage-toolbar">
          <button className="swift-link-button" type="button" onClick={onBack}>
            ← Client List
          </button>
          <button className="swift-link-button danger-link" onClick={onLogout}>
            Log Out
          </button>
        </div>

        <PaperPanel className="journal-hero-panel">
          <div className="journal-hero">
            <div>
              <span className="section-eyebrow">Client Journal</span>
              <h1 className="panel-title">
                {client.first_name} {client.last_name}
              </h1>
              <p className="panel-copy">
                {client.notes || "No care summary yet. Start the first chart entry below."}
              </p>
            </div>
            <div className="journal-meta">
              <span className="tag-chip">{client.pronouns || "Client"}</span>
              <span className="journal-meta-copy">
                {client.email || client.phone || "No direct contact on file"}
              </span>
            </div>
          </div>
          <div className="journal-actions">
            <button
              className="swift-button swift-button-primary client-stage-button"
              type="button"
              onClick={onStartChart}
            >
              New Chart Entry
            </button>
          </div>
        </PaperPanel>

        {error ? <p className="message-banner message-error">{error}</p> : null}
        {notice ? <p className="message-banner message-success">{notice}</p> : null}

        {isEditingChart ? (
          <PaperPanel className="client-form-panel">
            <h2 className="panel-title panel-title-small">Chart Entry</h2>
            <div className="form-stack">
              <div className="client-form-grid">
                <input
                  className="swift-field"
                  placeholder="Modality"
                  value={chartForm.modality}
                  onChange={(event) =>
                    onChartFormChange("modality", event.target.value)
                  }
                />
                <input
                  className="swift-field"
                  placeholder="Treatment Area"
                  value={chartForm.treatmentArea}
                  onChange={(event) =>
                    onChartFormChange("treatmentArea", event.target.value)
                  }
                />
              </div>
              <textarea
                className="swift-field swift-field-textarea"
                placeholder="Treatment Summary"
                value={chartForm.treatmentSummary}
                onChange={(event) =>
                  onChartFormChange("treatmentSummary", event.target.value)
                }
              />
              <textarea
                className="swift-field swift-field-textarea"
                placeholder="Clinical Notes"
                value={chartForm.notes}
                onChange={(event) => onChartFormChange("notes", event.target.value)}
              />
              <input
                className="swift-field"
                placeholder="Tags (comma separated)"
                value={chartForm.tags}
                onChange={(event) => onChartFormChange("tags", event.target.value)}
              />
              <div className="client-form-actions">
                <button
                  className="swift-button swift-button-primary"
                  type="button"
                  disabled={isSavingChart}
                  onClick={onSubmitChart}
                >
                  {isSavingChart ? "Saving..." : "Save Chart"}
                </button>
                <button
                  className="swift-button swift-button-secondary"
                  type="button"
                  disabled={isSavingChart}
                  onClick={onCancelChart}
                >
                  Cancel
                </button>
              </div>
            </div>
          </PaperPanel>
        ) : null}

        <PaperPanel>
          {isLoading ? (
            <p className="empty-state">Loading journal...</p>
          ) : charts.length === 0 ? (
            <p className="empty-state">
              No chart entries yet. Create the first one to start this client&apos;s history.
            </p>
          ) : (
            <div className="workspace-list">
              {charts.map((chart) => (
                <article key={chart.id} className="workspace-list-card journal-entry-card">
                  <div className="workspace-list-header">
                    <strong>{chart.treatment_area || chart.modality || "Chart Entry"}</strong>
                    <span className="tag-chip muted-chip">
                      {chart.modality || "General"}
                    </span>
                  </div>
                  <p className="workspace-list-copy">
                    {chart.treatment_summary || chart.notes || "No summary added yet."}
                  </p>
                  <span className="workspace-list-meta">
                    {formatDateTime(chart.created_at)}
                  </span>
                  <div className="journal-entry-footer">
                    <div className="journal-tag-row">
                      {chart.tags.length > 0 ? (
                        chart.tags.map((tag) => (
                          <span key={tag} className="tag-chip muted-chip">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="journal-meta-copy">No tags yet</span>
                      )}
                    </div>
                    <div className="journal-entry-actions">
                      <button
                        className="swift-link-button"
                        type="button"
                        onClick={() => onEditChart(chart)}
                      >
                        Edit
                      </button>
                      <button
                        className="swift-link-button danger-link"
                        type="button"
                        onClick={() => onDeleteChart(chart)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </PaperPanel>
      </div>
    </main>
  );
}
