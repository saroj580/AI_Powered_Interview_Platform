import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";
import { format } from "date-fns";

const TYPE_LABEL: Record<string, string> = {
  TECHNICAL: "Technical", BEHAVIORAL: "Behavioral", CODING: "Coding",
  VOICE: "Voice", MIXED: "Mixed", APTITUDE: "Aptitude",
};

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const completed = await prisma.interview.findMany({
      where: { createdById: user.userId, status: "COMPLETED", totalScore: { not: null } },
      select: { id: true, title: true, type: true, totalScore: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Score history: monthly averages
    const monthlyMap = new Map<string, { sum: number; count: number }>();
    completed.forEach((iv) => {
      const key = format(new Date(iv.createdAt), "MMM yy");
      const prev = monthlyMap.get(key) ?? { sum: 0, count: 0 };
      monthlyMap.set(key, { sum: prev.sum + (iv.totalScore ?? 0), count: prev.count + 1 });
    });
    const scoreHistory = Array.from(monthlyMap.entries()).map(([month, { sum, count }]) => ({
      month,
      score: Math.round(sum / count),
    }));

    // Skill radar: avg score per interview type
    const byType: Record<string, number[]> = {};
    completed.forEach((iv) => {
      if (!byType[iv.type]) byType[iv.type] = [];
      byType[iv.type].push(iv.totalScore!);
    });
    const skillRadar = Object.entries(byType).map(([type, scores]) => ({
      skill: TYPE_LABEL[type] ?? type,
      score: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
    }));

    // Best score
    const scores = completed.map((iv) => iv.totalScore ?? 0);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const bestIv = completed.find((iv) => iv.totalScore === bestScore);

    // Improvement: difference between first and last completed score
    const firstScore = scores[0] ?? 0;
    const lastScore = scores[scores.length - 1] ?? 0;
    const improvement = lastScore - firstScore;

    return NextResponse.json({
      scoreHistory,
      skillRadar,
      bestScore,
      bestSessionTitle: bestIv?.title ?? "",
      improvement,
      totalCompleted: completed.length,
    });
  } catch (err) {
    console.error("[progress]", err);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}
