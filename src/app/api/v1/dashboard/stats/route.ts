import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";

const TYPE_LABEL: Record<string, string> = {
  TECHNICAL: "Technical", BEHAVIORAL: "Behavioral", CODING: "Coding",
  VOICE: "Voice", MIXED: "Mixed", APTITUDE: "Aptitude", LIVE: "Live",
};

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const interviews = await prisma.interview.findMany({
      where: { createdById: user.userId },
      select: { id: true, type: true, status: true, totalScore: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const completed = interviews.filter(
      (iv) => iv.status === "COMPLETED" && iv.totalScore !== null
    );

    const avgScore =
      completed.length > 0
        ? Math.round(completed.reduce((s, iv) => s + (iv.totalScore ?? 0), 0) / completed.length)
        : 0;

    // Avg score per interview type → strong / weak areas
    const byType: Record<string, number[]> = {};
    completed.forEach((iv) => {
      if (!byType[iv.type]) byType[iv.type] = [];
      byType[iv.type].push(iv.totalScore!);
    });

    const strong: string[] = [];
    const weak: string[] = [];
    Object.entries(byType).forEach(([type, scores]) => {
      const avg = scores.reduce((s, n) => s + n, 0) / scores.length;
      const label = TYPE_LABEL[type] ?? type;
      if (avg >= 75) strong.push(label);
      else if (avg < 65) weak.push(label);
    });

    // Weekly change: completed interviews this week vs prior week
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thisWeek = interviews.filter((iv) => new Date(iv.createdAt) > weekAgo).length;
    const lastWeek = interviews.filter(
      (iv) => new Date(iv.createdAt) > twoWeeksAgo && new Date(iv.createdAt) <= weekAgo
    ).length;

    return NextResponse.json({
      totalInterviews: interviews.length,
      completedInterviews: completed.length,
      averageScore: avgScore,
      strong,
      weak,
      weeklyChange: thisWeek - lastWeek,
    });
  } catch (err) {
    console.error("[dashboard/stats]", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
