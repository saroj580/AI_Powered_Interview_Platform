"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft, ChevronRight, Sparkles, Loader2, Check,
  Clock, Trash2, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Question {
  id: string; question: string; type: string; difficulty: string;
  expectedPoints: string[]; timeLimit: number;
}

const STEPS = ["Basic Info", "AI Questions", "Review & Save"];

const TYPE_OPTIONS = [
  { value: "TECHNICAL",  label: "Technical",  desc: "Coding, system design, architecture" },
  { value: "BEHAVIORAL", label: "Behavioral", desc: "STAR-method, culture, soft skills" },
  { value: "CODING",     label: "Coding",     desc: "Algorithms, data structures, LeetCode-style" },
  { value: "MIXED",      label: "Mixed",      desc: "Combination of technical and behavioral" },
];

const DIFF_OPTIONS = ["EASY", "MEDIUM", "HARD"] as const;

export default function NewAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [type, setType] = useState("TECHNICAL");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);

  async function generateQuestions() {
    setQuestions([]);
    setGenerating(true);
    try {
      const res = await fetch("/api/v1/recruiter/assessments/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, type, difficulty, count: questionCount }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        toast.success(`${data.questions.length} questions generated`);
        setStep(1);
      } else {
        toast.error(data.error ?? "Generation failed");
      }
    } catch {
      toast.error("Failed to generate questions");
    } finally {
      setGenerating(false);
    }
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function editQuestion(id: string, text: string) {
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, question: text } : q));
  }

  async function saveAssessment() {
    if (!questions.length) return toast.error("Add at least one question");
    setSaving(true);
    try {
      const res = await fetch("/api/v1/recruiter/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, targetRole, type, difficulty, questionCount: questions.length, durationMinutes, questions }),
      });
      if (res.ok) {
        toast.success("Assessment created!");
        router.push("/recruiter/assessments");
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Save failed");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const canProceedStep0 = title.trim() && targetRole.trim() && type && difficulty;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/recruiter/assessments">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Create Assessment</h1>
          <p className="text-muted-foreground text-xs">AI-powered interview question generation</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
              i < step  ? "bg-primary border-primary text-primary-foreground"
              : i === step ? "border-primary text-primary"
              : "border-muted text-muted-foreground"
            )}>
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={cn("text-xs font-medium hidden sm:block", i === step ? "text-primary" : "text-muted-foreground")}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 0: Basic Info ──────────────────────────────────────────── */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Assessment Details</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Assessment Title</Label>
                    <Input placeholder="e.g. Senior React Developer" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Target Role</Label>
                    <Input placeholder="e.g. Frontend Engineer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setType(opt.value)}
                        className={cn(
                          "text-left p-3 rounded-lg border-2 transition-colors",
                          type === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        )}
                      >
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Difficulty</Label>
                    <div className="flex gap-2">
                      {DIFF_OPTIONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={cn(
                            "flex-1 text-xs font-semibold py-2 rounded-lg border-2 transition-colors",
                            difficulty === d
                              ? d === "EASY" ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30"
                                : d === "MEDIUM" ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30"
                                : "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30"
                              : "border-border hover:border-primary/40"
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Questions</Label>
                    <Select value={String(questionCount)} onValueChange={(v) => v && setQuestionCount(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[3, 5, 7, 10].map((n) => <SelectItem key={n} value={String(n)}>{n} questions</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Duration</Label>
                    <Select value={String(durationMinutes)} onValueChange={(v) => v && setDurationMinutes(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[15, 20, 30, 45, 60, 90].map((n) => <SelectItem key={n} value={String(n)}>{n} min</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={generateQuestions}
                    disabled={!canProceedStep0 || generating}
                    className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-2"
                  >
                    {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</> : <><Sparkles className="h-4 w-4" /> Generate Questions</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Step 1: Review Questions ────────────────────────────────────── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{questions.length} questions generated — edit or remove as needed</p>
              <Button variant="outline" size="sm" onClick={generateQuestions} disabled={generating} className="gap-1.5 text-xs h-8">
                <RefreshCw className={cn("h-3.5 w-3.5", generating && "animate-spin")} /> Regenerate
              </Button>
            </div>

            {questions.map((q, i) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <textarea
                        value={q.question}
                        onChange={(e) => editQuestion(q.id, e.target.value)}
                        className="flex-1 text-sm bg-transparent border-0 resize-none focus:outline-none focus:ring-0 leading-relaxed"
                        rows={2}
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-red-500" onClick={() => removeQuestion(q.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap pl-9">
                      {q.expectedPoints?.slice(0, 3).map((pt, j) => (
                        <Badge key={j} variant="secondary" className="text-[10px]">{pt}</Badge>
                      ))}
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                        <Clock className="h-3 w-3" />{Math.round(q.timeLimit / 60)}min
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(2)} disabled={questions.length === 0} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-2">
                Review <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Review & Save ───────────────────────────────────────── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Review & Save</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground mb-0.5">Title</p><p className="font-medium">{title}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-0.5">Target Role</p><p className="font-medium">{targetRole}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-0.5">Type</p><Badge variant="secondary">{type}</Badge></div>
                  <div><p className="text-xs text-muted-foreground mb-0.5">Difficulty</p><Badge variant="outline">{difficulty}</Badge></div>
                  <div><p className="text-xs text-muted-foreground mb-0.5">Questions</p><p className="font-medium">{questions.length}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-0.5">Duration</p><p className="font-medium">{durationMinutes} minutes</p></div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Questions</p>
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                      <p>{q.question}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button onClick={saveAssessment} disabled={saving} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-2">
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Check className="h-4 w-4" /> Save Assessment</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
