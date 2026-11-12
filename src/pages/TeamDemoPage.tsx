import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Copy, Shield, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/Button";
import { PageFooter } from "@/components/common/PageFooter";
import { PageHeader } from "@/components/common/PageHeader";
import {
  DEMO_ADMIN_ROLE,
  DEMO_ASSIGNABLE_MEMBER_ROLES,
  DEMO_TEAM,
  isDemoMemberRole,
  type DemoMember,
  type DemoMemberRole,
} from "@/demo/teamDemoData";
import { useRepositories } from "@/contexts/RepositoryContext";

export function TeamDemoPage({ onHomeClick }: { onHomeClick: () => void }) {
  const { team: teamRepository } = useRepositories();
  const [members, setMembers] = useState<DemoMember[]>([]);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    teamRepository
      .getMembers()
      .then((teamMembers) => {
        if (active) setMembers(teamMembers);
      })
      .catch((error: unknown) => {
        console.error("Failed to load demo team members:", error);
        toast.error("Could not load team members.");
      });
    return () => {
      active = false;
    };
  }, [teamRepository]);

  const addDemoMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const member = await teamRepository.addMember(email);
      setMembers((current) => [...current, member]);
      setEmail("");
    } catch (error) {
      console.error("Failed to add demo team member:", error);
      toast.error("Could not add team member.");
    }
  };

  const updateRole = async (memberId: number, role: DemoMemberRole) => {
    try {
      await teamRepository.updateMemberRole(memberId, role);
      setMembers((current) =>
        current.map((member) =>
          member.id === memberId ? { ...member, role } : member,
        ),
      );
    } catch (error) {
      console.error("Failed to update demo team member role:", error);
      toast.error("Could not update team member role.");
    }
  };

  const removeMember = async (memberId: number) => {
    try {
      await teamRepository.removeMember(memberId);
      setMembers((current) => current.filter((member) => member.id !== memberId));
    } catch (error) {
      console.error("Failed to remove demo team member:", error);
      toast.error("Could not remove team member.");
    }
  };

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_TEAM.inviteCode);
      setCopied(true);
      toast.success("Demo invite code copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy demo invite code:", error);
      toast.error("Could not copy the invite code.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <PageHeader />
      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="relative z-10 mx-auto max-w-4xl">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Button
              variant="secondary"
              size="small"
              onClick={onHomeClick}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Home
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
                <Users className="h-6 w-6 text-[#020051]" />
              </div>
              <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                Team Management
              </h1>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                Demo
              </span>
            </div>
          </header>

          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            This is a demo workspace. Changes are temporary and are not saved.
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                Current team
              </h2>
              <h3 className="mb-2 text-xl font-bold">{DEMO_TEAM.name}</h3>
              <p className="mb-6 text-sm text-gray-500">
                Collaborate on your team’s ethical AI assessment.
              </p>

              <div className="border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold text-gray-500">
                  Demo invite code
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <code className="flex-1 font-mono font-bold text-[#020051]">
                    {DEMO_TEAM.inviteCode}
                  </code>
                  <button
                    type="button"
                    onClick={copyInviteCode}
                    className="text-gray-500 transition-colors hover:text-gray-900"
                    aria-label="Copy demo invite code"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-[10px] italic text-gray-400">
                  This code is for display only.
                </p>
              </div>

              <form onSubmit={addDemoMember} className="mt-6 border-t border-gray-100 pt-5">
                <label
                  htmlFor="demo-member-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Add a demo member
                </label>
                <input
                  id="demo-member-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teammate@example.org"
                  className="mb-3 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:border-[#020051] focus:outline-none focus:ring-2 focus:ring-[#020051]/10"
                />
                <Button type="submit" className="w-full">
                  Add to demo
                </Button>
              </form>
            </section>

            <section className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#020051]/10 bg-[#020051]/5">
                  <Users className="h-6 w-6 text-[#020051]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {DEMO_TEAM.name} ({members.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Manage members and roles
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 font-bold text-gray-600">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {member.name}
                          </span>
                          {member.id === 1 && (
                            <span className="rounded-md border border-[#020051]/20 bg-[#020051]/10 px-2 py-0.5 text-[10px] font-bold text-[#020051]">
                              You
                            </span>
                          )}
                        </div>
                        <div className="truncate text-xs text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {member.role === DEMO_ADMIN_ROLE ? (
                        <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Admin</span>
                        </div>
                      ) : (
                        <>
                          <label
                            className="sr-only"
                            htmlFor={`role-${member.id}`}
                          >
                            Role for {member.name}
                          </label>
                          <select
                            id={`role-${member.id}`}
                            value={member.role}
                            onChange={(event) => {
                              if (isDemoMemberRole(event.target.value)) {
                                updateRole(member.id, event.target.value);
                              }
                            }}
                            className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#020051]/20"
                          >
                            {DEMO_ASSIGNABLE_MEMBER_ROLES.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeMember(member.id)}
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                            aria-label={`Remove ${member.name} from demo team`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-500">
                    No members in this demo team.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
