import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert poker coach specialising in No-Limit Texas Hold'em and Pot-Limit Omaha. You have deep knowledge of GTO principles, exploitative play, hand ranges, pot odds, implied odds, stack-to-pot ratio, position advantage, and tournament vs cash game dynamics.

When a player shares a hand, you analyze it with complete honesty. You do not soften bad plays. You do not give vague encouragement. You give concrete, specific, actionable feedback.

Structure your response in this EXACT JSON format:
{
  "verdict": "Good Play" | "Acceptable" | "Mistake" | "Major Mistake",
  "verdict_explanation": "One sentence summary of why",
  "what_you_did": "Brief description of the action",
  "was_it_correct": true or false,
  "key_issues": ["issue 1", "issue 2", "issue 3"],
  "correct_play": "What they should have done and why",
  "pot_odds_analysis": "Relevant pot odds or equity calculation if applicable, or null if not relevant",
  "position_analysis": "How position affected this decision",
  "range_analysis": "What range should villain have here and how does that affect the decision",
  "lesson": "The single most important thing to remember from this hand",
  "rating": a number from 1 to 10 where 10 is perfect
}

Return only valid JSON. No markdown. No preamble.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      gameType,
      position,
      stackSizes,
      hand,
      players,
      street,
      boardCards,
      potSize,
      actionTaken,
      reasoning,
    } = body;

    const userMessage = `Analyze this poker hand:
Game: ${gameType}
Position: ${position}
Stack sizes: ${stackSizes}
My hand: ${hand}
Players: ${players}
Street: ${street}
Board: ${street === "Preflop" ? "Preflop - no board" : boardCards || "not provided"}
Pot size: ${potSize}
Action: ${actionTaken}
My reasoning: ${reasoning?.trim() || "Not provided"}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return Response.json({ error: "No response from AI." }, { status: 500 });
    }

    const analysis = JSON.parse(content);
    return Response.json(analysis);
  } catch (err) {
    console.error("Analyze error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return Response.json({ error: message }, { status: 500 });
  }
}
