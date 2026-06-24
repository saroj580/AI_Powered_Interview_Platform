'use client';

import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function OnboardingStep4() {
  const router = useRouter();
  const { progress, setStep4, nextStep, previousStep } = useOnboardingStore();
  
  const [file, setFile] = useState<File | null>(progress.step4?.resumeFile ? new File([], progress.step4.resumeFile.name) : null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const isValid = file !== null;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (selectedFile.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleNext = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate file upload
      // In real implementation, upload to server
      setStep4({
        resumeFile: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: '#',
        },
      });

      nextStep();
      router.push('/onboarding/step-5-ats-results');
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePrevious = () => {
    previousStep();
    router.push('/onboarding/step-3-skills');
  };

  return (
    <OnboardingLayout
      currentStep={4}
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextDisabled={!isValid || isUploading}
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Upload your resume
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            We'll analyze it for ATS compatibility and extract key skills.
          </p>
        </div>

        <div className="space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-colors ${
              isDragging
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
          >
            <input
              type="file"
              id="resume-input"
              className="hidden"
              accept=".pdf,.docx"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <FileText className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <Upload className="w-12 h-12 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Drag and drop your resume
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    or{' '}
                    <label htmlFor="resume-input" className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                      click to browse
                    </label>
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Supports PDF and DOCX (max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Helper text */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/50">
          <p className="text-sm text-green-900 dark:text-green-100">
            ✨ We'll analyze your resume for ATS keywords, formatting, and skills alignment with your target role.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
