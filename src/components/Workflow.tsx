import { useState, useEffect, useCallback } from "react";
import { GitPullRequest, GitMerge } from "lucide-react";

const columns = [
  { id: "backlog", name: "Backlog", color: "bg-gray-400", description: "new issues" },
  { id: "research", name: "Research", color: "bg-blue-500", description: "codebase exploration" },
  { id: "plan", name: "Plan", color: "bg-purple-500", description: "design tasks" },
  { id: "implement", name: "Implement", color: "bg-orange-500", description: "write code" },
  { id: "validate", name: "Validate", color: "bg-yellow-500", description: "human review" },
  { id: "done", name: "Done", color: "bg-green-500", description: "complete" },
];

const ticketTitles = [
  "refactor daemon modules",
  "improve initial setup UX",
  "assess test coverage",
  "add webhook handler",
];

// Status tags based on column and state
type StatusTag = { tag: string; tagColor: string };

const getStatusTags = (column: number, isReady: boolean, isEditing: boolean, isYolo: boolean, isYoloComplete: boolean): StatusTag[] => {
  const tags: StatusTag[] = [];
  
  if (isEditing) {
    tags.push({ tag: "editing", tagColor: "bg-gray-600" });
  }
  
  if (isYolo && !isYoloComplete) {
    tags.push({ tag: "yolo", tagColor: "bg-yellow-500" });
  }
  
  switch (column) {
    case 0: 
      tags.push({ tag: "backlog", tagColor: "bg-gray-500" });
      break;
    case 1: 
      tags.push(isReady 
        ? { tag: "research_ready", tagColor: "bg-green-500" }
        : { tag: "researching", tagColor: "bg-blue-500" });
      break;
    case 2: 
      tags.push(isReady 
        ? { tag: "plan_ready", tagColor: "bg-green-500" }
        : { tag: "planning", tagColor: "bg-purple-500" });
      break;
    case 3: 
      tags.push({ tag: "implementing", tagColor: "bg-orange-500" });
      break;
    case 4: 
      tags.push({ tag: "ready to merge", tagColor: "bg-yellow-500" });
      break;
    case 5: 
      tags.push({ tag: "merged", tagColor: "bg-green-600" });
      break;
  }
  
  return tags;
};

// No longer used - content is now structured differently

interface Issue {
  id: number;
  title: string;
  column: number;
  isReady: boolean;
  isEditing: boolean;
  isYolo: boolean;
  isYoloComplete: boolean;
}

const createInitialIssues = (): Issue[] => [
  { id: 1, title: ticketTitles[0], column: 0, isReady: false, isEditing: false, isYolo: false, isYoloComplete: false },
  { id: 2, title: ticketTitles[1], column: 0, isReady: false, isEditing: false, isYolo: false, isYoloComplete: false },
  { id: 3, title: ticketTitles[2], column: 1, isReady: false, isEditing: false, isYolo: false, isYoloComplete: false },
  { id: 4, title: ticketTitles[3], column: 1, isReady: false, isEditing: false, isYolo: false, isYoloComplete: false },
];

// Scripted animation sequence - never more than 2 in any column
const animationScript = [
  // Ticket 3: researching → editing
  { ticketId: 3, action: "edit" },
  // Ticket 3: editing done → research_ready
  { ticketId: 3, action: "ready" },
  // Move ticket 3 to plan
  { ticketId: 3, action: "move", column: 2 },
  // Ticket 4: researching → editing  
  { ticketId: 4, action: "edit" },
  // Ticket 4: research_ready (stays here)
  { ticketId: 4, action: "ready" },
  // Ticket 3: planning → editing
  { ticketId: 3, action: "edit" },
  // Ticket 3: plan_ready
  { ticketId: 3, action: "ready" },
  // Move ticket 3 to implement (stays here as "implementing")
  { ticketId: 3, action: "move", column: 3 },
  // Move ticket 1 to research
  { ticketId: 1, action: "move", column: 1 },
  // Ticket 1: researching → editing
  { ticketId: 1, action: "edit" },
  // Ticket 1: research_ready
  { ticketId: 1, action: "ready" },
  // Move ticket 1 to plan
  { ticketId: 1, action: "move", column: 2 },
  // YOLO: Ticket 2 starts yolo journey
  { ticketId: 2, action: "yolo" },
  // Ticket 1: planning
  { ticketId: 1, action: "edit" },
  // Yolo ticket 2 to research
  { ticketId: 2, action: "move", column: 1 },
  // Ticket 1: plan_ready
  { ticketId: 1, action: "ready" },
  // Yolo ticket 2 to plan
  { ticketId: 2, action: "move", column: 2 },
  // Move ticket 1 to implement
  { ticketId: 1, action: "move", column: 3 },
  // Yolo ticket 2 to implement
  { ticketId: 2, action: "move", column: 3 },
  // Ticket 1 to validate
  { ticketId: 1, action: "move", column: 4 },
  // Yolo ticket 2 to validate (stops blinking)
  { ticketId: 2, action: "yolo_complete" },
  { ticketId: 2, action: "move", column: 4 },
  // Ticket 1 to done
  { ticketId: 1, action: "move", column: 5 },
  // Ticket 2 to done
  { ticketId: 2, action: "move", column: 5 },
];

