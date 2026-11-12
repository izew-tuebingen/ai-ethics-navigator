/**
 * useAnswerManagement Hook
 * Manages answer state and persistence for a questionnaire
 */

import type { AnswerRecord, Question } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useRepositories } from "@/contexts/RepositoryContext";

export function useAnswerManagement(
  valueName: string,
  questions: Question[],
  frameworkId?: string | null,
) {
  const { answer: answerRepository } = useRepositories();

  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [completedCount, setCompletedCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(questions.length);

  const getValidAnswers = useCallback(
    (rawAnswers: AnswerRecord) => {
      const validAnswers: AnswerRecord = {};
      const validIds = new Set(questions.map((q) => q.question_id));
      for (const [key, val] of Object.entries(rawAnswers)) {
        if (validIds.has(key)) {
          validAnswers[key] = val;
        }
      }
      return validAnswers;
    },
    [questions],
  );

  useEffect(() => {
    let active = true;
    setAnswers({});
    setCompletedCount(0);
    setTotalQuestions(questions.length);

    answerRepository
      .getAnswers(valueName, frameworkId)
      .then((loaded) => {
        if (!active) return;
        const valid = getValidAnswers(loaded);
        setAnswers(valid);
        setCompletedCount(Object.keys(valid).length);
      })
      .catch((error: unknown) => {
        console.error("Failed to load questionnaire answers:", error);
      });

    return () => {
      active = false;
    };
  }, [
    answerRepository,
    valueName,
    frameworkId,
    getValidAnswers,
    questions.length,
  ]);

  const handleSaveAnswer = useCallback(
    async (questionId: string, answerId: string | null) => {
      const updatedAnswers = await answerRepository.saveAnswer(
        valueName,
        frameworkId,
        questionId,
        answerId,
      );
      setAnswers(updatedAnswers);
      setCompletedCount(Object.keys(updatedAnswers).length);
      setTotalQuestions(questions.length);
    },
    [answerRepository, valueName, frameworkId, questions.length],
  );

  //helpfunction: get answer for a specific question
  const getAnswerForQuestion = useCallback(
    (questionId: string): string | null => {
      return answers[questionId] ?? null;
    },
    [answers],
  );

  const isQuestionAnswered = useCallback(
    (questionId: string): boolean => {
      return !!answers[questionId];
    },
    [answers],
  );

  return {
    answers,
    completedCount,
    totalQuestions,
    percentage:
      totalQuestions > 0
        ? Math.round((completedCount / totalQuestions) * 100)
        : 0,
    saveAnswer: handleSaveAnswer,
    getAnswer: getAnswerForQuestion,
    isAnswered: isQuestionAnswered,
  };
}
