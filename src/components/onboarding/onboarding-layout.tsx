'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  showNavigation?: boolean;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps = 7,
  onNext,
  onPrevious,
  nextDisabled = false,
  previousDisabled = false,
  showNavigation = true,
}: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header with progress */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">InterviewAI</h1>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <Card className="shadow-lg">
          <div className="p-8 sm:p-12">
            {children}
          </div>
        </Card>
      </div>

      {/* Navigation Footer */}
      {showNavigation && (
        <div className="sticky bottom-0 z-40 border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={previousDisabled}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="hidden sm:flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i + 1 <= currentStep
                        ? 'bg-blue-600'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={onNext}
                disabled={nextDisabled}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
