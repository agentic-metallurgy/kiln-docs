import { GitBranch, Bot, FileText, Search, RotateCcw, Zap } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Claude-Powered",
    description: "Uses your local Claude Code subscription.",
    description2: "No new auth or API-key needed.",
  },
  {
    icon: GitBranch,
    title: "GitHub Projects Integration",
    description: "Monitors GitHub project boards in real-time.",
    description2: "All state is stored on the Issue.",
  },
  {
    icon: FileText,
    title: "Simplify \"md hell\"",
    description: "Stop worrying about how to organize .md files.",
    description2: "All of your context is saved on the GitHub Issue and PR.",
  },
  {
    icon: Search,
    title: "Focus on the Problem",
    description: "Code is free but the problems are still difficult.",
    description2: "Focus on solving the problem instead of managing windows and files.",
  },
  {
    icon: RotateCcw,
    title: "Retrying is Cheap",
    description: <>If you don't like how things went, just add the <span className="text-blue-400 font-semibold">reset</span> label and start over again.</>,
    description2: "No need to worry.",
  },
  {
    icon: Zap,
    title: "YOLO Mode",
    description: "Confident your initial Issue has enough context?",
    description2: <>Just set the <span className="text-yellow-400 font-semibold">yolo</span> label and let Kiln move it autonomously to deliver the PR.</>,
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
