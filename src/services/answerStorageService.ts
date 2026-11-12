/**
 * Answer Storage Service
 * Handles saving and loading answers from localStorage.
 * @file answerStorageService.ts
 * @description Provides localStorage helpers for questionnaire answers.
 * @module Answer Storage Service
 * @category Services
 */

import type { AnswerRecord } from "@/types";
import { logger } from "@/utils/logger";
import { STORAGE_KEYS } from "@/constants/storage";

/**
 * @function getStorageKey
 * @description  Generate storage key for a questionnaire path, 
 * so that answers from different questionnaires are stored seperately.
 * @param jsonFilePath - The path to the questionnaire JSON file
 * @returns {string} - The storage key for the questionnaire
 */
export function getStorageKey(jsonFilePath: string): string {
  return STORAGE_KEYS.questionnaireAnswers(jsonFilePath);
}

/**
 * Save answers to localStorage.
 */
export function saveAnswers(jsonFilePath: string, answers: AnswerRecord): void {
  try {
    const key = getStorageKey(jsonFilePath);
    localStorage.setItem(key, JSON.stringify(answers));
  } catch (error) {
    logger.warn("Failed to save answers:", error);
  }
}

/**
 * Load answers from localStorage.
 */
export function loadAnswers(jsonFilePath: string): AnswerRecord {
  try {
    const key = getStorageKey(jsonFilePath);
    const stored = localStorage.getItem(key);
    if (!stored) return {};
    return JSON.parse(stored) as AnswerRecord;
  } catch (error) {
    logger.warn("Failed to load answers:", error);
    return {};
  }
}

/**
 * @function getAnswer
 * @description  Get answer for a specific question
 * @param jsonFilePath - The path to the questionnaire JSON file
 * @param questionId - The ID of the question to get the answer for
 * @returns {string | null} - The answer ID or null if not found
 * 
 */
export function getAnswer(
  jsonFilePath: string,
  questionId: string,
): string | null {
  const answers = loadAnswers(jsonFilePath);
  return answers[questionId] ?? null;
}

/**
 * @function saveAnswer
 * @description  Save a single answer for a specific question
 * @param jsonFilePath - The path to the questionnaire JSON file
 * @param questionId - The ID of the question to save the answer for
 * @param answerId - The ID of the answer to save
 * @returns {AnswerRecord} - The updated answers
 */
export function saveAnswer(
  jsonFilePath: string,
  questionId: string,
  answerId: string | null,
): AnswerRecord {
  const answers = loadAnswers(jsonFilePath);
  const updatedAnswers = { ...answers };
  if (answerId === null) {
    delete updatedAnswers[questionId];
  } else {
    updatedAnswers[questionId] = answerId;
  }
  saveAnswers(jsonFilePath, updatedAnswers);
  return updatedAnswers;
}

/**
 * @function getCompletionStats
 * @description  Calculate completion statistics for a questionnaire
 * @param jsonFilePath - The path to the questionnaire JSON file
 * @param totalQuestions - The total number of questions in the questionnaire
 * @returns {Object} - The completion statistics
 */
export function getCompletionStats(
  jsonFilePath: string,
  totalQuestions: number,
): { completed: number; total: number; percentage: number } {
  const answers = loadAnswers(jsonFilePath);
  const completed = Object.keys(answers).length;
  return {
    completed,
    total: totalQuestions,
    percentage:
      totalQuestions > 0 ? Math.round((completed / totalQuestions) * 100) : 0,
  };
}
