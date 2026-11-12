/**
 * useQuestionNavigation Hook
 * Manages navigation between questions in a questionnaire
 */

import type { Question } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useQuestionNavigation(
  questions: Question[],
  getAnswer: (questionId: string) => string | null,
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex] ?? null;

  // Update selected answer when question changes
  useEffect(() => {
    if (currentQuestion) {
      const answer = getAnswer(currentQuestion.question_id);
      setSelectedAnswer(answer);
    }
  }, [currentIndex, currentQuestion, getAnswer]);

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentIndex(index);
      }
    },
    [questions.length],
  );

  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const canGoNext = currentIndex < questions.length - 1;
  const canGoPrevious = currentIndex > 0;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  return {
    currentIndex,
    currentQuestion,
    selectedAnswer,
    setSelectedAnswer,
    goToQuestion,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    isFirstQuestion,
    isLastQuestion,
  };
}
