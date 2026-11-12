import { useRepositories } from "@/contexts/RepositoryContext";
import { DEMO_CURRENT_USER_NAME } from "@/demo/teamDemoData";
import type { QuestionComment } from "@/domain/models/collaboration";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useDemoQuestionCollaboration(questionId: string) {
  const { collaboration } = useRepositories();
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [comments, setComments] = useState<QuestionComment[]>([]);
  const isAssignedToMe = assignedTo === DEMO_CURRENT_USER_NAME;

  useEffect(() => {
    let active = true;
    setAssignedTo(null);
    setComments([]);
    if (!questionId) return;

    Promise.all([
      collaboration.getAssignment(questionId),
      collaboration.getComments(questionId),
    ])
      .then(([assignee, questionComments]) => {
        if (!active) return;
        setAssignedTo(assignee);
        setComments(questionComments);
      })
      .catch((error: unknown) => {
        console.error("Failed to load question collaboration data:", error);
        if (active) {
          toast.error("Could not load question collaboration data.");
        }
      });

    return () => {
      active = false;
    };
  }, [collaboration, questionId]);

  const assignQuestion = async (name: string) => {
    try {
      await collaboration.setAssignment(questionId, name);
      setAssignedTo(name);
      toast.success(
        name === DEMO_CURRENT_USER_NAME
          ? "Assigned to you."
          : `Assigned to ${name}.`,
      );
    } catch (error) {
      console.error("Failed to assign question:", error);
      toast.error("Could not assign this question.");
    }
  };

  const unassignQuestion = async () => {
    try {
      await collaboration.setAssignment(questionId, null);
      setAssignedTo(null);
      toast.success("Question unassigned.");
    } catch (error) {
      console.error("Failed to unassign question:", error);
      toast.error("Could not unassign this question.");
    }
  };

  const addComment = async (text: string) => {
    try {
      const comment = await collaboration.addComment(
        questionId,
        DEMO_CURRENT_USER_NAME,
        text,
      );
      setComments((current) => [...current, comment]);
      toast.success("Comment added.");
    } catch (error) {
      console.error("Failed to add question comment:", error);
      toast.error("Could not add comment.");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await collaboration.deleteComment(questionId, commentId);
      setComments((current) =>
        current.filter((comment) => comment.id !== commentId),
      );
    } catch (error) {
      console.error("Failed to delete question comment:", error);
      toast.error("Could not delete comment.");
    }
  };

  return {
    assignedTo,
    comments,
    isAssignedToMe,
    assignQuestion,
    unassignQuestion,
    addComment,
    deleteComment,
  };
}
