/**
 * PdfValueBreakdownSection.tsx
 * Presentational PDF section for value dimensions score summary table
 */

import type { PdfValueBreakdown } from "@/types/pdfReport.types";
import { View } from "@react-pdf/renderer";
import React from "react";
import { SafeText as Text } from "../common/SafeText";
import { PDF_COLORS, pdfStyles } from "../styles/pdfTheme";

interface Props {
  breakdowns: PdfValueBreakdown[];
}

export const PdfValueBreakdownSection: React.FC<Props> = ({ breakdowns }) => {
  return (
    <View>
      <Text style={pdfStyles.sectionTitle}>Value Dimensions</Text>

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableHeader}>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 2.5 }]}>Ethical Value</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 1, textAlign: "center" }]}>Label</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 1.5, textAlign: "center" }]}>Progress</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 4 }]}>Description</Text>
        </View>

        {breakdowns.map((item) => {
          const progressText = `${item.completedQuestions}/${item.totalQuestions} Questions`;

          return (
            <View key={item.id} style={pdfStyles.tableRow} wrap={false}>
              <Text style={[pdfStyles.tableCellText, { flex: 2.5, fontWeight: "bold" }]}>
                {item.name}
              </Text>
              <View style={{ flex: 1, alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: item.color || PDF_COLORS.primary,
                    borderRadius: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    minWidth: 24,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "#FFFFFF",
                    }}
                  >
                    {item.grade ?? "—"}
                  </Text>
                </View>
              </View>
              <Text style={[pdfStyles.tableCellMuted, { flex: 1.5, textAlign: "center" }]}>
                {progressText}
              </Text>
              <Text style={[pdfStyles.tableCellMuted, { flex: 4 }]}>
                {item.description}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
