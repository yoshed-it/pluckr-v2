import type { ClientRecord } from "./types";

type ClientIdentitySource = Pick<
  ClientRecord,
  "preferred_name" | "first_name" | "last_name"
>;

export function getClientDisplayName(client: ClientIdentitySource) {
  const preferredName = client.preferred_name?.trim();

  if (preferredName) {
    return preferredName;
  }

  return getClientLegalName(client);
}

export function getClientLegalName(client: ClientIdentitySource) {
  return `${client.first_name} ${client.last_name}`.trim();
}

export function getClientInitials(client: ClientIdentitySource) {
  const nameParts = getClientDisplayName(client)
    .split(/\s+/)
    .filter(Boolean);

  if (nameParts.length === 0) {
    return "";
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
}
