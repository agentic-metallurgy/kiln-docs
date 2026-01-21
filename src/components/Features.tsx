import { GitBranch, Bot, Shield, Zap, Settings, Users } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "GitHub Projects Integration",
    description: "Native integration with GitHub Projects v2. Monitors kanban board columns in real-time.",
  },
  {
    icon: Bot,
    title: "Claude-Powered",
    description: "Leverages Claude's advanced reasoning for research, planning, and code generation.",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop",
    description: "Engineers control the flow. Review and approve at each stage before moving forward.",
  },
  {
    icon: Shield,
    title: "Safe by Design",
    description: "No autonomous commits. All changes require human review before merging.",
  },
  {
    icon: Zap,
    title: "Fast Iteration",
    description: "Reduce time from issue to PR. Claude handles the boilerplate, you handle the decisions.",
  },
  {
    icon: Settings,
    title: "Configurable Workflows",
    description: "Customize prompts, review stages, and automation rules to fit your team's process.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-gradient-fire">Engineers</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kiln respects your workflow. It augments your process, never replaces your judgment.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-glow hover:border-primary/30 transition-all duration-300"
            >
              <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
