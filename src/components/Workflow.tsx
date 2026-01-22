import { useState, useEffect } from "react";
import { GitPullRequest } from "lucide-react";

const columns = [
  { id: "backlog", name: "Backlog", color: "bg-gray-400", description: "new issues" },
  { id: "research", name: "Research", color: "bg-blue-500", description: "codebase exploration" },
  { id: "plan", name: "Plan", color: "bg-purple-500", description: "design tasks" },
  { id: "implement", name: "Implement", color: "bg-orange-500", description: "write code" },
  { id: "validate", name: "Validate", color: "bg-yellow-500", description: "human review" },
  { id: "done", name: "Done", color: "bg-green-500", description: "complete" },
];

const ticketTitles = [
  { title: "create api endpoint", tag: "feature", tagColor: "bg-blue-500" },
  { title: "evaluate tests", tag: "test", tagColor: "bg-purple-500" },
  { title: "add monitoring", tag: "infra", tagColor: "bg-cyan-500" },
  { title: "refactor utils", tag: "refactor", tagColor: "bg-orange-500" },
  { title: "chore: edit docs", tag: "docs", tagColor: "bg-gray-500" },
  { title: "bug: /auth/me", tag: "bug", tagColor: "bg-red-500" },
  { title: "vuln: update deps", tag: "security", tagColor: "bg-yellow-600" },
  { title: "add rate limiting", tag: "feature", tagColor: "bg-blue-500" },
];

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
  tag: string;
  tagColor: string;
  column: number;
  isYolo?: boolean;
  hasPR?: boolean;
}

const getRandomTicket = () => {
  const ticket = ticketTitles[Math.floor(Math.random() * ticketTitles.length)];
  return {
    id: Date.now() + Math.random(),
    title: ticket.title,
    tag: ticket.tag,
    tagColor: ticket.tagColor,
    column: 0,
  };
};

export function Workflow() {
  const [issues, setIssues] = useState<Issue[]>([
    { ...getRandomTicket(), id: 1, column: 0 },
    { ...getRandomTicket(), id: 2, column: 1 },
    { ...getRandomTicket(), id: 3, column: 2 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIssues((prev) => {
        const newIssues = [...prev];
        
        // Find an issue to move (not in done)
        const movableIssues = newIssues.filter(i => i.column < 5);
        if (movableIssues.length === 0) {
          // Reset when all done
          return [getRandomTicket(), { ...getRandomTicket(), id: Date.now() + 1 }];
        }
        
        // Randomly select one to move forward
        const toMove = movableIssues[Math.floor(Math.random() * movableIssues.length)];
        const issueIndex = newIssues.findIndex(i => i.id === toMove.id);
        
        // Sometimes do a "yolo" jump from backlog to implement
        if (toMove.column === 0 && Math.random() > 0.7) {
          newIssues[issueIndex] = { ...toMove, column: 3, isYolo: true };
        } else {
          // When moving to validate (column 4), add PR icon
          const newColumn = toMove.column + 1;
          const hasPR = newColumn >= 4;
          newIssues[issueIndex] = { 
            ...toMove, 
            column: newColumn, 
            isYolo: toMove.isYolo && newColumn <= 4,
            hasPR 
          };
        }
        
        // Occasionally add a new issue to backlog
        if (Math.random() > 0.6 && newIssues.filter(i => i.column === 0).length < 2) {
          newIssues.push(getRandomTicket());
        }
        
        // Remove completed issues after a delay (keeping max 6 issues)
        if (newIssues.length > 6) {
          const doneIssues = newIssues.filter(i => i.column === 5);
          if (doneIssues.length > 0) {
            const toRemove = doneIssues[0];
            return newIssues.filter(i => i.id !== toRemove.id);
          }
        }
        
        return newIssues;
      });
    }, 2000);

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
                      .map((issue) => (
                        <div
                          key={issue.id}
                          className={`
                            bg-card border border-border rounded-md p-2 text-xs
                            shadow-sm transition-all duration-500 ease-out
                            ${issue.isYolo ? "ring-2 ring-kiln-glow animate-pulse" : ""}
                          `}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium text-white ${issue.tagColor}`}>
                              {issue.tag}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {issue.hasPR && (
                              <GitPullRequest className="w-3 h-3 text-green-500 flex-shrink-0" />
                            )}
                            <span className="truncate">{issue.title}</span>
                          </div>
                          {issue.isYolo && (
                            <span className="text-[10px] text-kiln-glow font-semibold mt-1 block">
                              yolo →
                            </span>
                          )}
                        </div>
                      ))}
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
