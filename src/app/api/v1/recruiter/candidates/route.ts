import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { prisma } from "@/lib/prisma";
import type { CandidateStage } from "@prisma/client";

const VALID_STAGES = new Set<string>([
  "APPLIED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_COMPLETED",
  "SHORTLISTED",
  "HIRED",
  "REJECTED",
]);

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const stageParam = searchParams.get("stage") ?? "";
  const search = searchParams.get("search") ?? "";

  if (stageParam && !VALID_STAGES.has(stageParam)) {
    return NextResponse.json({ error: "Invalid stage value" }, { status: 400 });
  }

  const stage = stageParam as CandidateStage | "";

  const invites = await prisma.candidateInvite.findMany({
    where: {
      assessment: { createdById: user.userId },
      ...(stage ? { stage } : {}),
      ...(search ? { email: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      assessment: { select: { id: true, title: true, targetRole: true } },
      candidate: { select: { id: true, name: true, email: true, image: true } },
      session: { select: { score: true, endedAt: true, aiEvaluation: true } },
    },
  });

  const formatted = invites.map((inv) => ({
    id: inv.id,
    email: inv.email,
    stage: inv.stage,
    score: inv.score ?? inv.session?.score ?? null,
    completedAt: inv.completedAt,
    createdAt: inv.createdAt,
    notes: inv.notes,
    assessment: inv.assessment,
    candidate: inv.candidate
      ? { ...inv.candidate }
      : { name: inv.email.split("@")[0], email: inv.email, image: null },
  }));

  return NextResponse.json(formatted);
}
