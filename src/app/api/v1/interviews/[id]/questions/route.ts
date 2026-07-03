import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";
import { groqChat } from "@/lib/groq";

const MCQ_TYPES = ["TECHNICAL", "BEHAVIORAL", "MIXED", "APTITUDE"];

function buildVoicePrompt(role: string, difficulty: string, count: number) {
  return `Generate exactly ${count} open-ended conversational interview questions for a ${role} candidate at ${difficulty} difficulty.
Focus on situational and behavioral scenarios ideal for spoken verbal responses — communication, teamwork, leadership, and self-reflection.
Return ONLY a valid JSON array with no markdown or extra text:
[
  {
    "id": "1",
    "question": "question text"
  }
]
Each question must be clear, standalone, and suitable for a 1-2 minute verbal answer. Generate all ${count} questions.`;
}

function buildMCQPrompt(type: string, role: string, difficulty: string, count: number) {
  const focus: Record<string, string> = {
    TECHNICAL: "core programming concepts, data structures, algorithms, system design, and role-specific technical knowledge",
    BEHAVIORAL: "STAR-method scenarios, leadership, teamwork, conflict resolution, and communication skills",
    MIXED: "a balanced mix of 50% technical questions (concepts, code) and 50% behavioral scenarios (STAR method)",
    APTITUDE: "logical reasoning, numerical aptitude, pattern recognition, verbal reasoning, and problem-solving ability",
  };
  return `Generate exactly ${count} ${type} multiple-choice interview questions for a ${role} candidate at ${difficulty} difficulty.
Focus areas: ${focus[type] ?? "general technical and behavioral skills"}.
Return ONLY a valid JSON array with no markdown or extra text:
[
  {
    "id": "1",
    "question": "question text",
    "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
    "correct": 0,
    "explanation": "why this answer is correct"
  }
]
"correct" is the 0-indexed position of the right answer. Generate all ${count} questions.`;
}

function buildCodingPrompt(role: string, difficulty: string, count: number) {
  return `Generate exactly ${count} coding problem(s) for a ${role} candidate at ${difficulty} difficulty.
Return ONLY a valid JSON array with no markdown or extra text:
[
  {
    "id": "1",
    "title": "problem title",
    "description": "full problem description with context",
    "examples": [{"input": "...", "output": "...", "explanation": "..."}],
    "constraints": ["constraint 1", "constraint 2"],
    "starterCode": {
      "javascript": "// starter code",
      "python": "# starter code",
      "java": "// starter code"
    }
  }
]
Make problems realistic and appropriate for the difficulty level.`;
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

    const isCoding = interview.type === "CODING";
    const isVoice = interview.type === "VOICE";

    const prompt = isCoding
      ? buildCodingPrompt(interview.targetRole, interview.difficulty, interview.questionCount)
      : isVoice
        ? buildVoicePrompt(interview.targetRole, interview.difficulty, interview.questionCount)
        : buildMCQPrompt(interview.type, interview.targetRole, interview.difficulty, interview.questionCount);

    const raw = await groqChat([{ role: "user", content: prompt }], {
      temperature: 0.7,
      maxTokens: 4096,
    });

    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("AI returned no valid JSON array");

    const questions = JSON.parse(match[0]);
    return NextResponse.json({ questions, type: interview.type });
  } catch (err) {
    console.error("[interview/questions]", err);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
