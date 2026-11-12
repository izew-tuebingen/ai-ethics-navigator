/**
 * QuestionSidebar Component
 * Displays value info, progress, and question list navigation
 * 
 */

import type {
    Question,
    QuestionnaireData,
    ValueIcon as ValueIconType,
} from "@/types";
import { Button } from "../Button";
import { ValueIcon } from "../values/ValueIcon";

interface QuestionSidebarProps {
    questionnaire: QuestionnaireData;
    questions: Question[];
    currentIndex: number;
    answers: Record<string, string>;
    completedCount: number;
    totalQuestions: number;
    valueIcon: ValueIconType;
    valueColor: string;
    valueBg: string;
    valueBorder: string;
    onBack?: () => void;
    onQuestionClick: (index: number) => void;
    onClose?: () => void;
    mode?: "mobile" | "desktop";
    isOpen?: boolean;
}

export function QuestionSidebar({
    questionnaire,
    questions,
    currentIndex,
    answers,
    completedCount,
    totalQuestions,
    valueIcon,
    valueColor,
    valueBg,
    valueBorder,
    onBack,
    onQuestionClick,
    isOpen = false,
    onClose,
    mode = "desktop",
}: QuestionSidebarProps) {
    const isMobile = mode === "mobile";

    // Base classes shared by both modes
    const baseClasses = "bg-card border-r border-border flex flex-col p-6 md:p-8 lg:p-10 gap-8 overflow-auto";

    // Mode-specific classes
    const layoutClasses = isMobile
        ? `fixed inset-y-0 left-0 z-50 w-[280px] transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`
        : "hidden md:flex w-56 md:w-64 lg:w-72 xl:w-80 shrink-0 h-full max-h-screen relative";

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <div
                className={`${baseClasses} ${layoutClasses}`}
                style={
                    {
                        "--value-color": valueColor,
                        "--value-bg": valueBg,
                        "--value-border": valueBorder,
                    } as React.CSSProperties
                }
            >
                {/* Back Button */}
                <div className="flex justify-between items-center shrink-0">
                    <Button
                        variant="ghost"
                        icon={<span className="text-base md:text-lg">←</span>}
                        onClick={onBack}
                    >
                        Back
                    </Button>
                </div>

                {/* Value Info */}
                <div
                    className="border border-value-border rounded-3xl p-3 md:p-4"
                    style={{ backgroundColor: valueBg, color: valueColor }}
                >
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <ValueIcon type={valueIcon} color={valueColor} />
                        <p className="font-light text-base md:text-lg leading-relaxed mb-1">
                            {questionnaire.questionnaire_info.title}
                        </p>
                    </div>

                    <div
                        className="border border-value-border rounded-[30px] h-7 md:h-8 px-3 py-1 inline-flex items-center justify-center"
                        style={{ backgroundColor: valueBg }}
                    >
                        <span
                            className="font-medium text-xs md:text-sm"
                            style={{ color: valueColor }}
                        >
                            {completedCount} / {totalQuestions}
                        </span>
                    </div>
                </div>

                {/* Question List */}
                <div className="flex flex-col gap-6">
                    {questionnaire.question_collections.map((collection) => (
                        <div key={collection.collection_id} className="flex flex-col gap-3">
                            <h3 
                                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {collection.collection_title}
                            </h3>
                            <div className="grid grid-cols-2 gap-[clamp(0.5rem,1.2vw,0.75rem)]">
                                {collection.questions.map((q) => {
                                    const index = questions.findIndex((flatQ) => flatQ.question_id === q.question_id);
                                    const isAnswered = !!answers[q.question_id];
                                    const isActive = index === currentIndex;

                                    return (
                                        <div
                                            key={q.question_id}
                                            onClick={() => onQuestionClick(index)}
                                            className={`
                                                relative border border-gray-200
                                                ${isActive ? "bg-muted" : "bg-background"}
                                                rounded-full h-12 md:h-14 lg:h-16 px-4 md:px-5 lg:px-6 py-3 md:py-4 flex items-center cursor-pointer hover:bg-gray-100 transition-colors
                                            `}
                                        >
                                            <p className="font-semibold text-sm md:text-base text-[#474747] leading-tight flex-1">
                                                {q.question_id}
                                            </p>
                                            <div className="w-4 h-4 md:w-5 md:h-5 ml-2 shrink-0 flex items-center justify-center">
                                                {isAnswered && (
                                                    <svg
                                                        aria-label="answered-indicator"
                                                        className="w-4 h-4 md:w-5 md:h-5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            x="0.5"
                                                            y="0.5"
                                                            width="23"
                                                            height="23"
                                                            rx="11.5"
                                                            fill={valueColor}
                                                        />
                                                        <rect
                                                            x="0.5"
                                                            y="0.5"
                                                            width="23"
                                                            height="23"
                                                            rx="11.5"
                                                            stroke="white"
                                                        />
                                                        <path
                                                            d="M6.1665 12.8333L9.49984 16.1666L17.8332 7.83325"
                                                            stroke="white"
                                                            strokeWidth="1.25"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
