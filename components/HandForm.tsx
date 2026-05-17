"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormFields {
  gameType: string;
  position: string;
  stackSizes: string;
  hand: string;
  players: string;
  street: string;
  boardCards: string;
  potSize: string;
  actionTaken: string;
  reasoning: string;
}

const initialForm: FormFields = {
  gameType: "No-Limit Texas Hold'em",
  position: "",
  stackSizes: "",
  hand: "",
  players: "6",
  street: "Preflop",
  boardCards: "",
  potSize: "",
  actionTaken: "",
  reasoning: "",
};

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#555]">
          {label}
          {required && <span className="text-[#22c55e] ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-[#333] normal-case tracking-normal">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-[#ef4444] text-xs mt-1.5 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 7a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-4 pb-1">
      <span className="text-[#16a34a] text-[10px]">◆</span>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#444]">{label}</span>
      <div className="flex-1 h-px bg-[#1e1e1e]" />
    </div>
  );
}

export default function HandForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormFields>(initialForm);
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function set(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<FormFields> = {};
    if (!form.position) next.position = "Required";
    if (!form.stackSizes.trim()) next.stackSizes = "Required";
    if (!form.hand.trim()) next.hand = "Required";
    if (!form.potSize.trim()) next.potSize = "Required";
    if (!form.actionTaken.trim()) next.actionTaken = "Required";
    if (form.street !== "Preflop" && !form.boardCards.trim())
      next.boardCards = "Required for post-flop streets";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Analysis failed. Please try again.");
      }
      const analysis = await res.json();
      sessionStorage.setItem("poker_analysis", JSON.stringify(analysis));
      sessionStorage.setItem("poker_hand", JSON.stringify(form));
      router.push("/results");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const isPreflop = form.street === "Preflop";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <SectionDivider label="Game Setup" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Game Type" required>
          <select value={form.gameType} onChange={(e) => set("gameType", e.target.value)} className="input-base">
            <option>No-Limit Texas Hold&apos;em</option>
            <option>Pot-Limit Omaha</option>
          </select>
        </Field>

        <Field label="Your Position" required error={errors.position}>
          <select
            value={form.position}
            onChange={(e) => set("position", e.target.value)}
            className={`input-base${errors.position ? " error" : ""}`}
          >
            <option value="">Select position</option>
            {["UTG", "UTG+1", "MP", "HJ", "CO", "BTN", "SB", "BB"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>

        <Field label="Players at Table" required>
          <select value={form.players} onChange={(e) => set("players", e.target.value)} className="input-base">
            {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={String(n)}>{n} players</option>
            ))}
          </select>
        </Field>

        <Field label="Street" required>
          <select
            value={form.street}
            onChange={(e) => { set("street", e.target.value); if (e.target.value === "Preflop") set("boardCards", ""); }}
            className="input-base"
          >
            {["Preflop", "Flop", "Turn", "River"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <SectionDivider label="Your Cards" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Your Hand" required hint="AKQJTs / h d c s" error={errors.hand}>
          <input
            type="text"
            value={form.hand}
            onChange={(e) => set("hand", e.target.value)}
            placeholder="e.g. AsKh"
            className={`input-base font-mono${errors.hand ? " error" : ""}`}
          />
        </Field>

        <Field label="Board Cards" required={!isPreflop} hint={isPreflop ? "n/a preflop" : undefined} error={errors.boardCards}>
          <input
            type="text"
            value={form.boardCards}
            onChange={(e) => set("boardCards", e.target.value)}
            placeholder="e.g. Ah 7d 2c"
            disabled={isPreflop}
            className={`input-base font-mono${errors.boardCards ? " error" : ""}`}
          />
        </Field>
      </div>

      <SectionDivider label="Situation" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Stack Sizes" required error={errors.stackSizes}>
          <input
            type="text"
            value={form.stackSizes}
            onChange={(e) => set("stackSizes", e.target.value)}
            placeholder="e.g. Hero: 100BB, Villain: 85BB"
            className={`input-base${errors.stackSizes ? " error" : ""}`}
          />
        </Field>

        <Field label="Pot Size" required error={errors.potSize}>
          <input
            type="text"
            value={form.potSize}
            onChange={(e) => set("potSize", e.target.value)}
            placeholder="e.g. 12BB"
            className={`input-base${errors.potSize ? " error" : ""}`}
          />
        </Field>
      </div>

      <SectionDivider label="The Action" />

      <Field label="Action Taken" required error={errors.actionTaken}>
        <textarea
          value={form.actionTaken}
          onChange={(e) => set("actionTaken", e.target.value)}
          rows={5}
          placeholder="Describe exactly what happened — all streets, all actions. e.g. Villain raised to 3BB from CO, I 3-bet to 9BB from BTN, villain called. Flop came Ah 7d 2c. Villain checked, I bet 6BB, villain raised to 18BB. I called."
          className={`input-base resize-none${errors.actionTaken ? " error" : ""}`}
        />
      </Field>

      <Field label="Your Reasoning" hint="optional">
        <textarea
          value={form.reasoning}
          onChange={(e) => set("reasoning", e.target.value)}
          rows={3}
          placeholder="What were you thinking when you made this play?"
          className="input-base resize-none"
        />
      </Field>

      {apiError && (
        <div className="bg-[#450a0a]/50 border border-[#dc2626]/30 text-[#f87171] text-sm rounded-lg px-4 py-3 flex items-start gap-2.5">
          <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 7a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
          </svg>
          {apiError}
        </div>
      )}

      <div className="pt-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.99] disabled:bg-[#052e16] disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors text-base tracking-wide"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2.5">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Thinking...
            </span>
          ) : (
            "Analyze My Hand"
          )}
        </button>
      </div>
    </form>
  );
}
