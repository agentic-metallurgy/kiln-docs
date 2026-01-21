import { GitBranch, Bot, Users } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "GitHub Projects Integration",
    description: "Native integration with GitHub Projects v2.",
    description2: "Monitors kanban boards in real-time.",
  },
  {
    icon: Bot,
    title: "Claude-Powered",
    description: "Leverages Claude's advanced reasoning and tools.",
    description2: "Uses your local Claude and subscription, no external login or API-key trickery needed.",
  },
  {
    icon: Users,
    title: "Built for Engineers",
    description: "Kiln makes it easier to manage research, plans, PRDs, specs — all stored within GitHub issues.",
    description2: "State is stored on the GitHub Project board as labels and statuses. It augments your process, doesn't force you to deal with complicated folder/document management.",
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
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
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
