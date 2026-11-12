import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AnswerOption, Question } from "@/types";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { QuestionAssignmentDropdown } from "./QuestionAssignmentDropdown";

interface QuestionContentProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  hoveredQuestionId: string | null;
  onAnswerClick: (optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onQuestionHover: (questionId: string | null) => void;
  onFinish?: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  assignedTo: string | null;
  onAssign: (name: string) => void;
  onUnassign: () => void;
}

export function QuestionContent({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  hoveredQuestionId,
  onAnswerClick,
  onNext,
  onPrevious,
  onQuestionHover,
  onFinish,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  assignedTo,
  onAssign,
  onUnassign,
}: QuestionContentProps) {
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(
    debounce(() => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowScrollHint(
        scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 10,
      );
    }, 100),
    [],
  );

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      checkScroll.cancel();
    };
  }, [question.question_id, question.answer_options, checkScroll]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pt-2 md:pt-4 lg:pt-4 pb-2"
      >
        <div className="max-w-[700px]">
          <p className="font-sans text-xs md:text-sm text-muted-foreground leading-relaxed mb-1 md:mb-2">
            Question {currentIndex + 1} of {totalQuestions}
          </p>

          <div className="relative mb-2 md:mb-3">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h2
                className="font-semibold text-lg md:text-xl lg:text-2xl text-[#333333] leading-tight cursor-help"
                onMouseEnter={() => onQuestionHover(question.question_id)}
                onMouseLeave={() => onQuestionHover(null)}
              >
                {question.question_text}
              </h2>
              <QuestionAssignmentDropdown
                assignedTo={assignedTo}
                onAssign={onAssign}
                onUnassign={onUnassign}
              />
            </div>

            {question.guidance && (
              <p className="text-sm text-gray-400 italic mt-1 mb-2 max-w-[700px]">
                {question.guidance}
              </p>
            )}

            {hoveredQuestionId === question.question_id && question.guidance && (
              <div className="absolute left-0 top-full mt-2 bg-gray-900 text-white text-xs md:text-sm p-3 rounded-md z-50 max-w-sm wrap-break-word">
                {question.guidance}
              </div>
            )}
          </div>

          <RadioGroup
            value={selectedAnswer || ""}
            onValueChange={onAnswerClick}
            className="flex flex-col gap-2 mb-2 md:mb-3"
          >
            {question.answer_options
              .filter(
                (option: AnswerOption) =>
                  option.option_text && option.option_text.trim() !== "",
              )
              .map((option: AnswerOption) => {
                const isSelected = selectedAnswer === option.option_id;
                const optionId = `option-${option.option_id}`;
                return (
                  <label
                    key={option.option_id}
                    htmlFor={optionId}
                    className={`rounded-[12px] p-2.5 md:p-3 cursor-pointer transition-all block ${
                      isSelected ? "bg-[#f8f5ff]" : "bg-card hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-2.5 md:gap-3 items-center">
                      <RadioGroupItem
                        value={option.option_id}
                        id={optionId}
                        onClick={(event) => {
                          if (isSelected) {
                            event.preventDefault();
                            onAnswerClick(option.option_id);
                          }
                        }}
                      />
                      <div className="font-sans text-sm text-[#333333] leading-relaxed flex-1 select-none">
                        {option.option_text}
                      </div>
                    </div>
                  </label>
                );
              })}
          </RadioGroup>
        </div>
      </div>

      {showScrollHint && (
        <div className="absolute bottom-20 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none flex items-end justify-center pb-4 z-10 transition-opacity duration-300">
          <span className="text-primary text-sm font-medium animate-bounce bg-background/80 px-3 py-1 rounded-full shadow-sm">
            Scroll for more ↓
          </span>
        </div>
      )}

      <div className="shrink-0 px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-background border-t border-border/50 z-20">
        <div className="max-w-175 flex justify-between gap-2 md:gap-4">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="bg-card border border-primary border-solid rounded-[30px] h-9 md:h-10 px-4 md:px-6 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-sans text-xs md:text-sm text-primary">
              ← Previous
            </span>
          </button>
          <button
            onClick={isLastQuestion && onFinish ? onFinish : onNext}
            disabled={!canGoNext && !isLastQuestion}
            className="bg-primary border border-primary border-solid rounded-[30px] h-9 md:h-10 px-4 md:px-6 flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-sans text-xs md:text-sm text-white">
              {isLastQuestion ? "Finished" : "Next →"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
