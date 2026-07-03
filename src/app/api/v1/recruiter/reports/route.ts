import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const invites = await prisma.candidateInvite.findMany({
    where: {
      assessment: { createdById: user.userId },
      createdAt: { gte: sixMonthsAgo },
    },
    select: {
      createdAt: true,
      completedAt: true,
      score: true,
      stage: true,
      assessment: { select: { targetRole: true } },
    },
  });

  // Build monthly buckets
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      m: d.getMonth(),
      y: d.getFullYear(),
    };
  });

  const monthlyData = months.map(({ month, m, y }) => {
    const bucket = invites.filter((inv) => {
      const d = new Date(inv.createdAt);
      return d.getMonth() === m && d.getFullYear() === y;
    });
    const completed = bucket.filter((inv) => inv.completedAt);
    const scores = completed.filter((inv) => inv.score != null).map((inv) => inv.score!);
    return {
      month,
      candidates: bucket.length,
      completed: completed.length,
      avg: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    };
  });

  // Role breakdown
  const roleMap = new Map<string, { candidates: number; hired: number; scores: number[] }>();
  for (const inv of invites) {
    const role = inv.assessment.targetRole;
    if (!roleMap.has(role)) roleMap.set(role, { candidates: 0, hired: 0, scores: [] });
    const entry = roleMap.get(role)!;
    entry.candidates++;
    if (inv.stage === "HIRED") entry.hired++;
    if (inv.score != null) entry.scores.push(inv.score);
  }
  const roleBreakdown = [...roleMap.entries()].map(([role, v]) => ({
    role,
    candidates: v.candidates,
    hired: v.hired,
    avgScore: v.scores.length > 0 ? Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length) : 0,
  })).sort((a, b) => b.candidates - a.candidates).slice(0, 6);

  // Stage funnel
  const stageCounts = {
    APPLIED: 0, INTERVIEW_SCHEDULED: 0, INTERVIEW_COMPLETED: 0,
    SHORTLISTED: 0, HIRED: 0, REJECTED: 0,
  } as Record<string, number>;
  for (const inv of invites) stageCounts[inv.stage] = (stageCounts[inv.stage] ?? 0) + 1;

  return NextResponse.json({ monthlyData, roleBreakdown, stageCounts });
}
