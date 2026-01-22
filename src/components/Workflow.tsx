import { useState, useEffect } from "react";
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
  "create api endpoint",
  "evaluate tests",
  "add monitoring",
  "refactor utils",
  "chore: edit docs",
  "bug: /auth/me",
  "vuln: update deps",
  "add rate limiting",
  "fix webhook handler",
  "update schema",
];

// Status tags based on column position and progress
const getStatusTag = (column: number, isReady: boolean): { tag: string; tagColor: string } => {
  switch (column) {
    case 0: return { tag: "backlog", tagColor: "bg-gray-500" };
    case 1: return isReady 
      ? { tag: "research_ready", tagColor: "bg-blue-400" }
      : { tag: "researching", tagColor: "bg-blue-600" };
    case 2: return isReady 
      ? { tag: "plan_ready", tagColor: "bg-purple-400" }
      : { tag: "planning", tagColor: "bg-purple-600" };
    case 3: return { tag: "implementing", tagColor: "bg-orange-500" };
    case 4: return { tag: "ready to merge", tagColor: "bg-yellow-500" };
    case 5: return { tag: "merged", tagColor: "bg-green-600" };
    default: return { tag: "backlog", tagColor: "bg-gray-500" };
  }
};

const contentLines = [
  "Move issues through your GitHub Project kanban.",
  "Discuss and refine context by commenting on the Issue during Research and Plan.",
  "When an Issue moves to Implement, kiln triggers Claude to generate the pull request.",
  "Or—skip straight from Backlog → Implement (\"yolo\") and let kiln handle the full flow.",
  "kiln continuously watches the board and orchestrates Claude across each phase.",
];

interface Issue {
  id: number;
  title: string;
  column: number;
  isReady: boolean; // For research/plan columns - toggles between working and ready
  isYolo?: boolean;
}

// Initialize with fixed 10 tickets
const initialIssues: Issue[] = [
  { id: 1, title: ticketTitles[0], column: 0, isReady: false },
  { id: 2, title: ticketTitles[1], column: 0, isReady: false },
  { id: 3, title: ticketTitles[2], column: 0, isReady: false },
  { id: 4, title: ticketTitles[3], column: 0, isReady: false },
  { id: 5, title: ticketTitles[4], column: 1, isReady: false },
  { id: 6, title: ticketTitles[5], column: 1, isReady: false },
  { id: 7, title: ticketTitles[6], column: 2, isReady: false },
  { id: 8, title: ticketTitles[7], column: 2, isReady: false },
  { id: 9, title: ticketTitles[8], column: 3, isReady: false },
  { id: 10, title: ticketTitles[9], column: 3, isReady: false },
];

export function Workflow() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

  useEffect(() => {
    const interval = setInterval(() => {
      setIssues((prev) => {
        const newIssues = [...prev];
        
        // Find issues not in done
        const movableIssues = newIssues.filter(i => i.column < 5);
        if (movableIssues.length === 0) {
          // Reset when all done
          return initialIssues.map((issue, idx) => ({ ...issue, id: Date.now() + idx }));
        }
        
        // Randomly select one to progress
        const toMove = movableIssues[Math.floor(Math.random() * movableIssues.length)];
        const issueIndex = newIssues.findIndex(i => i.id === toMove.id);
        
        // Research and Plan columns have two stages: working → ready → next column
        if ((toMove.column === 1 || toMove.column === 2) && !toMove.isReady) {
          // Toggle to ready state
          newIssues[issueIndex] = { ...toMove, isReady: true };
        } else if (toMove.column === 0 && Math.random() > 0.8) {
          // Yolo jump from backlog to implement
          newIssues[issueIndex] = { ...toMove, column: 3, isYolo: true, isReady: false };
        } else {
          // Move to next column
          const newColumn = toMove.column + 1;
          newIssues[issueIndex] = { 
            ...toMove, 
            column: newColumn, 
            isReady: false,
            isYolo: toMove.isYolo && newColumn <= 5,
          };
        }
        
        return newIssues;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

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

            {/* Kanban Lanes */}
            <div className="grid grid-cols-6 gap-2 min-h-[140px]">
              {columns.map((col, colIndex) => (
                <div
                  key={col.id}
                  className="bg-background/40 rounded-lg p-2 border border-border/50 min-h-[120px]"
                >
                  <div className="space-y-2">
                    {issues
                      .filter((issue) => issue.column === colIndex)
                      .map((issue) => {
                        const status = getStatusTag(issue.column, issue.isReady);
                        return (
                          <div
                            key={issue.id}
                            className={`
                              bg-card border border-border rounded-md p-2 text-xs
                              shadow-sm transition-all duration-500 ease-out
                              ${issue.isYolo ? "ring-2 ring-kiln-glow animate-pulse" : ""}
                            `}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium text-white ${status.tagColor}`}>
                                {status.tag}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {issue.column === 4 && (
                                <GitPullRequest className="w-3 h-3 text-green-500 flex-shrink-0" />
                              )}
                              {issue.column === 5 && (
                                <GitMerge className="w-3 h-3 text-purple-500 flex-shrink-0" />
                              )}
                              <span className="truncate">{issue.title}</span>
                            </div>
                            {issue.isYolo && issue.column < 5 && (
                              <span className="text-[10px] text-kiln-glow font-semibold mt-1 block">
                                yolo →
                              </span>
                            )}
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
        <div className="max-w-2xl mx-auto bg-card/80 border border-border rounded-xl p-6 space-y-3">
          {contentLines.map((line, index) => (
            <p key={index} className="text-foreground/90">
              {line.includes("yolo") ? (
                <>
                  {line.split('"yolo"')[0]}
                  <span className="text-kiln-glow font-semibold">"yolo"</span>
                  {line.split('"yolo"')[1]}
                </>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
