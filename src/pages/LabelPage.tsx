/**
 * @file LabelPage.tsx
 * @description Displays overall assessment grade and individual value scores.
 * LabelPage - Refactored
 * Displays overall assessment grade and individual value scores
 * Scores are calculated from the bundled framework and locally stored answers.
 * The page is designed to be visually engaging while providing clear insights into the user's strengths and areas for improvement across all ethical values.
 */

import { useEffect, useMemo, useState } from "react";
import { NavigationButtons } from "../components/common/NavigationButtons";
import { PageFooter } from "../components/common/PageFooter";
import { PageHeader } from "../components/common/PageHeader";
import { LabelHeader } from "../components/label/LabelHeader";
import { LabelVisualization } from "../components/label/LabelVisualization";
import { ValueCard, ValueCardData } from "../components/ValueCard_Labels";
import { useFramework } from "../contexts/FrameworkContext";
import { useProgressTracker } from "../hooks/useProgressTracker";
import {
    calculateAllValueScores,
    calculateOverallScore,
    createValueCardData,
} from "../services/labelCalculationService";
import { getAllAnswersAsync } from "../services/pdfReportMapper";
import { useRepositories } from "../contexts/RepositoryContext";

import { ExportPdfButton } from "../components/label/ExportPdfButton";
import type { LetterGrade } from "../types";

/**
 * @interface LabelPageProps
 * @description Props for the LabelPage component.
 * It includes three optional callback functions: onHomeClick, onReviewClick, and onLabelClick.
 * @param onHomeClick - Callback function to handle the "Home" button click event.
 * @param onReviewClick - Callback function to handle the "Review" button click event.
 * @param onLabelClick - Callback function to handle the "Label" button click event.
 */
interface LabelPageProps {
    onHomeClick?: () => void;
    onReviewClick?: () => void;
    onLabelClick?: () => void;
}
/**
 * @function LabelPageRefactored
 * @description labelPageRefactored Component: Displays overall assessment grade and individual value scores.
 * @param props 
 * @returns {JSX.Element} - The rendered LabelPage component.
 */

export function LabelPageRefactored(props: LabelPageProps) {
    const { onHomeClick, onReviewClick, onLabelClick } = props;
    const { values, isManifestLoaded } = useProgressTracker();

    const { selectedFrameworkId, selectedFrameworkName, framework } = useFramework();
    const { answer: answerRepository } = useRepositories();

    const [answersMap, setAnswersMap] = useState<Record<string, Record<string, string>> | null>(null);

    useEffect(() => {
        if (!isManifestLoaded || !values.length) return;

        let isMounted = true;
        getAllAnswersAsync(values, selectedFrameworkId, answerRepository)
            .then((res) => {
                if (isMounted) {
                    setAnswersMap(res);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch answers for Label Page", err);
            });

        return () => {
            isMounted = false;
        };
    }, [isManifestLoaded, values, selectedFrameworkId, answerRepository]);

    // Calculate scores and card data with useMemo
    const { valueScoresLetters, overallGrade, valueCards } = useMemo(() => {
        if (!isManifestLoaded || !answersMap) {
            return {
                valueScoresLetters: [] as (LetterGrade | null)[],
                overallGrade: null as LetterGrade | null,
                valueCards: [],
            };
        }
        const { letters } = calculateAllValueScores(values, selectedFrameworkId, answersMap);
        const { letter: grade } = calculateOverallScore(letters);
        const cards = createValueCardData(values, letters);
        return {
            valueScoresLetters: letters,
            overallGrade: grade as LetterGrade | null,
            valueCards: cards,
        };
    }, [values, selectedFrameworkId, isManifestLoaded, answersMap]);

    if (!isManifestLoaded || !answersMap) {
        return (
            <div className="h-screen w-full bg-[#fffffa] flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#fffffa] min-h-screen w-full">
            {/* Top Bar */}
            <PageHeader />

            <div className="flex flex-col gap-3 md:gap-5 lg:gap-6 px-4 sm:px-6 md:px-10 lg:px-4 py-3 md:py-4 lg:py-5 max-w-5xl mx-auto">
                {/* Navigation Buttons */}
                <NavigationButtons
                    buttons={[
                        { label: "Home", onClick: onHomeClick ?? (() => { }) },
                        { label: "Review", onClick: onReviewClick ?? (() => { }) },
                        {
                            label: "Label",
                            onClick: onLabelClick ?? (() => { }),
                            isActive: true,
                        },
                    ]}
                />

                {/* Main Content - Your Label Section */}
                {/* Flex container displaying header on left and label visualization on right */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full">
                    {/* Header with PDF Export Action */}
                    <LabelHeader
                        action={
                            <ExportPdfButton
                                values={values}
                                valueScoresLetters={valueScoresLetters as (LetterGrade | null)[]}
                                overallGrade={overallGrade as LetterGrade | null}
                                frameworkId={selectedFrameworkId}
                                framework={framework}
                                frameworkName={selectedFrameworkName}
                            />
                        }
                    />
                    {/* Label Visualization */}
                    <LabelVisualization grade={overallGrade} size="large" />
                </div>


                {/* Score Breakdown Section */}
                <div className="flex flex-col gap-3 md:gap-5 w-full">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-bold text-lg md:text-xl text-[#474747]">
                            Your rating breakdown
                        </h2>
                        <p className="font-normal text-xs md:text-sm text-black leading-[1.4]">
                            The value cards below display and explain the value ratings that
                            make up your total rating
                        </p>
                    </div>

                    {/* Value Cards - Flexbox Layout */}
                    <div className="flex flex-wrap gap-6 w-full">
                        {valueCards.map((card: ValueCardData) => (
                            <ValueCard key={card.title} data={card} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <PageFooter />
        </div>
    );
}
