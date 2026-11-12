export type TeamMemberRole = "admin" | "editor" | "viewer";

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: TeamMemberRole;
}
