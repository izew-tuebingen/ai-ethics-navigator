import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalAnswerRepository } from "./LocalAnswerRepository";
import { LocalQuestionCollaborationRepository } from "./LocalQuestionCollaborationRepository";
import { LocalTeamRepository } from "./LocalTeamRepository";

describe("local repositories", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the existing framework-scoped local answer storage", async () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    });

    const repository = new LocalAnswerRepository();
    await repository.saveAnswer(
      "Transparency",
      "vde_spec_90012",
      "T1-Q1",
      "A",
    );

    expect(await repository.getAnswers("Transparency", "vde_spec_90012")).toEqual({
      "T1-Q1": "A",
    });

    await repository.saveAnswer(
      "Transparency",
      "vde_spec_90012",
      "T1-Q1",
      null,
    );
    expect(await repository.getAnswers("Transparency", "vde_spec_90012")).toEqual(
      {},
    );
  });

  it("keeps local comments and assignments isolated by question", async () => {
    const repository = new LocalQuestionCollaborationRepository();
    await repository.setAssignment("question-1", "Alex Morgan");
    const comment = await repository.addComment(
      "question-1",
      "Alex Morgan",
      "Review the evidence.",
    );

    expect(await repository.getAssignment("question-1")).toBe("Alex Morgan");
    expect(await repository.getAssignment("question-2")).toBeNull();
    expect(await repository.getComments("question-1")).toEqual([comment]);
    expect(await repository.getComments("question-2")).toEqual([]);

    await repository.deleteComment("question-1", comment.id);
    await repository.setAssignment("question-1", null);
    expect(await repository.getComments("question-1")).toEqual([]);
    expect(await repository.getAssignment("question-1")).toBeNull();
  });

  it("manages demo team members behind a repository interface", async () => {
    const repository = new LocalTeamRepository();
    const member = await repository.addMember("new.member@example.org");
    expect(member.name).toBe("New Member");

    await repository.updateMemberRole(member.id, "viewer");
    expect(
      (await repository.getMembers()).find((current) => current.id === member.id)
        ?.role,
    ).toBe("viewer");

    await repository.removeMember(member.id);
    expect(
      (await repository.getMembers()).some((current) => current.id === member.id),
    ).toBe(false);
  });
});
