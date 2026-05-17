import OpenAI from "openai";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Hand } = require("pokersolver");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function parseCards(input: string): string[] {
  if (!input?.trim()) return [];
  const normalized = input.toUpperCase().replace(/10/g, "T").replace(/[,\s]+/g, " ").trim();
  const matches = normalized.match(/[AKQJT2-9][SHDC]/g) || [];
  return matches.map((c: string) => c[0] + c[1].toLowerCase());
}

function calculateEquity(heroCards: string[], board: string[], iterations = 2000): number {
  const ranks = ["2","3","4","5","6","7","8","9","T","J","Q","K","A"];
  const suits = ["s","h","d","c"];
  const known = new Set([...heroCards, ...board].map(c => c.toLowerCase()));
  const deck = ranks.flatMap(r => suits.map(s => r + s)).filter(c => !known.has(c.toLowerCase()));

  let wins = 0, ties = 0;

  for (let i = 0; i < iterations; i++) {
    const d = [...deck];
    for (let j = d.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [d[j], d[k]] = [d[k], d[j]];
    }

    const villainCards = [d[0], d[1]];
    const needed = 5 - board.length;
    const fullBoard = [...board, ...d.slice(2, 2 + needed)];

    try {
      const heroHand = Hand.solve([...heroCards, ...fullBoard]);
      const villainHand = Hand.solve([...villainCards, ...fullBoard]);
      const winners = Hand.winners([heroHand, villainHand]);
      if (winners.length > 1) ties++;
      else if (winners[0] === heroHand) wins++;
    } catch {
      // skip invalid deals
    }
  }

  return Math.round(((wins + ties * 0.5) / iterations) * 100);
}

const SYSTEM_PROMPT = `You are a poker coach giving instant table decisions. Return ONLY this JSON:
{
  "action": "FOLD" | "CALL" | "RAISE",
  "confidence": "Strong" | "Marginal" | "Tough Spot",
  "reasoning": "Exactly two sentences. Direct. No fluff."
}
The equity is already calculated — do not recalculate. Base action on equity vs pot odds, position, and stack dynamics. Be decisive.`;

export async function POST(request: Request) {
  try {
    const { cards, board, position, potSize, betFacing } = await request.json();

    const heroCards = parseCards(cards);
    const boardCards = parseCards(board);

    if (heroCards.length < 2) {
      return Response.json({ error: "Enter at least 2 hole cards (e.g. AsKh)" }, { status: 400 });
    }

    const equity = calculateEquity(heroCards, boardCards);

    const potNum = parseFloat(potSize) || 0;
    const betNum = parseFloat(betFacing) || 0;
    const potOddsStr = betNum > 0
      ? `, facing bet of ${betFacing}BB (need ~${Math.round((betNum / (potNum + betNum * 2)) * 100)}% equity to call)`
      : ", no bet facing (check or open)";

    const userMessage = `Hand: ${cards}
Board: ${board?.trim() || "Preflop"}
Position: ${position}
Pot: ${potSize}BB${potOddsStr}
Equity vs random range: ${equity}%

What is the correct action?`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 180,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return Response.json({ error: "No response from AI." }, { status: 500 });

    const parsed = JSON.parse(content);
    return Response.json({ ...parsed, equity });
  } catch (err) {
    console.error("Quick decision error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return Response.json({ error: message }, { status: 500 });
  }
}
