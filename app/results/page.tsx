"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import AnalysisResult, { type Analysis } from "@/components/AnalysisResult";

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("poker_analysis");
      if (!raw) { setError(true); return; }
      setAnalysis(JSON.parse(raw));
    } catch {
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <div className="text-4xl opacity-20">♠</div>
            <p className="text-[#444] text-sm">No analysis found.</p>
            <button
              onClick={() => router.push("/")}
              className="text-[#22c55e] hover:text-white text-sm font-medium transition-colors"
            >
              ← Analyze a hand
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2.5 text-[#444] text-sm">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#333]">
            Hand Analysis
          </span>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-[11px] text-[#555] hover:text-[#22c55e] transition-colors font-medium border border-[#222] hover:border-[#16a34a]/30 rounded-lg px-3 py-1.5"
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3L5 8l5 5"/>
            </svg>
            New Hand
          </button>
        </div>
      </div>

      <main className="flex-1 px-4 py-7">
        <div className="max-w-3xl mx-auto">
          <AnalysisResult analysis={analysis} />

          <div className="mt-8 pt-6 border-t border-[#1a1a1a] flex justify-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 bg-[#141414] hover:bg-[#1c1c1c] border border-[#222] hover:border-[#333] text-[#666] hover:text-white font-medium py-2.5 px-7 rounded-lg transition-all text-sm"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 3L5 8l5 5"/>
              </svg>
              Analyze Another Hand
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
