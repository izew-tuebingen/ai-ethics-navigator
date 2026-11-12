/**
 * useQuestionnaire Hook
 * Loads questionnaire data from the bundled ethics framework.
 * It extracts the requested value and maps it to the expected questionnaire structure.
 * The hook returns the structured questionnaire data, a flat list of questions for easy access, and loading/error states for UI feedback.
 */

import { useFramework } from "@/contexts/FrameworkContext";
import { logger } from "@/utils/logger";
import { useEffect, useMemo, useState } from "react";
import { mapFrameworkToQuestionnaire } from "@/utils/frameworkMapper";

import type {
  Question,
  QuestionnaireData,
} from "@/types/questionnaire.types";

export function useQuestionnaire(valueName?: string) {
  const { framework, isFrameworkLoaded } = useFramework();
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive flat list of questions cleanly from questionnaire data
  const questions = useMemo<Question[]>(
    () => questionnaire?.question_collections.flatMap((c) => c.questions) ?? [],
    [questionnaire],
  );

  useEffect(() => {
    let isMounted = true;

    const loadQuestionnaire = () => {
      try {
        if (!isFrameworkLoaded) {
          setLoading(true);
          return;
        }
        setError(null);

        if (!valueName) {
          throw new Error(
            "No valueName provided. A value name is required to load its questionnaire.",
          );
        }

        if (!framework) {
          throw new Error("Ethics framework is empty or not available.");
        }

        const questionnaireData = mapFrameworkToQuestionnaire(framework, valueName);

        if (!isMounted) return;

        setQuestionnaire(questionnaireData);
        setLoading(false);

        logger.debug(
          "Successfully loaded bundled questionnaire for:",
          valueName,
        );
      } catch (err) {
        if (!isMounted) return;
        const errorMessage =
          err instanceof Error ? err.message : "Questionnaire load failed";
        logger.error("useQuestionnaire error:", errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    loadQuestionnaire();

    return () => {
      isMounted = false;
    };
  }, [valueName, framework, isFrameworkLoaded]);

  return {
    questionnaire,
    questions,
    loading,
    error,
    totalQuestions: questions.length,
  };
}
