/**
 * QuestionToolbar Component
 * Action buttons for assistant, assign to me, comment, and copy link
 */

import { Button } from "../Button";

interface QuestionToolbarProps {
    isAssistantOpen: boolean;
    isCommentOpen: boolean;
    hasCommentNotification?: boolean;
    isAssistantDisabled?: boolean;
    isAssignedToMe: boolean;
    onToggleAssistant: () => void;
    onToggleComment: () => void;
    onToggleAssignment: () => void;
    onToggleSidebar?: () => void;
    onCopyLink?: () => void;
}

export function QuestionToolbar({
    isAssistantOpen,
    isCommentOpen,
    isAssistantDisabled = false,
    isAssignedToMe,
    onToggleAssistant,
    onToggleComment,
    onToggleAssignment,
    onToggleSidebar,
    onCopyLink,
    hasCommentNotification = false,
}: QuestionToolbarProps) {
    return (
        <div className="p-3 md:p-4 lg:p-6 xl:p-8 flex flex-wrap gap-2 md:gap-3 lg:gap-4 justify-end shrink-0">
            {/* Mobile Menu Toggle */}
            <div className="md:hidden mr-auto">
                <Button
                    variant="ghost"
                    size="small"
                    icon={<span className="text-base">☰</span>}
                    onClick={onToggleSidebar}
                    className="min-w-[40px]"
                >
                    <span className="hidden sm:inline">Menu</span>
                </Button>
            </div>

            <Button
                variant="ghost"
                size="small"
                icon={<span className="text-base md:text-lg lg:text-xl">?</span>}
                isActive={isAssistantOpen}
                disabled={isAssistantDisabled}
                onClick={onToggleAssistant}
                className="min-w-[40px] sm:min-w-fit"
            >
                <span className="hidden sm:inline">Assistant</span>
            </Button>

            <Button
                variant="ghost"
                size="small"
                icon={<span className="text-base md:text-lg">👤</span>}
                isActive={isAssignedToMe}
                className="min-w-[40px] sm:min-w-fit"
                onClick={onToggleAssignment}
                title={isAssignedToMe ? "Unassign from me" : "Assign to me"}
            >
                <span className="hidden sm:inline">
                    {isAssignedToMe ? "Assigned to me" : "Assign to me"}
                </span>
            </Button>

            <Button
                variant="ghost"
                size="small"
                icon={<span className="text-base md:text-lg">💬</span>}
                isActive={isCommentOpen}
                onClick={onToggleComment}
                hasNotification={hasCommentNotification}
                className="min-w-[40px] sm:min-w-fit"
            >
                <span className="hidden sm:inline">Comment</span>
            </Button>

            <Button
                variant="ghost"
                size="small"
                icon={<span className="text-base md:text-lg">📋</span>}
                onClick={onCopyLink}
                className="min-w-[40px] sm:min-w-fit"
            >
                <span className="hidden sm:inline">Copy Link</span>
            </Button>
        </div>
    );
}
