/**
 * PdfEvaluationDetailsSection.tsx
 * Presentational PDF section for detailed criteria and indicator responses
 */

import type {
  PdfCriteriaEvaluation,
  PdfIndicatorResponse,
  PdfValueEvaluation,
} from "@/types/pdfReport.types";
import { View } from "@react-pdf/renderer";
import React from "react";
import { SafeText as Text } from "../common/SafeText";
import { PDF_COLORS, pdfStyles } from "../styles/pdfTheme";

const IndicatorRow: React.FC<{ ind: PdfIndicatorResponse }> = ({ ind }) => (
  <View style={pdfStyles.indicatorRow} wrap={false}>
    <Text style={pdfStyles.indicatorQuestion}>
      [{ind.code}] {ind.question}
    </Text>
    <Text style={pdfStyles.indicatorAnswer}>
      {ind.selectedOptionText ? `Selected Answer: ${ind.selectedOptionText}` : null}
    </Text>
    <Text style={pdfStyles.indicatorGuidance}>
      {ind.guidance ? `Guidance: ${ind.guidance}` : null}
    </Text>
    {ind.recommendation ? (
      <Text style={pdfStyles.indicatorRecommendation}>
        Recommendation: {ind.recommendation}
      </Text>
    ) : null}
  </View>
);

const CriteriaBlock: React.FC<{ crit: PdfCriteriaEvaluation }> = ({ crit }) => (
  <View style={pdfStyles.criteriaContainer}>
    <Text style={pdfStyles.criteriaName}>
      {crit.code}: {crit.name}
    </Text>
    {crit.indicators.map((ind) => (
      <IndicatorRow key={ind.id} ind={ind} />
    ))}
  </View>
);

interface Props {
  evaluations: PdfValueEvaluation[];
}

export const PdfEvaluationDetailsSection: React.FC<Props> = ({ evaluations }) => {
  return (
    <View>
      <Text style={pdfStyles.sectionTitle}>Detailed Report</Text>

      {evaluations.map((valEval) => (
        <View key={valEval.valueId} style={[
          pdfStyles.valueCardContainer,
          {
            borderColor: valEval.color || PDF_COLORS.border,
            backgroundColor: valEval.bgColor || PDF_COLORS.bgCard,
          }
        ]}>
          <Text style={pdfStyles.valueTitle}>{valEval.valueName}</Text>

          {valEval.criteria.map((crit) => (
            <CriteriaBlock key={crit.id} crit={crit} />
          ))}

        </View>
      ))}
    </View>
  );
};
