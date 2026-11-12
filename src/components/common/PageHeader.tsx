import { Link } from "react-router-dom";
import { DEMO_CURRENT_USER_NAME } from "@/demo/teamDemoData";
import { useAiAssist } from "@/contexts/AiAssistContext";
import { Logo } from "./Logo";

export function PageHeader() {
  const { isAiAssistEnabled, toggleAiAssist } = useAiAssist();
  const initials = DEMO_CURRENT_USER_NAME.split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-card border-b border-border/60 px-4 md:px-6 py-1.5 md:py-2 flex items-center justify-between shrink-0 h-11 md:h-12">
      <div className="flex items-center gap-2 md:gap-3">
        <Link to="/" className="hover:opacity-90 transition-opacity flex items-center">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-2.5 md:gap-4">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs">
            AI Assist
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isAiAssistEnabled}
            aria-label="AI Assist"
            onClick={toggleAiAssist}
            className={`relative inline-flex h-[18px] w-8 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#020051] focus-visible:ring-offset-2 md:h-5 md:w-9 ${
              isAiAssistEnabled ? "bg-[#020051]" : "bg-gray-300"
            }`}
            title={isAiAssistEnabled ? "Disable AI Assist" : "Enable AI Assist"}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform md:h-4 md:w-4 ${
                isAiAssistEnabled
                  ? "translate-x-[17px] md:translate-x-[18px]"
                  : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-[#020051] text-white shadow-xs md:h-8 md:w-8"
          title={DEMO_CURRENT_USER_NAME}
          aria-label={`User: ${DEMO_CURRENT_USER_NAME}`}
        >
          <span className="text-[11px] font-semibold md:text-xs">{initials}</span>
        </div>
      </div>
    </div>
  );
}
