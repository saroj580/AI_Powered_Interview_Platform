"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown, ChevronUp, CheckCircle2, XCircle, TrendingUp,
  Lightbulb, MessageSquare, Brain, Activity, User,
  Target, BookOpen, Zap, Award, ArrowLeft, BarChart3,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CategoryScore {
  score: number;
  explanation: string;
  observations: string[];
}

interface QuestionAnalysis {
  question: string;
  candidateAnswer: string;
  score: number;
  strengths: string;
  improvements: string;
  idealAnswer: string;
}

export interface LiveReportData {
  report: {
    overallScore: number;
    level: string;
    hiringRecommendation: string;
    summary: string;
    categoryScores: Record<string, CategoryScore>;
    strengths: { title: string; evidence: string }[];
    weaknesses: { title: string; whyItMatters: string; impact: string }[];
    questionAnalysis: QuestionAnalysis[];
    communicationAnalysis: Record<string, string>;
    technicalAnalysis: Record<string, string>;
    behavioralAnalysis: Record<string, string>;
    improvementPlan: {
      priorityTopics: string[];
      conceptsToRevise: string[];
      practiceStrategy: string;
      interviewPrep: string;
      communicationTips: string;
      confidenceBuilding: string;
      timeManagement: string;
    };
    actionableTips: string[];
    finalSummary: {
      overallImpression: string;
      hiringReadiness: string;
      biggestStrength: string;
      biggestWeakness: string;
      estimatedExperience: string;
      recommendation: string;
      closingMessage: string;
    };
  };
  meta: {
    title: string;
    type: string;
    role: string;
    difficulty: string;
    durationMinutes: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (s >= 65) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function scoreBg(s: number) {
  if (s >= 80) return "bg-emerald-500";
  if (s >= 65) return "bg-amber-500";
  return "bg-red-500";
}

function recommendationStyle(r: string) {
  if (r === "Strong Hire") return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400";
  if (r === "Hire") return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400";
  if (r === "Consider") return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400";
  return "bg-red-100 text-red-700 border-red-300 dark:bg-red-950/30 dark:text-red-400";
}

const CATEGORY_LABELS: Record<string, string> = {
  technicalKnowledge: "Technical Knowledge",
  problemSolving: "Problem Solving",
  communication: "Communication",
  confidence: "Confidence",
  analyticalThinking: "Analytical Thinking",
  systemThinking: "System Thinking",
  clarity: "Clarity",
  accuracy: "Accuracy",
  professionalism: "Professionalism",
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  technicalKnowledge: Brain,
  problemSolving: Target,
  communication: MessageSquare,
  confidence: Activity,
  analyticalThinking: BarChart3,
  systemThinking: Brain,
  clarity: Lightbulb,
  accuracy: CheckCircle2,
  professionalism: User,
};

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-base">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <CardContent className="pt-0 pb-6 px-6">{children}</CardContent>}
    </Card>
  );
}

