import { createServerFn } from "@tanstack/react-start";
import { AGENTS, COUNSEL_RAILS, PLAYBOOKS, type AgentId } from "./desk";

export type RunAgentInput = {
  agent: AgentId;
  cash: number;
  weeklyIn: number;
  rollingAvg: number;
  weeklyTarget: number;
  opportunities: {
    title: string;
    status: string;
    thesis: string;
    playbookId: string;
  }[];
  focusTitle?: string;
  notes?: string;
};

export type RunAgentResult =
  | {
      ok: true;
      agent: AgentId;
      headline: string;
      realityCheck: string;
      counselWarnings: string[];
      moves: {
        title: string;
        why: string;
        timebox: string;
        capital: number;
        legalNote: string;
      }[];
      body: string;
      doNotDo: string[];
      weeklyMath: string;
      suggestions?: {
        title: string;
        playbookId: string;
        thesis: string;
        capitalAsk: number;
        weeklyLow: number;
        weeklyHigh: number;
        legalNotes: string;
        nextAction: string;
      }[];
    }
  | { ok: false; error: string };

const RUNNABLE: AgentId[] = ["pulse", "scout", "allocator", "builder", "closer"];

function extractJson(text: string): unknown {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object in model output");
  return JSON.parse(raw.slice(start, end + 1));
}

function constitution(agent: AgentId) {
  const rails = COUNSEL_RAILS.map((r) => `- ${r.title}: ${r.detail}`).join("\n");
  const books = PLAYBOOKS.map((p) => `- ${p.id}: ${p.name} (${p.lane})`).join("\n");
  const self = AGENTS.find((a) => a.id === agent);
  return `You are ${self?.name ?? agent} on North Desk, a legal income-operations crew.

MANDATE
- Seed working capital is $100. Weekly target is $2,500 average. There is no ceiling.
- $2,500/week is operator income from selling products and services, NOT a return on $100.
- Never promise results. Never imply investing $100 in stocks, options, or crypto will hit this number.
- Prefer shipping a real offer this week over audience-building theater.

COUNSEL (hard constraints — violate none)
${rails}

LEGAL PLAYBOOKS (stay inside these)
${books}

YOUR ROLE
${self?.brief}

OUTPUT
Return ONLY a JSON object with this shape:
{
  "headline": "string, max 110 chars",
  "realityCheck": "one blunt paragraph on math vs the mandate",
  "counselWarnings": ["short warnings, may be empty"],
  "moves": [
    { "title": "string", "why": "string", "timebox": "e.g. 90 min", "capital": 0, "legalNote": "string" }
  ],
  "body": "2-4 short paragraphs of specific operator guidance",
  "doNotDo": ["things to refuse this week"],
  "weeklyMath": "plain-language path from current numbers toward $2500/wk",
  "suggestions": []
}

Rules for suggestions:
- Only Scout may fill "suggestions" (0-3). Other agents use [].
- Each suggestion needs title, playbookId (one of ${PLAYBOOKS.map((p) => p.id).join(", ")}), thesis, capitalAsk, weeklyLow, weeklyHigh, legalNotes, nextAction.
- weeklyHigh must be honest. Do not put 2500 on a brand-new digital pack.

Moves: exactly 3. Capital in each move must sum to <= remaining cash unless a move spends 0.
Be concrete (names of pages, emails, files). No hashtags, no emoji, no hype, no 'passive income' slogans.
If the user asks for something illegal or that would get them sued, refuse in counselWarnings and doNotDo, and point to a legal alternative.`;
}

