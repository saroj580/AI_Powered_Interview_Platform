import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const interview = await prisma.interview.findFirst({
      where: { id, createdById: user.userId },
    });
    if (!interview) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(interview);
  } catch (err) {
    console.error("[interviews GET id]", err);
    return NextResponse.json({ error: "Failed to fetch interview" }, { status: 500 });
  }
}
