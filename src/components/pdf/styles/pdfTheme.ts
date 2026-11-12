/**
 * pdfTheme.ts
 * Design system tokens and StyleSheet for @react-pdf/renderer
 */

import { StyleSheet } from "@react-pdf/renderer";

export const PDF_COLORS = {
  primary: "#020051",
  primaryLight: "#1A187A",
  textDark: "#333333",
  textMuted: "#666666",
  textLight: "#888888",
  bgLight: "#FFFFFA",
  bgCard: "#F8F9FA",
  bgSubtle: "#F0F1F5",
  border: "#E6E6EE",
  borderDark: "#CCCCCC",
  white: "#FFFFFF",
  accent: "#4E4D85",

  // Grade Colors
  gradeA: "#10B981", // Emerald
  gradeB: "#3B82F6", // Blue
  gradeC: "#8B5CF6", // Purple
  gradeD: "#F59E0B", // Amber
  gradeE: "#F97316", // Orange
  gradeF: "#EF4444", // Red
  gradeG: "#6B7280", // Gray
};

export const getGradeColor = (grade: string | null, valueColor?: string): string => {
  if (valueColor) return valueColor;

  switch (grade) {
    case "A": return PDF_COLORS.gradeA;
    case "B": return PDF_COLORS.gradeB;
    case "C": return PDF_COLORS.gradeC;
    case "D": return PDF_COLORS.gradeD;
    case "E": return PDF_COLORS.gradeE;
    case "F": return PDF_COLORS.gradeF;
    case "G": return PDF_COLORS.gradeG;
    default: return PDF_COLORS.textMuted;
  }
};

export const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 36,
    backgroundColor: PDF_COLORS.white,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: PDF_COLORS.textDark,
  },

  // Header Section
  headerContainer: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderColor: PDF_COLORS.primary,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    letterSpacing: -0.3,
  },
  headerBadge: {
    backgroundColor: PDF_COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  headerBadgeText: {
    color: PDF_COLORS.white,
    fontSize: 8,
    fontWeight: "bold",
  },
  metadataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 12,
  },
  metadataItem: {
    fontSize: 8.5,
    color: PDF_COLORS.textMuted,
  },

  // Section Headers
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    marginTop: 14,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Overall Score Card
  overallCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PDF_COLORS.bgCard,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PDF_COLORS.border,
    marginBottom: 14,
  },
  overallTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  overallLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: PDF_COLORS.textDark,
  },
  overallDesc: {
    fontSize: 9,
    color: PDF_COLORS.textMuted,
    marginTop: 4,
    lineHeight: 1.3,
  },
  overallBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  overallBadgeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: PDF_COLORS.white,
  },

  // Breakdown Table
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: PDF_COLORS.border,
    borderRadius: 6,
    marginBottom: 16,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: PDF_COLORS.bgSubtle,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: PDF_COLORS.border,
  },
  tableHeaderCell: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: PDF_COLORS.textDark,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: PDF_COLORS.border,
    alignItems: "center",
  },
  tableCellText: {
    fontSize: 9,
    color: PDF_COLORS.textDark,
  },
  tableCellMuted: {
    fontSize: 8.5,
    color: PDF_COLORS.textMuted,
  },

  // Detailed Evaluation Items
  valueCardContainer: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: PDF_COLORS.bgCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PDF_COLORS.border,
  },
  valueTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    marginBottom: 6,
  },
  criteriaContainer: {
    marginTop: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderColor: PDF_COLORS.accent,
  },
  criteriaName: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: PDF_COLORS.textDark,
    marginTop: 4,
  },
  indicatorRow: {
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: PDF_COLORS.white,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: PDF_COLORS.border,
  },
  indicatorQuestion: {
    fontSize: 8.5,
    color: PDF_COLORS.textDark,
    fontWeight: "bold",
  },
  indicatorAnswer: {
    fontSize: 8.5,
    color: PDF_COLORS.primaryLight,
    marginTop: 2,
  },
  indicatorGuidance: {
    fontSize: 8,
    color: PDF_COLORS.textMuted,
    marginTop: 2,
    fontStyle: "italic",
  },
  indicatorRecommendation: {
    fontSize: 8.5,
    color: "#4338CA", // Indigo 700 to match UI
    marginTop: 4,
    padding: 4,
    backgroundColor: "#EEF2FF", // Indigo 50
    borderRadius: 2,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: PDF_COLORS.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: PDF_COLORS.textLight,
  },
});
