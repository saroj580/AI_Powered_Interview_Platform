'use client';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AtsScore {
  score: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  detectedSkills: string[];
}

export default function OnboardingStep5() {
  const router = useRouter();
  const { setStep5, nextStep, previousStep } = useOnboardingStore();
  const [atsScore, setAtsScore] = useState<AtsScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate ATS analysis
    const timer = setTimeout(() => {
      const mockScore: AtsScore = {
        score: 78,
        strengths: [
          'Good keyword density for target role',
          'Clear technical skills section',
          'Quantified achievements',
          'Professional formatting',
        ],
        improvements: [
          'Add more system design experience',
          'Include metrics for past projects',
          'Add leadership keywords',
          'Expand cloud platform experience',
        ],
        missingKeywords: [
          'Microservices',
          'Kubernetes',
          'GraphQL',
          'Machine Learning',
        ],
        detectedSkills: [
          'React',
          'Node.js',
          'PostgreSQL',
          'AWS',
          'Docker',
          'TypeScript',
        ],
      };
      setAtsScore(mockScore);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    if (atsScore) {
      setStep5({
        atsAnalysis: atsScore,
      });
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
      nextDisabled={isLoading}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Your Resume Analysis
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            AI-powered insights for ATS optimization and role alignment.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        ) : atsScore ? (
          <div className="space-y-6">
            {/* ATS Score */}
            <div className={`p-8 rounded-lg border ${getScoreBg(atsScore.score)} border-slate-200 dark:border-slate-700`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">ATS Score</h3>
                <TrendingUp className={`w-5 h-5 ${getScoreColor(atsScore.score)}`} />
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(atsScore.score)}`}>
                {atsScore.score}
                <span className="text-2xl">/100</span>
              </div>
              <div className="mt-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    atsScore.score >= 85
                      ? 'bg-green-600'
                      : atsScore.score >= 70
                      ? 'bg-blue-600'
                      : atsScore.score >= 55
                      ? 'bg-amber-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${atsScore.score}%` }}
                />
              </div>
            </div>

            {/* Detected Skills */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Detected Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {atsScore.detectedSkills.map((skill) => (
                  <Badge key={skill} variant="default" className="bg-green-600 hover:bg-green-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Strengths */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Resume Strengths
              </h3>
              <ul className="space-y-2">
                {atsScore.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
                    ✓ {strength}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Improvements */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Recommended Improvements
              </h3>
              <ul className="space-y-2">
                {atsScore.improvements.map((improvement, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
                    • {improvement}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Missing Keywords */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Keywords to Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {atsScore.missingKeywords.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="text-amber-600 border-amber-600">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        {/* Helper text */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 Your resume will be checked against 50+ ATS systems. Follow the suggestions above to improve your chances.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
