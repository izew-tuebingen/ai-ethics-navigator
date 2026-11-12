/**
 * Types for navigation and routing
 */

/** Valid page identifiers */
export type PageType = "home" | "values" | "question" | "label";

/** Navigation callback signatures */
export interface NavigationCallbacks {
  onHomeClick?: () => void;
  onReviewClick?: () => void;
  onLabelClick?: () => void;
  onBackClick?: () => void;
  onAboutClick?: () => void;
  onLoginClick?: () => void;
  onEditClick?: () => void;
}

/** Value selection callback */
export type ValueClickHandler = (valueName: string, path: string) => void;

/** Progress change callback */
export type ProgressChangeHandler = (
  completed: number,
  total: number,
  valueName: string,
) => void;
