import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { prisma, withRetry } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const token = extractToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { progress, complete } = await req.json();

  if (!progress) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  if (progress.step1?.fullName) {
    updateData.name = progress.step1.fullName;
  }

  if (complete) {
    updateData.onboardingCompleted = true;
  }

  const updatedUser = await withRetry(() =>
    prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
    })
  );

  const newToken = signToken({
    userId: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role,
    onboardingCompleted: updatedUser.onboardingCompleted,
    name: updatedUser.name,
  });

  const response = NextResponse.json({
    success: true,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      onboardingCompleted: updatedUser.onboardingCompleted,
    },
    token: newToken,
  });

  response.cookies.set(AUTH_COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
