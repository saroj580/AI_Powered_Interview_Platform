'use client';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function OnboardingStep1() {
  const router = useRouter();
  const { progress, setStep1, nextStep } = useOnboardingStore();
  
  const [fullName, setFullName] = useState(progress.step1?.fullName || '');
  const [status, setStatus] = useState(progress.step1?.currentStatus || '');

  const isValid = fullName.trim() && status;

  const handleNext = async () => {
    if (!isValid) return;
    
    setStep1({
      fullName: fullName.trim(),
      currentStatus: status as any,
    });
    
    nextStep();
    router.push('/onboarding/step-2-career-goals');
  };

  return (
    <OnboardingLayout
      currentStep={1}
      onNext={handleNext}
      nextDisabled={!isValid}
      previousDisabled={true}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to InterviewAI 👋
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Let's personalize your interview preparation journey.
          </p>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="text-base font-medium">
              What's your name?
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 h-12 text-base"
              autoFocus
            />
          </div>

          {/* Current Status */}
          <div>
            <Label className="text-base font-medium mb-4 block">
              What's your current status?
            </Label>
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="space-y-3">
                {[
                  { value: 'student', label: 'Student', icon: '🎓' },
                  { value: 'fresher', label: 'Fresher (0-1 years experience)', icon: '🚀' },
                  { value: 'working-professional', label: 'Working Professional (1-5 years)', icon: '💼' },
                  { value: 'senior-professional', label: 'Senior Professional (5+ years)', icon: '⭐' },
                ].map(({ value, label, icon }) => (
                  <div key={value} className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="flex items-center gap-2 cursor-pointer flex-1">
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium">{label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Helper text */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 We use this information to tailor interview questions and learning paths to your experience level.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
