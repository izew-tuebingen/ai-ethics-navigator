import type { Question } from "@/types";
import type { AssistantAction } from "@/domain/services/IAssistantService";

export type { AssistantAction } from "@/domain/services/IAssistantService";

export const ASSISTANT_DEMO_ACTIONS: Array<{
  id: AssistantAction;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: "explain",
    label: "Explain Background",
    icon: "💡",
    description: "Explain the question and what each answer means",
  },
  {
    id: "examples",
    label: "Show Examples",
    icon: "📋",
    description: "See practical good and bad examples",
  },
  {
    id: "guidelines",
    label: "Relevant Guidelines",
    icon: "✓",
    description: "View best practices and guidelines",
  },
];

export function getAssistantDemoResponse(
  action: AssistantAction,
  question: Question,
): string {
  switch (action) {
    case "explain":
      return `This question asks: “${question.question_text}” Consider what evidence your team can provide and choose the answer that best reflects your current documented practice.`;
    case "examples":
      return "Example evidence could include a written policy, an assigned owner, dated review records, and links to the documents or tests that support your answer. These examples are illustrative only.";
    case "guidelines":
      return question.guidance?.trim()
        ? `Guidance for this indicator: ${question.guidance}`
        : "Discuss the intended outcome with relevant stakeholders, record the evidence used to make your assessment, and review the decision as the system changes.";
  }
}
