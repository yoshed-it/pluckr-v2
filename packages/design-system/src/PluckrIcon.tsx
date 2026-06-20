import React from "react";
import {
  Archive,
  ChevronRight,
  LogOut,
  Minus,
  NotebookTabs,
  Settings2,
  type LucideIcon
} from "lucide-react-native";

type PluckrIconName =
  | "settings"
  | "logout"
  | "folio"
  | "open"
  | "remove"
  | "archive";

type PluckrIconProps = {
  name: PluckrIconName;
  size?: number;
  color: string;
};

const iconMap: Record<PluckrIconName, LucideIcon> = {
  settings: Settings2,
  logout: LogOut,
  folio: NotebookTabs,
  open: ChevronRight,
  remove: Minus,
  archive: Archive
};

export function PluckrIcon({
  name,
  size = 18,
  color
}: PluckrIconProps) {
  const Icon = iconMap[name];

  return <Icon size={size} color={color} strokeWidth={2} />;
}

export type { PluckrIconName };
