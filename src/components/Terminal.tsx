import { Github, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Terminal() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get <span className="text-gradient-fire">Started</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Easy to configure, open source, ready to go.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://github.com/agentic-metallurgy/kiln" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-gradient-fire text-primary-foreground hover:opacity-90 transition-opacity shadow-glow group">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="/docs">
              <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-card/80">
                <BookOpen className="mr-2 h-5 w-5" />
                Documentation
              </Button>
            </a>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
            {/* Terminal header */}
            <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-kiln-heat/70" />
                <div className="w-3 h-3 rounded-full bg-kiln-ember/70" />
                <div className="w-3 h-3 rounded-full bg-kiln-glow/70" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">terminal</span>
            </div>
            
            {/* Terminal content */}
            <div className="p-6 font-mono text-sm space-y-4">
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-kiln-ember">$</span>
                  <span className="text-foreground">brew tap agentic-metallurgy/tap</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-kiln-ember">$</span>
                  <span className="text-foreground">brew install kiln</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-kiln-ember">$</span>
                  <span className="text-foreground">kiln</span>
                </div>
              </div>

              {/* ASCII logo */}
              <div className="py-2">
                <img
                  src="/kiln-ascii.png"
                  alt="KILN"
                  className="h-20 w-auto"
                />
              </div>

              <div className="text-muted-foreground space-y-1">
                <p>
                  <span className="text-kiln-glow">●</span> Connected to GitHub Projects
                </p>
                <p>
                  <span className="text-kiln-ember">●</span> Watching Columns: Research, Plan, Implement
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground">
                  <span className="text-kiln-glow">→</span> Issue #42 moved to <span className="text-kiln-ember">Research</span> - starting research.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
