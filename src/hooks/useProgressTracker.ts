/*
 * useProgressTracker.ts :
 * Custom React hook for tracking progress of values and questions locally.
 * Tracks answer progress from local browser storage.
 */

import { STORAGE_KEYS } from "@/constants/storage";
import type { ValueMetadata, ValueProgress } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useFramework } from "../contexts/FrameworkContext";
import { useRepositories } from "../contexts/RepositoryContext";
import { getQuestionId } from "../utils/ethicsUtils";

// Custom hook
export function useProgressTracker() {
  const {
    selectedFrameworkId,
    values,
    isFrameworkLoaded: isManifestLoaded,
  } = useFramework();
  const { answer: answerRepository } = useRepositories();
  const [valueProgress, setValueProgress] = useState<
    Record<string, ValueProgress>
  >({});
  // Track which framework scope the current progress represents.
  const [loadedScopeKey, setLoadedScopeKey] = useState<string | null>(null);

  const currentScopeKey = `local_${selectedFrameworkId ?? "default"}`;

  // Helper to compute progress stats for a single value from an answers record
  const computeValueProgress = useCallback(
    (
      targetValue: ValueMetadata,
      parsedAnswers: Record<string, string>,
    ): ValueProgress => {
      let completed = 0;
      let calculatedTotal = 0;

      (targetValue.criteria || []).forEach((c: any, cIdx: number) => {
        const indicators = c.indicators || [];
        indicators.forEach((ind: any, iIdx: number) => {
          const questionId = getQuestionId(ind, cIdx, iIdx);
          const hasAnswer =
            parsedAnswers[questionId] !== undefined &&
            parsedAnswers[questionId] !== null &&
            parsedAnswers[questionId] !== "";

          calculatedTotal++;
          if (hasAnswer) completed++;
        });
      });

      if (calculatedTotal === 0) {
        calculatedTotal = targetValue.total_questions || 0;
      }

      return { completed, total: calculatedTotal };
    },
    [],
  );

  useEffect(() => {
    if (!isManifestLoaded || values.length === 0) return;

    let active = true;
    Promise.all(
      values.map(async (targetValue) => {
        const savedAnswers = await answerRepository.getAnswers(
          targetValue.name,
          selectedFrameworkId,
        );
        return [
          targetValue.name,
          computeValueProgress(targetValue, savedAnswers),
        ] as const;
      }),
    )
      .then((progressEntries) => {
        if (!active) return;
        setValueProgress(Object.fromEntries(progressEntries));
        setLoadedScopeKey(currentScopeKey);
      })
      .catch((error: unknown) => {
        console.error("Failed to load assessment progress:", error);
      });

    return () => {
      active = false;
    };
  }, [
    answerRepository,
    selectedFrameworkId,
    isManifestLoaded,
    values,
    currentScopeKey,
    computeValueProgress,
  ]);

  useEffect(() => {
    if (isManifestLoaded && loadedScopeKey === currentScopeKey) {
      const progressStorageKey = STORAGE_KEYS.valueProgress(selectedFrameworkId);
      localStorage.setItem(progressStorageKey, JSON.stringify(valueProgress));
    }
  }, [
    valueProgress,
    isManifestLoaded,
    selectedFrameworkId,
    loadedScopeKey,
    currentScopeKey,
  ]);

  // Update progress for a specific value (with dynamic total)
  const updateProgress = useCallback(
    (valueName: string, completed: number, total: number) => {
      setValueProgress((prev) => ({
        ...prev,
        [valueName]: { completed, total },
      }));
    },
    [],
  );

  // Reset progress for a specific value
  const resetProgress = useCallback((valueName: string) => {
    setValueProgress((prev) => {
      const { [valueName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Reset all progress
  const resetAll = () => {
    setValueProgress({});
    if (isManifestLoaded) {
      const progressStorageKey = STORAGE_KEYS.valueProgress(selectedFrameworkId);
      localStorage.removeItem(progressStorageKey);
    }
  };

  // Helper to calculate overall progress percentage
  const getOverallProgress = useCallback(() => {
    let totalCompleted = 0;
    let totalQuestions = 0;

    Object.values(valueProgress).forEach((progress) => {
      totalCompleted += progress.completed;
      totalQuestions += progress.total;
    });

    return {
      completed: totalCompleted,
      total: totalQuestions,
      percentage:
        totalQuestions > 0
          ? Math.round((totalCompleted / totalQuestions) * 100)
          : 0,
    };
  }, [valueProgress]);

  return {
    valueProgress,
    values,
    updateProgress,
    resetProgress,
    resetAll,
    getOverallProgress,
    isManifestLoaded,
  };
}
