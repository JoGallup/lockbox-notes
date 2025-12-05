"use client";

import { Shield, Github, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left - Security Badge */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20">
              <Shield className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
              <span className="text-xs font-medium text-[hsl(var(--success))]">FHE Protected</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Field-level encryption powered by Zama</span>
          </div>

          {/* Center - Built with */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" />
            <span>using</span>
            <a 
              href="https://www.zama.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-[hsl(var(--lab-blue))] transition-colors inline-flex items-center gap-1"
            >
              Zama FHEVM
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://docs.zama.ai/fhevm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </a>
            <a 
              href="https://github.com/zama-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
