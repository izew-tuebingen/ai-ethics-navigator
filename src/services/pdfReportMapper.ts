/**
 * pdfReportMapper.ts
 * Pure data mapper service to transform application state into strict DTO for PDF report generation
 */

import type { EthicsFramework, LetterGrade, ValueMetadata } from "@/types";
import type {
  LabelReportDataDTO,
  PdfCriteriaEvaluation,
  PdfIndicatorResponse,
  PdfValueBreakdown,
  PdfValueEvaluation,
} from "@/types/pdfReport.types";
import {
  FRAMEWORK_DISPLAY_NAME,
  LOCAL_ETHICS_FRAMEWORK,
} from "@/constants/framework";
import type { IAnswerRepository } from "@/domain/repositories/IRepositories";
import { getQuestionId } from "@/utils/ethicsUtils";
import { letterToScore } from "@/utils/scoring";

interface UserProfileInfo {
  email?: string;
  displayName?: string;
}

/**
 * Build deterministic option lookup map combining runtime framework, values, and static local framework fallback
 */
function buildOptionMap(
  framework?: EthicsFramework | null,
  values?: ValueMetadata[],
): Map<string, string> {
  const map = new Map<string, string>();

  const sources = [
    framework?.values,
    (framework as unknown as { question_collections?: unknown[] })
      ?.question_collections,
    values,
    (LOCAL_ETHICS_FRAMEWORK as unknown as { values?: unknown[] })?.values,
    (LOCAL_ETHICS_FRAMEWORK as unknown as { question_collections?: unknown[] })
      ?.question_collections,
  ];

  for (const sourceValues of sources) {
    if (!Array.isArray(sourceValues)) continue;

    for (const val of sourceValues) {
      if (typeof val !== "object" || val === null) continue;
      const criteriaList = (val as { criteria?: unknown[] }).criteria || [val];

      criteriaList.forEach((crit: unknown, cIdx: number) => {
        if (typeof crit !== "object" || crit === null) return;
        const indicators =
          (crit as { indicators?: unknown[] }).indicators ||
          (crit as { questions?: unknown[] }).questions ||
          [];

        (indicators as unknown[]).forEach((ind: unknown, iIdx: number) => {
          if (typeof ind !== "object" || ind === null) return;
          const questionId = getQuestionId(
            ind as any,
            cIdx,
            iIdx,
          ).toLowerCase();

          const optionsList =
            (ind as { options?: unknown[] }).options ||
            (ind as { answer_options?: unknown[] }).answer_options;

          if (Array.isArray(optionsList)) {
            optionsList.forEach((opt: unknown) => {
              if (typeof opt !== "object" || opt === null) return;

              const optObj = opt as Record<string, string>;
              const optKey = String(
                optObj.label ||
                  optObj.option_id ||
                  optObj.id ||
                  optObj.letter ||
                  "",
              )
                .toLowerCase()
                .trim();
              const text = optObj.text || optObj.option_text;

              if (text && optKey) {
                const label =
                  optObj.label ||
                  optObj.id ||
                  optObj.option_id ||
                  optKey.toUpperCase();
                const formatted = `${label}: ${text}`;

                map.set(`${questionId}_${optKey}`, formatted);
                if (optObj.code)
                  map.set(
                    `${String(optObj.code).toLowerCase()}_${optKey}`,
                    formatted,
                  );
                if (optObj.id)
                  map.set(
                    `${String(optObj.id).toLowerCase()}_${optKey}`,
                    formatted,
                  );
              }
            });
          }
        });
      });
    }
  }

  return map;
}

export async function getAllAnswersAsync(
  values: ValueMetadata[],
  frameworkId: string | null | undefined,
  answerRepository: IAnswerRepository,
): Promise<Record<string, Record<string, string>>> {
  const entries = await Promise.all(
    values.map(async (value) => [
      value.path || value.name,
      await getAnswersForValue(value, frameworkId, answerRepository),
    ] as const),
  );
  return Object.fromEntries(entries);
}

/**
 * Build the complete DTO required by @react-pdf/renderer
 * This is a pure synchronous function. All data should be fetched beforehand.
 */
