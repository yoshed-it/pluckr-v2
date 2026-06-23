import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  getClientDisplayName,
  getClientInitials,
  type ClientRecord
} from "@pluckr/domain";

import { pluckrAppTheme } from "../../tokens/pluckrAppTheme";
import { PluckrCard } from "../../primitives/Card";
import { TagChip } from "../../primitives/TagChip";
import { ClientIdentityBlock } from "./ClientIdentityBlock";
import { ContactInfoRow } from "./ContactInfoRow";
import { StatusChip } from "../../primitives/StatusChip";
import { PluckrIconButton } from "../../primitives/IconButton";

type Props = {
  client: ClientRecord;
  onOpenDetails: () => void;
  onOpenConsent: () => void;
  onOpenTagPicker: () => void;
};

const visibleClientTagLimit = 2;

function formatLastSeen(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function ClientHeaderCard({
  client,
  onOpenDetails,
  onOpenConsent,
  onOpenTagPicker
}: Props) {
  const lastSeen = formatLastSeen(client.last_seen_at || client.created_at);
  const isActive = !client.archived_at;
  const clientTags = client.client_tags ?? [];
  const visibleClientTags = clientTags.slice(0, visibleClientTagLimit);
  const hiddenClientTagCount = Math.max(
    clientTags.length - visibleClientTags.length,
    0
  );

  return (
    <PluckrCard compact>
      <View style={styles.topRow}>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{getClientInitials(client)}</Text>
          </View>
          <ClientIdentityBlock
            preferredName={getClientDisplayName(client)}
            pronouns={client.pronouns}
            isActive={isActive}
          />
        </View>
        <View style={styles.detailButton}>
          <PluckrIconButton
            icon="details"
            accessibilityLabel="Open client details"
            onPress={onOpenDetails}
            size="md"
          />
        </View>
      </View>

      <View style={styles.tagRow}>
        {visibleClientTags.map((tag) => (
          <TagChip key={tag} label={tag} />
        ))}
        {hiddenClientTagCount > 0 ? (
          <TagChip
            label={`+${hiddenClientTagCount} ${hiddenClientTagCount === 1 ? "tag" : "tags"}`}
            variant="outline"
            onPress={onOpenTagPicker}
          />
        ) : null}
        {client.consent_signed_at ? (
          <StatusChip label="Image Consent Signed" icon="consent" tone="accent" />
        ) : (
          <TagChip label="Sign Consent" icon="document" variant="outline" onPress={onOpenConsent} />
        )}
        <TagChip label="Add Tag" icon="add" variant="outline" onPress={onOpenTagPicker} />
      </View>

      <View style={styles.divider} />

      <ContactInfoRow
        phone={client.phone}
        email={client.email}
        lastSeen={lastSeen}
      />
    </PluckrCard>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  identityRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pluckrAppTheme.radii.full,
    backgroundColor: pluckrAppTheme.colors.info
  },
  avatarLabel: {
    color: pluckrAppTheme.colors.surface,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "800"
  },
  detailButton: {
    alignSelf: "flex-start"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12
  },
  divider: {
    height: 1,
    backgroundColor: pluckrAppTheme.colors.divider,
    marginVertical: 12
  }
});
