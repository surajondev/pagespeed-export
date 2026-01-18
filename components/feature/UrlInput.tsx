"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { usePageSpeedAnalysis } from "@/lib/api/use-psi";
import { useAppStore } from "@/lib/store/appStore";

export function UrlInput() {
  const [inputUrl, setInputUrl] = useState("");
  const { mutate: analyze, isPending } = usePageSpeedAnalysis();
  const isLoading = useAppStore((state) => state.isLoading); // From store, or use isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    analyze(inputUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-20 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Analyze your{" "}
          <span className="text-primary bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Core Web Vitals
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
          Get a comprehensive performance report and export it to PDF, Markdown,
          or TOON (Token Oriented Object Notation) for your LLM workflows.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="relative flex items-center max-w-xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <input
            type="text"
            placeholder="Enter website URL (e.g., https://example.com)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="relative w-full bg-background border border-white/10 rounded-xl px-6 py-4 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputUrl}
            className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Analyze <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
