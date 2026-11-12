import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import type { QuestionComment } from "@/domain/models/collaboration";

export function CommentPanel({
  comments,
  onAddComment,
  onDeleteComment,
  onClose,
}: {
  comments: QuestionComment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (id: string) => void;
  onClose: () => void;
}) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newComment.trim();
    if (!text) return;
    onAddComment(text);
    setNewComment("");
  };

  return (
    <div
      aria-label="Comments demo panel"
      className="w-[400px] bg-white border-l border-[#e0e0e0] flex flex-col h-full shadow-2xl relative z-40 shrink-0"
    >
      <div className="border-b border-[#e0e0e0] p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[24px]">💬</span>
          <h3 className="font-semibold text-[18px] text-[#333333]">Comments</h3>
          <span className="bg-[#e0e0e0] rounded-full w-[24px] h-[24px] flex items-center justify-center">
            <span className="text-[12px] text-[#666666]">
              {comments.length}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close comments"
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

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-60">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <span className="text-3xl text-gray-300">💬</span>
            </div>
            <p className="text-sm font-medium">No comments yet</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="bg-[#020051] text-white rounded-full size-[32px] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="font-medium text-[12px]">
                    {comment.author
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-[14px] text-[#333333]">
                      {comment.author}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment.id)}
                      aria-label="Delete demo comment"
                      title="Delete comment"
                      className="rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[14px] text-[#555555] leading-[20px] mb-2">
                    {comment.text}
                  </p>
                  <span className="text-[11px] text-[#999999] uppercase tracking-wider font-medium">
                    {formatCommentDate(comment.createdAtIso)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleAddComment}
        className="border-t border-[#e0e0e0] p-6 bg-gray-50/50"
      >
        <div className="space-y-3">
          <textarea
            aria-label="Write a comment"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Add a comment..."
            className="w-full border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans text-[14px] text-[#333333] shadow-inner bg-white"
            rows={3}
            maxLength={1000}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setNewComment("")}
              className="bg-white border border-gray-200 rounded-lg h-9 px-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-[14px] text-[#666666]">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`rounded-lg h-9 px-5 flex items-center justify-center cursor-pointer transition-all shadow-sm ${
                newComment.trim()
                  ? "bg-[#020051] text-white hover:bg-[#030068] active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed border-none"
              }`}
            >
              <span className="font-semibold text-[14px]">Post Comment</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function formatCommentDate(createdAtIso: string): string {
  const createdAt = new Date(createdAtIso);
  if (Date.now() - createdAt.getTime() < 60_000) return "Just now";
  return createdAt.toLocaleString();
}
