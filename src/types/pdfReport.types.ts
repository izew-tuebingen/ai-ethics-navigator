/**
 * pdfReport.types.ts
 * Data Transfer Objects (DTO) for decoupled PDF Report generation using @react-pdf/renderer
 */

import type { LetterGrade } from "./scoring.types";

export interface PdfReportMetadata {
  title: string;
  assessmentType: string;
  userEmail?: string;
  frameworkName?: string;
  generatedAt: string;
}

export interface PdfOverallScore {
  grade: LetterGrade | null;
  numericScore: number | null;
  summaryText: string;
}

export interface PdfValueBreakdown {
  id: string;
  name: string;
  grade: LetterGrade | null;
  numericScore: number | null;
  description: string;
  totalQuestions: number;
  completedQuestions: number;
  color: string;
}

export interface PdfIndicatorResponse {
  id: string;
  code: string;
  question: string;
  selectedOptionText: string;
  importanceLevel: number;
  guidance?: string | null;
  recommendation?: string;
}

export interface PdfCriteriaEvaluation {
  id: string;
  code: string;
  name: string;
  description: string;
  indicators: PdfIndicatorResponse[];
}

export interface PdfValueEvaluation {
  valueId: string;
  valueName: string;
  color?: string;
  bgColor?: string;
  criteria: PdfCriteriaEvaluation[];
}

export interface LabelReportDataDTO {
  metadata: PdfReportMetadata;
  overallScore: PdfOverallScore;
  valueBreakdowns: PdfValueBreakdown[];
  detailedEvaluations: PdfValueEvaluation[];
}
