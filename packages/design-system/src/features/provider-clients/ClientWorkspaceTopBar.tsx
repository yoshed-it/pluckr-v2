import React from "react";

import { TopBar } from "../../composite/TopBar";

type Props = {
  onBack: () => void;
  onMore: () => void;
  backLabel?: string;
};

export function ClientWorkspaceTopBar({
  onBack,
  onMore,
  backLabel = "Clients"
}: Props) {
  return (
    <TopBar
      title="Client"
      backLabel={backLabel}
      onBack={onBack}
      actions={[{ icon: "more", label: "Open more actions", onPress: onMore }]}
    />
  );
}
