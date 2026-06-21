import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const resumeSchema = z.object({
  userId: z.string().uuid(),
  fileUrl: z.string().url(),
  parsedText: z.string().optional(),
});

export async function GET() {
  const resumes = await prisma.resume.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(resumes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = resumeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const resume = await prisma.resume.create({
    data: {
      userId: parsed.data.userId,
      fileUrl: parsed.data.fileUrl,
      parsedText: parsed.data.parsedText,
    },
  });

  return NextResponse.json(resume, { status: 201 });
}
