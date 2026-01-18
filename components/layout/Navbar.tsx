"use client";

import Link from "next/link";
import { Sparkles, Github, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/surajondev/pagespeed-export")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => console.error("Failed to fetch stars", err));
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            PageSpeed Export
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/surajondev/pagespeed-export"
            target="_blank"
            className="group"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              {stars !== null && (
                <>
                  <div className="w-px h-4 bg-border mx-1" />
                  <div className="flex items-center gap-1 text-muted-foreground group-hover:text-amber-400 transition-colors">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{stars}</span>
                  </div>
                </>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