export const runAgent = createServerFn({ method: "POST" })
  .validator((input: RunAgentInput) => input)
  .handler(async ({ data }): Promise<RunAgentResult> => {
    if (!RUNNABLE.includes(data.agent)) {
      return { ok: false, error: "That agent does not run on demand." };
    }
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "AI is not available in this environment." };
    }

    const user = [
      `Cash on hand: $${data.cash.toFixed(2)}`,
      `This week income: $${data.weeklyIn.toFixed(2)}`,
      `Rolling 4-week average: $${data.rollingAvg.toFixed(2)}`,
      `Weekly target: $${data.weeklyTarget}`,
      `Pipeline:`,
      data.opportunities.length
        ? data.opportunities
            .map((o) => `- [${o.status}] ${o.title} (${o.playbookId}): ${o.thesis}`)
            .join("\n")
        : "- empty",
      data.focusTitle ? `Focus item: ${data.focusTitle}` : "",
      data.notes ? `Operator note: ${data.notes}` : "",
      `Run as: ${data.agent}`,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: data.agent === "pulse" ? 1800 : 1200,
        messages: [
          { role: "system", content: constitution(data.agent) },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Desk link failed (${res.status}). Try again in a minute.` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    if (!text) return { ok: false, error: "The crew returned an empty briefing." };

    try {
      const parsed = extractJson(text) as Record<string, unknown>;
      const movesRaw = Array.isArray(parsed.moves) ? parsed.moves : [];
      const moves = movesRaw.slice(0, 3).map((m) => {
        const x = m as Record<string, unknown>;
        return {
          title: String(x.title ?? "Move"),
          why: String(x.why ?? ""),
          timebox: String(x.timebox ?? "60 min"),
          capital: Number(x.capital) || 0,
          legalNote: String(x.legalNote ?? ""),
        };
      });
      while (moves.length < 3) {
        moves.push({
          title: "Protect the rails",
          why: "Keep the week legal and small.",
          timebox: "15 min",
          capital: 0,
          legalNote: "Counsel stands.",
        });
      }

      const suggestions = Array.isArray(parsed.suggestions)
        ? (parsed.suggestions as Record<string, unknown>[]).slice(0, 3).map((s) => ({
            title: String(s.title ?? "Untitled"),
            playbookId: String(s.playbookId ?? "digital"),
            thesis: String(s.thesis ?? ""),
            capitalAsk: Number(s.capitalAsk) || 0,
            weeklyLow: Number(s.weeklyLow) || 0,
            weeklyHigh: Number(s.weeklyHigh) || 0,
            legalNotes: String(s.legalNotes ?? ""),
            nextAction: String(s.nextAction ?? ""),
          }))
        : [];

      return {
        ok: true,
        agent: data.agent,
        headline: String(parsed.headline ?? "Briefing").slice(0, 160),
        realityCheck: String(parsed.realityCheck ?? ""),
        counselWarnings: Array.isArray(parsed.counselWarnings)
          ? parsed.counselWarnings.map((w) => String(w)).slice(0, 6)
          : [],
        moves,
        body: String(parsed.body ?? text),
        doNotDo: Array.isArray(parsed.doNotDo)
          ? parsed.doNotDo.map((w) => String(w)).slice(0, 6)
          : [],
        weeklyMath: String(parsed.weeklyMath ?? ""),
        suggestions: data.agent === "scout" ? suggestions : [],
      };
    } catch {
      return {
        ok: true,
        agent: data.agent,
        headline: "Briefing (unstructured)",
        realityCheck:
          "The crew answered in prose. Treat it as notes, not a promise.",
        counselWarnings: [],
        moves: [
          {
            title: "Read the notes",
            why: "Structured fields failed; the body still may be useful.",
            timebox: "20 min",
            capital: 0,
            legalNote: "Counsel rails still apply.",
          },
          {
            title: "Pick one legal playbook",
            why: "Stay inside the seven approved lanes.",
            timebox: "30 min",
            capital: 0,
            legalNote: "No cloned brands, no guaranteed yield.",
          },
          {
            title: "Log cash honestly",
            why: "The mandate is an average of real deposits.",
            timebox: "10 min",
            capital: 0,
            legalNote: "Income is taxable.",
          },
        ],
        body: text.slice(0, 4000),
        doNotDo: ["Do not treat this as licensed advice."],
        weeklyMath: "",
        suggestions: [],
      };
    }
  });
