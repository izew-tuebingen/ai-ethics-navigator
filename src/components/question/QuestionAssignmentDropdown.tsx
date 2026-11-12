import { useEffect, useRef, useState } from "react";
import { ChevronDown, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { useRepositories } from "@/contexts/RepositoryContext";
import { DEMO_CURRENT_USER_NAME } from "@/demo/teamDemoData";

export function QuestionAssignmentDropdown({
  assignedTo,
  onAssign,
  onUnassign,
}: {
  assignedTo: string | null;
  onAssign: (name: string) => void;
  onUnassign: () => void;
}) {
  const { team: teamRepository } = useRepositories();
  const [isOpen, setIsOpen] = useState(false);
  const [teammateNames, setTeammateNames] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    teamRepository
      .getMembers()
      .then((members) => {
        if (active) setTeammateNames(members.map((member) => member.name));
      })
      .catch((error: unknown) => {
        console.error("Failed to load demo teammates:", error);
        toast.error("Could not load teammates for assignment.");
      });
    return () => {
      active = false;
    };
  }, [teamRepository]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  const handleAssign = (name: string) => {
    onAssign(name);
    setIsOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      {assignedTo ? (
        <div className="flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1">
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            className="flex items-center gap-2 text-[11px] font-semibold text-sky-800"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-700 text-[9px] text-white">
              {assignedTo.charAt(0)}
            </span>
            {assignedTo === DEMO_CURRENT_USER_NAME
              ? "Assigned to you"
              : assignedTo}
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onUnassign}
            aria-label="Unassign question"
            className="rounded-full p-1 text-sky-700 hover:bg-sky-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600 shadow-sm transition-colors hover:border-primary hover:text-primary"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Assign
          <ChevronDown className="h-3 w-3" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 text-left shadow-xl">
          <p className="border-b border-gray-100 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Assign question · demo
          </p>
          {teammateNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleAssign(name)}
              className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              {name === DEMO_CURRENT_USER_NAME ? `${name} (you)` : name}
            </button>
          ))}
          {assignedTo && (
            <button
              type="button"
              onClick={() => {
                onUnassign();
                setIsOpen(false);
              }}
              className="block w-full border-t border-gray-100 px-3 pt-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Unassign
            </button>
          )}
        </div>
      )}
    </div>
  );
}
