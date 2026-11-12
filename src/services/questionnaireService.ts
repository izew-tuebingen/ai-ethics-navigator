/**
 * @file progressCalculationService.ts
 * @description Provides helpers for loading and preparing questionnaire data.
 * @module Questionnaire Service
 * @catgory Services
 * 
 */

import type { Question, QuestionnaireData } from "@/types";
import { logger } from "@/utils/logger";

/**
 * @function loadQuestionaire: Load questionnaire data from a JSON file.
 * @description The function fetches the provided file path, parses the response as QuestionnaireData.
 *@param jsonFilePath - Path to the questionnaire JSON file.
 *@returns {Promise<QuestionnaireData>} Parse questionnaire data.
* @throws {E*ror} If the file cannot be loaded  parsed.
 */
export async function loadQuestionnaire(
  jsonFilePath: string,
): Promise<QuestionnaireData> {
  try {
    const response = await fetch(jsonFilePath);
    if (!response.ok) {
      throw new Error(`Failed to load questionnaire: ${response.statusText}`);
    }
    const data: QuestionnaireData = await response.json();
    return data;
  } catch (error) {
    logger.error("Failed to load questionnaire:", error);
    throw error;
  }
}

/**
 * @function flattenQuestions:
 * @description Flatten all questions from question collections
 * @param questionnaire - Questionnaire data containing grouped question collections.
 * @returns {Question[]} Single list containing all questions in collection order
 */
export function flattenQuestions(questionnaire: QuestionnaireData): Question[] {
  const allQuestions: Question[] = [];
  questionnaire.question_collections.forEach((collection) => {
    allQuestions.push(...collection.questions);
  });
  return allQuestions;
}

/**
 * @function getQuestionnaireMetadata:
 * @description Extracts display metadata from questionnaire data.
 * @param questionnaire -Extracts display metadata from questionnaire data.
 * @returns {{ title: strings; totalQuestions: number; collecti*nCount: number }} Questionnaire metadata.
 */
export function getQuestionnaireMetadata(questionnaire: QuestionnaireData) {
  return {
    title: questionnaire.questionnaire_info.title,
    totalQuestions: questionnaire.question_collections.reduce(
      (sum, collection) => sum + collection.questions.length,
      0,
    ),
    collectionCount: questionnaire.question_collections.length,
  };
}
