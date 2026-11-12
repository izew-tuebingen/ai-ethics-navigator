import type { ProgressChangeHandler, ValueIcon } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiAssistantPanel } from "../components/question/AiAssistantPanel";
import { CommentPanel } from "../components/question/CommentPanel";
import { PageHeader } from "../components/common/PageHeader";
import { QuestionContent } from "../components/question/QuestionContent";
import { QuestionSidebar } from "../components/question/QuestionSidebar";
import { QuestionToolbar } from "../components/question/QuestionToolbar";
import { useFramework } from "../contexts/FrameworkContext";
import { useAiAssist } from "@/contexts/AiAssistContext";
import { useAnswerManagement } from "../hooks/useAnswerManagement";
import { useProgressTracker } from "../hooks/useProgressTracker";
import { useQuestionnaire } from "../hooks/useQuestionnaire";
import { useQuestionNavigation } from "../hooks/useQuestionNavigation";
import { useValueTheme } from "../hooks/useValueTheme";
import { useDemoQuestionCollaboration } from "../hooks/useDemoQuestionCollaboration";
import { DEMO_CURRENT_USER_NAME } from "@/demo/teamDemoData";

interface QuestionPageProps {
  onBack?: () => void;
  valueName?: string;
  onProgressChange?: ProgressChangeHandler;
}

export function QuestionPageRefactored({
  onBack,
  valueName = "Transparency",
  onProgressChange,
}: QuestionPageProps) {
  const activeValueName = valueName;
  const { updateProgress, values } = useProgressTracker();
  const { questionnaire, questions, loading, error, totalQuestions } =
    useQuestionnaire(activeValueName);
  const { selectedFrameworkId } = useFramework();
  const { isAiAssistEnabled } = useAiAssist();
  const { answers, completedCount, saveAnswer, getAnswer, isAnswered } =
    useAnswerManagement(activeValueName, questions, selectedFrameworkId);
  const navigation = useQuestionNavigation(questions, getAnswer);
  const collaboration = useDemoQuestionCollaboration(
    navigation.currentQuestion?.question_id ?? "",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredQuestionId, setHoveredQuestionId] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const customValue = values.find((value) => value.name === activeValueName);
  const theme = {
    color: customValue?.color || "#020051",
    bgColor: customValue?.bgColor || "#ffffff",
    borderColor: customValue?.borderColor || "#cccccc",
    icon: (customValue?.icon || "circle") as ValueIcon,
  };

  useValueTheme(theme.color, theme.bgColor, theme.borderColor);

  useEffect(() => {
    if (totalQuestions > 0) {
      updateProgress(activeValueName, completedCount, totalQuestions);
      onProgressChange?.(completedCount, totalQuestions, activeValueName);
    }
  }, [
    completedCount,
    totalQuestions,
    activeValueName,
    updateProgress,
    onProgressChange,
  ]);

  const handleAnswerClick = (optionId: string) => {
    const question = navigation.currentQuestion;
    if (!question) return;

    const answerId = navigation.selectedAnswer === optionId ? null : optionId;
    navigation.setSelectedAnswer(answerId);
    void saveAnswer(question.question_id, answerId)
      .catch((error: unknown) => {
        console.error("Failed to save answer:", error);
        toast.error("Could not save your answer.");
      });
  };

  const handleNext = () => {
    const question = navigation.currentQuestion;
    if (question?.required && !isAnswered(question.question_id)) {
      toast.error("Please answer this required question before proceeding.");
      return;
    }
    navigation.goToNext();
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading questionnaire...</p>
      </div>
    );
  }

  if (error || !questionnaire || questions.length === 0) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <p className="text-red-600">{error || "Failed to load questionnaire"}</p>
      </div>
    );
  }

  const { currentQuestion } = navigation;
  if (!currentQuestion) return null;

  return (
    <div className="relative h-screen w-full bg-background flex flex-col overflow-hidden font-sans">
      <PageHeader />
      <div className="flex w-full flex-1 overflow-hidden">
        <QuestionSidebar
          mode="mobile"
          questionnaire={questionnaire}
          questions={questions}
          currentIndex={navigation.currentIndex}
          answers={answers}
          completedCount={completedCount}
          totalQuestions={totalQuestions}
          valueIcon={theme.icon}
          valueColor={theme.color}
          valueBg={theme.bgColor}
          valueBorder={theme.borderColor}
          onBack={onBack}
          onQuestionClick={navigation.goToQuestion}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <QuestionSidebar
          mode="desktop"
          questionnaire={questionnaire}
          questions={questions}
          currentIndex={navigation.currentIndex}
          answers={answers}
          completedCount={completedCount}
          totalQuestions={totalQuestions}
          valueIcon={theme.icon}
          valueColor={theme.color}
          valueBg={theme.bgColor}
          valueBorder={theme.borderColor}
          onBack={onBack}
          onQuestionClick={navigation.goToQuestion}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <QuestionToolbar
            isAssistantOpen={isAssistantOpen}
            isCommentOpen={isCommentOpen}
            isAssistantDisabled={!isAiAssistEnabled}
            isAssignedToMe={collaboration.isAssignedToMe}
            onToggleAssistant={() => {
              setIsCommentOpen(false);
              setIsAssistantOpen((open) => !open);
            }}
            onToggleComment={() => {
              setIsAssistantOpen(false);
              setIsCommentOpen((open) => !open);
            }}
            hasCommentNotification={collaboration.comments.length > 0}
            onToggleAssignment={() =>
              collaboration.isAssignedToMe
                ? collaboration.unassignQuestion()
                : collaboration.assignQuestion(DEMO_CURRENT_USER_NAME)
            }
            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
            onCopyLink={() => {
              void navigator.clipboard
                .writeText(window.location.href)
                .then(() => toast.success("Question link copied."))
                .catch((copyError: unknown) => {
                  console.error("Failed to copy question link:", copyError);
                  toast.error("Could not copy question link.");
                });
            }}
          />
          <QuestionContent
            question={currentQuestion}
            currentIndex={navigation.currentIndex}
            totalQuestions={totalQuestions}
            selectedAnswer={navigation.selectedAnswer}
            hoveredQuestionId={hoveredQuestionId}
            onAnswerClick={handleAnswerClick}
            onNext={handleNext}
            onPrevious={navigation.goToPrevious}
            onQuestionHover={setHoveredQuestionId}
            onFinish={onBack}
            canGoNext={navigation.canGoNext}
            canGoPrevious={navigation.canGoPrevious}
            isLastQuestion={navigation.isLastQuestion}
            assignedTo={collaboration.assignedTo}
            onAssign={collaboration.assignQuestion}
            onUnassign={collaboration.unassignQuestion}
          />
        </div>
        {isCommentOpen && (
          <CommentPanel
            comments={collaboration.comments}
            onAddComment={collaboration.addComment}
            onDeleteComment={collaboration.deleteComment}
            onClose={() => setIsCommentOpen(false)}
          />
        )}
        {isAssistantOpen && (
          <AiAssistantPanel
            question={currentQuestion}
            onClose={() => setIsAssistantOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
