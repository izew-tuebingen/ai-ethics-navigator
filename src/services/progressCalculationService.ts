/**
 *@file ProgressCalculationService.ts
 *@description: This service calculates progress percentages for individual values, 
 *overall assessment completion, chart segments, and summary statistics used by the values overview page.
 *@category Services
 *@module ProgressCalculationService
 */

import type { ProgressSegment, ValueProgress } from "@/types";

/**
 * calculateOverallProgress:  Calculate overall progress percentage from value progress data
 * @param valueProgress - Progress data grouped by value name.
 * @returns {number} Overall progress percentage rounded to the nearest integer
 *
 */
export function calculateOverallProgress(
  valueProgress: Record<string, ValueProgress>,
): number {
  const values = Object.values(valueProgress);

  if (values.length === 0) return 0;

  const totalCompleted = values.reduce((sum, v) => sum + v.completed, 0);
  const totalQuestions = values.reduce((sum, v) => sum + v.total, 0);

  if (totalQuestions === 0) return 0;

  return Math.round((totalCompleted / totalQuestions) * 100);
}

/**
 * calculateValueProgress: Calculate progress percentage for a single value
 * @param completed - number of the completed questions for the value.
 * @param total - Total number of questions for the value.
 * @retruns {number} Value progress percentagerounded to the nearest integer.
 */
export function calculateValueProgress(
  completed: number,
  total: number,
): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * transformToChartSegments: Transform value progress data into chart segments.
 * @description Each value is mapped to a chart segment using its display name and background color.
 * @param values - Value metadata used to create chart segments.
 * @param valueProgress - Progress data grouped by value name.
 * @returns {ProgressSegment[]} Chart segments for progress visualization.
 */
export function transformToChartSegments(
  values: Array<{
    name: string;
    color: string;
    bgColor: string;
  }>,
  valueProgress: Record<string, ValueProgress>,
): ProgressSegment[] {
  return values.map((value) => {
    const progress = valueProgress[value.name];
    return {
      color: value.bgColor,
      label: value.name,
      progress:
        progress && progress.total > 0
          ? (progress.completed / progress.total) * 100
          : 0,
      total: progress?.total ?? 0,
      completed: progress?.completed ?? 0,
    };
  });
}

/**
 * getProgressSummary:
 * @description  Calculates summary statistics for all value progress entries.
 * @param valueProgress - Progress data grouped by value name.
 * @retruns totalCompleted: number; totalQuestions: number; completedValues: number; totalValues: number; overallPercentage: number;}} Summary statistics for the questionnaire progress.
 */
export function getProgressSummary(
  valueProgress: Record<string, ValueProgress>,
): {
  totalCompleted: number;
  totalQuestions: number;
  completedValues: number;
  totalValues: number;
  overallPercentage: number;
} {
  const values = Object.values(valueProgress);
  const totalCompleted = values.reduce((sum, v) => sum + v.completed, 0);
  const totalQuestions = values.reduce((sum, v) => sum + v.total, 0);
  const completedValues = values.filter(
    (v) => v.total > 0 && v.completed === v.total,
  ).length;

  return {
    totalCompleted,
    totalQuestions,
    completedValues,
    totalValues: values.length,
    overallPercentage: calculateOverallProgress(valueProgress),
  };
}
