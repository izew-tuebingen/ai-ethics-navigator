/**
 * Scoring and Aggregation Utility
 *
 * Implements the VCIO aggregation logic as specified in section 5.3:
 * - Criteria level aggregation
 * - Value level aggregation
 * - Score to letter grade conversion
 */

import { STORAGE_KEYS } from "@/constants/storage";
import type { LetterGrade } from "@/types";
import { logger } from "./logger";
import { getQuestionId } from "./ethicsUtils";

// Score mapping: Letter grade to numeric score
const LETTER_TO_SCORE: Record<LetterGrade, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
};

const SCORE_TO_LETTER: Record<number, LetterGrade> = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
};

/**
 * Convert a letter grade to its numeric score
 */
export function letterToScore(letter: LetterGrade): number {
  return LETTER_TO_SCORE[letter];
}

/**
 * Convert a numeric score to its letter grade
 * Rounds to nearest integer and clips to valid range
 */
export function scoreToLetter(score: number): LetterGrade {
  const rounded = Math.round(score);
  const clamped = Math.max(0, Math.min(6, rounded));
  return SCORE_TO_LETTER[clamped] ?? "G";
}

/**
 * Aggregate indicator scores to a criteria score
 *
 * Implements Step 3 from section 5.3:
 * - Takes average of indicator scores
 * - Rounds to next integer
 * - Applies special logic for negative/positive anchors
 */
export function aggregateIndicators(indicatorScores: number[]): number {
  if (indicatorScores.length === 0) {
    return 6; // Default to G if no indicators
  }

  // Calculate the average
  const sum = indicatorScores.reduce((a, b) => a + b, 0);
  const average = sum / indicatorScores.length;

  // Round to next integer (ceiling)
  return Math.ceil(average);
}

/**
 * Aggregate criteria scores to a value score
 *
 * Implements section 5.3.2:
 * - Since all criteria have same significance, use rounded average
 * - All scores get same weight
 */
export function aggregateCriteria(criteriaScores: number[]): number {
  if (criteriaScores.length === 0) {
    return 6; // Default to G if no criteria
  }

  // Calculate the average
  const sum = criteriaScores.reduce((a, b) => a + b, 0);
  const average = sum / criteriaScores.length;

  // Round to next integer
  return Math.ceil(average);
}

/**
 * Calculate the overall score for a single value based on its criteria scores
 *
 * @param criteriaScores - Array of numeric scores (0-6) for each criterion
 * @returns Letter grade (A-G)
 */
export function calculateValueScore(criteriaScores: number[]): string {
  if (criteriaScores.length === 0) {
    return "G";
  }

  const valueScore = aggregateCriteria(criteriaScores);
  return scoreToLetter(valueScore);
}

/**
 * Calculate numeric score for a value based on criteria scores
 */
export function calculateValueScoreNumeric(criteriaScores: number[]): number {
  if (criteriaScores.length === 0) {
    return 6;
  }

  return aggregateCriteria(criteriaScores);
}

export interface CriteriaDataForScoring {
  id?: string;
  code?: string;
  name?: string;
  indicators?: Array<{ id?: string; code?: string }>;
}

/**
 * Calculate a value's score from its criteria and stored answers
 * using 2-tier VCIO aggregation (Indicator -> Criteria -> Value).
 *
 * Returns null if not all questions for this value are answered.
 */
export function calculateHierarchicalValueScore(
  criteria: CriteriaDataForScoring[] | undefined,
  answers: Record<string, string>,
  totalQuestions: number,
): LetterGrade | null {
  const answeredCount = Object.keys(answers).length;

  if (!criteria || criteria.length === 0) {
    if (
      answeredCount > 0 &&
      (totalQuestions === 0 || answeredCount >= totalQuestions)
    ) {
      const scores = convertAnswersToScores(answers);
      if (scores.length === 0) return null;
      const valScore = aggregateCriteria(scores);
      return scoreToLetter(valScore);
    }
    return null;
  }

  const criteriaScores: number[] = [];

  let cIdx = 0;
  for (const criterion of criteria) {
    const indicators = criterion.indicators || [];
    if (indicators.length === 0) {
      cIdx++;
      continue;
    }

    const indicatorScores: number[] = [];
    let iIdx = 0;
    for (const ind of indicators) {
      const questionId = getQuestionId(ind as any, cIdx, iIdx);
      const answerLetter = questionId ? answers[questionId] : undefined;
      if (!answerLetter) {
        return null; // Unanswered question
      }
      indicatorScores.push(getAnswerScore(answerLetter as LetterGrade));
      iIdx++;
    }

    // Step 1: Ceiling average on indicator level
    const criterionScore = aggregateIndicators(indicatorScores);
    criteriaScores.push(criterionScore);
    cIdx++;
  }

  if (criteriaScores.length === 0) {
    return null;
  }

  // Step 2: Ceiling average on criteria level
  const valueNumericScore = aggregateCriteria(criteriaScores);
  return scoreToLetter(valueNumericScore);
}

