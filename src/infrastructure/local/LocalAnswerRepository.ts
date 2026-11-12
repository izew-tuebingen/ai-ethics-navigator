import { loadValueAnswers } from "@/utils/scoring";
import { saveAnswer as saveAnswerToStorage } from "@/services/answerStorageService";
import type { IAnswerRepository } from "@/domain/repositories/IRepositories";

export class LocalAnswerRepository implements IAnswerRepository {
  async getAnswers(
    valueName: string,
    frameworkId?: string | null,
  ): Promise<Record<string, string>> {
    return loadValueAnswers(valueName, frameworkId);
  }

  async saveAnswer(
    valueName: string,
    frameworkId: string | null | undefined,
    questionId: string,
    answerId: string | null,
  ): Promise<Record<string, string>> {
    const storagePath = `local_${frameworkId ? `${frameworkId}_` : ""}${valueName}`;
    return saveAnswerToStorage(storagePath, questionId, answerId);
  }
}
