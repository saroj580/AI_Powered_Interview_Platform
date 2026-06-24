'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OnboardingStep7() {
  const router = useRouter();
  const { complete } = useOnboardingStore();

  useEffect(() => {
    // Mark onboarding as complete
    complete();
  }, [complete]);

  // Auto-redirect after 5 seconds if user doesn't click
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  const handleGoDashboard = () => {
    router.push('/dashboard');
  };

  const handleViewRoadmap = () => {
    router.push('/dashboard/roadmap');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="p-8 sm:p-12 text-center shadow-xl">
          {/* Success animation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-10 animate-pulse" />
              <div className="flex items-center justify-center w-full h-full">
                <CheckCircle2 className="w-20 h-20 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Main content */}
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            You're ready to start preparing! 🚀
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Your dashboard is now personalized based on your profile. Let's get you interview-ready.
          </p>

          {/* Feature preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: '📝', label: 'Mock Interviews', desc: 'Practice with AI' },
              { icon: '💻', label: 'Coding Practice', desc: 'Solve LeetCode-style problems' },
              { icon: '📊', label: 'Analytics', desc: 'Track your progress' },
              { icon: '🎯', label: 'Roadmap', desc: 'Your personalized learning plan' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {feature.label}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoDashboard}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2"
            >
              Go To Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleViewRoadmap}
              variant="outline"
              size="lg"
              className="font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              View Roadmap
            </Button>
          </div>

          {/* Helper text */}
          <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
            Auto-redirecting to dashboard in 5 seconds...
          </p>
        </Card>

        {/* Testimonial */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Join thousands preparing for interviews
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold"
              >
                {i}
              </div>
            ))}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-2">
              +12,500 candidates
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
