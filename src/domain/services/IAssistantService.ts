import type { Question } from "@/types";

export type AssistantAction = "explain" | "examples" | "guidelines";

export interface IAssistantService {
  getResponse(action: AssistantAction, question: Question): Promise<string>;
}