// ── ScoreBar ──────────────────────────────────────────────────────────────────

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className={cn("text-xs font-bold", scoreColor(score))}>{score}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={cn("h-full rounded-full", scoreBg(score))}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function LiveReportView({ data }: { data: LiveReportData }) {
  const { report, meta } = data;
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* Back */}
      <div className="flex items-center gap-3">
        <Link href="/candidate/interviews">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> All Interviews
          </Button>
        </Link>
        <Badge variant="outline" className="text-xs">Live AI Interview Report</Badge>
      </div>

      {/* ── Hero card ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={cn("text-sm font-semibold border px-3 py-1", recommendationStyle(report.hiringRecommendation))}>
                    {report.hiringRecommendation}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{report.level}</Badge>
                  <Badge variant="secondary" className="text-xs">{meta.difficulty} · {meta.role}</Badge>
                </div>
                <h1 className="text-2xl font-bold">{meta.title}</h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{report.summary}</p>
              </div>

              {/* Overall score circle */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative h-28 w-28">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={report.overallScore >= 80 ? "#10b981" : report.overallScore >= 65 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - report.overallScore / 100) }}
                      transition={{ duration: 1.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-3xl font-black", scoreColor(report.overallScore))}>{report.overallScore}</span>
                    <span className="text-xs text-muted-foreground font-medium">/ 100</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Overall Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Category Scores ── */}
      <Section title="Category Scores" icon={BarChart3}>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(report.categoryScores).map(([key, cat]) => {
            const Icon = CATEGORY_ICONS[key] ?? Brain;
            return (
              <div key={key} className="space-y-3">
                <ScoreBar label={CATEGORY_LABELS[key] ?? key} score={cat.score} icon={Icon} />
                <p className="text-xs text-muted-foreground leading-relaxed">{cat.explanation}</p>
                {cat.observations?.length > 0 && (
                  <ul className="space-y-1">
                    {cat.observations.map((o, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="text-primary shrink-0 mt-0.5">·</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Strengths ── */}
      <Section title="Strengths Observed" icon={CheckCircle2}>
        <div className="space-y-3">
          {report.strengths.map((s, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{s.title}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{s.evidence}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Weaknesses ── */}
      <Section title="Areas for Improvement" icon={TrendingUp}>
        <div className="space-y-3">
          {report.weaknesses.map((w, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">{w.title}</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{w.whyItMatters}</p>
                <p className="text-xs text-muted-foreground mt-1">{w.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Q&A Review ── */}
      <Section title="Question-by-Question Review" icon={MessageSquare}>
        <div className="space-y-3">
          {report.questionAnalysis.map((qa, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
                onClick={() => setExpandedQ(expandedQ === i ? null : i)}
              >
                <div className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                  qa.score >= 75 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" :
                    qa.score >= 55 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
                )}>
                  {qa.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{qa.question}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{qa.candidateAnswer}</p>
                </div>
                {expandedQ === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />}
              </button>

              {expandedQ === i && (
                <div className="px-4 pb-4 space-y-4 border-t border-border">
                  <div className="pt-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Candidate&apos;s Answer</p>
                    <p className="text-sm bg-muted/50 rounded-lg p-3 leading-relaxed">{qa.candidateAnswer}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">What was good</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">{qa.strengths}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">What could be better</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">{qa.improvements}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs font-semibold text-primary mb-1">Ideal answer should cover</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{qa.idealAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Analysis sections (Communication / Technical / Behavioral) ── */}
      <Section title="Communication Analysis" icon={MessageSquare} defaultOpen={false}>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(report.communicationAnalysis).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
              <p className="text-sm leading-relaxed">{val}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Technical Analysis" icon={Brain} defaultOpen={false}>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(report.technicalAnalysis).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
              <p className="text-sm leading-relaxed">{val}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Behavioral Analysis" icon={Activity} defaultOpen={false}>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(report.behavioralAnalysis).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
              <p className="text-sm leading-relaxed">{val}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Improvement Plan ── */}
      <Section title="Personalised Improvement Plan" icon={BookOpen}>
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Priority Topics</p>
              <ul className="space-y-1.5">
                {report.improvementPlan.priorityTopics.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary font-bold text-xs mt-0.5">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Concepts to Revise</p>
              <ul className="space-y-1.5">
                {report.improvementPlan.conceptsToRevise.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-amber-500 shrink-0 mt-0.5">·</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {[
            { label: "Practice Strategy", val: report.improvementPlan.practiceStrategy },
            { label: "Interview Preparation", val: report.improvementPlan.interviewPrep },
            { label: "Communication Tips", val: report.improvementPlan.communicationTips },
            { label: "Confidence Building", val: report.improvementPlan.confidenceBuilding },
            { label: "Time Management", val: report.improvementPlan.timeManagement },
          ].map(({ label, val }) => (
            <div key={label} className="p-3 rounded-lg border border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
              <p className="text-sm leading-relaxed">{val}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Actionable Tips ── */}
      <Section title="Actionable Tips" icon={Zap}>
        <div className="space-y-2">
          {report.actionableTips.map((tip, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-primary">{i + 1}</span>
              </div>
              <p className="text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Final Summary ── */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-5 w-5 text-primary" />
            Interview Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Overall Impression", val: report.finalSummary.overallImpression },
              { label: "Hiring Readiness", val: report.finalSummary.hiringReadiness },
              { label: "Biggest Strength", val: report.finalSummary.biggestStrength },
              { label: "Biggest Weakness", val: report.finalSummary.biggestWeakness },
              { label: "Estimated Experience", val: report.finalSummary.estimatedExperience },
              { label: "Final Recommendation", val: report.finalSummary.recommendation },
            ].map(({ label, val }) => (
              <div key={label} className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                <p className="text-sm leading-relaxed">{val}</p>
              </div>
            ))}
          </div>

          {/* Closing message */}
          <div className="p-4 rounded-2xl bg-card border border-primary/20 mt-2">
            <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> Message from your Interviewer
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground italic">
              &quot;{report.finalSummary.closingMessage}&quot;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/candidate/interviews/new">
          <Button className="bg-gradient-primary text-white border-0 hover:opacity-90">Practice Again</Button>
        </Link>
        <Link href="/candidate/interviews">
          <Button variant="outline">View All Interviews</Button>
        </Link>
      </div>
    </div>
  );
}
