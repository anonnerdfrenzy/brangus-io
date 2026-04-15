import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic();

const SYSTEM_PROMPT = `You help someone craft genuine, specific words of affirmation for their partner.

Your job: given a situation and a guess at what the partner might feel insecure about right now, suggest 4 possible words of affirmation the speaker could say.

Rules for the affirmations:
- Written in first person, as if the speaker is saying them directly ("I love how you...", "You are...", "When you...")
- Use gender-neutral language about the partner — "you" only, no gendered pronouns
- Specific and concrete, not vague platitudes ("You're amazing" is bad; "The way you think through problems out loud helps me see things more clearly" is good)
- Each one addresses a different angle of the insecurity — don't be repetitive
- Warm but not performative. Real, not saccharine. No cliches like "you're the best" or "you complete me".
- Short enough to actually say out loud — one or two sentences each
- Tie the words to the specific situation where you can`;

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

Please suggest 4 specific words of affirmation I could say.`;

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
