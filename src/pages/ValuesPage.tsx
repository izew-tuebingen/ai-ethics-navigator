/**
 * ValuesPage - Refactored
 * Overview of the bundled ethics values with local progress tracking
 * @file ValuesPage.tsx - Refactored
 * @description Defines the values overview page for the VCIO questionnaire.
 * The page displays all ethics values and their answer progress.
 * It also provides navigation to Home, Review, and Label views.
 * @category Pages
 * @module ValuesPageRefactored
 */

import type { ValueClickHandler } from "@/types";
import { NavigationButtons } from "../components/common/NavigationButtons";
import { PageFooter } from "../components/common/PageFooter";
import { PageHeader } from "../components/common/PageHeader";
import { ProgressSection } from "../components/values/ProgressSection";
import { ValueCardGrid } from "../components/values/ValueCardGrid";
import { useProgressTracker } from "../hooks/useProgressTracker";
import {
    getProgressSummary,
    transformToChartSegments,
} from "../services/progressCalculationService";

interface ValuesPageProps {
    onValueClick: ValueClickHandler;
    onHomeClick: () => void;
    onReviewClick: () => void;
    onLabelClick: () => void;
}

/**
 * @function ValuesPageRefactored 
 * @description Provides an overview of all values with progress tracking.   
 * @param props - The props for the components.
 * @returns {JSX.Element} - The rendered ValuesPage component.
 */

export function ValuesPageRefactored({
    onValueClick,
    onHomeClick,
    onReviewClick,
    onLabelClick,
}: ValuesPageProps) {
    // Values and progress are loaded from the bundled framework and local storage.
    const { valueProgress, values, getOverallProgress, isManifestLoaded } =
        useProgressTracker();

    if (!isManifestLoaded) {
        return (
            <div className="h-screen w-full bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading values...</p>
            </div>
        );
    }

    const sanitizedGridValues = values.map((v) => ({
        id: v.id || v.name || Math.random().toString(36).substring(2, 9),
        name: v.name || "Unnamed Value",
        icon: v.icon || "circle",
        description: v.description || "",
        color: v.color || "#000000",
        bgColor: v.bgColor || "#ffffff",
        borderColor: v.borderColor || "#cccccc",
        path: v.path || "",
    }));

    const safeProgress = (valueProgress || {}) as Record<
        string,
        { completed: number; total: number }
    >;

    const chartSegments = transformToChartSegments(sanitizedGridValues as any, safeProgress);
    const summary = getProgressSummary(safeProgress);

    return (
        <div className="min-h-screen w-full bg-background flex flex-col">
            <PageHeader />

            <main className="flex-1">
                <div className="flex flex-col gap-3 md:gap-5 lg:gap-6 px-4 sm:px-6 md:px-10 lg:px-4 py-3 md:py-4 lg:py-5 max-w-5xl mx-auto">
                    {/* Navigation Buttons */}
                    <NavigationButtons
                        buttons={[
                            { label: "Home", onClick: onHomeClick },
                            { label: "Review", onClick: onReviewClick, isActive: true },
                            {
                                label: "Label",
                                onClick: onLabelClick,
                            },
                        ]}
                    />

                    {/* Title Section */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-bold text-lg md:text-xl lg:text-2xl text-text-title leading-tight">Your Values</h1>
                        <p className="font-normal text-xs md:text-sm leading-[1.4] max-w-[809px]">
                            Operationalize abstract ethical principles by specifying criteria, indicators, and observables.
                            Click on a value card below to begin defining observables for your product.
                        </p>
                    </div>

                    {/* Value Cards Grid */}
                    <ValueCardGrid values={sanitizedGridValues} valueProgress={valueProgress} onValueClick={onValueClick} />

                    {/* Progress Section */}
                    <ProgressSection percentage={getOverallProgress().percentage} completedQuestions={summary.totalCompleted} totalQuestions={summary.totalQuestions} chartSegments={chartSegments} />
                </div>
            </main>

            {/* Footer */}
            <PageFooter />
        </div>
    );
}
