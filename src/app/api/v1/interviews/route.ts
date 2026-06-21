import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const interviewSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["TECHNICAL", "BEHAVIORAL", "CODING", "VOICE", "MIXED"]),
  status: z.enum(["DRAFT", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  targetRole: z.string().min(2),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  questionCount: z.number().int().min(0),
  durationMinutes: z.number().int().min(1),
  createdById: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
});

export async function GET() {
  const interviews = await prisma.interview.findMany({
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      organization: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(interviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = interviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;
  const interview = await prisma.interview.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      status: data.status ?? "DRAFT",
      targetRole: data.targetRole,
      difficulty: data.difficulty,
      questionCount: data.questionCount,
      durationMinutes: data.durationMinutes,
      createdById: data.createdById,
      organizationId: data.organizationId,
    },
  });

  return NextResponse.json(interview, { status: 201 });
}