/**
 * Calculate overall assessment score across all values
 *
 * @param valueScores - Array of letter grades (A-G or null for incomplete)
 * @returns Letter grade (A-G) or null if any value is incomplete
 */
export function calculateOverallScore(
  valueScores: (LetterGrade | null)[],
): LetterGrade | null {
  if (valueScores.length === 0 || valueScores.some((score) => score === null)) {
    return null;
  }

  const numericScores = (valueScores as LetterGrade[]).map(letterToScore);
  const average =
    numericScores.reduce((a, b) => a + b, 0) / numericScores.length;
  const rounded = Math.round(average);

  return scoreToLetter(rounded);
}

/**
 * Calculate overall numeric score across all values
 *
 * @param valueScores - Array of numeric scores (0-6) for each value
 * @returns Numeric score (0-6)
 */
export function calculateOverallScoreNumeric(valueScores: number[]): number {
  if (valueScores.length === 0) {
    return 6;
  }

  const average = valueScores.reduce((a, b) => a + b, 0) / valueScores.length;
  return Math.round(average);
}

/**
 * Process answered question and convert to score
 *
 * Question answers are stored as letter grades (A, B, C, D, E, F, G)
 * in the answers object. This converts them to numeric scores.
 */
export function getAnswerScore(answerLetter: LetterGrade | undefined): number {
  if (!answerLetter) {
    return 6; // Unanswered defaults to G
  }

  return letterToScore(answerLetter);
}

/**
 * Convert answer letters to numeric scores
 */
export function convertAnswersToScores(
  answers: Record<string, string>,
): number[] {
  return Object.values(answers)
    .filter((answer) => typeof answer === "string")
    .map((answer) => letterToScore(answer as LetterGrade));
}

/**
 * Validate and normalize a score to ensure it's within valid range
 */
export function normalizeScore(score: number): number {
  return Math.max(0, Math.min(6, Math.round(score)));
}

/**
 * Helper to check if a score indicates full fulfillment (A)
 */
export function isFullyFulfilled(score: number): boolean {
  return score === 0; // A = 0
}

/**
 * Helper to check if a score indicates no fulfillment (G)
 */
export function isNotFulfilled(score: number): boolean {
  return score === 6; // G = 6
}

/**
 * Helper to check if a score is at least partially fulfilled (F or higher)
 */
export function isPartiallyFulfilled(score: number): boolean {
  return score <= 5; // F or higher (score 0-5)
}

/**
 * Load answers for a value from sessionStorage
 *
 * @param valueName - The data file path or name for the value
 * @param frameworkId - The selected framework ID for scoped answers
 * @returns Object with question IDs as keys and letter answers as values
 */
export function loadValueAnswers(
  valueName: string,
  frameworkId?: string | null,
): Record<string, string> {
  try {
    const storeKey = STORAGE_KEYS.valueAnswers(valueName, frameworkId);
    const stored = localStorage.getItem(storeKey);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    logger.warn(`Failed to load answers for ${valueName}:`, error);
    return {};
  }
}

/**
 * Calculate a value's score from its stored answers
 *
 * Returns null if not all questions have been answered.
 *
 * @param valueName - The data file path or name for the value
 * @param totalQuestions - The total number of questions for this value
 * @param frameworkId - The selected framework ID
 * @param criteria - Optional criteria array for 2-tier VCIO calculation
 * @returns Letter grade (A-G) or null
 */
export function calculateValueScoreFromAnswers(
  valueName: string,
  totalQuestions: number,
  frameworkId?: string | null,
  criteria?: CriteriaDataForScoring[],
): LetterGrade | null {
  const answers = loadValueAnswers(valueName, frameworkId);
  return calculateHierarchicalValueScore(criteria, answers, totalQuestions);
}
