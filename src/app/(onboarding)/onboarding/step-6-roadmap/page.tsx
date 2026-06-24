'use client';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { BookOpen, Target, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoadmapItem } from '@/types/onboarding.types';

export default function OnboardingStep6() {
  const router = useRouter();
  const { setStep6, nextStep, previousStep } = useOnboardingStore();
  const [roadmap, setRoadmap] = useState<RoadmapItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate roadmap generation
    const timer = setTimeout(() => {
      const mockRoadmap: RoadmapItem[] = [
        {
          id: '1',
          title: 'React Advanced Patterns',
          description: 'Hooks, Context API, Code Splitting, Lazy Loading',
          category: 'Frontend',
          estimatedHours: 12,
          difficulty: 'intermediate',
          priority: 1,
        },
        {
          id: '2',
          title: 'System Design for Frontend',
          description: 'Performance, Scalability, State Management at Scale',
          category: 'System Design',
          estimatedHours: 15,
          difficulty: 'advanced',
          priority: 2,
        },
        {
          id: '3',
          title: 'Behavioral Interview Mastery',
          description: 'STAR Method, Communication, Conflict Resolution',
          category: 'Soft Skills',
          estimatedHours: 8,
          difficulty: 'beginner',
          priority: 3,
        },
        {
          id: '4',
          title: 'Database Query Optimization',
          description: 'Indexing, Query Plans, Performance Tuning',
          category: 'Backend',
          estimatedHours: 10,
          difficulty: 'intermediate',
          priority: 4,
        },
        {
          id: '5',
          title: 'Coding Interview Practice',
          description: 'Arrays, Strings, Trees, Graphs, DP Problems',
          category: 'Algorithms',
          estimatedHours: 20,
          difficulty: 'advanced',
          priority: 5,
        },
      ];
      setRoadmap(mockRoadmap);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    if (roadmap) {
      setStep6({
        roadmap,
      });
      nextStep();
      router.push('/onboarding/step-7-complete');
    }
  };

  const handlePrevious = () => {
    previousStep();
    router.push('/onboarding/step-5-ats-results');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700';
    }
  };

  return (
    <OnboardingLayout
      currentStep={6}
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextDisabled={isLoading}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Your Learning Roadmap
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Based on your role and skills, here's what to focus on.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : roadmap ? (
          <div className="space-y-4">
            {roadmap.map((item, index) => (
              <Card
                key={item.id}
                className="p-6 border-l-4 border-l-blue-600 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {item.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          ~{item.estimatedHours}h
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Summary Stats */}
        {roadmap && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {roadmap.length}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Topics</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(roadmap.reduce((sum, item) => sum + item.estimatedHours, 0) / 4)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Weeks to master</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {roadmap.reduce((sum, item) => sum + item.estimatedHours, 0)}h
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total hours</p>
            </div>
          </div>
        )}

        {/* Helper text */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/50">
          <p className="text-sm text-green-900 dark:text-green-100">
            🎯 This roadmap is personalized. You can adjust topics and add custom goals in your dashboard later.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
