import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { groqChat } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { targetRole, type, difficulty, count = 5 } = await req.json();
  if (!targetRole || !type) {
    return NextResponse.json({ error: "targetRole and type are required" }, { status: 400 });
  }

  const typeDesc: Record<string, string> = {
    TECHNICAL:  "technical coding and system design",
    BEHAVIORAL: "behavioral STAR-method",
    CODING:     "algorithmic problem-solving and data structures",
    MIXED:      "mixed technical and behavioral",
    VOICE:      "conversational and communication-focused",
  };

  const prompt = `Generate ${count} interview questions for a ${difficulty} ${typeDesc[type] ?? type} interview for a ${targetRole} role.

Return a JSON array with this exact structure:
[
  {
    "id": "q1",
    "question": "<the interview question>",
    "type": "${type}",
    "difficulty": "${difficulty}",
    "expectedPoints": ["<key point 1>", "<key point 2>", "<key point 3>"],
    "timeLimit": <seconds, between 60 and 300>
  }
]

Make questions specific, realistic, and professional. For CODING type include algorithm/data structure problems. For BEHAVIORAL use STAR-method prompts. Return ONLY the JSON array, no markdown.`;

  const response = await groqChat([{ role: "user", content: prompt }], {
    temperature: 0.7,
    maxTokens: 1500,
  });

  const match = response.match(/\[[\s\S]*\]/);
  if (!match) {
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }

  const questions = JSON.parse(match[0]);
  return NextResponse.json({ questions });
}
