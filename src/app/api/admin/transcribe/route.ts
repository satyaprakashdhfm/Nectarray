import { NextResponse } from "next/server";
import { generateText, transcribe } from "ai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { AccessError, requireAdmin } from "@/lib/auth/access";

/**
 * Speech to text for the admin Workspace: a short recording of what the
 * admin said (16 kHz mono WAV, made in the browser) in, the words out, for
 * the prompt of a Claude Code session.
 *
 * Two engines, picked by what is configured:
 * - Groq's Whisper large-v3-turbo when GROQ_API_KEY is set: the fastest
 *   (well under a second) and very accurate.
 * - Otherwise Gemini Flash, on the key the site already has, told that the
 *   words are an instruction to a coding assistant so file names and code
 *   terms come through as said.
 *
 * Only for an admin all the way in (Google, the allowlist, the emailed
 * code). Nothing is stored: the audio goes to the engine and is dropped.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024; // about two minutes of 16 kHz WAV
const GEMINI_MODEL =
  process.env.GEMINI_TRANSCRIBE_MODEL ??
  process.env.GEMINI_MODEL ??
  "gemini-3.6-flash";

const CONTEXT =
  "Spoken instructions to an AI coding assistant, in English with an Indian accent. Expect programming words, file and folder names, commands, git terms, framework and library names (Next.js, React, Tailwind, Railway, Supabase, Claude).";

/* Thirty a minute per admin: generous for talking, useless for abuse. */
const recent = new Map<string, number[]>();
function allowed(userId: string) {
  const now = Date.now();
  const times = (recent.get(userId) ?? []).filter((t) => now - t < 60_000);
  if (times.length >= 30) return false;
  times.push(now);
  recent.set(userId, times);
  return true;
}

export async function POST(request: Request) {
  let userId: string;
  try {
    userId = (await requireAdmin()).id;
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 401;
    return NextResponse.json({ error: "Not allowed." }, { status });
  }
  if (!allowed(userId))
    return NextResponse.json(
      { error: "Too many recordings in a minute. Wait a moment." },
      { status: 429 },
    );

  let audio: File | null = null;
  let hint = "";
  try {
    const form = await request.formData();
    const value = form.get("audio");
    audio = value instanceof File ? value : null;
    hint = String(form.get("hint") ?? "").slice(0, 200);
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (!audio || audio.size === 0)
    return NextResponse.json({ error: "No audio." }, { status: 400 });
  if (audio.size > MAX_BYTES)
    return NextResponse.json(
      { error: "That recording is too long. Keep it under two minutes." },
      { status: 413 },
    );

  const bytes = new Uint8Array(await audio.arrayBuffer());
  const context = hint ? `${CONTEXT} Working in the repo: ${hint}.` : CONTEXT;

  try {
    if (process.env.GROQ_API_KEY) {
      const result = await transcribe({
        model: groq.transcription("whisper-large-v3-turbo"),
        audio: bytes,
        providerOptions: { groq: { language: "en", prompt: context } },
        abortSignal: AbortSignal.timeout(30_000),
      });
      return NextResponse.json({ text: clean(result.text), engine: "groq" });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY)
      return NextResponse.json(
        { error: "No speech engine is configured." },
        { status: 503 },
      );
    const { text } = await generateText({
      model: google(GEMINI_MODEL),
      temperature: 0,
      abortSignal: AbortSignal.timeout(45_000),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Transcribe this recording word for word. ${context} Write only what was said, as plain text: no quotes, no labels, no commentary, no translation. Keep file names and code terms as spoken. If nothing was said, return an empty answer.`,
            },
            {
              type: "file",
              mediaType: audio.type || "audio/wav",
              data: bytes,
            },
          ],
        },
      ],
    });
    return NextResponse.json({ text: clean(text), engine: "gemini" });
  } catch (error) {
    console.error("[transcribe]", error);
    return NextResponse.json(
      { error: "Could not turn that into text. Try again." },
      { status: 502 },
    );
  }
}

/** Trims what engines add around the words: whitespace, wrapping quotes. */
const clean = (text: string) =>
  text
    .trim()
    .replace(/^["“'](.*)["”']$/s, "$1")
    .trim();
