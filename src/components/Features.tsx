import { GitBranch, Bot, FileText, Search, RotateCcw, Zap } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Claude-Powered",
    description: "Leverages Claude's advanced reasoning and tools.",
    description2: "Uses your local Claude and subscription, no external login or API-key trickery needed.",
  },
  {
    icon: GitBranch,
    title: "GitHub Projects Integration",
    description: "Native integration with GitHub Projects v2.",
    description2: "Monitors kanban boards in real-time.",
  },
  {
    icon: FileText,
    title: "Simplify \"md hell\"",
    description: "Stop worrying about where to save and how to organize .md files.",
    description2: "All of your context is saved as GitHub issues.",
  },
  {
    icon: Search,
    title: "Focus on the Problem",
    description: "Code is cheap but the problems to solve are still difficult.",
    description2: "Focus on discussing, clarifying, and solving the problem.",
  },
  {
    icon: RotateCcw,
    title: "Retrying is Cheap",
    description: "If you don't like how things went, just add the \"reset\" label and start over again.",
    description2: "No need to worry.",
  },
  {
    icon: Zap,
    title: "YOLO Mode",
    description: "Confident your initial Issue has enough context?",
    description2: "Just set the \"yolo\" label and let Claude take it through all stages and deliver your PR.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-gradient-fire">Teams</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stop worrying about the .md files. Focus on solving problems together.
            <br />
            Keep the PRDs, code, and PRs all in one context as you co-author solutions.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-glow hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-1">{feature.description}</p>
              <p className="text-muted-foreground text-sm">{feature.description2}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
