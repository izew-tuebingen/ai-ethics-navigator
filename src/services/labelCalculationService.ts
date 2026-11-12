/** 
 * @file labelCalculation.ts
 * @description Provides helper functions for calculating AI Trust Label grades.
 * @category Services
 * @modul Label Calculation Service
 * 
 */

import type { LetterGrade, ValueMetadata } from "@/types";
import {
  calculateOverallScoreNumeric,
  calculateValueScoreFromAnswers,
  calculateHierarchicalValueScore,
  letterToScore,
  scoreToLetter,
} from "@/utils/scoring";

/**
* Ordered list of supported letter grades from best (`A`) to weakest (`G`) used by the AI Trust Label.
*/
export const GRADES: LetterGrade[] = ["A", "B", "C", "D", "E", "F", "G"];

/**
 * calculateAllValueScores: Calculates letter and numeric scores for all values.
 * Each value score is derived from the answers stored for the value's
 * @param values - Value metadata entries used to calculate individual scores.
 * @returns {{ letters: LetterGrade[]; numeric: number[] }} Letter and numeric scores for all values.
 * 
 */
export function calculateAllValueScores(
  values: ValueMetadata[],
  frameworkId?: string | null,
  answersMap?: Record<string, Record<string, string>>,
): {
  letters: (LetterGrade | null)[];
  numeric: (number | null)[];
} {
  const letters = values.map((value) => {
    if (answersMap) {
      const valId = value.path || value.name;
      const answers = answersMap[valId] || {};
      return calculateHierarchicalValueScore(
        value.criteria,
        answers,
        value.total_questions || 0,
      );
    } else {
      return calculateValueScoreFromAnswers(
        value.name,
        value.total_questions || 0,
        frameworkId,
        value.criteria,
      );
    }
  });
  const numeric = letters.map((letter) =>
    letter ? letterToScore(letter) : null,
  );

  return { letters, numeric };
}

/**
 * calculateOverallScore: Calculate overall score from value scores
 * @param valueScoresNumeric - Numeric scores for the individual values.
 * @returns {{ numeric: number; letter: LetterGrade }} Overall numeric score and corresponding letter grade.
 */
export function calculateOverallScore(
  valueScoresLetters: (LetterGrade | null)[],
): {
  numeric: number | null;
  letter: LetterGrade | null;
} {
  if (
    valueScoresLetters.length === 0 ||
    valueScoresLetters.some((s) => s === null)
  ) {
    return { numeric: null, letter: null };
  }

  const validScores = valueScoresLetters as LetterGrade[];
  const numericScores = validScores.map(letterToScore);
  const numeric = calculateOverallScoreNumeric(numericScores);
  const letter = scoreToLetter(numeric);

  return { numeric, letter };
}

/**
 * getOverallGrade: Returns the overall grade used by the label visualization.
 * @param overallScore - Overall letter grade.
 * @returns {LetterGrade} Letter grade used for the label display.
 *
 */
export function getOverallGrade(
  overallScore: LetterGrade | null,
): LetterGrade | null {
  return overallScore;
}

/**
 * CreateValueCardData:Creates value card display data by combining value metadata with grades.
 * @param values - Value metadata entries used to build the cards.
 * @param valueScores - Calculated letter grades aligned by value index.
 * @returns {ValueCardData[]} Display data for value cards.
 */
export function createValueCardData(
  values: ValueMetadata[],
  valueScores: (LetterGrade | null)[],
) {
  return values.map((value, index) => {
    const score = valueScores[index] ?? null;

    return {
      title: value.name,
      icon: value.icon,
      iconColor: value.color,
      headerBgColor: value.bgColor,
      titleColor: value.color,
      grade: score,
      description: value.description,
      path: value.path,
    };
  });
}
