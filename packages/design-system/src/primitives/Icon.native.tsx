import React from "react";
import type { LucideProps } from "lucide-react-native";
import {
  Archive,
  BarChart3,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleEllipsis,
  FilePlus2,
  FileText,
  Home,
  LogOut,
  Mail,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  Zap
} from "lucide-react-native";

export type PluckrIconName =
  | "settings"
  | "logout"
  | "folio"
  | "open"
  | "remove"
  | "archive"
  | "document"
  | "back"
  | "more"
  | "phone"
  | "mail"
  | "clock"
  | "camera"
  | "add"
  | "upload"
  | "details"
  | "consent"
  | "start"
  | "home"
  | "clients"
  | "reports";

type PluckrIconProps = {
  name: PluckrIconName;
  size?: number;
  color: string;
  strokeWidth?: number;
};

const iconMap: Record<PluckrIconName, React.ComponentType<LucideProps>> = {
  settings: SlidersHorizontal,
  logout: LogOut,
  folio: BookOpen,
  open: ChevronRight,
  remove: Minus,
  archive: Archive,
  document: FileText,
  back: ChevronLeft,
  more: CircleEllipsis,
  phone: Phone,
  mail: Mail,
  clock: Clock3,
  camera: Camera,
  add: Plus,
  upload: FilePlus2,
  details: UserRound,
  consent: ShieldCheck,
  start: Zap,
  home: Home,
  clients: Users,
  reports: BarChart3
};

export function PluckrIcon({
  name,
  size = 18,
  color,
  strokeWidth = 2
}: PluckrIconProps) {
  const IconComponent = iconMap[name];

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}
