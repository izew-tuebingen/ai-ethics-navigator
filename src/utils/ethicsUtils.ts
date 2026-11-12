/**
 * Utility functions for AI Ethics framework items, indicators, and question resolution.
 */

export interface IndicatorLike {
  code?: string;
  id?: string;
  question_id?: string;
}

/**
 * Resolves a unique question/indicator ID using a unified fallback strategy across the application.
 *
 * @param indicator - The indicator or question item object
 * @param criterionIndex - Optional criterion index for synthetic fallback ID generation
 * @param indicatorIndex - Optional indicator index for synthetic fallback ID generation
 * @returns Clean, unique question ID string
 */
export function getQuestionId(
  indicator?: IndicatorLike | null,
  criterionIndex?: number,
  indicatorIndex?: number,
): string {
  if (!indicator) {
    const cIdx = criterionIndex ?? 0;
    const iIdx = indicatorIndex ?? 0;
    return `fire-${cIdx}-${iIdx}`;
  }

  const rawId = indicator.code || indicator.id || indicator.question_id;
  if (typeof rawId === "string" && rawId.trim() !== "") {
    return rawId.trim();
  }

  const cIdx = criterionIndex ?? 0;
  const iIdx = indicatorIndex ?? 0;
  return `fire-${cIdx}-${iIdx}`;
}
