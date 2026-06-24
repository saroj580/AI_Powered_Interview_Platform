import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // TODO: Get user ID from auth token
  // TODO: Fetch onboarding progress from database
  
  // For now, return empty progress
  return NextResponse.json({
    progress: {
      currentStep: 1,
      step1: null,
      step2: null,
      step3: null,
      step4: null,
      step5: null,
      step6: null,
      completed: false,
    },
  });
}

export async function POST(req: NextRequest) {
  const { progress } = await req.json();

  if (!progress) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }

  // TODO: Get user ID from auth token
  // TODO: Save progress to database
  
  return NextResponse.json({
    success: true,
    message: 'Progress updated',
  });
}
