'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingRoot() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to step 1
    router.replace('/onboarding/step-1-welcome');
  }, [router]);

  return null;
}
