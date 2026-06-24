import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sessions = await prisma.session.findMany({
      where: { userId: user.userId, status: "COMPLETED", score: { not: null } },
      include: { evaluation: true, interview: { select: { title: true, type: true, targetRole: true } } },
      orderBy: { createdAt: "asc" },
    });

    // Score history: group by month
    const monthlyMap = new Map<string, { sum: number; count: number }>();
    sessions.forEach((s) => {
      const key = format(new Date(s.createdAt), "MMM yy");
      const prev = monthlyMap.get(key) ?? { sum: 0, count: 0 };
      monthlyMap.set(key, { sum: prev.sum + (s.score ?? 0), count: prev.count + 1 });
    });
    const scoreHistory = Array.from(monthlyMap.entries()).map(([month, { sum, count }]) => ({
      month,
      score: Math.round(sum / count),
    }));

    // Skill radar from evaluations
    const evals = sessions.filter((s) => s.evaluation).map((s) => s.evaluation!);
    const skillRadar =
      evals.length > 0
        ? [
            { skill: "Technical", score: Math.round(evals.reduce((s, e) => s + e.technical, 0) / evals.length) },
            { skill: "Communication", score: Math.round(evals.reduce((s, e) => s + e.communication, 0) / evals.length) },
            { skill: "Problem Solving", score: Math.round(evals.reduce((s, e) => s + e.problemSolving, 0) / evals.length) },
            { skill: "Confidence", score: Math.round(evals.reduce((s, e) => s + e.confidence, 0) / evals.length) },
          ]
        : [];

    // Best score
    const scores = sessions.map((s) => s.score ?? 0);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const bestSession = sessions.find((s) => s.score === bestScore);

    // Improvement: score difference between first and last sessions
    const firstScore = scores[0] ?? 0;
    const lastScore = scores[scores.length - 1] ?? 0;
    const improvement = lastScore - firstScore;

    return NextResponse.json({
      scoreHistory,
      skillRadar,
      bestScore,
      bestSessionTitle: bestSession?.interview?.title ?? "",
      improvement,
      totalCompleted: sessions.length,
    });
  } catch (err) {
    console.error("[progress]", err);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}
