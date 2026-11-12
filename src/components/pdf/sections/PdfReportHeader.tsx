/**
 * PdfReportHeader.tsx
 * Presentational PDF header section showing assessment type, date, and framework
 */

import type { PdfReportMetadata } from "@/types/pdfReport.types";
import { View } from "@react-pdf/renderer";
import React from "react";
import { SafeText as Text } from "../common/SafeText";
import { pdfStyles } from "../styles/pdfTheme";

interface Props {
  metadata: PdfReportMetadata;
}

export const PdfReportHeader: React.FC<Props> = ({ metadata }) => {
  return (
    <View style={pdfStyles.headerContainer} fixed>
      <View style={pdfStyles.headerTopRow}>
        <Text style={pdfStyles.headerTitle}>{metadata.title}</Text>
      </View>

      <View style={pdfStyles.metadataRow}>
        <Text style={pdfStyles.metadataItem}>{metadata.assessmentType}</Text>
        <Text style={pdfStyles.metadataItem}>User: {metadata.userEmail}</Text>
        <Text style={pdfStyles.metadataItem}>{metadata.frameworkName}</Text>
        <Text style={pdfStyles.metadataItem}>Date: {metadata.generatedAt}</Text>
      </View>
    </View>
  );
};
