import type { KeyValueStorage, OrganizationSelectionStorage } from "./types";

const organizationSelectionKey = "pluckr:selected-organization-id";

/**
 * Wraps a generic key-value store with a domain-specific API for
 * organization selection persistence.
 */
export function createOrganizationSelectionStorage(
  storage: KeyValueStorage
): OrganizationSelectionStorage {
  return {
    async getSelectedOrganizationId() {
      return (await storage.getItem(organizationSelectionKey)) ?? null;
    },
    async setSelectedOrganizationId(organizationId: string) {
      await storage.setItem(organizationSelectionKey, organizationId);
    },
    async clearSelectedOrganizationId() {
      await storage.removeItem(organizationSelectionKey);
    }
  };
}
