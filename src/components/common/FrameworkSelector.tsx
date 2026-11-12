import { useFramework } from "@/contexts/FrameworkContext";
import { useState } from "react";

export function FrameworkSelector() {
  const { selectedFrameworkId, selectedFrameworkName } = useFramework();
  const [frameworkId, setFrameworkId] = useState(selectedFrameworkId);

  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-left">
      <div className="relative">
        <select
          id="framework-selector"
          aria-label="Assessment framework"
          value={frameworkId}
          onChange={(event) => setFrameworkId(event.target.value)}
          className="w-full appearance-none h-11 pl-4 pr-10 rounded-xl border border-[#020051] bg-white/80 backdrop-blur-sm text-sm font-medium text-[#020051] focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer hover:border-[#020051]/30 hover:shadow-md"
        >
          <option value={selectedFrameworkId}>{selectedFrameworkName}</option>
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#020051]/50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
