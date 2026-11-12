import { afterEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "@/constants/storage";
import { loadValueAnswers, calculateHierarchicalValueScore } from "./scoring";

describe("local publication assessment data", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses a browser-local answer key scoped to the bundled framework", () => {
    expect(STORAGE_KEYS.valueAnswers("Transparency", "framework-v1")).toBe(
      "answers:local_framework-v1_Transparency",
    );
  });

  it("loads previously saved answers from local storage", () => {
    const localStorage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({ "T1-Q1": "A" })),
    };
    vi.stubGlobal("localStorage", localStorage);

    expect(loadValueAnswers("Transparency", "framework-v1")).toEqual({
      "T1-Q1": "A",
    });
    expect(localStorage.getItem).toHaveBeenCalledWith(
      "answers:local_framework-v1_Transparency",
    );
  });

  it("scores only answered indicators and leaves incomplete values ungraded", () => {
    const criteria = [
      { indicators: [{ code: "T1-Q1" }, { code: "T1-Q2" }] },
    ];

    expect(
      calculateHierarchicalValueScore(
        criteria,
        { "T1-Q1": "A", "T1-Q2": "A" },
        2,
      ),
    ).toBe("A");
    expect(
      calculateHierarchicalValueScore(criteria, { "T1-Q1": "A" }, 2),
    ).toBeNull();
  });
});
