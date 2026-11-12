import {
  EthicsCriterion,
  EthicsFramework,
  EthicsIndicator,
  EthicsOption,
  EthicsValue,
} from "@/types/ethics.types";
import {
  Question,
  QuestionCollection,
  QuestionnaireData,
} from "@/types/questionnaire.types";
import { getQuestionId } from "@/utils/ethicsUtils";

const normalize = (s?: string) =>
  (s || "").toString().toLowerCase().trim().replace(/\s+/g, "");

export function mapFrameworkToQuestionnaire(
  framework: EthicsFramework,
  valueName: string,
): QuestionnaireData {
  if (!framework || !Array.isArray(framework.values)) {
    throw new Error("Ethics framework is empty or not available.");
  }

  const remoteValue = framework.values.find(
    (v: EthicsValue) => normalize(v.name) === normalize(valueName),
  );

  if (!remoteValue) {
    throw new Error(
      `The value '${valueName}' was not found in the bundled framework.`,
    );
  }

  const criteria = Array.isArray(remoteValue.criteria)
    ? remoteValue.criteria
    : [];

  const questionCollections: QuestionCollection[] = criteria.map(
    (criterion: EthicsCriterion, cIdx: number) => {
      const indicators = Array.isArray(criterion.indicators)
        ? criterion.indicators
        : [];

      return {
        collection_id: criterion.code || criterion.id || `col-${cIdx}`,
        collection_title: criterion.name || "Unnamed Category",
        collection_description: criterion.description || "",

        questions: indicators.map(
          (ind: EthicsIndicator, iIdx: number): Question => {
            const answer_options = (ind.options || []).map(
              (o: EthicsOption, idx: number) => ({
                option_id: o.label || o.id || `opt-${idx}`,
                option_text: o.text || "",
              }),
            );

            return {
              question_id: getQuestionId(ind, cIdx, iIdx),
              question_text: ind.question || "unnamed question",
              guidance: ind.guidance || "",
              importance_level: Number(ind.importanceLevel) || 3,
              required: typeof ind.required === "boolean" ? ind.required : true,
              answer_options,
              followup_questions: [],
            };
          },
        ),
      };
    },
  );

  return {
    questionnaire_info: {
      title: remoteValue.name || valueName,
      description: remoteValue.description || "",
      version: remoteValue.version || "1.0",
      created_date: remoteValue.createdDate || new Date().toISOString(),
    },
    question_collections: questionCollections,
  };
}
