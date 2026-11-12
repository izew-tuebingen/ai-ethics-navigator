import type { TeamMember, TeamMemberRole } from "@/domain/models/team";

export type DemoMemberRole = TeamMemberRole;
export type DemoMember = TeamMember;

export const DEMO_CURRENT_USER_NAME = "Max Mustermann";
export const DEMO_ADMIN_ROLE: DemoMemberRole = "admin";
export const DEMO_DEFAULT_MEMBER_ROLE: DemoMemberRole = "editor";

export const DEMO_TEAM = {
  name: "AI Ethics",
  inviteCode: "AEN901",
} as const;

export const DEMO_TEAM_MEMBERS: DemoMember[] = [
  {
    id: 1,
    name: DEMO_CURRENT_USER_NAME,
    email: "max.mustermann@example.org",
    role: "admin",
  },
  {
    id: 2,
    name: "Erika Musterfrau",
    email: "erika.musterfrau@example.org",
    role: "editor",
  },
  {
    id: 3,
    name: "Lilli Schmidt",
    email: "lilli.schmidt@example.org",
    role: "viewer",
  },
];

export const DEMO_TEAMMATE_NAMES = DEMO_TEAM_MEMBERS.map(
  (member) => member.name,
);

export const DEMO_MEMBER_ROLES: Array<{
  value: DemoMemberRole;
  label: string;
}> = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

export const DEMO_ASSIGNABLE_MEMBER_ROLES = DEMO_MEMBER_ROLES.filter(
  (role) => role.value !== DEMO_ADMIN_ROLE,
);

export function isDemoMemberRole(value: string): value is DemoMemberRole {
  return DEMO_MEMBER_ROLES.some((role) => role.value === value);
}
