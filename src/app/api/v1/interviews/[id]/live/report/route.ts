import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";
import { groqChat } from "@/lib/groq";

interface LiveMessage {
  role: "interviewer" | "candidate";
  content: string;
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

    const { history, observations } = await req.json() as {
      history: LiveMessage[];
      observations: string[];
    };

    const conversationText = history
      .map((m) => `${m.role === "interviewer" ? "Interviewer" : "Candidate"}: ${m.content}`)
      .join("\n\n");

    const observationsText = observations.length > 0
      ? observations.map((o, i) => `Turn ${i + 1}: ${o}`).join("\n")
      : "No detailed observations recorded.";

    const prompt = `You are a senior hiring manager writing a comprehensive interview evaluation report.

You just observed a live technical interview for a ${interview.targetRole} candidate at ${interview.difficulty} difficulty.

===FULL INTERVIEW TRANSCRIPT===
${conversationText}

===EVALUATOR OBSERVATIONS (per question turn)===
${observationsText}

Generate a detailed, evidence-based evaluation report as valid JSON with no markdown or extra text.
Base EVERY claim on specific moments from the transcript — do not fabricate generic feedback.

Return this exact JSON structure:
{
  "overallScore": <integer 0-100>,
  "level": "<Fresher | Junior | Mid-Level | Senior | Lead>",
  "hiringRecommendation": "<Strong Hire | Hire | Consider | No Hire>",
  "summary": "<3-4 sentence overall performance summary referencing specific interview moments>",

  "categoryScores": {
    "technicalKnowledge":  { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] },
    "problemSolving":      { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] },
    "communication":       { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] },
    "confidence":          { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] },
    "analyticalThinking":  { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] },
    "systemThinking":      { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] },
    "clarity":             { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] },
    "accuracy":            { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] },
    "professionalism":     { "score": <0-100>, "explanation": "<2 sentences>", "observations": ["<evidence 1>", "<evidence 2>"] }
  },

  "strengths": [
    { "title": "<strength name>", "evidence": "<specific quote or moment from the interview>" }
  ],

  "weaknesses": [
    { "title": "<weakness name>", "whyItMatters": "<1 sentence>", "impact": "<how it affected this interview>" }
  ],

  "questionAnalysis": [
    {
      "question": "<question the interviewer asked>",
      "candidateAnswer": "<brief summary of candidate's response>",
      "score": <0-100>,
      "strengths": "<what was done well>",
      "improvements": "<what was missing or incorrect>",
      "idealAnswer": "<key points an ideal answer should have covered>"
    }
  ],

  "communicationAnalysis": {
    "clarity": "<assessment>",
    "fluency": "<assessment>",
    "confidence": "<assessment>",
    "conciseness": "<assessment>",
    "technicalExplanation": "<ability to explain technical concepts clearly>",
    "professionalism": "<professional conduct>",
    "useOfExamples": "<whether candidate used concrete examples>",
    "overall": "<1-2 sentence overall communication verdict>"
  },

  "technicalAnalysis": {
    "conceptualUnderstanding": "<depth of conceptual knowledge>",
    "codingKnowledge": "<coding and implementation awareness>",
    "problemSolvingProcess": "<how they approached problems>",
    "decisionMaking": "<quality of technical decisions>",
    "algorithmicThinking": "<algorithmic and data structure awareness>",
    "systematicApproach": "<structured vs ad-hoc thinking>",
    "solutionJustification": "<ability to defend choices>"
  },

  "behavioralAnalysis": {
    "confidenceLevel": "<assessment>",
    "handlingPressure": "<how they handled difficult questions>",
    "listeningSkills": "<how well they listened before answering>",
    "adaptability": "<ability to handle follow-up / pivot>",
    "curiosity": "<evidence of genuine interest>",
    "honestyWhenUnsure": "<did they admit uncertainty vs bluff>",
    "professionalAttitude": "<overall demeanor>"
  },

  "improvementPlan": {
    "priorityTopics": ["<topic 1>", "<topic 2>", "<topic 3>"],
    "conceptsToRevise": ["<concept 1>", "<concept 2>"],
    "practiceStrategy": "<specific practice recommendation>",
    "interviewPrep": "<interview preparation advice>",
    "communicationTips": "<how to improve communication>",
    "confidenceBuilding": "<confidence-building exercises>",
    "timeManagement": "<time management recommendation>"
  },

  "actionableTips": [
    "<specific actionable tip 1>",
    "<specific actionable tip 2>",
    "<specific actionable tip 3>",
    "<specific actionable tip 4>",
    "<specific actionable tip 5>"
  ],

  "finalSummary": {
    "overallImpression": "<1-2 sentence impression>",
    "hiringReadiness": "<readiness assessment>",
    "biggestStrength": "<single biggest strength with evidence>",
    "biggestWeakness": "<single biggest area to improve>",
    "estimatedExperience": "<estimated years/level of experience demonstrated>",
    "recommendation": "<final recommendation sentence>",
    "closingMessage": "<warm, encouraging closing message to the candidate>"
  }
}

Be SPECIFIC and EVIDENCE-BASED. Reference exact things the candidate said. Do not give generic feedback that could apply to anyone.`;

    const raw = await groqChat([{ role: "user", content: prompt }], {
      temperature: 0.3,
      maxTokens: 6000,
    });

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned no valid JSON for report");

    const report = JSON.parse(jsonMatch[0]);

    // Persist overall score on the interview
    if (typeof report.overallScore === "number") {
      await prisma.interview.update({
        where: { id },
        data: { status: "COMPLETED", totalScore: report.overallScore },
      });
    }

    return NextResponse.json({
      report,
      meta: {
        title: interview.title,
        type: interview.type,
        role: interview.targetRole,
        difficulty: interview.difficulty,
        durationMinutes: interview.durationMinutes,
      },
    });
  } catch (err) {
    console.error("[live/report]", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
