import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { progress } = await req.json();

  if (!progress) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }

  // TODO: Implement actual saving to database
  // For now, we're just storing in memory/session

  return NextResponse.json({
    success: true,
    message: 'Progress saved',
  });
}
