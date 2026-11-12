import {
  DEFAULT_DEMO_RECOMMENDATION,
  DEMO_LABEL_RECOMMENDATIONS,
} from "@/demo/labelRecommendations";
import type { LetterGrade } from "@/types";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";

interface ActionableRecommendationsProps {
  value: { name: string; grade: LetterGrade | null; path: string };
}

export function ActionableRecommendations({
  value,
}: ActionableRecommendationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (value.grade === null) {
    return (
      <div className="w-full mt-4 bg-gray-50/70 rounded-xl border border-gray-200 p-3 text-center text-xs text-gray-400">
        Complete all questions to unlock recommendations
      </div>
    );
  }

  if (value.grade === "A") {
    return (
      <div className="w-full mt-4 bg-emerald-50/50 rounded-xl border border-emerald-100 overflow-hidden">
        <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="font-semibold text-sm text-emerald-900">Excellent work!</h4>
        </div>
        <div className="p-4 h-[160px] flex items-center justify-center text-emerald-700/80 text-sm text-center">
          No improvements needed for this value. Keep maintaining these high standards!
        </div>
      </div>
    );
  }

  const recommendations =
    DEMO_LABEL_RECOMMENDATIONS[value.name] ?? [DEFAULT_DEMO_RECOMMENDATION];

  return (
    <div className="w-full mt-4 bg-indigo-50/50 rounded-xl border border-indigo-100 overflow-hidden">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="w-full bg-indigo-50 hover:bg-indigo-100/80 transition-colors px-4 py-3 flex items-center justify-between text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-semibold text-sm text-indigo-900">
            Learn how to improve? (Demo Answers)
          </span>
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="h-[160px] overflow-y-auto border-t border-indigo-100 p-4 text-sm text-gray-700">
          <ul className="list-disc space-y-2 pl-5">
            {recommendations.map((recommendation) => (
              <li key={recommendation.questionId}>
                <strong className="font-semibold">
                  Question [{recommendation.questionId}]:
                </strong>{" "}
                {recommendation.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
