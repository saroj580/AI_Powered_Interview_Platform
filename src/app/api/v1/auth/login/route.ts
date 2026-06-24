import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password format." }, { status: 422 });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "No account found with that email." }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "This account uses Google sign-in. Please click 'Continue with Google'." },
        { status: 401 }
      );
    }

    const passwordMatches = await verifyPassword(password, user.password);
    if (!passwordMatches) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      name: user.name,
    });

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        onboardingCompleted: user.onboardingCompleted,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
