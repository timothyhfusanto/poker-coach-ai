function CardsIllustration() {
  return (
    <svg
      width="260"
      height="220"
      viewBox="0 0 260 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
      aria-hidden="true"
    >
      <defs>
        <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#000" floodOpacity="0.75" />
        </filter>
        <radialGradient id="table-glow" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="card-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="130" cy="160" rx="130" ry="70" fill="url(#table-glow)" />

      {/* Ace of Spades */}
      <g transform="rotate(-12 75 105)" filter="url(#card-shadow)">
        <rect x="15" y="20" width="118" height="165" rx="10" fill="#f4f0e8" />
        <rect x="15" y="20" width="118" height="165" rx="10" fill="url(#card-shine)" />
        <rect x="21" y="26" width="106" height="153" rx="7" fill="none" stroke="#d8d2c6" strokeWidth="1" />
        <text x="28" y="50" fontFamily="Georgia, 'Times New Roman', serif" fontSize="22" fontWeight="bold" fill="#111">A</text>
        <text x="30" y="70" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" fill="#111">♠</text>
        <text x="74" y="125" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="58" fill="#0a0a0a">♠</text>
        <g transform="rotate(180 74 162)">
          <text x="28" y="50" fontFamily="Georgia, 'Times New Roman', serif" fontSize="22" fontWeight="bold" fill="#111">A</text>
          <text x="30" y="70" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" fill="#111">♠</text>
        </g>
      </g>

      {/* Ace of Hearts */}
      <g transform="rotate(7 155 100)" filter="url(#card-shadow)">
        <rect x="125" y="15" width="118" height="165" rx="10" fill="#f4f0e8" />
        <rect x="125" y="15" width="118" height="165" rx="10" fill="url(#card-shine)" />
        <rect x="131" y="21" width="106" height="153" rx="7" fill="none" stroke="#d8d2c6" strokeWidth="1" />
        <text x="138" y="44" fontFamily="Georgia, 'Times New Roman', serif" fontSize="22" fontWeight="bold" fill="#c41c1c">A</text>
        <text x="140" y="64" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" fill="#c41c1c">♥</text>
        <text x="184" y="120" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="58" fill="#c41c1c">♥</text>
        <g transform="rotate(180 184 157)">
          <text x="138" y="44" fontFamily="Georgia, 'Times New Roman', serif" fontSize="22" fontWeight="bold" fill="#c41c1c">A</text>
          <text x="140" y="64" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" fill="#c41c1c">♥</text>
        </g>
      </g>

      {/* Chip stack */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${32 + i * 2}, ${190 - i * 5})`} opacity={0.45 - i * 0.08}>
          <ellipse cx="20" cy="6" rx="18" ry="5" fill="#052e16" />
          <rect x="2" y="1" width="36" height="8" rx="2" fill="#14532d" />
          <ellipse cx="20" cy="1" rx="18" ry="5" fill="#16a34a" />
          <ellipse cx="20" cy="1" rx="14" ry="3.5" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" />
        </g>
      ))}

      {/* Suit accents */}
      <text x="8" y="48" fontFamily="Georgia, serif" fontSize="22" fill="#16a34a" opacity="0.14">♣</text>
      <text x="230" y="30" fontFamily="Georgia, serif" fontSize="18" fill="#c9943a" opacity="0.18">♦</text>
      <text x="10" y="200" fontFamily="Georgia, serif" fontSize="16" fill="#dc2626" opacity="0.12">♥</text>
    </svg>
  );
}

export default function HeroBanner() {
  return (
    <div className="felt-bg border-b border-[#1a1a1a] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 flex items-center gap-6">

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 bg-[#16a34a]/10 border border-[#16a34a]/20 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase">
              AI Hand Analysis
            </span>
          </div>

          <h1 className="text-3xl sm:text-[2.6rem] font-bold text-white leading-[1.15] tracking-tight mb-4">
            Stop guessing.<br />
            <span className="text-[#22c55e]">Start improving.</span>
          </h1>

          <p className="text-[#666] text-[15px] leading-relaxed max-w-sm">
            Describe any hand you played. Get a brutally honest breakdown — what you did, what went wrong, and exactly what to do next time.
          </p>

          <div className="flex items-center gap-5 mt-7">
            {[
              { val: "GTO",  label: "Aware"   },
              { val: "EV",   label: "Focused" },
              { val: "100%", label: "Honest"  },
            ].map(({ val, label }) => (
              <div key={val} className="text-center">
                <div className="text-base font-bold text-[#c9943a]">{val}</div>
                <div className="text-[10px] text-[#3a3a3a] uppercase tracking-widest">{label}</div>
              </div>
            ))}
            <div className="w-px h-8 bg-[#222] mx-1" />
            <div className="text-[11px] text-[#3a3a3a] leading-snug">
              No fluff.<br />No excuses.
            </div>
          </div>
        </div>

        <div className="hidden sm:block shrink-0 -mr-4">
          <CardsIllustration />
        </div>
      </div>
    </div>
  );
}
