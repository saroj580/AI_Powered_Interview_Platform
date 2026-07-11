import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const assessment = await prisma.assessment.findFirst({
    where: { id, createdById: user.userId },
    include: {
      invites: {
        orderBy: { createdAt: "desc" },
        include: { session: true },
      },
    },
  });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(assessment);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  const assessment = await prisma.assessment.updateMany({
    where: { id, createdById: user.userId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.questions !== undefined && { questions: body.questions }),
      ...(body.durationMinutes !== undefined && { durationMinutes: body.durationMinutes }),
    },
  });

  if (assessment.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.assessment.deleteMany({ where: { id, createdById: user.userId } });
  return NextResponse.json({ success: true });
}
