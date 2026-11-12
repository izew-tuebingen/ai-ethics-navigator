import {
  DEMO_DEFAULT_MEMBER_ROLE,
  DEMO_TEAM_MEMBERS,
} from "@/demo/teamDemoData";
import type { TeamMember, TeamMemberRole } from "@/domain/models/team";
import type { ITeamRepository } from "@/domain/repositories/IRepositories";

export class LocalTeamRepository implements ITeamRepository {
  private members: TeamMember[] = DEMO_TEAM_MEMBERS.map((member) => ({
    ...member,
  }));
  private nextMemberId =
    Math.max(...this.members.map((member) => member.id)) + 1;

  async getMembers(): Promise<TeamMember[]> {
    return this.members.map((member) => ({ ...member }));
  }

  async addMember(email: string): Promise<TeamMember> {
    const normalizedEmail = email.trim().toLowerCase();
    const emailName = normalizedEmail.split("@", 1)[0] ?? "";
    const displayName = emailName
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    const member: TeamMember = {
      id: this.nextMemberId++,
      name: displayName || "New teammate",
      email: normalizedEmail,
      role: DEMO_DEFAULT_MEMBER_ROLE,
    };
    this.members = [...this.members, member];
    return { ...member };
  }

  async updateMemberRole(
    memberId: number,
    role: TeamMemberRole,
  ): Promise<void> {
    this.members = this.members.map((member) =>
      member.id === memberId ? { ...member, role } : member,
    );
  }

  async removeMember(memberId: number): Promise<void> {
    this.members = this.members.filter((member) => member.id !== memberId);
  }
}
