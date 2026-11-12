/**
 * LabelReportDocument.tsx
 * Root @react-pdf/renderer Document template assembling all presentation sections
 */

import React from "react";
import { Document, Page } from "@react-pdf/renderer";
import { pdfStyles } from "./styles/pdfTheme";
import { PdfReportHeader } from "./sections/PdfReportHeader";
import { PdfOverallScoreSection } from "./sections/PdfOverallScoreSection";
import { PdfValueBreakdownSection } from "./sections/PdfValueBreakdownSection";
import { PdfEvaluationDetailsSection } from "./sections/PdfEvaluationDetailsSection";
import { PdfPageFooter } from "./sections/PdfPageFooter";
import type { LabelReportDataDTO } from "@/types/pdfReport.types";

interface Props {
  data: LabelReportDataDTO;
}

export const LabelReportDocument: React.FC<Props> = ({ data }) => {
  return (
    <Document title={data.metadata.title} author={data.metadata.userEmail}>
      <Page size="A4" style={pdfStyles.page}>
        <PdfReportHeader metadata={data.metadata} />
        <PdfOverallScoreSection overallScore={data.overallScore} />
        <PdfValueBreakdownSection breakdowns={data.valueBreakdowns} />
        <PdfEvaluationDetailsSection evaluations={data.detailedEvaluations} />
        <PdfPageFooter />
      </Page>
    </Document>
  );
};

export default LabelReportDocument;
