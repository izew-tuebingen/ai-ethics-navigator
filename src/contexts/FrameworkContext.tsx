import type { EthicsFramework, ValueIcon, ValueMetadata } from "@/types";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  FRAMEWORK_DISPLAY_NAME,
  LOCAL_ETHICS_FRAMEWORK,
} from "@/constants/framework";

interface FrameworkContextType {
  selectedFrameworkId: string;
  selectedFrameworkName: string;
  framework: EthicsFramework | null;
  values: ValueMetadata[];
  isFrameworkLoaded: boolean;
}

type BundledFramework = Omit<EthicsFramework, "values"> & {
  values: Array<EthicsFramework["values"][number] & Partial<ValueMetadata>>;
  valuesManifest?: Array<Partial<ValueMetadata>>;
};

function getValueIcon(icon: string): ValueIcon {
  switch (icon) {
    case "triangle":
    case "square":
    case "hexagon":
    case "diamond":
    case "circle":
      return icon;
    default:
      return "circle";
  }
}

const FrameworkContext = createContext<FrameworkContextType | undefined>(
  undefined,
);

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const bundledFramework =
    LOCAL_ETHICS_FRAMEWORK as unknown as BundledFramework;
  const framework = LOCAL_ETHICS_FRAMEWORK as unknown as EthicsFramework;
  const manifestByName = useMemo(
    () =>
      new Map(
        (bundledFramework.valuesManifest || []).map((entry) => [
          (entry.name || "").toLowerCase(),
          entry,
        ]),
      ),
    [bundledFramework],
  );
  const values = useMemo<ValueMetadata[]>(
    () => {
      return bundledFramework.values.map((value) => {
        const manifestEntry = manifestByName.get(value.name.toLowerCase());
        const criteria = value.criteria || [];
        return {
          id: value.id || value.name,
          name: value.name || "Unnamed Value",
          icon: getValueIcon(value.icon),
          description: value.description || manifestEntry?.description || "",
          color: value.color || manifestEntry?.color || "#000000",
          bgColor: value.bgColor || manifestEntry?.bgColor || "#ffffff",
          borderColor:
            value.borderColor || manifestEntry?.borderColor || "#cccccc",
          path: value.path || manifestEntry?.path || "",
          criteria,
          total_questions: criteria.reduce(
            (sum, criterion) => sum + (criterion.indicators || []).length,
            0,
          ),
        };
      });
    },
    [bundledFramework, manifestByName],
  );
  const selectedFrameworkId = framework.id || "local-framework";
  const selectedFrameworkName =
    framework.metadata.source || FRAMEWORK_DISPLAY_NAME;

  return (
    <FrameworkContext.Provider
      value={{
        selectedFrameworkId,
        selectedFrameworkName,
        framework,
        values,
        isFrameworkLoaded: true,
      }}
    >
      {children}
    </FrameworkContext.Provider>
  );
}

export function useFramework() {
  const context = useContext(FrameworkContext);
  if (context === undefined) {
    throw new Error("useFramework must be used within a FrameworkProvider");
  }
  return context;
}