export function buildLabelReportDTO(
  values: ValueMetadata[],
  valueScoresLetters: (LetterGrade | null)[],
  overallGrade: LetterGrade | null,
  answersMap: Record<string, Record<string, string>>,
  frameworkId?: string | null,
  profile?: UserProfileInfo | null,
  framework?: EthicsFramework | null,
  frameworkName?: string | null,
): LabelReportDataDTO {
  const optionMap = buildOptionMap(framework, values);

  const generatedAt = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const metadata = {
    title: "AI Ethics Label Report",
    assessmentType: "Individual Assessment",
    userEmail: profile?.email ?? "N/A",
    frameworkName: frameworkName
      ? `Framework: ${frameworkName}`
      : framework
        ? `Framework: ${
            framework.metadata?.source ||
            framework.id ||
            FRAMEWORK_DISPLAY_NAME
          }`
        : FRAMEWORK_DISPLAY_NAME,
    generatedAt,
  };

  // Only display letter grade if ALL values are completed (non-null)
  const allValuesCompleted =
    valueScoresLetters.length > 0 &&
    valueScoresLetters.every((score) => score !== null);

  const effectiveOverallGrade = allValuesCompleted ? overallGrade : null;

  const overallScore = {
    grade: effectiveOverallGrade,
    numericScore: effectiveOverallGrade
      ? letterToScore(effectiveOverallGrade)
      : null,
    summaryText:
      allValuesCompleted && effectiveOverallGrade
        ? `Overall Grade ${effectiveOverallGrade} computed from all ${values.length} value dimensions.`
        : `Assessment Incomplete: All ${values.length} value dimensions must be completed before an overall rating is assigned.`,
  };

  const valueBreakdowns: PdfValueBreakdown[] = values.map((val, idx) => {
    const grade = valueScoresLetters[idx] ?? null;
    const valId = val.path || val.name;
    const answers = answersMap[valId] || {};
    const completedQuestions = Object.keys(answers).length;

    return {
      id: val.path || val.name,
      name: val.name,
      grade,
      numericScore: grade ? letterToScore(grade) : null,
      description: val.description,
      totalQuestions: val.total_questions || 0,
      completedQuestions,
      color: val.color || "#020051",
    };
  });

  const detailedEvaluations = values
    .map((val) => {
      const valId = val.path || val.name;
      const answers = answersMap[valId] || {};

      if (Object.keys(answers).length === 0) {
        return null; // Skip values with no answers
      }

      // Load recommendations synchronously for this value
      let recommendations: Record<string, string> = {};
      if (typeof window !== "undefined") {
        try {
          // This must be synchronous, we can't await inside this map easily without refactoring the DTO builder.
          // Since localstorage is synchronous, we can just use our util if we import it, or use raw localStorage here.
          const STORAGE_PREFIX = "vcio_recommendations_";
          const frameworkSuffix = frameworkId ? `_${frameworkId}` : "";
          const key = `${STORAGE_PREFIX}${val.name}${frameworkSuffix}`;
          const data = window.localStorage.getItem(key);
          if (data) {
            recommendations = JSON.parse(data);
          }
        } catch (e) {
          console.error("Failed to load recommendations for PDF:", e);
        }
      }

      const criteriaList: PdfCriteriaEvaluation[] = (val.criteria || []).map(
        (crit, cIdx) => {
          const indicators: PdfIndicatorResponse[] = (
            crit.indicators || []
          ).map((ind, iIdx) => {
            const rawAnswerKey = findAnswerForIndicator(
              answers,
              ind,
              cIdx,
              iIdx,
            );
            const selectedOptionText = rawAnswerKey
              ? getSelectedOptionText(ind, rawAnswerKey, optionMap, cIdx, iIdx)
              : "Not Answered";

            const questionId = getQuestionId(ind as any, cIdx, iIdx);

            return {
              id: ind.id || questionId,
              code: ind.code || questionId,
              question: ind.question || (ind as any).question_text || "",
              selectedOptionText,
              importanceLevel: ind.importanceLevel || 1,
              guidance: ind.guidance || null,
              recommendation:
                recommendations[questionId] ||
                recommendations[ind.id] ||
                undefined,
            };
          });

          return {
            id: crit.id || `crit-${cIdx}`,
            code: crit.code || `CRIT-${cIdx}`,
            name: crit.name || "Unnamed Criteria",
            description: crit.description || "",
            indicators,
          };
        },
      );

      const evalItem: PdfValueEvaluation = {
        valueId: val.path || val.name,
        valueName: val.name,
        color: val.color,
        bgColor: val.bgColor,
        criteria: criteriaList,
      };
      return evalItem;
    })
    .filter((evalItem): evalItem is PdfValueEvaluation => evalItem !== null);

  return {
    metadata,
    overallScore,
    valueBreakdowns,
    detailedEvaluations,
  };
}

