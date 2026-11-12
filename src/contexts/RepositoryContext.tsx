import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { IRepositories } from "@/domain/repositories/IRepositories";
import { DemoAssistantService } from "@/infrastructure/demo/DemoAssistantService";
import { LocalAnswerRepository } from "@/infrastructure/local/LocalAnswerRepository";
import { LocalQuestionCollaborationRepository } from "@/infrastructure/local/LocalQuestionCollaborationRepository";
import { LocalTeamRepository } from "@/infrastructure/local/LocalTeamRepository";

const RepositoryContext = createContext<IRepositories | null>(null);

const localRepositories: IRepositories = {
  answer: new LocalAnswerRepository(),
  collaboration: new LocalQuestionCollaborationRepository(),
  team: new LocalTeamRepository(),
  assistant: new DemoAssistantService(),
};

export function RepositoryProvider({
  children,
  repositories,
}: {
  children: ReactNode;
  repositories?: IRepositories;
}) {
  const configuredRepositories = useMemo(
    () => repositories ?? localRepositories,
    [repositories],
  );

  return (
    <RepositoryContext.Provider value={configuredRepositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepositories(): IRepositories {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepositories must be used within a RepositoryProvider");
  }
  return context;
}
