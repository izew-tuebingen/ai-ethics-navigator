import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AiAssistContextValue {
  isAiAssistEnabled: boolean;
  toggleAiAssist: () => void;
}

const AiAssistContext = createContext<AiAssistContextValue | null>(null);

export function AiAssistProvider({ children }: { children: ReactNode }) {
  const [isAiAssistEnabled, setIsAiAssistEnabled] = useState(true);

  const toggleAiAssist = () => {
    setIsAiAssistEnabled((enabled) => !enabled);
  };

  return (
    <AiAssistContext.Provider value={{ isAiAssistEnabled, toggleAiAssist }}>
      {children}
    </AiAssistContext.Provider>
  );
}

export function useAiAssist(): AiAssistContextValue {
  const context = useContext(AiAssistContext);
  if (!context) {
    throw new Error("useAiAssist must be used within an AiAssistProvider");
  }
  return context;
}
