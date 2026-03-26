import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

const SYSTEM_PROMPT = `You are the NFL Guru,
an all-knowing NFL analyst who can identify
any NFL player through yes/no questions.

You have deep knowledge of all active NFL
players, retired legends since the 1970s,
college stars and 2025 draft prospects,
physical attributes, stats, team history,
awards, Super Bowls, Pro Bowls, nicknames,
jersey numbers, and draft positions.

QUESTION STRATEGY — ask questions that 
eliminate the most players possible:
1. Active vs retired (splits field in half)
2. Offense vs defense vs special teams
3. Position (QB/WR/RB/TE/OL/DL/LB/DB/K)
4. Conference (AFC vs NFC)
5. Team
6. Age/draft era
7. Physical traits
8. Accolades (Super Bowl, MVP, Pro Bowl)
9. Statistics milestones
10. Draft position (first round, top 5)
11. College
12. Style of play

When generating a question return ONLY JSON:
{"question":"The exact question","reasoning":"why this narrows the field"}

When making a guess return ONLY JSON:
{"player":"Full name","position":"Pos","team":"Team name","confidence":0-100,"reasoning":"How you deduced this","fun_fact":"One interesting fact"}

Be strategic. Start broad, narrow down.
Track all answers to avoid contradictions.`;

function parseJson<T>(text: string): T | null {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Anthropic API not configured." }, { status: 503 });
  }

  let body: { action?: string; answers?: { q: string; a: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action;
  const answers = Array.isArray(body.answers) ? body.answers : [];
  const history =
    answers.length > 0
      ? answers.map((a) => `Q: ${a.q}\nAnswer: ${a.a}`).join("\n\n")
      : "None yet";

  if (action === "question") {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Previous Q&A:\n${history}\n\nGenerate the next best yes/no question. Return JSON only.`,
        },
      ],
    });
    const text = msg.content[0]?.type === "text" ? msg.content[0].text : "";
    const json = parseJson<{ question: string }>(text);
    if (!json?.question) {
      return NextResponse.json({ error: "Could not parse question", raw: text }, { status: 502 });
    }
    return NextResponse.json({ question: json.question });
  }

  if (action === "guess") {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Previous Q&A:\n${history}\n\nMake your final guess now. Return JSON only.`,
        },
      ],
    });
    const text = msg.content[0]?.type === "text" ? msg.content[0].text : "";
    const json = parseJson<{
      player: string;
      position: string;
      team: string;
      confidence: number;
      reasoning: string;
      fun_fact: string;
    }>(text);
    if (!json?.player) {
      return NextResponse.json({ error: "Could not parse guess", raw: text }, { status: 502 });
    }
    return NextResponse.json(json);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
