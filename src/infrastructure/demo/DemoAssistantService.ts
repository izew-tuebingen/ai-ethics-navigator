import type { IAssistantService } from "@/domain/services/IAssistantService";
import {
  getAssistantDemoResponse,
  type AssistantAction,
} from "@/demo/assistantDemo";
import type { Question } from "@/types";

export class DemoAssistantService implements IAssistantService {
  async getResponse(
    action: AssistantAction,
    question: Question,
  ): Promise<string> {
    return getAssistantDemoResponse(action, question);
  }
}
