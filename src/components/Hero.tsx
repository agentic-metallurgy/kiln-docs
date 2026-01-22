import kilnLogo from "@/assets/kiln-logo.png";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Documentation button - top right */}
      <a 
        href="/docs" 
        className="absolute top-6 right-6 z-20"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="w-4 h-4" />
          Documentation
        </Button>
      </a>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark" />
      
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      
      <div className="container relative z-10 px-4 py-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-float">
            <img 
              src={kilnLogo} 
              alt="Kiln Logo" 
              className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl"
            />
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient-fire">kiln</span>
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl">
            Orchestrate Claude-powered workflows in GitHub
          </p>
          
          <p className="text-base text-muted-foreground/80 mb-2 max-w-xl">
            Co-author the PRD as a team, set to Implement when ready
          </p>
          <p className="text-base text-muted-foreground/80 mb-10 max-w-xl">
            Let kiln + Claude bake the PR for you
          </p>
          
          
          {/* Install command */}
          <div className="mt-12">
            <div className="bg-card border border-border rounded-lg p-4 shadow-card inline-block">
              <div className="text-left">
                <code className="font-mono text-sm text-muted-foreground block">
                  <span className="text-kiln-ember">$</span> brew tap agentic-metallurgy/tap
                </code>
                <code className="font-mono text-sm text-muted-foreground block">
                  <span className="text-kiln-ember">$</span> brew install kiln
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
