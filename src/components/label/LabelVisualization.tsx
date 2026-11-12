/**
 * LabelVisualization Component
 * Displays the main grade label using SVG assets
 */

import type { LetterGrade } from "@/types";

interface LabelVisualizationProps {
    grade: LetterGrade | null;
    size?: "small" | "medium" | "large";
}

export function LabelVisualization({
    grade,
    size = "large",
}: LabelVisualizationProps) {
    // Map grade to SVG asset path (files in /public are served from root)
    const effectiveGrade = grade ?? "G";
    const svgPath = `/Label_Large_${effectiveGrade}.svg`;

    // change the max-width based on size prop
    let maxWidthClass = "max-w-[360px]";
    if (size === "medium") {
        maxWidthClass = "max-w-[280px]";
    } else if (size === "small") {
        maxWidthClass = "max-w-[200px]";
    }

    return (
        <div className={`bg-white flex flex-col p-6 md:p-8 lg:p-10 rounded-2xl w-full lg:w-auto relative border border-[#E6E6EE] ${grade === null ? "opacity-70" : ""}`}>
            {/* Score Badge - Top Right */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 lg:top-10 lg:right-10 flex flex-col items-end">
                <p className="text-sm text-[#474747] font-normal leading-5">Score</p>
                <p className="text-3xl md:text-4xl text-[#474747] font-bold leading-tight h-10 flex items-center justify-end">
                    {grade ?? ""}
                </p>
            </div>

            {/* Bar Chart */}
            <img
                src={svgPath}
                alt={grade ? `Grade ${grade} visualization` : "Incomplete score visualization"}
                className={`h-auto w-full ${maxWidthClass} mx-auto ${grade === null ? "grayscale opacity-40" : ""}`}
            />
        </div>
    );
}

