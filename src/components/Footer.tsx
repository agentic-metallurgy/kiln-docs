import { Github, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container px-4">
        <div className="flex flex-col items-center gap-6">
          <span className="text-xl font-bold text-gradient-fire">kiln</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/agentic-metallurgy/kiln"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="/docs"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="w-5 h-5" />
            </a>
          </div>
          <span className="text-sm text-muted-foreground">
            Made by Elon Demirock · Open source, MIT License
          </span>
        </div>
      </div>
    </footer>
  );
}
