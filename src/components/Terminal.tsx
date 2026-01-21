export function Terminal() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start in <span className="text-gradient-fire">Seconds</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A single command gets kiln watching your project, ready to work.
          </p>
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
              <div className="flex items-start gap-2">
                <span className="text-kiln-ember">$</span>
                <span className="text-foreground">kiln</span>
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
                  <span className="text-kiln-ember">●</span> Watching column: Research
                </p>
                <p>
                  <span className="text-kiln-fire">●</span> Claude API ready
                </p>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground">
                  <span className="text-kiln-glow">→</span> Issue #42 moved to <span className="text-kiln-ember">Research</span>
                </p>
                <p className="text-muted-foreground">
                  <span className="text-kiln-glow">→</span> Starting research phase...
                </p>
                <p className="text-muted-foreground mt-2">
                  <span className="text-foreground">Claude:</span> Analyzing issue context and codebase structure...
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-kiln-ember">$</span>
                <span className="w-2 h-5 bg-foreground animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
