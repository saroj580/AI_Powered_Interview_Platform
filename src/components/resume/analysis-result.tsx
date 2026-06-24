"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Zap, CheckCircle2, XCircle, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import type { ResumeAnalysis } from "./upload-zone";

interface Props {
  analysis: ResumeAnalysis;
}

function scoreLabel(score: number) {
  if (score >= 85) return { text: "Excellent", color: "text-emerald-600" };
  if (score >= 70) return { text: "Good", color: "text-blue-600" };
  if (score >= 55) return { text: "Fair", color: "text-amber-600" };
  return { text: "Needs Work", color: "text-red-600" };
}

export function ResumeAnalysisResult({ analysis }: Props) {
  const label = scoreLabel(analysis.atsScore);

  return (
    <div className="space-y-4">
      {/* ATS Score */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-black text-primary">{analysis.atsScore}</div>
              <p className={`text-sm font-semibold mt-1 ${label.color}`}>{label.text}</p>
              <p className="text-muted-foreground text-xs mt-0.5">ATS Score</p>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5"><span>0</span><span>100</span></div>
              <Progress value={analysis.atsScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Your resume beats{" "}
                <span className="text-emerald-600 font-semibold">{analysis.percentileBeat}% of candidates</span> for{" "}
                <span className="font-medium">{analysis.experienceLevel}</span> roles.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Detected Skills</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="bg-primary/8 text-primary border-primary/20">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Suggested Roles */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Target Roles</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {analysis.suggestedRoles.map((role) => (
                <div key={role} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
                  <span className="text-sm font-medium">{role}</span>
                  <Badge className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">Good Fit</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.strengths.map((s) => (
                <div key={s} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Improvements */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" /> Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.improvements.map((s) => (
                <div key={s} className="flex items-start gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Key Highlights */}
      {analysis.keyHighlights?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" /> Key Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.keyHighlights.map((h) => (
                <div key={h} className="flex items-start gap-2 text-sm p-2.5 rounded-lg bg-primary/5">
                  <Star className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Missing Keywords */}
      {analysis.missingKeywords?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Missing Keywords</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Add these to improve ATS compatibility:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((k) => (
                  <Badge key={k} variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/20">{k}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Generate Interview from Resume */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/20">
          <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Resume-Based Interview</p>
                <p className="text-muted-foreground text-xs">
                  AI generates questions tailored to your experience as a <span className="font-medium">{analysis.experienceLevel}</span>
                </p>
              </div>
            </div>
            <Link href={`/candidate/interviews/new?role=${encodeURIComponent(analysis.suggestedRoles[0] ?? "")}`}>
              <Button className="bg-gradient-primary text-white border-0 hover:opacity-90 shrink-0 gap-1.5">
                <Zap className="h-4 w-4" />Generate Interview
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
