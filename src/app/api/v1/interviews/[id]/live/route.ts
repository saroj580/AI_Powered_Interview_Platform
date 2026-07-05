import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";
import { groqChat } from "@/lib/groq";

export interface LiveMessage {
  role: "interviewer" | "candidate";
  content: string;
}

export interface LiveTurnRequest {
  history: LiveMessage[];
  observations: string[];
  stage: string;
  questionIndex: number;
}

export interface LiveTurnResponse {
  message: string;
  stage: string;
  questionIndex: number;
  isComplete: boolean;
  observation: string;
}

function buildSystemPrompt(role: string, difficulty: string, targetQuestions: number, questionIndex: number): string {
  return `You are "Alex", a senior technical interviewer at a top tech company conducting a real-time live interview.

YOUR OUTPUT FORMAT — THIS IS MANDATORY:
You MUST respond with ONLY a raw JSON object. No markdown, no code fences, no explanation, no text before or after the JSON. Start your response with { and end with }.

Required JSON shape:
{
  "message": "<what you say to the candidate — natural, conversational, professional, 1-4 sentences>",
  "stage": "<one of: welcome | intro | readiness | interview | followup | closing | complete>",
  "questionIndex": <integer — increment only for NEW main questions, not follow-ups>,
  "isComplete": <boolean — true ONLY after delivering the final farewell/closing message>,
  "observation": "<your private evaluation note: quality, depth, accuracy, confidence, key points made or missed>"
}

Interview context:
- Candidate target role: ${role}
- Difficulty: ${difficulty}
- Target main questions: ${targetQuestions}
- Main questions asked so far: ${questionIndex} / ${targetQuestions}

Interviewing rules:
- Stage flow: welcome → intro → readiness → interview (main Qs) → closing
- Ask ONE question per message. Never combine two questions.
- Follow-up questions for vague/incorrect answers don't count toward ${targetQuestions}.
- Briefly acknowledge strong answers before moving on — don't overpraise.
- If candidate struggles, simplify once then try a different angle.
- Set isComplete = true ONLY in the final farewell message.
- Be professional, encouraging, and natural — not robotic.

REMEMBER: Respond with ONLY the JSON object. Nothing else.`;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const interview = await prisma.interview.findFirst({
      where: { id, createdById: user.userId },
    });
    if (!interview) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { history, stage, questionIndex } = await req.json() as LiveTurnRequest;

    const systemPrompt = buildSystemPrompt(
      interview.targetRole,
      interview.difficulty,
      interview.questionCount,
      questionIndex,
    );

    // Map conversation history to Groq message format
    const groqMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    if (history.length === 0) {
      // First turn — kick off the interview
      groqMessages.push({ role: "user", content: "Please begin the interview now." });
    } else {
      for (const msg of history) {
        groqMessages.push({
          role: msg.role === "candidate" ? "user" : "assistant",
          content: msg.content,
        });
      }
    }

    const raw = await groqChat(groqMessages, { temperature: 0.4, maxTokens: 512 });

    // Strip markdown code fences if model wraps output (```json ... ```)
    const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      // Model returned plain text — log and return a graceful recovery turn
      console.error("[live/turn] Non-JSON response (first 300 chars):", raw.slice(0, 300));
      return NextResponse.json({
        message: "Let's continue. Could you please share your thoughts on that?",
        stage,
        questionIndex,
        isComplete: false,
        observation: "[recovery turn — model returned plain text]",
      } satisfies LiveTurnResponse);
    }

    const parsed = JSON.parse(jsonMatch[0]) as LiveTurnResponse;

    // Clamp questionIndex so it never exceeds the target
    parsed.questionIndex = Math.min(parsed.questionIndex, interview.questionCount);

    // Determine if this is truly the last stage and mark interview complete in DB
    if (parsed.isComplete) {
      await prisma.interview.update({
        where: { id },
        data: { status: "COMPLETED" },
      });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[live/turn]", err);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
