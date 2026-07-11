"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { RotateCcw, TrendingUp, CheckCircle, XCircle, Lightbulb, BookOpen } from "lucide-react";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

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

interface Props {
  data: ReportData;
  interviewId: string;
}

function humanise(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

const TYPE_LABEL: Record<string, string> = {
  TECHNICAL:  "Technical",
  BEHAVIORAL: "Behavioral",
  CODING:     "Live Coding",
  VOICE:      "Voice",
  MIXED:      "Mixed",
  APTITUDE:   "Aptitude",
};

export function InterviewReport({ data }: Props) {
  const { evaluation, meta, questionsReview } = data;
  const { overall, ...dimScores } = evaluation.scores;

  const radarData = Object.entries(dimScores).map(([key, val]) => ({
    skill: humanise(key),
    score: val,
  }));

  const scoreBreakdown = Object.entries(dimScores) as [string, number][];

  const skipped = meta.answeredCount !== undefined
    ? meta.questionCount - meta.answeredCount
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">Interview Report</Badge>
          <h1 className="text-2xl font-bold">{meta.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {TYPE_LABEL[meta.type] ?? meta.type} · {meta.role} · {meta.difficulty}
            {" · "}{meta.answeredCount ?? meta.questionCount}/{meta.questionCount} answered
          </p>
        </div>
        <Link href="/candidate/interviews/new">
          <Button size="sm" className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5">
            <RotateCcw className="h-4 w-4" /> New Interview
          </Button>
        </Link>
      </motion.div>

      {/* Skipped notice */}
      {skipped > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-sm text-amber-700 dark:text-amber-400">
            <span className="font-medium">{skipped} question{skipped > 1 ? "s" : ""} left unanswered</span>
            — score reflects only the questions you attempted.
          </div>
        </motion.div>
      )}

      {/* Overall Score + Radar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/20">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="text-center shrink-0">
                <div className={`text-7xl font-black ${getScoreColor(overall)}`}>{overall}</div>
                <p className="text-muted-foreground text-sm mt-1">Overall Score</p>
                <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">{getScoreLabel(overall)}</Badge>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Radar name="Score" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Score Breakdown
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({TYPE_LABEL[meta.type] ?? meta.type} dimensions)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreBreakdown.map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">{humanise(key)}</span>
                  <span className={`font-bold text-sm ${getScoreColor(val)}`}>{val}/100</span>
                </div>
                <Progress value={val} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Strengths + Weaknesses */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {evaluation.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" /> Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {evaluation.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{evaluation.summary}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Improvement Plan */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" /> Improvement Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {evaluation.improvements.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <span className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Question Review */}
      {questionsReview && questionsReview.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Question Review
                <span className="ml-1 text-xs font-normal text-muted-foreground">— learn from each answer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {questionsReview.map((q, i) => {
                const hasMCQ = q.correctAnswer !== undefined;
                const isCorrect = q.isCorrect === true;
                const isWrong = q.isCorrect === false;
                const skippedQ = q.userAnswer === "No answer" || q.userAnswer === "No solution submitted";

                return (
                  <div key={i} className={cn(
                    "rounded-xl border p-4 space-y-3 transition-colors",
                    isCorrect ? "border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/10" :
                    isWrong || skippedQ ? "border-red-200 dark:border-red-800/30 bg-red-50/30 dark:bg-red-950/10" :
                    "border-border bg-muted/20"
                  )}>
                    {/* Question */}
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold",
                        isCorrect ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600" :
                        isWrong || skippedQ ? "bg-red-100 dark:bg-red-950/40 text-red-600" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {isCorrect ? "✓" : isWrong || skippedQ ? "✗" : i + 1}
                      </div>
                      <p className="text-sm font-medium leading-snug">{q.question}</p>
                    </div>

                    <div className="ml-9 space-y-2">
                      {/* User answer */}
                      {skippedQ ? (
                        <p className="text-xs text-muted-foreground italic">Not answered</p>
                      ) : (
                        <div className={cn(
                          "text-xs px-3 py-2 rounded-lg",
                          isCorrect ? "bg-emerald-100/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300" :
                          isWrong ? "bg-red-100/60 dark:bg-red-950/30 text-red-800 dark:text-red-300" :
                          "bg-muted/60 text-foreground"
                        )}>
                          <span className="font-semibold mr-1">Your answer:</span>
                          {q.userAnswer}
                        </div>
                      )}

                      {/* Correct answer — shown when wrong or skipped (MCQ only) */}
                      {hasMCQ && !isCorrect && (
                        <div className="space-y-1">
                          <div className="text-xs px-3 py-2 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                            <span className="font-semibold mr-1">Correct answer:</span>
                            {q.correctAnswer}
                          </div>
                          {q.explanation && (
                            <p className="text-xs text-muted-foreground px-1 leading-relaxed">{q.explanation}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
