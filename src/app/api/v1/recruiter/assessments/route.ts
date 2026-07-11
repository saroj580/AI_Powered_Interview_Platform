import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const assessments = await prisma.assessment.findMany({
    where: { createdById: user.userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { invites: true } },
      invites: {
        where: { completedAt: { not: null } },
        select: { id: true },
      },
    },
  });

  const formatted = assessments.map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
    difficulty: a.difficulty,
    targetRole: a.targetRole,
    questionCount: a.questionCount,
    durationMinutes: a.durationMinutes,
    isActive: a.isActive,
    createdAt: a.createdAt,
    totalInvites: a._count.invites,
    completedCount: a.invites.length,
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, type, difficulty, targetRole, questionCount, durationMinutes, questions } = body;

  if (!title || !targetRole) {
    return NextResponse.json({ error: "Title and targetRole are required" }, { status: 400 });
  }

  const assessment = await prisma.assessment.create({
    data: {
      title,
      type: type ?? "TECHNICAL",
      difficulty: difficulty ?? "MEDIUM",
      targetRole,
      questionCount: questionCount ?? 5,
      durationMinutes: durationMinutes ?? 30,
      questions: questions ?? [],
      createdById: user.userId,
    },
  });

  return NextResponse.json(assessment, { status: 201 });
}
