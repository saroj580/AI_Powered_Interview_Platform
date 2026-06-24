import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [sessions, interviews] = await Promise.all([
      prisma.session.findMany({
        where: { userId: user.userId },
        include: { evaluation: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.interview.count({ where: { createdById: user.userId } }),
    ]);

    const completed = sessions.filter((s) => s.status === "COMPLETED" && s.score !== null);
    const avgScore =
      completed.length > 0
        ? Math.round(completed.reduce((sum, s) => sum + (s.score ?? 0), 0) / completed.length)
        : 0;

    // Aggregate evaluations for skill breakdown
    const evals = sessions.filter((s) => s.evaluation).map((s) => s.evaluation!);
    const skillBreakdown =
      evals.length > 0
        ? {
            technical: Math.round(evals.reduce((s, e) => s + e.technical, 0) / evals.length),
            communication: Math.round(evals.reduce((s, e) => s + e.communication, 0) / evals.length),
            problemSolving: Math.round(evals.reduce((s, e) => s + e.problemSolving, 0) / evals.length),
            confidence: Math.round(evals.reduce((s, e) => s + e.confidence, 0) / evals.length),
          }
        : null;

    // Determine strong/weak topics from evaluations
    const strong: string[] = [];
    const weak: string[] = [];
    if (skillBreakdown) {
      const topics = [
        { name: "Technical", score: skillBreakdown.technical },
        { name: "Communication", score: skillBreakdown.communication },
        { name: "Problem Solving", score: skillBreakdown.problemSolving },
        { name: "Confidence", score: skillBreakdown.confidence },
      ];
      topics.forEach((t) => {
        if (t.score >= 75) strong.push(t.name);
        else if (t.score < 65) weak.push(t.name);
      });
    }

    // Weekly change: compare sessions in last 7 days vs prior 7 days
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thisWeek = sessions.filter((s) => new Date(s.createdAt) > weekAgo).length;
    const lastWeek = sessions.filter(
      (s) => new Date(s.createdAt) > twoWeeksAgo && new Date(s.createdAt) <= weekAgo
    ).length;

    return NextResponse.json({
      totalInterviews: interviews,
      totalSessions: sessions.length,
      completedSessions: completed.length,
      averageScore: avgScore,
      strong,
      weak,
      weeklyChange: thisWeek - lastWeek,
      skillBreakdown,
    });
  } catch (err) {
    console.error("[dashboard/stats]", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