/**
 * Reads answers for a value from local browser storage.
 */
async function getAnswersForValue(
  val: ValueMetadata,
  frameworkId: string | null | undefined,
  answerRepository: IAnswerRepository,
): Promise<Record<string, string>> {
  const byName = await answerRepository.getAnswers(val.name, frameworkId);
  if (Object.keys(byName).length > 0) return byName;

  const byPath = await answerRepository.getAnswers(val.path, frameworkId);
  if (Object.keys(byPath).length > 0) return byPath;

  const cleanPath = val.path.replace("data/", "").replace(".json", "");
  return answerRepository.getAnswers(cleanPath, frameworkId);
}

/**
 * Flexible lookup for indicator answer by ID or code using standardized getQuestionId
 */
function findAnswerForIndicator(
  answers: Record<string, string>,
  ind: any,
  cIdx?: number,
  iIdx?: number,
): string | undefined {
  const qId = getQuestionId(ind, cIdx, iIdx);
  if (answers[qId]) return answers[qId];
  if (ind.id && answers[ind.id]) return answers[ind.id];
  if (ind.code && answers[ind.code]) return answers[ind.code];

  const qIdLower = qId.toLowerCase();
  for (const [key, value] of Object.entries(answers)) {
    if (key.toLowerCase() === qIdLower) {
      return value;
    }
  }

  return undefined;
}

/**
 * Look up full option text for the selected answer key deterministically using standardized question IDs
 */
function getSelectedOptionText(
  ind: any,
  rawAnswerKey: string,
  optionMap: Map<string, string>,
  cIdx?: number,
  iIdx?: number,
): string {
  if (!rawAnswerKey) return "Not Answered";
  const rawKeyClean = rawAnswerKey.trim();

  // If the stored answer is already full option text (contains spaces and is long)
  if (rawKeyClean.length > 5 && rawKeyClean.includes(" ")) {
    return rawKeyClean;
  }

  let optKey = rawKeyClean.toLowerCase();
  if (optKey.includes("_")) {
    optKey = optKey.split("_").pop() || optKey;
  }

  // 1. Direct search in indicator's own options list (if present)
  const optionsList: any[] = ind.options || ind.answer_options || [];
  if (Array.isArray(optionsList) && optionsList.length > 0) {
    const matchedOpt = optionsList.find((opt: any) => {
      const optId = String(
        opt.label || opt.option_id || opt.id || opt.letter || "",
      )
        .trim()
        .toLowerCase();
      return optId === optKey;
    });

    if (matchedOpt) {
      const label =
        matchedOpt.label ||
        matchedOpt.option_id ||
        matchedOpt.id ||
        matchedOpt.letter ||
        optKey.toUpperCase();
      const text = matchedOpt.text || matchedOpt.option_text;
      return text ? `${label}: ${text}` : "";
    }
  }

  // 2. Deterministic lookup in option map by standard questionId
  const questionId = getQuestionId(ind, cIdx, iIdx).toLowerCase();
  if (optionMap.has(`${questionId}_${optKey}`)) {
    return optionMap.get(`${questionId}_${optKey}`)!;
  }
  if (ind.code && optionMap.has(`${ind.code.toLowerCase()}_${optKey}`)) {
    return optionMap.get(`${ind.code.toLowerCase()}_${optKey}`)!;
  }
  if (ind.id && optionMap.has(`${ind.id.toLowerCase()}_${optKey}`)) {
    return optionMap.get(`${ind.id.toLowerCase()}_${optKey}`)!;
  }

  return "";
}
