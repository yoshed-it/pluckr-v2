"use client";

/**
 * Swift-parity client list screen for the web app.
 *
 * This ports the searchable client list and add-client entry point into a
 * dedicated screen instead of leaving clients trapped inside a dashboard card.
 */
import type { ClientRecord } from "@pluckr/supabase";

import { PaperPanel } from "./PaperPanel";

type ClientListStageProps = {
  clients: ClientRecord[];
  searchText: string;
  isLoading: boolean;
  error: string | null;
  notice: string | null;
  isCreatingClient: boolean;
  isSavingClient: boolean;
  clientForm: {
    firstName: string;
    lastName: string;
    pronouns: string;
    phone: string;
    email: string;
    notes: string;
  };
  onBack: () => void;
  onLogout: () => void;
  onSelectClient: (client: ClientRecord) => void;
  onSearchChange: (value: string) => void;
  onStartCreate: () => void;
  onCancelCreate: () => void;
  onFormChange: (
    key: "firstName" | "lastName" | "pronouns" | "phone" | "email" | "notes",
    value: string
  ) => void;
  onSubmitClient: () => void;
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

export function ClientListStage({
  clients,
  searchText,
  isLoading,
  error,
  notice,
  isCreatingClient,
  isSavingClient,
  clientForm,
  onBack,
  onLogout,
  onSelectClient,
  onSearchChange,
  onStartCreate,
  onCancelCreate,
  onFormChange,
  onSubmitClient
}: ClientListStageProps) {
  return (
    <main className="swift-shell">
      <div className="stage-column stage-column-wide">
        <div className="stage-toolbar">
          <button className="swift-link-button" type="button" onClick={onBack}>
            ← Workspace
          </button>
          <button className="swift-link-button danger-link" onClick={onLogout}>
            Log Out
          </button>
        </div>

        <PaperPanel>
          <div className="client-stage-header">
            <div>
              <span className="section-eyebrow">All Clients</span>
              <h1 className="panel-title">Client List</h1>
              <p className="panel-copy">
                Search clients or create a new record the same way the Swift app
                does.
              </p>
            </div>
            <button
              className="swift-button swift-button-primary client-stage-button"
              type="button"
              onClick={onStartCreate}
            >
              Add Client
            </button>
          </div>

          <div className="client-toolbar">
            <input
              className="swift-field"
              type="text"
              placeholder="Search clients..."
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <span className="count-chip">{clients.length}</span>
          </div>
        </PaperPanel>

        {error ? <p className="message-banner message-error">{error}</p> : null}
        {notice ? <p className="message-banner message-success">{notice}</p> : null}

        {isCreatingClient ? (
          <PaperPanel className="client-form-panel">
            <h2 className="panel-title panel-title-small">Add New Client</h2>
            <div className="form-stack">
              <div className="client-form-grid">
                <input
                  className="swift-field"
                  placeholder="First Name"
                  value={clientForm.firstName}
                  onChange={(event) =>
                    onFormChange("firstName", event.target.value)
                  }
                />
                <input
                  className="swift-field"
                  placeholder="Last Name"
                  value={clientForm.lastName}
                  onChange={(event) =>
                    onFormChange("lastName", event.target.value)
                  }
                />
                <input
                  className="swift-field"
                  placeholder="Pronouns"
                  value={clientForm.pronouns}
                  onChange={(event) =>
                    onFormChange("pronouns", event.target.value)
                  }
                />
                <input
                  className="swift-field"
                  placeholder="Phone Number"
                  value={clientForm.phone}
                  onChange={(event) => onFormChange("phone", event.target.value)}
                />
                <input
                  className="swift-field"
                  placeholder="Email Address"
                  value={clientForm.email}
                  onChange={(event) => onFormChange("email", event.target.value)}
                />
              </div>
              <textarea
                className="swift-field swift-field-textarea"
                placeholder="Notes (optional)"
                value={clientForm.notes}
                onChange={(event) => onFormChange("notes", event.target.value)}
              />
              <div className="client-form-actions">
                <button
                  className="swift-button swift-button-primary"
                  type="button"
                  disabled={isSavingClient}
                  onClick={onSubmitClient}
                >
                  {isSavingClient ? "Saving..." : "Save Client"}
                </button>
                <button
                  className="swift-button swift-button-secondary"
                  type="button"
                  disabled={isSavingClient}
                  onClick={onCancelCreate}
                >
                  Cancel
                </button>
              </div>
            </div>
          </PaperPanel>
        ) : null}

        <PaperPanel>
          {isLoading ? (
            <p className="empty-state">Loading clients...</p>
          ) : clients.length === 0 ? (
            <div className="client-empty-state">
              <p className="empty-state">No clients yet. Add your first client to get started.</p>
            </div>
          ) : (
            <div className="workspace-list">
              {clients.map((client) => (
                <button
                  key={client.id}
                  className="workspace-list-card workspace-list-button"
                  type="button"
                  onClick={() => onSelectClient(client)}
                >
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
                </button>
              ))}
            </div>
          )}
        </PaperPanel>
      </div>
    </main>
  );
}
