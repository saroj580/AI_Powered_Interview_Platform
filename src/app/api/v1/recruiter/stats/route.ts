import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalAssessments,
    activeAssessments,
    totalInvites,
    completedInvites,
    scores,
    thisMonth,
    lastMonth,
  ] = await Promise.all([
    prisma.assessment.count({ where: { createdById: user.userId } }),
    prisma.assessment.count({ where: { createdById: user.userId, isActive: true } }),
    prisma.candidateInvite.count({
      where: { assessment: { createdById: user.userId } },
    }),
    prisma.candidateInvite.count({
      where: { assessment: { createdById: user.userId }, completedAt: { not: null } },
    }),
    prisma.candidateInvite.findMany({
      where: { assessment: { createdById: user.userId }, score: { not: null } },
      select: { score: true },
    }),
    prisma.candidateInvite.count({
      where: {
        assessment: { createdById: user.userId },
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    prisma.candidateInvite.count({
      where: {
        assessment: { createdById: user.userId },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((s, r) => s + (r.score ?? 0), 0) / scores.length)
      : 0;

  const completionRate =
    totalInvites > 0 ? Math.round((completedInvites / totalInvites) * 100) : 0;

  const candidateChange = lastMonth > 0
    ? `+${Math.round(((thisMonth - lastMonth) / lastMonth) * 100)}% vs last month`
    : `+${thisMonth} this month`;

  return NextResponse.json({
    totalAssessments,
    activeAssessments,
    totalCandidates: totalInvites,
    completedInterviews: completedInvites,
    completionRate,
    avgScore,
    candidateChange,
  });
}
