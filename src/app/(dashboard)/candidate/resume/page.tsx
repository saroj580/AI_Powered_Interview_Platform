"use client";
import { useState } from "react";
import { ResumeUploadZone } from "@/components/resume/upload-zone";
import { ResumeAnalysisResult } from "@/components/resume/analysis-result";
import type { ResumeAnalysis } from "@/components/resume/upload-zone";

export default function ResumePage() {
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Resume Analyzer</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Upload your resume for AI-powered ATS scoring, skill detection, and personalized interview generation
                </p>
            </div>
            <ResumeUploadZone onAnalysis={setAnalysis} />
            {analysis && <ResumeAnalysisResult analysis={analysis} />}
        </div>
    );
}
