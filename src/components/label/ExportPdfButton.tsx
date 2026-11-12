/**
 * ExportPdfButton.tsx
 * Decoupled action button that triggers PDF report generation
 */

import { exportLabelReportPdf } from "@/services/pdfExportService";
import { buildLabelReportDTO, getAllAnswersAsync } from "@/services/pdfReportMapper";
import { useRepositories } from "@/contexts/RepositoryContext";
import type { EthicsFramework, LetterGrade, ValueMetadata } from "@/types";
import { Download, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  values: ValueMetadata[];
  valueScoresLetters: (LetterGrade | null)[];
  overallGrade: LetterGrade | null;
  profile?: { email?: string } | null;
  frameworkId?: string | null;
  framework?: EthicsFramework | null;
  frameworkName?: string | null;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export const ExportPdfButton: React.FC<Props> = ({
  values,
  valueScoresLetters,
  overallGrade,
  profile,
  frameworkId,
  framework,
  frameworkName,
  variant = "primary",
  className = "",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { answer: answerRepository } = useRepositories();

  const handleExport = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    const toastId = toast.loading("Generating your PDF evaluation report...");

    try {
      // 1. Fetch all answers ahead of time
      const answersMap = await getAllAnswersAsync(
        values,
        frameworkId,
        answerRepository,
      );

      // 2. Build DTO via pure synchronous mapper
      const reportDTO = buildLabelReportDTO(
        values,
        valueScoresLetters,
        overallGrade,
        answersMap,
        frameworkId,
        profile,
        framework,
        frameworkName,
      );

      // 2. Export PDF via dynamic service
      await exportLabelReportPdf(reportDTO);

      toast.success("PDF report downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF report. Please try again.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-xs cursor-pointer focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed";

  let variantStyles = "bg-[#020051] text-white hover:bg-[#1a187a] active:bg-[#010038]";
  if (variant === "secondary") {
    variantStyles = "bg-[#E6E6EE] text-[#474747] hover:bg-[#d8d8e5]";
  } else if (variant === "outline") {
    variantStyles = "border border-[#020051] text-[#020051] bg-white hover:bg-[#f0f0fa]";
  }

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className={`${baseStyles} ${variantStyles} ${className}`}
      title="Export AI ethics label & detailed report as PDF"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Export PDF Report</span>
        </>
      )}
    </button>
  );
};
