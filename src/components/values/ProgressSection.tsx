import type { ProgressSegment } from "@/types";
import { PolarAreaProgressChart } from "./PolarAreaProgressChart";

interface ProgressSectionProps {
    percentage: number;
    completedQuestions: number;
    totalQuestions: number;
    chartSegments: ProgressSegment[];
}

export function ProgressSection({
    percentage,
    completedQuestions,
    totalQuestions,
    chartSegments,
}: ProgressSectionProps) {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 mt-3 md:mt-5 lg:mt-6 justify-center">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl md:text-2xl font-bold leading-tight text-text-title text-center lg:text-left">
                    Your Progress
                </h2>
                <div className="flex flex-col gap-1 items-center lg:items-start">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-text-title">
                        {percentage}%
                    </p>
                    <div className="flex flex-col gap-1 items-center lg:items-start">
                        <p className="text-xs md:text-sm font-normal leading-[160%] text-text-subtitle">
                            {completedQuestions} of {totalQuestions} questions answered
                        </p>
                    </div>
                </div>
            </div>

            <PolarAreaProgressChart segments={chartSegments} />
        </div>
    );
}
