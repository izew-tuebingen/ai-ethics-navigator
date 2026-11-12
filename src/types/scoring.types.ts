/**
 * Types for scoring and grade calculation
 */

/** Letter grades from A (best) to G (worst) */
export type LetterGrade = "A" | "B" | "C" | "D" | "E" | "F" | "G";

/** Numeric score representation (0-6) */
export type NumericScore = number;

/** Bar data for label visualization */
export interface BarData {
  letter: LetterGrade | string;
  height: number;
  isHighlighted?: boolean;
}

/** Value card data for label page */
export interface ValueCardLabelData {
  title: string;
  icon: "triangle" | "square" | "hexagon" | "heart" | "circle";
  iconColor: string;
  headerBgColor: string;
  titleColor: string;
  bars: BarData[];
  score: LetterGrade | string;
  description: string;
}

/** Score aggregation result */
export interface ScoreResult {
  letter: LetterGrade;
  numeric: NumericScore;
  criteria?: string[];
}
