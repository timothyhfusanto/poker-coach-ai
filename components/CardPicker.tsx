"use client";

import { useState } from "react";

const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
const SUITS = [
  { sym: '♠', code: 's', red: false },
  { sym: '♥', code: 'h', red: true  },
  { sym: '♦', code: 'd', red: true  },
  { sym: '♣', code: 'c', red: false },
];

function suitSym(code: string) {
  return SUITS.find(s => s.code === code)?.sym ?? code;
}

function isRed(suitCode: string) {
  return suitCode === 'h' || suitCode === 'd';
}

interface Props {
  cards: string[];
  onChange: (cards: string[]) => void;
  max: number;
  takenCards?: string[];
}

export default function CardPicker({ cards, onChange, max, takenCards = [] }: Props) {
  const [pendingRank, setPendingRank] = useState<string | null>(null);

  const allUsed = [...cards, ...takenCards];

  function toggleRank(rank: string) {
    if (cards.length >= max) return;
    setPendingRank(prev => prev === rank ? null : rank);
  }

  function commitCard(suitCode: string) {
    if (!pendingRank || cards.length >= max) return;
    const card = `${pendingRank}${suitCode}`;
    if (allUsed.includes(card)) return;
    onChange([...cards, card]);
    setPendingRank(null);
  }

  function removeCard(i: number) {
    onChange(cards.filter((_, idx) => idx !== i));
    setPendingRank(null);
  }

  const isFull = cards.length >= max;

  return (
    <div className="space-y-3">
      {/* Selected card slots */}
      <div className="flex gap-2 items-end flex-wrap min-h-[60px]">
        {cards.map((card, i) => {
          const rank = card.slice(0, -1);
          const suit = card.slice(-1);
          return (
            <button
              key={i}
              type="button"
              onClick={() => removeCard(i)}
              className="relative w-10 h-[56px] bg-[#f4f0e8] rounded-lg flex flex-col items-start justify-start p-1 hover:brightness-90 transition-all active:scale-95"
            >
              <span className="text-[13px] font-bold leading-none" style={{ color: isRed(suit) ? '#dc2626' : '#111' }}>
                {rank}
              </span>
              <span className="text-[11px] leading-none mt-0.5" style={{ color: isRed(suit) ? '#dc2626' : '#111' }}>
                {suitSym(suit)}
              </span>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#141414] border border-[#333] text-[#777] text-[9px] flex items-center justify-center">
                ×
              </span>
            </button>
          );
        })}
        {Array.from({ length: max - cards.length }).map((_, i) => (
          <div key={`slot-${i}`} className="w-10 h-[56px] rounded-lg border border-dashed border-[#252525] bg-[#0f0f0f]" />
        ))}
      </div>

      {/* Rank buttons */}
      <div className="flex flex-wrap gap-1.5">
        {RANKS.map(rank => {
          const allTaken = SUITS.every(s => allUsed.includes(`${rank}${s.code}`));
          const isActive  = pendingRank === rank;
          const disabled  = allTaken || isFull;
          return (
            <button
              key={rank}
              type="button"
              onClick={() => !disabled && toggleRank(rank)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all select-none ${
                isActive  ? 'bg-[#16a34a] text-white' :
                disabled  ? 'bg-[#0f0f0f] text-[#222] cursor-not-allowed' :
                            'bg-[#1c1c1c] text-[#bbb] hover:bg-[#252525] active:scale-95'
              }`}
            >
              {rank}
            </button>
          );
        })}
      </div>

      {/* Suit buttons — dimmed until a rank is picked */}
      <div
        className={`grid grid-cols-4 gap-2 transition-opacity duration-150 ${
          pendingRank && !isFull ? 'opacity-100' : 'opacity-20 pointer-events-none'
        }`}
      >
        {SUITS.map(suit => {
          const card   = pendingRank ? `${pendingRank}${suit.code}` : '';
          const taken  = card ? allUsed.includes(card) : false;
          return (
            <button
              key={suit.code}
              type="button"
              onClick={() => commitCard(suit.code)}
              disabled={taken}
              className={`h-12 rounded-xl text-2xl transition-all select-none ${
                taken ? 'bg-[#0f0f0f] cursor-not-allowed opacity-30'
                      : 'bg-[#1c1c1c] hover:bg-[#252525] active:scale-95'
              }`}
            >
              <span style={{ color: suit.red ? '#ef4444' : '#e8e2d6' }}>{suit.sym}</span>
            </button>
          );
        })}
      </div>

      {pendingRank && !isFull && (
        <p className="text-[10px] text-[#333] tracking-wide">
          Select a suit for <span className="text-[#888]">{pendingRank}</span>
        </p>
      )}
    </div>
  );
}
