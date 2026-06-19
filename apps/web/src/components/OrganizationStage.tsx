"use client";

/**
 * Recreates the Swift organization selection screen, including the
 * inline create-organization form for brand new users.
 */
import type { MembershipWithOrganization } from "@pluckr/supabase";

import { BrandHero } from "./BrandHero";
import { PaperPanel } from "./PaperPanel";

type OrganizationStageProps = {
  memberships: MembershipWithOrganization[];
  isCreating: boolean;
  organizationName: string;
  organizationDescription: string;
  isSubmitting: boolean;
  error: string | null;
  notice: string | null;
  onSelectOrganization: (organizationId: string) => void;
  onStartCreate: () => void;
  onCancelCreate: () => void;
  onOrganizationNameChange: (value: string) => void;
  onOrganizationDescriptionChange: (value: string) => void;
  onCreateOrganization: () => void;
  onShowJoinMessage: () => void;
  onLogout: () => void;
};

function formatRole(role: MembershipWithOrganization["membership"]["role"]) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function OrganizationStage({
  memberships,
  isCreating,
  organizationName,
  organizationDescription,
  isSubmitting,
  error,
  notice,
  onSelectOrganization,
  onStartCreate,
  onCancelCreate,
  onOrganizationNameChange,
  onOrganizationDescriptionChange,
  onCreateOrganization,
  onShowJoinMessage,
  onLogout
}: OrganizationStageProps) {
  const isNewUser = memberships.length === 0;

  return (
    <main className="swift-shell">
      <div className="stage-column stage-column-wide">
        <div className="stage-toolbar">
          <span className="stage-kicker">Organizations</span>
          <button className="swift-link-button danger-link" onClick={onLogout}>
            Log Out
          </button>
        </div>

        <BrandHero
          title="Organizations"
          subtitle={
            isNewUser
              ? "Welcome to Pluckr. Create your first organization to get started with clinical charting."
              : "Select an organization or create a new one to keep moving."
          }
          logoSize={isNewUser ? 112 : 88}
          compact={!isNewUser}
        />

        {error ? <p className="message-banner message-error">{error}</p> : null}
        {notice ? <p className="message-banner message-success">{notice}</p> : null}

        {isCreating ? (
          <PaperPanel className="organization-form-panel">
            <h2 className="panel-title panel-title-small">Organization Details</h2>
            <div className="form-stack">
              <label className="field-stack">
                <span className="field-label">Organization Name</span>
                <input
                  className="swift-field"
                  type="text"
                  placeholder="Organization Name"
                  value={organizationName}
                  onChange={(event) =>
                    onOrganizationNameChange(event.target.value)
                  }
                />
              </label>

              <label className="field-stack">
                <span className="field-label">Description</span>
                <textarea
                  className="swift-field swift-field-textarea"
                  placeholder="Description (optional)"
                  value={organizationDescription}
                  onChange={(event) =>
                    onOrganizationDescriptionChange(event.target.value)
                  }
                  rows={4}
                />
              </label>

              <div className="action-stack">
                <button
                  className="swift-button swift-button-primary"
                  type="button"
                  disabled={!organizationName.trim() || isSubmitting}
                  onClick={onCreateOrganization}
                >
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </button>
                <button
                  className="swift-button swift-button-secondary"
                  type="button"
                  disabled={isSubmitting}
                  onClick={onCancelCreate}
                >
                  Cancel
                </button>
              </div>
            </div>
          </PaperPanel>
        ) : (
          <div className="organization-layout">
            {memberships.length > 0 ? (
              <PaperPanel>
                <div className="panel-header-row">
                  <h2 className="panel-title panel-title-small">
                    Your Organizations
                  </h2>
                  <span className="count-chip">{memberships.length}</span>
                </div>
                <div className="organization-list">
                  {memberships.map((record) => (
                    <button
                      key={record.organization.id}
                      type="button"
                      className="organization-card"
                      onClick={() => onSelectOrganization(record.organization.id)}
                    >
                      <span className="organization-glyph" aria-hidden="true">
                        +
                      </span>
                      <span className="organization-card-copy">
                        <span className="organization-card-header">
                          <strong>{record.organization.name}</strong>
                          <span className="tag-chip">
                            {formatRole(record.membership.role)}
                          </span>
                        </span>
                        <span className="organization-card-body">
                          {record.organization.description ||
                            "Clinical workspace ready for provider notes, client records, and investor demos."}
                        </span>
                      </span>
                      <span className="organization-chevron" aria-hidden="true">
                        ›
                      </span>
                    </button>
                  ))}
                </div>
              </PaperPanel>
            ) : null}

            <PaperPanel className="action-panel">
              <h2 className="panel-title panel-title-small">
                {isNewUser ? "Get Started" : "More Actions"}
              </h2>
              <div className="action-stack">
                <button
                  className="swift-button swift-button-primary"
                  type="button"
                  onClick={onStartCreate}
                >
                  {isNewUser
                    ? "Create Your First Organization"
                    : "Create New Organization"}
                </button>
                <button
                  className="swift-button swift-button-secondary"
                  type="button"
                  onClick={onShowJoinMessage}
                >
                  {isNewUser ? "Join Existing Organization" : "Join Organization"}
                </button>
              </div>
            </PaperPanel>
          </div>
        )}
      </div>
    </main>
  );
}