export function Workflow() {
  const [issues, setIssues] = useState<Issue[]>(createInitialIssues());
  const [step, setStep] = useState(0);

  const applyStep = useCallback((issues: Issue[], scriptStep: typeof animationScript[0]): Issue[] => {
    return issues.map(issue => {
      if (issue.id !== scriptStep.ticketId) return issue;
      
      switch (scriptStep.action) {
        case "move":
          return { ...issue, column: scriptStep.column!, isReady: false, isEditing: false };
        case "edit":
          return { ...issue, isEditing: true };
        case "ready":
          return { ...issue, isReady: true, isEditing: false };
        case "yolo":
          return { ...issue, isYolo: true };
        case "yolo_complete":
          return { ...issue, isYoloComplete: true };
        default:
          return issue;
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= animationScript.length) {
          // Reset after completing the sequence
          setIssues(createInitialIssues());
          return 0;
        }
        setIssues(issues => applyStep(issues, animationScript[nextStep]));
        return nextStep;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [applyStep]);

  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How It <span className="text-gradient-fire">Works</span>
          </h2>
        </div>

        {/* Animated Kanban Board */}
        <div className="max-w-6xl mx-auto mb-12 overflow-x-auto">
          <div className="bg-card/60 border border-border rounded-xl p-4 min-w-[800px]">
            {/* Column Headers */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              {columns.map((col) => (
                <div key={col.id} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`w-3 h-3 rounded-full ${col.color}`} />
                    <span className="font-semibold text-sm">{col.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">{col.description}</p>
                </div>
              ))}
            </div>

            {/* Kanban Lanes - Fixed height for 2 tickets */}
            <div className="grid grid-cols-6 gap-2 h-[160px]">
              {columns.map((col, colIndex) => (
                <div
                  key={col.id}
                  className="bg-background/40 rounded-lg p-2 border border-border/50 h-full overflow-hidden"
                >
                  <div className="space-y-2">
                    {issues
                      .filter((issue) => issue.column === colIndex)
                      .map((issue) => {
                        const tags = getStatusTags(issue.column, issue.isReady, issue.isEditing, issue.isYolo, issue.isYoloComplete);
                        return (
                          <div
                            key={issue.id}
                            className={`
                              bg-card border border-border rounded-md p-2 text-xs
                              shadow-sm transition-all duration-500 ease-out
                              ${issue.isYolo && !issue.isYoloComplete ? "ring-2 ring-kiln-glow animate-pulse" : ""}
                            `}
                          >
                            <div className="flex flex-wrap items-center gap-1 mb-1.5">
                              {tags.map((status, idx) => (
                                <span 
                                  key={idx}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-medium text-white ${status.tagColor}`}
                                >
                                  {status.tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5">
                              {issue.column === 3 && (
                                <GitMerge className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              )}
                              {issue.column === 4 && (
                                <GitPullRequest className="w-3 h-3 text-green-500 flex-shrink-0" />
                              )}
                              {issue.column === 5 && (
                                <GitMerge className="w-3 h-3 text-purple-500 flex-shrink-0" />
                              )}
                              <span className="truncate">{issue.title}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Description */}
        <div className="max-w-3xl mx-auto bg-card/80 border border-border rounded-xl p-8 space-y-6">
          <div className="space-y-4">
            <p className="text-lg text-foreground/90">
              Move issues through your GitHub Project board.
            </p>
            <p className="text-foreground/80">
              When an issue transitions between columns, kiln automatically runs Claude to handle that phase of work.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-foreground/90 font-medium">Step-by-step:</p>
            <ol className="list-decimal list-inside space-y-2 text-foreground/80 ml-2">
              <li>Create an issue on your GitHub Project kanban.</li>
              <li>
                Move it through columns — kiln picks it up and runs the appropriate phase.
                <br />
                <span className="text-muted-foreground ml-5 text-sm">
                  (or <span className="text-kiln-glow font-semibold">'yolo'</span> it and let kiln carry it from Backlog to Validate autonomously)
                </span>
              </li>
              <li>Review the pull request when it's ready.</li>
            </ol>
          </div>

          <div className="space-y-4">
            <p className="text-foreground/90 font-medium">What happens at each phase:</p>
            <div className="grid gap-3 text-sm">
              <div className="flex gap-3 items-start">
                <span className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-blue-400">Research</span>
                  <p className="text-foreground/70">Claude explores the codebase and writes insights back to the issue.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-purple-400">Plan</span>
                  <p className="text-foreground/70">Claude develops a detailed implementation plan and updates the issue.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-3 h-3 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-orange-400">Implement</span>
                  <p className="text-foreground/70">Claude executes the plan, commits code, and opens a PR.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-yellow-400">Validate</span>
                  <p className="text-foreground/70">Humans review and approve — Claude stays idle here.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-green-400">Done</span>
                  <p className="text-foreground/70">Worktrees and temporary artifacts are cleaned up.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
