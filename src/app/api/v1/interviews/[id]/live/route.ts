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
  return `You are "Alex", a senior technical interviewer at a top tech company. You are conducting a real-time live interview.

Interview context:
- Candidate's target role: ${role}
- Difficulty level: ${difficulty}
- Target number of main interview questions: ${targetQuestions}
- Main questions asked so far: ${questionIndex} / ${targetQuestions}

Your interviewing behavior:
- Stage progression: welcome → briefly introduce the interview format → confirm the candidate is ready → ask ONE question at a time → follow up or advance → close the interview
- NEVER ask more than one question per message
- Ask contextual follow-up questions if an answer is vague, incomplete, or incorrect — these do NOT count toward the ${targetQuestions} main questions
- Acknowledge strong answers briefly ("That's a solid explanation", "Good point") before moving on — do not overpraise
- Progress from easier to harder concepts as the interview advances
- Be professional, encouraging, and natural — never robotic or scripted
- After ${targetQuestions} main questions, transition to a closing message thanking the candidate
- Set isComplete to true ONLY in the closing/farewell message, not the thank-you question transition

Difficulty adaptation:
- If candidate answers well → increase complexity and probe deeper
- If candidate struggles → be supportive, briefly simplify, then try a different angle
- Detect hesitation, vagueness, or overconfidence and adapt accordingly

IMPORTANT: Respond ONLY with a valid JSON object — no markdown, no extra text:
{
  "message": "<what you say to the candidate — natural, conversational, professional, 1-4 sentences>",
  "stage": "<one of: welcome | intro | readiness | interview | followup | closing | complete>",
  "questionIndex": <integer — increment only for NEW main questions, not follow-ups>,
  "isComplete": <boolean — true ONLY after delivering the final farewell/closing message>,
  "observation": "<your private evaluation note for this turn: quality, depth, accuracy, confidence, communication style, key points made or missed — NEVER shown to the candidate>"
}`;
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

    const raw = await groqChat(groqMessages, { temperature: 0.75, maxTokens: 512 });

    // Parse JSON response — strip any surrounding markdown if the model adds it
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned no valid JSON");

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
