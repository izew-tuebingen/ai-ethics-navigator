import type { QuestionComment } from "@/domain/models/collaboration";
import type { IQuestionCollaborationRepository } from "@/domain/repositories/IRepositories";

export class LocalQuestionCollaborationRepository
  implements IQuestionCollaborationRepository
{
  private assignments = new Map<string, string>();
  private comments = new Map<string, QuestionComment[]>();

  async getAssignment(questionId: string): Promise<string | null> {
    return this.assignments.get(questionId) ?? null;
  }

  async setAssignment(
    questionId: string,
    assignee: string | null,
  ): Promise<void> {
    if (assignee === null) {
      this.assignments.delete(questionId);
      return;
    }
    this.assignments.set(questionId, assignee);
  }

  async getComments(questionId: string): Promise<QuestionComment[]> {
    return [...(this.comments.get(questionId) ?? [])];
  }

  async addComment(
    questionId: string,
    author: string,
    text: string,
  ): Promise<QuestionComment> {
    const comment: QuestionComment = {
      id: `${Date.now()}-${Math.random()}`,
      author,
      text,
      createdAtIso: new Date().toISOString(),
    };
    this.comments.set(questionId, [
      ...(this.comments.get(questionId) ?? []),
      comment,
    ]);
    return comment;
  }

  async deleteComment(questionId: string, commentId: string): Promise<void> {
    this.comments.set(
      questionId,
      (this.comments.get(questionId) ?? []).filter(
        (comment) => comment.id !== commentId,
      ),
    );
  }
}
