import { useState } from "react";
import { useAiAssist } from "@/contexts/AiAssistContext";
import { useRepositories } from "@/contexts/RepositoryContext";
import {
  ASSISTANT_DEMO_ACTIONS,
  type AssistantAction,
} from "@/demo/assistantDemo";
import { useResizableDrawer } from "@/hooks/useResizableDrawer";
import type { Question } from "@/types";

type MessageType = "user" | "assistant" | "system";

interface Message {
  type: MessageType;
  text: string;
}

export function AiAssistantPanel({
  question,
  onClose,
}: {
  question: Question;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width, handleMouseDown } = useResizableDrawer();
  const { assistant } = useRepositories();
  const { isAiAssistEnabled, toggleAiAssist } = useAiAssist();
  const showActionButtons = messages.length === 0;

  const handleActionClick = async (action: AssistantAction) => {
    const actionLabel =
      ASSISTANT_DEMO_ACTIONS.find((button) => button.id === action)?.label ??
      action;
    setError(null);
    setIsLoading(true);
    setMessages([{ type: "system", text: `Requesting: ${actionLabel}...` }]);
    try {
      const response = await assistant.getResponse(action, question);
      setMessages([
        { type: "system", text: `Requesting: ${actionLabel}...` },
        { type: "assistant", text: response },
      ]);
    } catch (requestError) {
      console.error("AI assistant request failed:", requestError);
      setError("The assistant could not complete this request. Please try again.");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!question) return null;

  return (
    <div
      style={{ width: `${width}px` }}
      className="bg-white border-l border-[#e0e0e0] flex flex-col h-full shadow-2xl relative z-40 shrink-0"
      aria-label="AI Assistant demo panel"
    >
      <div
        onMouseDown={handleMouseDown}
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-500/20 active:bg-blue-500/40 transition-colors z-50 -ml-[1px]"
      />

      <div className="border-b border-[#e0e0e0] p-6 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-[18px] text-[#333333]">
            AI Assistant
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI Assistant"
          className="text-[#666666] hover:text-[#333333] transition-colors p-1 rounded-md hover:bg-gray-100"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex min-h-0 flex-col gap-6 p-6">
        {!isAiAssistEnabled ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="mb-2 text-[14px] text-[#555555]">
              AI Assist is turned off.
            </p>
            <p className="mb-6 text-[13px] text-[#666666]">
              Enable AI Assist to access contextual help and examples.
            </p>
            <button
              type="button"
              onClick={toggleAiAssist}
              className="rounded-md bg-[#020051] px-4 py-2 text-sm text-white"
            >
              Enable AI Assist
            </button>
          </div>
        ) : (
          <>
            <div className="mb-0">
              <p className="text-[14px] text-[#555555] leading-[22px]">
                {showActionButtons
                  ? "Need help? Select one of the options:"
                  : "Demo response for the current question"}
              </p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            {messages.length > 0 && (
              <div className="flex-1 min-h-0 w-full overflow-auto mb-6 space-y-4 scroll-smooth">
                {messages.map((message, index) => (
                  <div key={`${message.type}-${index}`}>
                    {message.type === "system" ? (
                      <p className="text-[12px] text-[#999999] italic px-2">
                        {message.text}
                      </p>
                    ) : (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="font-['Inter:Regular',sans-serif] text-[14px] text-[#333333] leading-[20px] max-w-none break-words [overflow-wrap:anywhere]">
                          {message.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {showActionButtons ? (
                ASSISTANT_DEMO_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleActionClick(action.id)}
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className="bg-white rounded-[16px] w-full cursor-pointer hover:bg-gray-50 transition-colors text-left border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="min-w-[36px] min-h-[36px] rounded-full bg-[#f3f4f6] text-center text-[16px] leading-[36px]">
                        {action.icon}
                      </div>
                      <div className="flex flex-col flex-1 gap-0.5">
                        <p className="font-semibold text-[14px] text-[#111111] leading-[18px]">
                          {action.label}
                        </p>
                        <p className="text-[13px] text-[#666666] leading-[18px]">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="bg-white rounded-[16px] w-full cursor-pointer hover:bg-gray-50 transition-colors text-left px-4 py-3 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center font-semibold text-[13px] text-[#111111] leading-[18px]">
                    ← Back to options
                  </div>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
