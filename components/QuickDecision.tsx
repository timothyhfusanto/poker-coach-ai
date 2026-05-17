"use client";

import { useState } from "react";
import CardPicker from "@/components/CardPicker";

interface QDResult {
  action: "FOLD" | "CALL" | "RAISE";
  equity: number;
  confidence: "Strong" | "Marginal" | "Tough Spot";
  reasoning: string;
}

const POSITIONS = ["UTG", "UTG+1", "MP", "HJ", "CO", "BTN", "SB", "BB"];

const POT_PRESETS  = [2, 3, 4, 6, 8, 10, 15, 20, 30, 50, 100];
const BET_PRESETS  = [2, 3, 4, 5, 6, 8, 10, 15, 20, 30];

const ACTION_STYLES: Record<
  QDResult["action"],
  { text: string; border: string; bg: string; sub: string }
> = {
  FOLD:  { text: "text-[#ef4444]", border: "border-[#dc2626]/30", bg: "bg-[#450a0a]/30", sub: "Fold your hand" },
  CALL:  { text: "text-[#22c55e]", border: "border-[#16a34a]/30", bg: "bg-[#052e16]/30", sub: "Call the bet"   },
  RAISE: { text: "text-[#22c55e]", border: "border-[#16a34a]/30", bg: "bg-[#052e16]/30", sub: "Put in a raise" },
};

const CONFIDENCE_STYLES: Record<QDResult["confidence"], string> = {
  "Strong":     "bg-[#16a34a]/12 border border-[#16a34a]/25 text-[#22c55e]",
  "Marginal":   "bg-[#c9943a]/12 border border-[#c9943a]/25 text-[#d4af37]",
  "Tough Spot": "bg-[#dc2626]/12 border border-[#dc2626]/25 text-[#ef4444]",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-[#16a34a] text-[10px]">◆</span>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#444]">{children}</span>
    </div>
  );
}

