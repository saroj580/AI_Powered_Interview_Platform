'use client';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { X } from 'lucide-react';

const SKILLS_BY_CATEGORY = {
  frontend: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Remix', 'Astro', 'TypeScript'],
  backend: ['Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'PHP', 'Ruby'],
  database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB', 'Cassandra'],
  cloud: ['AWS', 'Google Cloud', 'Azure', 'Heroku', 'Vercel'],
  devops: ['Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab', 'CI/CD'],
};

export default function OnboardingStep3() {
  const router = useRouter();
  const { progress, setStep3, nextStep, previousStep } = useOnboardingStore();
  
  const [selectedSkills, setSelectedSkills] = useState(progress.step3?.skills.map(s => s.name) || []);
  const [activeCategory, setActiveCategory] = useState<keyof typeof SKILLS_BY_CATEGORY>('frontend');

  const isValid = selectedSkills.length > 0;

  const handleSelectSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleNext = async () => {
    if (!isValid) return;
    
    setStep3({
      skills: selectedSkills.map((name, i) => ({
        id: `skill-${i}`,
        name,
        category: 'other',
      })),
    });
    
    nextStep();
    router.push('/onboarding/step-4-resume');
  };

  const handlePrevious = () => {
    previousStep();
    router.push('/onboarding/step-2-career-goals');
  };

  return (
    <OnboardingLayout
      currentStep={3}
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextDisabled={!isValid}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            What's your tech stack?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Select technologies you're comfortable with.
          </p>
        </div>

        <div className="space-y-6">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.keys(SKILLS_BY_CATEGORY).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as keyof typeof SKILLS_BY_CATEGORY)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SKILLS_BY_CATEGORY[activeCategory].map((skill) => (
              <button
                key={skill}
                onClick={() => handleSelectSkill(skill)}
                className={`p-3 rounded-lg border-2 font-medium transition-all text-sm sm:text-base ${
                  selectedSkills.includes(skill)
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Selected Skills ({selectedSkills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 px-3 py-1">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Helper text */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 Select at least 3-5 technologies. We'll generate questions based on your tech stack and weaker areas.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
