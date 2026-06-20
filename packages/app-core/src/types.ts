/**
 * Shared app-level types used by the web and mobile controller hooks.
 *
 * These live outside the UI layer so the frontends can share behavior
 * without mixing view code into backend or data-access code.
 */
export type AuthMode = "signin" | "signup" | "forgot";

/**
 * Minimal persistence interface for remembering the selected organization
 * between app launches on web and mobile.
 */
export type OrganizationSelectionStorage = {
  getSelectedOrganizationId: () => Promise<string | null>;
  setSelectedOrganizationId: (organizationId: string) => Promise<void>;
  clearSelectedOrganizationId: () => Promise<void>;
};

/**
 * Generic key-value adapter implemented by both localStorage wrappers and
 * AsyncStorage.
 */
export type KeyValueStorage = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};
