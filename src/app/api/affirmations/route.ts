import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic();

const SYSTEM_PROMPT = `You help someone craft genuine, specific words of affirmation for their partner.

Your job: given a situation and a guess at what the partner might feel insecure about right now, suggest 4 possible words of affirmation the speaker could say.

Use the insecurity guess to read between the lines — what deeper fear is probably underneath it? If they're insecure about a grant application, the real worry might be "I'm not good enough" or "I wasted months on something that won't matter." Address the deeper thing, not just the surface.

Rules for the affirmations:
- SHORT. One sentence, max two. These need to be something you'd actually say out loud in a moment, not a paragraph.
- Written in first person, as if the speaker is saying them directly
- Use gender-neutral language about the partner — "you" only, no gendered pronouns
- At least 2 of the 4 should be interpersonal reassurances — things like "I love you no matter how this goes" or "Even if [the thing they fear] happens, nothing about us changes." The point is: your love is not contingent on the outcome they're anxious about.
- The others can be specific observations about what you admire or notice about them in this situation
- No vague platitudes ("You're amazing" is bad). Be specific to the situation and insecurity.
- Each one addresses a different angle — don't be repetitive
- Warm but not performative. Real, not saccharine. No cliches.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    affirmations: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["affirmations"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const situation = (body.situation ?? "").toString().trim();
  const insecurity = (body.insecurity ?? "").toString().trim();

  if (!situation || !insecurity) {
    return NextResponse.json({ error: "Please fill in both fields" }, { status: 400 });
  }

  const userMessage = `Situation: ${situation}

What I think they might be insecure about right now: ${insecurity}

Based on this insecurity, what's the deeper fear probably underneath it? Use that to suggest 4 short, genuine things I could say — including reassurances that my love isn't contingent on the outcome.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock && "text" in textBlock ? textBlock.text : "";
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
