import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/get-auth-user";

const interviewSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["TECHNICAL", "BEHAVIORAL", "CODING", "VOICE", "MIXED"]),
  status: z.enum(["DRAFT", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  targetRole: z.string().min(2),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  questionCount: z.number().int().min(0),
  durationMinutes: z.number().int().min(1),
  organizationId: z.string().uuid().optional(),
});

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const limit = Number(searchParams.get("limit") ?? "50");
  const status = searchParams.get("status");
  const search = searchParams.get("search") ?? "";

  try {
    const interviews = await prisma.interview.findMany({
      where: {
        createdById: user.userId,
        ...(status ? { sessions: { some: { status: status as never } } } : {}),
        ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      },
      include: {
        sessions: {
          where: { userId: user.userId },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const formatted = interviews.map((iv) => {
      const session = iv.sessions[0];
      return {
        id: iv.id,
        title: iv.title,
        type: iv.type,
        difficulty: iv.difficulty,
        targetRole: iv.targetRole,
        questionCount: iv.questionCount,
        durationMinutes: iv.durationMinutes,
        status: session?.status ?? "DRAFT",
        score: session?.score ?? null,
        sessionId: session?.id ?? null,
        createdAt: iv.createdAt,
        startedAt: session?.startedAt ?? null,
        endedAt: session?.endedAt ?? null,
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("[interviews GET]", err);
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
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
        createdById: user.userId,
        organizationId: data.organizationId,
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (err) {
    console.error("[interviews POST]", err);
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 });
  }
}
