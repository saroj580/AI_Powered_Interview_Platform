"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { InterviewReport } from "@/components/interview/report-view";
import { Loader2 } from "lucide-react";

interface QuestionReview {
  question: string;
  userAnswer: string;
  isCorrect?: boolean;
  correctAnswer?: string;
  explanation?: string;
}

interface ReportData {
  evaluation: {
    scores: Record<string, number>;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    summary: string;
  };
  meta: {
    title: string;
    type: string;
    role: string;
    difficulty: string;
    questionCount: number;
    answeredCount?: number;
    durationMinutes: number;
  };
  questionsReview?: QuestionReview[];
}

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`report_${id}`);
    if (stored) setData(JSON.parse(stored));
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Loading your report…</p>
      </div>
    );
  }

  return <InterviewReport data={data} interviewId={id} />;
}
