import type { LetterGrade } from "@/types";
import { ActionableRecommendations } from "./label/ActionableRecommendations";
import { ValueIcon } from "./values/ValueIcon";

import { LabelVisualization } from "./label/LabelVisualization";
export interface ValueCardData {
  title: string;
  icon: "triangle" | "square" | "hexagon" | "diamond" | "circle";
  iconColor: string;
  headerBgColor: string;
  titleColor: string;
  grade: LetterGrade | null;
  description: string;
  path: string;
}

interface ValueCardProps {
  data: ValueCardData;
}

export function ValueCard({ data }: ValueCardProps) {
  const isCompleted = data.grade !== null;

  // Set CSS custom properties for dynamic theming
  const cardStyle = {
    "--value-header-bg": data.headerBgColor,
    "--value-title-color": data.titleColor,
    "--value-border-color": data.iconColor,
  } as React.CSSProperties;

  const headerStyle = {
    backgroundColor: "var(--value-header-bg)",
  } as React.CSSProperties;

  const titleStyle = {
    color: "var(--value-title-color)",
  } as React.CSSProperties;

  return (
    <div
      className="flex flex-col rounded-2xl w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-value-card border border-(--value-border-color) transition-all"
      style={cardStyle}
    >
      {/* Header with Icon and Title */}
      <div
        className="flex items-center gap-2 p-2.5 w-full rounded-t-2xl"
        style={headerStyle}
      >
        <ValueIcon type={data.icon} color={data.iconColor} />
        <p className="font-medium text-sm leading-5 flex items-center justify-between w-full" style={titleStyle}>
          <span>{data.title}</span>
          {!isCompleted && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200/80 text-gray-600 font-semibold">
              Incomplete
            </span>
          )}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 w-full flex-grow">
        <div>
          {/* Label Visualization */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <LabelVisualization grade={data.grade} size="medium" />
          </div>

          {/* Description */}
          <p className="text-xs text-black leading-snug">
            {data.description}
          </p>
        </div>

        {/* Actionable Recommendations specific to this value */}
        <div className="mt-auto">
          <ActionableRecommendations value={{ name: data.title, grade: data.grade, path: data.path }} />
        </div>
      </div>
    </div>
  );
}

