import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ inviteId: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { inviteId } = await params;
  const { stage, notes } = await req.json();

  const invite = await prisma.candidateInvite.findFirst({
    where: { id: inviteId, assessment: { createdById: user.userId } },
  });
  if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.candidateInvite.update({
    where: { id: inviteId },
    data: {
      ...(stage ? { stage } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  return NextResponse.json(updated);
}
