import { useState, useEffect, useCallback, useRef } from "react";
import { GitPullRequest, GitMerge } from "lucide-react";
import researchAndPlan from "@/assets/research-and-plan-1080p-30fps.gif";
import humanInTheLoop from "@/assets/human-in-the-loop.gif";

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
  const [gifVisible, setGifVisible] = useState(false);
  const [gif2Visible, setGif2Visible] = useState(false);
  const gifRef = useRef<HTMLDivElement>(null);
  const gif2Ref = useRef<HTMLDivElement>(null);

  // Preload first gif immediately, but only show when scrolled into view
  useEffect(() => {
    const img = new Image();
    img.src = researchAndPlan;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGifVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (gifRef.current) {
      observer.observe(gifRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Second gif - only load when 10% visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGif2Visible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (gif2Ref.current) {
      observer.observe(gif2Ref.current);
    }

    return () => observer.disconnect();
  }, []);

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

        {/* Orchestrate Description */}
        <div className="max-w-3xl mx-auto bg-card/80 border border-border rounded-xl p-8 space-y-6 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground">
              Orchestrate Claude Code from GitHub Projects
            </h3>
            <p className="text-lg text-foreground/80">
              When you move an issue, Kiln will invoke Claude Code to execute the respective /command locally.
            </p>
          </div>

          <ul className="space-y-2 text-lg text-foreground/80 ml-2">
            <li>• Use your existing Claude subscription (no auth trickery, no API keys needed, runs locally)</li>
            <li>• All context and state is on GitHub (no markdown mess, no local DBs, easy recovery)</li>
            <li>• Poll instead of webhooks/events (no external attack surfaces, works behind VPN)</li>
            <li>• Supports MCPs and anything else Claude can do</li>
          </ul>
        </div>

        {/* End-to-end flow GIF */}
        <div ref={gifRef} className="max-w-5xl mx-auto mb-12">
          {gifVisible && (
            <img
              src={researchAndPlan}
              alt="Research and plan demonstration"
              className="w-full rounded-xl border border-border shadow-card"
            />
          )}
        </div>

        {/* Step by step */}
        <div className="max-w-3xl mx-auto bg-card/80 border border-border rounded-xl p-8 mb-16 space-y-6">
          <h3 className="text-xl md:text-2xl font-semibold text-foreground">
            The Flow
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-lg text-foreground/80 ml-2">
            <li>Create Issues in your GitHub kanban board</li>
            <li>Move them to <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /><strong>Research</strong></span>, <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /><strong>Plan</strong></span>, or <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /><strong>Implement</strong></span></li>
            <li>Kiln invokes your local Claude Code and uses Labels to track state</li>
            <li>Once complete, labels like <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">research_ready</span>, <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">plan_ready</span> appear</li>
            <li>Implementation begins with a draft PR and is coded iteratively</li>
            <li>When coding is complete, Issue moves to <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><strong>Validate</strong></span>, PR is set to ready for review</li>
          </ol>
        </div>

        {/* Human in the Loop */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Human in the <span className="text-gradient-fire">Loop</span>
          </h2>
        </div>

        {/* You Decide When It's Ready */}
        <div className="max-w-3xl mx-auto bg-card/80 border border-border rounded-xl p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground">
              You Decide When It's Ready
            </h3>
            <p className="text-lg text-foreground/80">
              At every step, a human decides when to proceed.
            </p>
            <p className="text-lg text-foreground/80">
              This inherently provides a full audit trail — every action is timestamped and recorded in GitHub, ready for metrics and reporting.
            </p>
            <p className="text-lg text-foreground/80">
              Comment under Research or Plan to make decisions, edit and refine.
              <br />
              Send to the next phase when you're ready.
            </p>
          </div>
        </div>

        {/* Human in the Loop GIF */}
        <div ref={gif2Ref} className="max-w-5xl mx-auto mt-16">
          {gif2Visible && (
            <img
              src={humanInTheLoop}
              alt="Human in the loop demonstration"
              className="w-full rounded-xl border border-border shadow-card"
            />
          )}
        </div>
      </div>
    </section>
  );
}
