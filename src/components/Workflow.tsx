import { useState, useEffect } from "react";

const columns = [
  { id: "backlog", name: "Backlog", color: "bg-gray-400", description: "new issues" },
  { id: "research", name: "Research", color: "bg-blue-500", description: "codebase exploration" },
  { id: "plan", name: "Plan", color: "bg-purple-500", description: "design tasks" },
  { id: "implement", name: "Implement", color: "bg-orange-500", description: "write code" },
  { id: "validate", name: "Validate", color: "bg-yellow-500", description: "human review" },
  { id: "done", name: "Done", color: "bg-green-500", description: "complete" },
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
  column: number;
  isYolo?: boolean;
}

export function Workflow() {
  const [issues, setIssues] = useState<Issue[]>([
    { id: 1, title: "Add auth flow", column: 0 },
    { id: 2, title: "Fix API bug", column: 1 },
    { id: 3, title: "Update docs", column: 2 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIssues((prev) => {
        const newIssues = [...prev];
        
        // Find an issue to move
        const movableIssues = newIssues.filter(i => i.column < 5);
        if (movableIssues.length === 0) {
          // Reset when all done
          return [
            { id: Date.now(), title: "New feature", column: 0 },
            { id: Date.now() + 1, title: "Bug fix", column: 0 },
          ];
        }
        
        // Randomly select one to move forward
        const toMove = movableIssues[Math.floor(Math.random() * movableIssues.length)];
        const issueIndex = newIssues.findIndex(i => i.id === toMove.id);
        
        // Sometimes do a "yolo" jump from backlog to implement
        if (toMove.column === 0 && Math.random() > 0.7) {
          newIssues[issueIndex] = { ...toMove, column: 3, isYolo: true };
        } else {
          newIssues[issueIndex] = { ...toMove, column: toMove.column + 1, isYolo: false };
        }
        
        // Occasionally add a new issue to backlog
        if (Math.random() > 0.6 && newIssues.filter(i => i.column === 0).length < 2) {
          const titles = ["Refactor utils", "Add tests", "Fix typo", "Update deps", "New endpoint"];
          newIssues.push({
            id: Date.now(),
            title: titles[Math.floor(Math.random() * titles.length)],
            column: 0,
          });
        }
        
        // Remove completed issues after a delay (represented by keeping max 6 issues)
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
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
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
