import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";
import { groqChat } from "@/lib/groq";

// Score dimensions per interview type — what actually matters for each format
const SCORE_SCHEMA: Record<string, Record<string, string>> = {
  CODING: {
    codeQuality:        "Readability, structure, naming, comments",
    problemSolving:     "Approach, correctness, handling edge cases",
    algorithmKnowledge: "Choice of data structures and algorithms",
    codeEfficiency:     "Time/space complexity, optimization",
  },
  TECHNICAL: {
    technicalKnowledge: "Accuracy and depth of technical answers",
    problemSolving:     "Logical thinking and solution approach",
    conceptClarity:     "Clear explanation of concepts",
    breadth:            "Coverage of relevant topics",
  },
  BEHAVIORAL: {
    communication:      "Clarity and structure of answers (STAR method)",
    situationalJudgment:"Decision-making in real scenarios",
    selfAwareness:      "Reflection on strengths and growth areas",
    teamwork:           "Collaboration and leadership examples",
  },
  APTITUDE: {
    logicalReasoning:   "Pattern recognition and deductive reasoning",
    numericalAbility:   "Accuracy with numbers and quantitative problems",
    problemSolving:     "Strategy and efficiency in solving problems",
    accuracy:           "Correctness rate across all questions",
  },
  VOICE: {
    communication:      "Clarity, fluency, and structure",
    confidence:         "Tone, pacing, and self-assurance",
    articulation:       "Precise word choice and expression",
    coherence:          "Logical flow and relevance of answers",
  },
  MIXED: {
    technical:          "Technical knowledge and accuracy",
    behavioral:         "Situational and soft-skill responses",
    communication:      "Overall clarity and expression",
    problemSolving:     "Analytical and critical thinking",
  },
};

function buildScoreTemplate(type: string): string {
  const dims = SCORE_SCHEMA[type] ?? SCORE_SCHEMA.TECHNICAL;
  const lines = Object.entries(dims).map(([k, desc]) => `    "${k}": <0-100>  // ${desc}`).join(",\n");
  return `{\n${lines},\n    "overall": <0-100>\n  }`;
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

    const { answers } = await req.json() as {
      answers: Array<{ question: string; answer: string; correct?: boolean }>
    };

    const isMCQ = interview.type !== "CODING" && interview.type !== "VOICE";
    const answered = answers.filter((a) => a.answer && a.answer !== "No answer" && a.answer !== "No solution submitted");
    const correctCount = isMCQ ? answers.filter((a) => a.correct === true).length : null;
    const mcqScore = isMCQ && answers.length > 0 ? Math.round((correctCount! / answers.length) * 100) : null;

    const qaSummary = answers.map((a, i) =>
      `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}${a.correct !== undefined ? ` [${a.correct ? "CORRECT" : "WRONG"}]` : ""}`
    ).join("\n\n");

    const scoreTemplate = buildScoreTemplate(interview.type);

    const contextLine = isMCQ
      ? `Objective MCQ result: ${mcqScore}/100 (${correctCount} correct out of ${answers.length} questions answered)`
      : `${answered.length} of ${answers.length} questions answered.`;

    const evalPrompt = `You are an expert interviewer evaluating a ${interview.type} interview for a ${interview.targetRole} candidate at ${interview.difficulty} difficulty.

${contextLine}
Questions and answers:
${qaSummary}

Evaluate ONLY the dimensions relevant to a ${interview.type} interview. Return ONLY valid JSON (no markdown, no extra text):
{
  "scores": ${scoreTemplate},
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific area to improve 1", "specific area to improve 2"],
  "improvements": ["concrete action step 1", "concrete action step 2", "concrete action step 3"],
  "summary": "2-3 sentence assessment specific to a ${interview.type} interview"
}
${isMCQ ? `The MCQ score of ${mcqScore}/100 should heavily influence "overall" and the primary dimension.` : ""}
Be specific — reference actual questions and answers in your feedback, not generic advice.`;

    const raw = await groqChat([{ role: "user", content: evalPrompt }], {
      temperature: 0.3,
      maxTokens: 1200,
    });

    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI returned no valid JSON");

    const evaluation = JSON.parse(match[0]);

    await prisma.interview.update({
      where: { id },
      data: { status: "COMPLETED", totalScore: evaluation.scores.overall },
    });

    return NextResponse.json({
      evaluation,
      meta: {
        title: interview.title,
        type: interview.type,
        role: interview.targetRole,
        difficulty: interview.difficulty,
        questionCount: answers.length,
        answeredCount: answered.length,
        durationMinutes: interview.durationMinutes,
      },
    });
  } catch (err) {
    console.error("[interview/submit]", err);
    return NextResponse.json({ error: "Failed to evaluate interview" }, { status: 500 });
  }
}
