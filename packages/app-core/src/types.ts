/**
 * Shared app-level types used by the web and mobile controller hooks.
 *
 * These live outside the UI layer so the frontends can share behavior
 * without mixing view code into backend or data-access code.
 */
export type AuthMode = "signin" | "signup" | "forgot";
