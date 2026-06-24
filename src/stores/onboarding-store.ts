import { create } from 'zustand';
import { OnboardingProgress, OnboardingStep1Data, OnboardingStep2Data, OnboardingStep3Data, OnboardingStep4Data, OnboardingStep5Data, OnboardingStep6Data } from '@/types/onboarding.types';

interface OnboardingStore {
  progress: OnboardingProgress;
  isLoading: boolean;
  error: string | null;
  
  // Step setters
  setStep1: (data: OnboardingStep1Data) => void;
  setStep2: (data: OnboardingStep2Data) => void;
  setStep3: (data: OnboardingStep3Data) => void;
  setStep4: (data: OnboardingStep4Data) => void;
  setStep5: (data: OnboardingStep5Data) => void;
  setStep6: (data: OnboardingStep6Data) => void;
  
  // Navigation
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Lifecycle
  complete: () => void;
  reset: () => void;
  
  // Server sync
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
}

const initialProgress: OnboardingProgress = {
  currentStep: 1,
  step1: null,
  step2: null,
  step3: null,
  step4: null,
  step5: null,
  step6: null,
  completed: false,
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  progress: initialProgress,
  isLoading: false,
  error: null,
  
  setStep1: (data) => {
    set((state) => ({
      progress: { ...state.progress, step1: data },
    }));
  },
  
  setStep2: (data) => {
    set((state) => ({
      progress: { ...state.progress, step2: data },
    }));
  },
  
  setStep3: (data) => {
    set((state) => ({
      progress: { ...state.progress, step3: data },
    }));
  },
  
  setStep4: (data) => {
    set((state) => ({
      progress: { ...state.progress, step4: data },
    }));
  },
  
  setStep5: (data) => {
    set((state) => ({
      progress: { ...state.progress, step5: data },
    }));
  },
  
  setStep6: (data) => {
    set((state) => ({
      progress: { ...state.progress, step6: data },
    }));
  },
  
  goToStep: (step) => {
    set((state) => ({
      progress: { ...state.progress, currentStep: Math.max(1, Math.min(7, step)) },
    }));
  },
  
  nextStep: () => {
    set((state) => ({
      progress: { ...state.progress, currentStep: Math.min(7, state.progress.currentStep + 1) },
    }));
  },
  
  previousStep: () => {
    set((state) => ({
      progress: { ...state.progress, currentStep: Math.max(1, state.progress.currentStep - 1) },
    }));
  },
  
  complete: () => {
    set((state) => ({
      progress: {
        ...state.progress,
        completed: true,
        completedAt: new Date(),
        currentStep: 7,
      },
    }));
  },
  
  reset: () => {
    set({ progress: initialProgress, error: null });
  },
  
  saveProgress: async () => {
    const { progress } = get();
    set({ isLoading: true });
    try {
      const response = await fetch('/api/v1/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });
      if (!response.ok) throw new Error('Failed to save progress');
      set({ error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadProgress: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/v1/onboarding/progress');
      const data = await response.json();
      set({ progress: data.progress, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
