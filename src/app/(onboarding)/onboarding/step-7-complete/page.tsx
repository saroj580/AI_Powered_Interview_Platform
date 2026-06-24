'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useAuthStore } from '@/stores/auth-store';
import { CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function OnboardingStep7() {
  const router = useRouter();
  const { complete, progress } = useOnboardingStore();
  const { user, setUser, token } = useAuthStore();
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    async function completeOnboarding() {
      try {
        const res = await fetch('/api/v1/onboarding/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ progress, complete: true }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user && data.token) {
            setUser(data.user, data.token);
          }
          complete();
          toast.success("Onboarding complete! Welcome to InterviewAI 🎉");
        }
      } catch {
        toast.error("Could not save progress, but you can continue.");
      } finally {
        setSaving(false);
      }
    }

    completeOnboarding();
  }, [complete, progress, token, setUser]);

  useEffect(() => {
    if (saving) return;
    const timer = setTimeout(() => {
      const role = user?.role;
      if (role === 'RECRUITER') router.push('/recruiter/dashboard');
      else router.push('/candidate/dashboard');
    }, 5000);
    return () => clearTimeout(timer);
  }, [saving, router, user?.role]);

  function handleGoDashboard() {
    const role = user?.role;
    if (role === 'RECRUITER') router.push('/recruiter/dashboard');
    else router.push('/candidate/dashboard');
  }

  if (saving) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Saving your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="p-8 sm:p-12 text-center shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-primary rounded-full opacity-10 animate-pulse" />
              <div className="flex items-center justify-center w-full h-full">
                <CheckCircle2 className="w-20 h-20 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            You&apos;re all set! 🚀
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Your dashboard is personalized based on your profile. Let&apos;s get you interview-ready.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: '📝', label: 'Mock Interviews', desc: 'Practice with AI-generated questions' },
              { icon: '💻', label: 'Coding Practice', desc: 'Solve DSA & algorithm problems' },
              { icon: '📊', label: 'Analytics', desc: 'Track your scores over time' },
              { icon: '🎯', label: 'Personalized Roadmap', desc: 'Your custom learning plan' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{feature.label}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoDashboard}
              size="lg"
              className="bg-gradient-primary text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90"
            >
              Go To Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => toast.info("Roadmap coming soon!")}
              variant="outline"
              size="lg"
              className="font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              View Roadmap
            </Button>
          </div>

          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
            Auto-redirecting to dashboard in 5 seconds…
          </p>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Join thousands preparing for interviews
          </p>
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white text-xs font-bold"
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
