/**
 * Types for AI Ethics Values and their metadata
 * define the structure of the value dimensions, their criteria.
 * The indicators used throughout the app for rendering and progress tracking.
 */

/** Valid icon types for values */
export type ValueIcon =
  | "triangle"
  | "square"
  | "hexagon"
  | "diamond"
  | "circle";

/** Progress tracking for a single value */
export interface ValueProgress {
  completed: number;
  total: number;
}

/** Complete metadata for a value dimension */
export interface ValueMetadata {
  id?: string;
  name: string;
  path: string;
  description: string;
  total_questions?: number;
  icon: ValueIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  criteria?: CriteriaMetadata[];
}

/** Simplified value card display props */
export interface ValueCardData {
  name: string;
  icon: ValueIcon;
  description: string;
  progress: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/** Progress data for charts and visualization */
export interface ProgressSegment {
  color: string;
  label: string;
  progress: number;
  total: number;
  completed: number;
}


export interface IndicatorMetadata {
  id: string;
  code: string;
  question: string;
  guidance?: string | null;
  importanceLevel: number;
  required: boolean;
}
export interface CriteriaMetadata {
  id: string;
  code: string;
  name: string;
  description: string;
  indicators: IndicatorMetadata[];
}
