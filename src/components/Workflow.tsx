import { Search, FileText, Code2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Research",
    description: "Claude analyzes issues, explores codebases, and gathers context to understand the problem space.",
    color: "text-kiln-glow",
    bgColor: "bg-kiln-glow/10",
  },
  {
    icon: FileText,
    title: "Plan",
    description: "Generates detailed implementation plans with file changes, tests, and documentation updates.",
    color: "text-kiln-ember",
    bgColor: "bg-kiln-ember/10",
  },
  {
    icon: Code2,
    title: "Implement",
    description: "Creates PRs with code changes, following your team's conventions and best practices.",
    color: "text-kiln-fire",
    bgColor: "bg-kiln-fire/10",
  },
];

export function Workflow() {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient-fire">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Move issues through your kanban columns. Kiln watches and orchestrates Claude 
            to handle each phase of development.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="bg-card border border-border rounded-xl p-6 h-full shadow-card hover:border-primary/50 transition-colors">
                <div className={`${step.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