function ChipRow({
  options,
  value,
  onSelect,
  suffix = "",
}: {
  options: (number | string)[];
  value: string;
  onSelect: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => {
        const strVal = String(opt);
        const isActive = value === strVal;
        return (
          <button
            key={strVal}
            type="button"
            onClick={() => onSelect(strVal)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
              isActive
                ? "bg-[#16a34a] text-white"
                : "bg-[#1c1c1c] text-[#666] hover:text-[#bbb] active:scale-95"
            }`}
          >
            {opt}{suffix}
          </button>
        );
      })}
    </div>
  );
}

export default function QuickDecision() {
  const [holeCards, setHoleCards]   = useState<string[]>([]);
  const [boardCards, setBoardCards] = useState<string[]>([]);
  const [position, setPosition]     = useState("");
  const [potSize, setPotSize]       = useState("");
  const [noBet, setNoBet]           = useState(true);
  const [betFacing, setBetFacing]   = useState("0");

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<QDResult | null>(null);
  const [error, setError]     = useState<string | null>(null);

  function reset() {
    setHoleCards([]);
    setBoardCards([]);
    setPosition("");
    setPotSize("");
    setNoBet(true);
    setBetFacing("0");
    setResult(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (holeCards.length < 2 || !position || !potSize) return;
    setLoading(true);
    setResult(null);
    setError(null);

    const cards  = holeCards.join("").replace(/(.)(.)(.)(.)/, "$1$2 $3$4").trim() || holeCards.join(" ");
    const board  = boardCards.join(" ");
    const bet    = noBet ? "0" : betFacing;

    try {
      const res = await fetch("/api/quick-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: holeCards.join(""), board, position, potSize, betFacing: bet }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed. Try again.");
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Result screen ── */
  if (result) {
    const s = ACTION_STYLES[result.action];
    return (
      <div className="animate-fade-up">
        <div className={`rounded-2xl border ${s.border} ${s.bg} px-6 py-10 text-center space-y-5`}>
          <div>
            <div className={`text-7xl sm:text-8xl font-black tracking-tighter ${s.text} animate-bounce-in`}>
              {result.action}
            </div>
            <div className="text-xs text-[#444] mt-2 tracking-widest uppercase">{s.sub}</div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#444] text-sm uppercase tracking-widest">Equity</span>
            <span className="text-3xl font-bold tabular-nums text-white">
              {result.equity}<span className="text-lg font-normal text-[#444]">%</span>
            </span>
          </div>
          <div>
            <span className={`inline-flex items-center text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${CONFIDENCE_STYLES[result.confidence]}`}>
              {result.confidence}
            </span>
          </div>
          <p className="text-[#999] text-base leading-relaxed max-w-xs mx-auto">{result.reasoning}</p>
          <button
            onClick={reset}
            className="text-sm text-[#444] hover:text-[#888] transition-colors underline underline-offset-4"
          >
            New hand
          </button>
        </div>
      </div>
    );
  }

  /* ── Input form ── */
  const canSubmit = holeCards.length === 2 && position && potSize && !loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* My Cards */}
      <div>
        <SectionLabel>My Cards</SectionLabel>
        <div className="mt-3">
          <CardPicker
            cards={holeCards}
            onChange={setHoleCards}
            max={2}
            takenCards={boardCards}
          />
        </div>
      </div>

      {/* Board */}
      <div>
        <div className="flex items-center justify-between">
          <SectionLabel>Board Cards</SectionLabel>
          <span className="text-[10px] text-[#333] mt-2">blank = preflop</span>
        </div>
        <div className="mt-3">
          <CardPicker
            cards={boardCards}
            onChange={setBoardCards}
            max={5}
            takenCards={holeCards}
          />
        </div>
      </div>

      {/* Position */}
      <div>
        <SectionLabel>My Position</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              type="button"
              onClick={() => setPosition(pos)}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all select-none ${
                position === pos
                  ? "bg-[#16a34a] text-white"
                  : "bg-[#1c1c1c] text-[#666] hover:text-[#bbb] active:scale-95"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Pot Size */}
      <div>
        <SectionLabel>Pot Size</SectionLabel>
        <div className="mt-3 space-y-2">
          <ChipRow options={POT_PRESETS} value={potSize} onSelect={setPotSize} suffix="BB" />
          <input
            type="number"
            min="0"
            step="0.5"
            value={potSize}
            onChange={e => setPotSize(e.target.value)}
            placeholder="Custom BB amount"
            className="input-base"
          />
        </div>
      </div>

      {/* Bet Facing */}
      <div>
        <SectionLabel>Bet Facing</SectionLabel>
        <div className="mt-3 space-y-2">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setNoBet(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
                noBet ? "bg-[#1c1c1c] text-white ring-1 ring-[#333]" : "bg-[#141414] text-[#555] hover:text-[#888]"
              }`}
            >
              No bet
            </button>
            <button
              type="button"
              onClick={() => setNoBet(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
                !noBet ? "bg-[#1c1c1c] text-white ring-1 ring-[#333]" : "bg-[#141414] text-[#555] hover:text-[#888]"
              }`}
            >
              Facing a bet
            </button>
          </div>

          {!noBet && (
            <div className="space-y-2 animate-fade-in">
              <ChipRow options={BET_PRESETS} value={betFacing} onSelect={setBetFacing} suffix="BB" />
              <input
                type="number"
                min="0"
                step="0.5"
                value={betFacing}
                onChange={e => setBetFacing(e.target.value)}
                placeholder="Custom BB amount"
                className="input-base"
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-[#450a0a]/50 border border-[#dc2626]/30 text-[#f87171] text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.99] disabled:bg-[#0f0f0f] disabled:text-[#2a2a2a] disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-base tracking-wide"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Calculating...
          </span>
        ) : (
          "Get Decision"
        )}
      </button>

      <p className="text-center text-xs text-[#2a2a2a]">
        Equity calculated vs random villain range
      </p>
    </form>
  );
}
