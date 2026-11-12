import type { QuestionComment } from "@/domain/models/collaboration";
import type { TeamMember, TeamMemberRole } from "@/domain/models/team";
import type { IAssistantService } from "@/domain/services/IAssistantService";

export interface IAnswerRepository {
  getAnswers(
    valueName: string,
    frameworkId?: string | null,
  ): Promise<Record<string, string>>;
  saveAnswer(
    valueName: string,
    frameworkId: string | null | undefined,
    questionId: string,
    answerId: string | null,
  ): Promise<Record<string, string>>;
}

export interface IQuestionCollaborationRepository {
  getAssignment(questionId: string): Promise<string | null>;
  setAssignment(questionId: string, assignee: string | null): Promise<void>;
  getComments(questionId: string): Promise<QuestionComment[]>;
  addComment(
    questionId: string,
    author: string,
    text: string,
  ): Promise<QuestionComment>;
  deleteComment(questionId: string, commentId: string): Promise<void>;
}

export interface ITeamRepository {
  getMembers(): Promise<TeamMember[]>;
  addMember(email: string): Promise<TeamMember>;
  updateMemberRole(memberId: number, role: TeamMemberRole): Promise<void>;
  removeMember(memberId: number): Promise<void>;
}

export interface IRepositories {
  answer: IAnswerRepository;
  collaboration: IQuestionCollaborationRepository;
  team: ITeamRepository;
  assistant: IAssistantService;
}
