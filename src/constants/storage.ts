/**
 * Centralized Storage Keys & System Constants
 */

export const STORAGE_KEYS = {
  // LocalStorage Key Generators
  valueAnswers: (valueName: string, frameworkId?: string | null): string => {
    const scopedValueName = frameworkId
      ? `${frameworkId}_${valueName}`
      : valueName;
    return `answers:local_${scopedValueName}`;
  },

  /**
   * Generates storage key for generic questionnaire file paths
   */
  questionnaireAnswers: (jsonFilePath: string): string => {
    return `answers:${jsonFilePath}`;
  },

  /**
   * Generates storage key for value progress tracking
   */
  valueProgress: (frameworkId?: string | null): string => {
    const baseKey = frameworkId ? frameworkId : "default";
    return `valueProgress_local_${baseKey}`;
  },
} as const;
