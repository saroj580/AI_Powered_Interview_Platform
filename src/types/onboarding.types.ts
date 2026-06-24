// Onboarding Progress Types

export interface OnboardingStep1Data {
  fullName: string;
  currentStatus: 'student' | 'fresher' | 'working-professional' | 'senior-professional';
}

export interface OnboardingStep2Data {
  targetRole: string;
  targetCompanies: string[];
}

export interface OnboardingStep3Data {
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'devops' | 'other';
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface OnboardingStep4Data {
  resumeFile: {
    name: string;
    size: number;
    type: string;
    url: string;
  } | null;
}

export interface AtsAnalysisResult {
  score: number;
  detectedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
}

export interface OnboardingStep5Data {
  atsAnalysis: AtsAnalysisResult | null;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  priority: number;
}

export interface OnboardingStep6Data {
  roadmap: RoadmapItem[];
}

export interface OnboardingProgress {
  currentStep: number; // 1-7
  step1: OnboardingStep1Data | null;
  step2: OnboardingStep2Data | null;
  step3: OnboardingStep3Data | null;
  step4: OnboardingStep4Data | null;
  step5: OnboardingStep5Data | null;
  step6: OnboardingStep6Data | null;
  completed: boolean;
  completedAt?: Date;
}
