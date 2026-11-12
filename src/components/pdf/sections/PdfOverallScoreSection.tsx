/**
 * PdfOverallScoreSection.tsx
 * Presentational PDF section for overall grade score and summary
 */

import type { PdfOverallScore } from "@/types/pdfReport.types";
import { View } from "@react-pdf/renderer";
import React from "react";
import { SafeText as Text } from "../common/SafeText";
import { getGradeColor, PDF_COLORS, pdfStyles } from "../styles/pdfTheme";

interface Props {
  overallScore: PdfOverallScore;
}

export const PdfOverallScoreSection: React.FC<Props> = ({ overallScore }) => {
  const isCompleted = overallScore.grade !== null;
  const gradeText = isCompleted ? overallScore.grade : "—";
  const badgeBg = isCompleted ? getGradeColor(overallScore.grade) : PDF_COLORS.gradeG;

  return (
    <View style={pdfStyles.overallCard}>
      <View style={pdfStyles.overallTextContainer}>
        <Text style={pdfStyles.overallLabel}>Overall AI Ethics Label</Text>
        <Text style={pdfStyles.overallDesc}>{overallScore.summaryText}</Text>
      </View>

      <View style={[pdfStyles.overallBadge, { backgroundColor: badgeBg }]}>
        <Text style={[pdfStyles.overallBadgeText, !isCompleted ? { fontSize: 20 } : {}]}>
          {gradeText}
        </Text>
      </View>
    </View>
  );
};
