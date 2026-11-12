/**
 * pdfExportService.ts
 * On-demand async PDF generation and download service
 * Dynamically imports @react-pdf/renderer to keep bundle size lightweight
 */

import type { LabelReportDataDTO } from "@/types/pdfReport.types";
import { logger } from "@/utils/logger";
import React from "react";

/**
 * Dynamically render PDF and trigger browser file download
 */
export async function exportLabelReportPdf(
  data: LabelReportDataDTO,
): Promise<void> {
  try {
    // Dynamic imports for code-splitting @react-pdf/renderer
    const [{ pdf }, { LabelReportDocument }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("../components/pdf/LabelReportDocument"),
    ]);

    // Create React element from document template
    const docElement = React.createElement(LabelReportDocument, { data });

    // Generate blob asynchronously
    const blob = await pdf(docElement as any).toBlob();

    // Generate object URL & trigger browser download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedGrade = data.overallScore.grade ?? "draft";
    const dateStamp = new Date().toISOString().split("T")[0];
    link.download = `AI_Ethics_Label_Report_${sanitizedGrade}_${dateStamp}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up memory
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    logger.error("Failed to generate PDF report:", error);
    throw error;
  }
}
