/**
 * Types for questionnaires, questions, and answers
 */

/** Single answer option for a question */
export interface AnswerOption {
  option_id: string;
  option_text: string;
}

/** A single question in the questionnaire */
export interface Question {
  question_id: string;
  question_text: string;
  guidance?: string;
  subquestion?: string | null;
  importance_level: number;
  required: boolean;
  answer_options: AnswerOption[];
  followup_questions?: Question[];
}

/** Collection of related questions */
export interface QuestionCollection {
  collection_id: string;
  collection_title: string;
  collection_description?: string;
  questions: Question[];
}

/** Complete questionnaire structure */
export interface QuestionnaireData {
  questionnaire_info: {
    title: string;
    description?: string;
    version?: string;
    created_date?: string;
  };
  question_collections: QuestionCollection[];
}

/** User's answers to questions */
export type AnswerRecord = Record<string, string>;

/** Storage key pattern for answers */
export type AnswerStorageKey = `answers:${string}`;
