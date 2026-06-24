'use client';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { X } from 'lucide-react';

const TARGET_ROLES = [
  { value: 'frontend-developer', label: 'Frontend Developer', icon: '⚛️' },
  { value: 'backend-developer', label: 'Backend Developer', icon: '🔧' },
  { value: 'full-stack-developer', label: 'Full Stack Developer', icon: '🏗️' },
  { value: 'mobile-developer', label: 'Mobile Developer', icon: '📱' },
  { value: 'devops-engineer', label: 'DevOps Engineer', icon: '☁️' },
  { value: 'data-scientist', label: 'Data Scientist', icon: '📊' },
  { value: 'product-manager', label: 'Product Manager', icon: '🎯' },
  { value: 'solution-architect', label: 'Solution Architect', icon: '🏢' },
  { value: 'security-engineer', label: 'Security Engineer', icon: '🔐' },
  { value: 'qa-engineer', label: 'QA Engineer', icon: '🐛' },
];

export default function OnboardingStep2() {
  const router = useRouter();
  const { progress, setStep2, nextStep, previousStep } = useOnboardingStore();
  
  const [targetRole, setTargetRole] = useState(progress.step2?.targetRole || '');
  const [companies, setCompanies] = useState(progress.step2?.targetCompanies || []);
  const [companyInput, setCompanyInput] = useState('');

  const isValid = targetRole;

  const handleAddCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      setCompanies([...companies, companyInput.trim()]);
      setCompanyInput('');
    }
  };

  const handleRemoveCompany = (company: string) => {
    setCompanies(companies.filter((c) => c !== company));
  };

  const handleNext = async () => {
    if (!isValid) return;
    
    setStep2({
      targetRole,
      targetCompanies: companies,
    });
    
    nextStep();
    router.push('/onboarding/step-3-skills');
  };

  const handlePrevious = () => {
    previousStep();
    router.push('/onboarding/step-1-welcome');
  };

  return (
    <OnboardingLayout
      currentStep={2}
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextDisabled={!isValid}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            What's your target role?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            We'll personalize interview questions and learning paths based on this.
          </p>
        </div>

        <div className="space-y-6">
          {/* Target Role Selection */}
          <div>
            <Label className="text-base font-medium mb-4 block">
              Select your target role
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TARGET_ROLES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setTargetRole(value)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    targetRole === value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Companies */}
          <div>
            <Label htmlFor="companies" className="text-base font-medium">
              Target companies (optional)
            </Label>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Add companies you're interested in. We'll help you prepare for their interview questions.
            </p>
            <div className="flex gap-2">
              <Input
                id="companies"
                type="text"
                placeholder="e.g., Google, Meta, Microsoft"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
                className="h-12 text-base"
              />
              <Button
                type="button"
                onClick={handleAddCompany}
                variant="secondary"
                className="px-6"
              >
                Add
              </Button>
            </div>
            {companies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {companies.map((company) => (
                  <Badge key={company} variant="secondary" className="gap-1 px-3 py-1">
                    {company}
                    <button
                      onClick={() => handleRemoveCompany(company)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Helper text */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/50">
          <p className="text-sm text-green-900 dark:text-green-100">
            📍 Peers preparing for {targetRole ? TARGET_ROLES.find((r) => r.value === targetRole)?.label : 'your role'} focus on {['system design', 'algorithms', 'communication'].slice(0, 2).join(', ')}.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
