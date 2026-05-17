"use client";

import { useState } from "react";
import HandForm from "@/components/HandForm";
import QuickDecision from "@/components/QuickDecision";

const TABS = ["Hand History", "Quick Decision"] as const;
type Tab = typeof TABS[number];

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  "Hand History":   "Full breakdown of any hand you played",
  "Quick Decision": "Instant action at the table",
};

export default function HomeTabs() {
  const [active, setActive] = useState<Tab>("Hand History");

  return (
    <div>
      <div className="flex gap-1.5 mb-6 bg-[#111] border border-[#222] rounded-xl p-1">
        {TABS.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                isActive
                  ? "bg-[#16a34a] text-white"
                  : "text-[#555] hover:text-[#999]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[#3a3a3a] uppercase tracking-widest mb-5">
        {TAB_DESCRIPTIONS[active]}
      </p>

      {active === "Hand History" ? <HandForm /> : <QuickDecision />}
    </div>
  );
}
