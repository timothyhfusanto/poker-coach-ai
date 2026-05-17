import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-lg bg-[#16a34a]/12 border border-[#16a34a]/25 group-hover:bg-[#16a34a]/20 transition-colors" />
            <svg className="absolute inset-0 m-auto" width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C10 2 3 7 3 12a4 4 0 007 2.646V17H8v1h4v-1h-2v-2.354A4 4 0 0017 12C17 7 10 2 10 2z" fill="#22c55e"/>
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold tracking-tight text-white">Poker Coach</span>
            <span className="text-[13px] font-semibold text-[#22c55e]">AI</span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
          <span className="text-[11px] text-[#444] font-medium tracking-wide uppercase">
            Brutal honesty. Better poker.
          </span>
        </div>
      </div>
    </header>
  );
}
