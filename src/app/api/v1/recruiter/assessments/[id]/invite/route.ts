import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const user = getAuthUser(req);
  if (!user || user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { emails } = await req.json() as { emails: string[] };

  if (!emails?.length) {
    return NextResponse.json({ error: "At least one email required" }, { status: 400 });
  }

  // Verify assessment belongs to this recruiter
  const assessment = await prisma.assessment.findFirst({
    where: { id, createdById: user.userId },
  });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Find any existing users with those emails
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true, email: true },
  });
  const userMap = new Map(existingUsers.map((u) => [u.email, u.id]));

  const results = await Promise.allSettled(
    emails.map((email) =>
      prisma.candidateInvite.create({
        data: {
          assessmentId: id,
          email,
          candidateId: userMap.get(email) ?? null,
        },
      })
    )
  );

  const created = results.filter((r) => r.status === "fulfilled").length;
  const skipped = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ created, skipped, message: `${created} invite(s) sent` });
}
