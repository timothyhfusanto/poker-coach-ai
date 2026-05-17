"use client";

import { useEffect, useState } from "react";

export interface Analysis {
  verdict: "Good Play" | "Acceptable" | "Mistake" | "Major Mistake";
  verdict_explanation: string;
  what_you_did: string;
  was_it_correct: boolean;
  key_issues: string[];
  correct_play: string;
  pot_odds_analysis: string | null;
  position_analysis: string;
  range_analysis: string;
  lesson: string;
  rating: number;
}

const verdictConfig = {
  "Good Play": {
    topColor: "rgba(22, 163, 74, 0.12)",
    border: "border-[#16a34a]/25",
    badge: "bg-[#052e16] border-[#16a34a]/30 text-[#22c55e]",
    rating: "text-[#22c55e]",
    bar: "bg-[#16a34a]",
    barBright: "bg-[#22c55e]",
  },
  "Acceptable": {
    topColor: "rgba(201, 148, 58, 0.1)",
    border: "border-[#c9943a]/25",
    badge: "bg-[#2a1a00] border-[#c9943a]/30 text-[#d4af37]",
    rating: "text-[#d4af37]",
    bar: "bg-[#c9943a]",
    barBright: "bg-[#d4af37]",
  },
  "Mistake": {
    topColor: "rgba(234, 88, 12, 0.1)",
    border: "border-orange-700/25",
    badge: "bg-orange-950/60 border-orange-700/30 text-orange-400",
    rating: "text-orange-400",
    bar: "bg-orange-600",
    barBright: "bg-orange-400",
  },
  "Major Mistake": {
    topColor: "rgba(220, 38, 38, 0.12)",
    border: "border-[#dc2626]/25",
    badge: "bg-[#450a0a] border-[#dc2626]/30 text-[#f87171]",
    rating: "text-[#f87171]",
    bar: "bg-[#dc2626]",
    barBright: "bg-[#ef4444]",
  },
};

const cardLeftBorder: Record<string, string> = {
  issues:   "border-l-[#dc2626]/50",
  correct:  "border-l-[#16a34a]/50",
  position: "border-l-blue-600/50",
  range:    "border-l-violet-600/50",
  odds:     "border-l-cyan-600/50",
};

function Card({
  title,
  accent,
  delay = 0,
  children,
}: {
  title: string;
  accent: keyof typeof cardLeftBorder;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-[#141414] border border-[#222] border-l-2 ${cardLeftBorder[accent]} rounded-xl p-5 animate-fade-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <h3 className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#444] mb-3">{title}</h3>
      <div className="text-sm text-[#aaa] leading-relaxed">{children}</div>
    </div>
  );
}

export default function AnalysisResult({ analysis }: { analysis: Analysis }) {
  const [mounted, setMounted] = useState(false);
  const cfg = verdictConfig[analysis.verdict] ?? verdictConfig["Mistake"];
  const pct = Math.round((analysis.rating / 10) * 100);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`space-y-3 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>

      {/* ── Verdict hero ── */}
      <div
        className={`relative overflow-hidden border ${cfg.border} rounded-2xl p-7 animate-fade-up`}
        style={{
          animationFillMode: "both",
          background: `linear-gradient(180deg, ${cfg.topColor} 0%, #141414 45%)`,
        }}
      >
        {/* Corner spade */}
        <div className="absolute top-0 right-0 w-56 h-56 opacity-[0.035] pointer-events-none select-none">
          <svg viewBox="0 0 200 200" fill="none">
            <text x="10" y="180" fontFamily="Georgia, serif" fontSize="180" fill="currentColor">♠</text>
          </svg>
        </div>

        <div className="relative flex items-start justify-between gap-4 mb-5">
          <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border ${cfg.badge}`}>
            {analysis.verdict}
          </span>
          <div className="text-right shrink-0">
            <div className={`text-4xl font-bold tabular-nums leading-none ${cfg.rating}`}>
              {analysis.rating}
              <span className="text-xl font-normal text-[#333]">/10</span>
            </div>
            <div className="text-[9px] text-[#333] uppercase tracking-[0.14em] mt-1">Rating</div>
          </div>
        </div>

        <p className="relative text-xl sm:text-2xl font-semibold text-white leading-snug mb-6">
          {analysis.verdict_explanation}
        </p>

        {/* Rating bar */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#333]">Hand quality</span>
            <span className="text-[9px] text-[#333] tabular-nums">{pct}%</span>
          </div>
          <div className="h-1.5 bg-[#0f0f0f] rounded-full overflow-hidden border border-[#1c1c1c]">
            <div
              className={`h-full rounded-full ${cfg.barBright} animate-grow-width`}
              style={{ "--target-width": `${pct}%`, width: `${pct}%`, animationDelay: "300ms" } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      {/* ── Analysis grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card title="Key Issues" accent="issues" delay={80}>
          {analysis.key_issues.length > 0 ? (
            <ul className="space-y-2">
              {analysis.key_issues.map((issue, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="text-[#dc2626] mt-[3px] text-[9px] shrink-0">▶</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#333] italic">No major issues identified.</p>
          )}
        </Card>

        <Card title="Correct Play" accent="correct" delay={140}>
          {analysis.correct_play}
        </Card>

        <Card title="Position Analysis" accent="position" delay={200}>
          {analysis.position_analysis}
        </Card>

        <Card title="Range Analysis" accent="range" delay={260}>
          {analysis.range_analysis}
        </Card>
      </div>

      {analysis.pot_odds_analysis && (
        <Card title="Pot Odds & Equity" accent="odds" delay={320}>
          {analysis.pot_odds_analysis}
        </Card>
      )}

      {/* ── Key Lesson ── */}
      <div
        className="relative rounded-xl overflow-hidden border border-[#16a34a]/15 animate-fade-up"
        style={{ animationDelay: "360ms", animationFillMode: "both" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#16a34a]" />
        <div className="px-7 py-6 bg-[#141414]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#16a34a]/60">Key Lesson</span>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
          </div>
          <p className="text-base sm:text-lg text-[#ccc] leading-relaxed font-medium">
            {analysis.lesson}
          </p>
        </div>
      </div>
    </div>
  );
}
