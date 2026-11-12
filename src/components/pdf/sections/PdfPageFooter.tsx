/**
 * PdfPageFooter.tsx
 * Presentational PDF footer section with dynamic page numbers and confidentiality notice
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { SafeText as Text } from "../common/SafeText";
import { pdfStyles } from "../styles/pdfTheme";

export const PdfPageFooter: React.FC = () => {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text style={pdfStyles.footerText}>
        AI Ethics Navigator • Confidential Evaluation Report
      </Text>
      <Text
        style={pdfStyles.footerText}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
};
