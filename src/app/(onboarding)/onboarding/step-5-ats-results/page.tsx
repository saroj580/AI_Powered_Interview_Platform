'use client';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { CheckCircle2, AlertCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OnboardingStep5() {
  const router = useRouter();
  const { progress, setStep5, nextStep, previousStep } = useOnboardingStore();
  const atsScore = progress.step5?.atsAnalysis ?? null;

  const handleNext = () => {
    if (atsScore) {
      setStep5({ atsAnalysis: atsScore });
      nextStep();
      router.push('/onboarding/step-6-roadmap');
    }
  };

  const handlePrevious = () => {
    previousStep();
    router.push('/onboarding/step-4-resume');
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 55) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 70) return 'bg-blue-50 dark:bg-blue-900/20';
    if (score >= 55) return 'bg-amber-50 dark:bg-amber-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <OnboardingLayout
      currentStep={5}
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextDisabled={!atsScore}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Resume Analysis</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            AI-powered insights for ATS optimization and role alignment.
          </p>
        </div>

        {!atsScore ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-slate-600 dark:text-slate-400">No resume analysis found.</p>
            <Link href="/onboarding/step-4-resume">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Go back and upload your resume
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ATS Score */}
            <div className={`p-8 rounded-lg border ${getScoreBg(atsScore.score)} border-slate-200 dark:border-slate-700`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">ATS Score</h3>
                <TrendingUp className={`w-5 h-5 ${getScoreColor(atsScore.score)}`} />
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(atsScore.score)}`}>
                {atsScore.score}<span className="text-2xl">/100</span>
              </div>
              <div className="mt-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    atsScore.score >= 85 ? 'bg-green-600'
                    : atsScore.score >= 70 ? 'bg-blue-600'
                    : atsScore.score >= 55 ? 'bg-amber-600'
                    : 'bg-red-600'
                  }`}
                  style={{ width: `${atsScore.score}%` }}
                />
              </div>
            </div>

            {/* Detected Skills */}
            {atsScore.detectedSkills.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Detected Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {atsScore.detectedSkills.map((skill) => (
                    <Badge key={skill} variant="default" className="bg-green-600 hover:bg-green-700">{skill}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Strengths */}
            {atsScore.strengths.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" /> Resume Strengths
                </h3>
                <ul className="space-y-2">
                  {atsScore.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300">✓ {strength}</li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Improvements */}
            {atsScore.improvements.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" /> Recommended Improvements
                </h3>
                <ul className="space-y-2">
                  {atsScore.improvements.map((improvement, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300">• {improvement}</li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Missing Keywords */}
            {atsScore.missingKeywords.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Keywords to Add</h3>
                <div className="flex flex-wrap gap-2">
                  {atsScore.missingKeywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-amber-600 border-amber-600">{keyword}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
