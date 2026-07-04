"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";
import {
  ChevronRight, ChevronLeft, Mic, MicOff, Timer, Sparkles, AlertCircle,
  StopCircle, Loader2, CheckCircle2, Code2, Play, Terminal, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ── Types ─────────────────────────────────────────────────────────────────────

interface MCQQuestion {
  id: string;
  question: string;
  type: "MCQ";
  options: string[];
  correct: number;
  explanation: string;
}

interface CodingQuestion {
  id: string;
  title: string;
  description: string;
  type: "CODING";
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
}

interface VoiceQuestion {
  id: string;
  question: string;
  type: "VOICE";
}

type Question = MCQQuestion | CodingQuestion | VoiceQuestion;

interface Interview {
  id: string;
  title: string;
  type: string;
  targetRole: string;
  difficulty: string;
  questionCount: number;
  durationMinutes: number;
}

// ── Speech Recognition ────────────────────────────────────────────────────────

interface SpeechRecognitionEvent extends Event { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; [i: number]: { transcript: string } } } }
interface SpeechRecognitionErrorEvent extends Event { error: string }
interface ISpeechRecognition extends EventTarget {
  continuous: boolean; interimResults: boolean; lang: string; maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null; onstart: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
declare global { interface Window { SpeechRecognition?: new () => ISpeechRecognition; webkitSpeechRecognition?: new () => ISpeechRecognition } }

function getSR(): (new () => ISpeechRecognition) | null {
  if (typeof window === "undefined" || !window.isSecureContext) return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function useSpeechRecognition(onTranscript: (text: string, isFinal: boolean) => void) {
  const ref = useRef<ISpeechRecognition | null>(null);
  const mounted = useRef(true);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = typeof window !== "undefined" && !!getSR();

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; ref.current?.abort(); };
  }, []);

  const start = useCallback(() => {
    const SR = getSR();
    if (!SR) return;
    setError(null);
    const r = new SR();
    ref.current = r;
    r.continuous = true; r.interimResults = true; r.lang = "en-US"; r.maxAlternatives = 1;
    r.onstart = () => { if (mounted.current) setRecording(true); };
    r.onresult = (e: SpeechRecognitionEvent) => {
      if (!mounted.current) return;
      let fin = "", interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) fin += t; else interim += t;
      }
      if (fin) onTranscript(fin, true);
      else if (interim) onTranscript(interim, false);
    };
    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (!mounted.current) return;
      setError(e.error === "not-allowed" ? "Microphone access denied." : `Speech error: ${e.error}`);
      setRecording(false);
    };
    r.onend = () => { if (mounted.current) setRecording(false); };
    try { r.start(); } catch { setError("Failed to start microphone."); }
  }, [onTranscript]);

  const stop = useCallback(() => { ref.current?.stop(); setRecording(false); }, []);
  return { recording, supported, error, start, stop };
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function useCountdown(minutes: number) {
  const [secs, setSecs] = useState(minutes * 60);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60), s = secs % 60;
  return { secs, display: `${m}:${s.toString().padStart(2, "0")}` };
}

// ── End Session Dialog ────────────────────────────────────────────────────────

function EndSessionDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <StopCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold">End Session Early?</h3>
            <p className="text-xs text-muted-foreground">Your progress will be submitted for evaluation.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Continue</Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>End Session</Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function InterviewSession({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [idx, setIdx] = useState(0);
  // MCQ answers: index of selected option (-1 = unanswered)
  const [mcqAnswers, setMcqAnswers] = useState<number[]>([]);
  // Free-text / voice / code answers
  const [textAnswers, setTextAnswers] = useState<string[]>([]);
  const [interimText, setInterimText] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  const [showEndDialog, setShowEndDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Code execution
  const [runOutput, setRunOutput] = useState<{ stdout: string; stderr: string; exitCode: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function runCode(code: string, language: string) {
    if (!code.trim() || isRunning) return;
    setIsRunning(true);
    setRunOutput(null);

    // JavaScript executes client-side — no external API needed
    if (language === "javascript") {
      const logs: string[] = [];
      const errs: string[] = [];
      const origLog = console.log;
      const origError = console.error;
      const origWarn = console.warn;
      console.log = (...a: unknown[]) => logs.push(a.map(String).join(" "));
      console.error = (...a: unknown[]) => errs.push(a.map(String).join(" "));
      console.warn = (...a: unknown[]) => errs.push("[warn] " + a.map(String).join(" "));
      try {
        // AsyncFunction lets the candidate use await at the top level
        const AsyncFn = Object.getPrototypeOf(async function () {}).constructor as new (...args: string[]) => () => Promise<void>;
        await new AsyncFn(code)();
        setRunOutput({ stdout: logs.join("\n"), stderr: errs.join("\n"), exitCode: 0 });
      } catch (e) {
        setRunOutput({ stdout: logs.join("\n"), stderr: String(e), exitCode: 1 });
      } finally {
        console.log = origLog;
        console.error = origError;
        console.warn = origWarn;
        setIsRunning(false);
      }
      return;
    }

    // Python / Java — server-side via Wandbox
    try {
      const res = await fetch("/api/v1/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (data.error) {
        setRunOutput({ stdout: "", stderr: data.error, exitCode: 1 });
      } else {
        setRunOutput({ stdout: data.output ?? "", stderr: data.stderr ?? "", exitCode: data.exitCode ?? 0 });
      }
    } catch {
      setRunOutput({ stdout: "", stderr: "Network error — could not reach execution server.", exitCode: 1 });
    } finally {
      setIsRunning(false);
    }
  }

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      setTextAnswers((prev) => {
        const next = [...prev];
        next[idx] = ((next[idx] ?? "").trimEnd() + " " + text).trim();
        return next;
      });
      setInterimText("");
    } else {
      setInterimText(text);
    }
  }, [idx]);

  const { recording, supported, error: speechError, start, stop } = useSpeechRecognition(handleTranscript);
  const { secs, display: timeDisplay } = useCountdown(interview?.durationMinutes ?? 40);

  // Load interview + generate questions
  useEffect(() => {
    async function init() {
      try {
        const [ivRes, qRes] = await Promise.all([
          fetch(`/api/v1/interviews/${interviewId}`),
          fetch(`/api/v1/interviews/${interviewId}/questions`, { method: "POST" }),
        ]);
        if (!ivRes.ok) throw new Error("Interview not found");
        if (!qRes.ok) throw new Error("Failed to generate questions");

        const iv = await ivRes.json();
        const { questions: qs } = await qRes.json();

        // Coerce any value to a plain string — prevents "Objects are not valid as React child"
        // when the AI returns objects/arrays in place of strings (e.g. examples.input)
        const str = (v: unknown): string =>
          v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);

        // Normalise question types based on structure + interview type
        const normalised: Question[] = qs.map((q: Record<string, unknown>) => {
          if (q.starterCode) {
            const rawExamples = Array.isArray(q.examples) ? q.examples : [];
            return {
              ...q,
              type: "CODING",
              title: str(q.title),
              description: str(q.description),
              examples: rawExamples.map((ex: Record<string, unknown>) => ({
                input: str(ex.input),
                output: str(ex.output),
                explanation: ex.explanation != null ? str(ex.explanation) : undefined,
              })),
              constraints: Array.isArray(q.constraints)
                ? (q.constraints as unknown[]).map(str)
                : [],
            } as CodingQuestion;
          }
          if (iv.type === "VOICE") return { id: str(q.id), question: str(q.question), type: "VOICE" } as VoiceQuestion;
          return {
            ...q,
            type: "MCQ",
            question: str(q.question),
            options: Array.isArray(q.options) ? (q.options as unknown[]).map(str) : [],
            explanation: str(q.explanation),
          } as MCQQuestion;
        });

        setInterview(iv);
        setQuestions(normalised);
        setMcqAnswers(new Array(normalised.length).fill(-1));
        setTextAnswers(new Array(normalised.length).fill(""));
      } catch (err) {
        setLoadError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [interviewId]);

  // Auto-end when timer hits 0
  useEffect(() => {
    if (secs === 0 && !loading && !submitting) handleSubmit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secs]);

  async function handleSubmit() {
    if (submitting) return;
    if (recording) stop();
    setShowEndDialog(false);
    setSubmitting(true);

    const answers = questions.map((q, i) => {
      if (q.type === "MCQ") {
        const m = q as MCQQuestion;
        const sel = mcqAnswers[i];
        return {
          question: m.question,
          answer: sel >= 0 ? m.options[sel] : "No answer",
          correct: sel === m.correct,
          correctAnswer: m.options[m.correct],
          explanation: m.explanation,
        };
      } else if (q.type === "VOICE") {
        const v = q as VoiceQuestion;
        return { question: v.question, answer: textAnswers[i] || "No answer" };
      } else {
        const c = q as CodingQuestion;
        return { question: c.title, answer: textAnswers[i] || "No solution submitted" };
      }
    });

    try {
      const res = await fetch(`/api/v1/interviews/${interviewId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      sessionStorage.setItem(`report_${interviewId}`, JSON.stringify(data));
      router.push(`/candidate/interviews/${interviewId}/report`);
    } catch {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Generating your personalized questions…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="font-medium">{loadError}</p>
        <Button variant="outline" onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Evaluating your performance…</p>
      </div>
    );
  }

  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  const progress = ((idx) / questions.length) * 100;
  const answered = q.type === "MCQ" ? mcqAnswers[idx] >= 0 : textAnswers[idx]?.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      {showEndDialog && (
        <EndSessionDialog onConfirm={handleSubmit} onCancel={() => setShowEndDialog(false)} />
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              Question {idx + 1} of {questions.length} · {interview?.type}
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-lg",
            secs < 120 ? "bg-red-50 text-red-600 dark:bg-red-950/30" : "bg-muted text-foreground"
          )}>
            <Timer className="h-3.5 w-3.5" />{timeDisplay}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => setShowEndDialog(true)}>
            <StopCircle className="h-3.5 w-3.5" /> End Session
          </Button>
        </div>
      </div>

      {/* ── CODING layout: true side-by-side ─────────────────────────── */}
      {q.type === "CODING" && (() => {
        const cq = q as CodingQuestion;
        const displayCode = textAnswers[idx] || cq.starterCode?.[codeLanguage] || "";
        return (
          <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* LEFT: problem description */}
            <div className="w-[42%] border-r border-border overflow-y-auto bg-background">
              <div className="p-5 space-y-5">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-base leading-tight">{cq.title}</span>
                  <Badge variant="outline" className="ml-auto text-[10px] shrink-0">{interview?.difficulty}</Badge>
                </div>

                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{cq.description}</p>

                {cq.examples.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Examples</p>
                    {cq.examples.map((ex, ei) => (
                      <div key={ei} className="rounded-lg bg-muted/60 p-3 text-xs font-mono space-y-1">
                        <div><span className="text-muted-foreground">Input:  </span>{ex.input}</div>
                        <div><span className="text-muted-foreground">Output: </span>{ex.output}</div>
                        {ex.explanation && <div className="text-muted-foreground mt-1">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {cq.constraints.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Constraints</p>
                    <ul className="space-y-1">
                      {cq.constraints.map((c, ci) => (
                        <li key={ci} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-primary shrink-0">•</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prev button at bottom of left panel */}
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setIdx((i) => i - 1)} disabled={idx === 0} className="gap-1.5 w-full">
                    <ChevronLeft className="h-4 w-4" /> Previous Problem
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT: editor + submit */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#252526]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60 font-mono">solution</span>
                  <Select value={codeLanguage} onValueChange={(v) => { if (!v) return; setCodeLanguage(v); if (!textAnswers[idx]) { setTextAnswers((prev) => { const n = [...prev]; n[idx] = cq.starterCode?.[v] ?? ""; return n; }); } }}>
                    <SelectTrigger className="h-6 w-28 text-xs bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["javascript", "python", "java"].map((lang) => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  {/* Problem dots */}
                  <div className="flex items-center gap-1">
                    {questions.map((_, qi) => {
                      const ans = textAnswers[qi]?.trim().length > 0;
                      return (
                        <button key={qi} onClick={() => setIdx(qi)} className={cn(
                          "h-2 w-2 rounded-full transition-all",
                          qi === idx ? "bg-primary w-4" : ans ? "bg-primary/40" : "bg-white/20"
                        )} />
                      );
                    })}
                  </div>
                  {/* Run button */}
                  <button
                    onClick={() => runCode(displayCode, codeLanguage)}
                    disabled={isRunning || !displayCode.trim()}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all",
                      isRunning || !displayCode.trim()
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    )}
                  >
                    {isRunning ? (
                      <><Loader2 className="h-3 w-3 animate-spin" />Running…</>
                    ) : (
                      <><Play className="h-3 w-3" />Run</>
                    )}
                  </button>
                </div>
              </div>

              {/* Monaco editor — shrinks when output panel is open */}
              <div className={cn("min-h-0 transition-all", runOutput ? "flex-[3]" : "flex-1")}>
                <MonacoEditor
                  height="100%"
                  language={codeLanguage}
                  value={displayCode}
                  onChange={(v) => setTextAnswers((prev) => { const n = [...prev]; n[idx] = v ?? ""; return n; })}
                  theme="vs-dark"
                  options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: "on", padding: { top: 12 } }}
                />
              </div>

              {/* Output panel — shown after Run */}
              {runOutput && (
                <div className="flex-[1] min-h-0 border-t border-white/10 bg-[#0d1117] flex flex-col" style={{ maxHeight: 200 }}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-[#161b22] shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="h-3 w-3 text-white/50" />
                      <span className="text-xs text-white/50 font-mono">output</span>
                      {runOutput.exitCode !== 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/50 text-red-400 font-mono">
                          exit {runOutput.exitCode}
                        </span>
                      )}
                      {runOutput.exitCode === 0 && runOutput.stdout && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-400 font-mono">
                          success
                        </span>
                      )}
                    </div>
                    <button onClick={() => setRunOutput(null)} className="text-white/30 hover:text-white/60 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-3 py-2">
                    {runOutput.stdout && (
                      <pre className="text-xs text-emerald-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {runOutput.stdout}
                      </pre>
                    )}
                    {runOutput.stderr && (
                      <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap leading-relaxed">
                        {runOutput.stderr}
                      </pre>
                    )}
                    {!runOutput.stdout && !runOutput.stderr && (
                      <p className="text-xs text-white/30 font-mono italic">No output</p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit bar */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-[#252526] shrink-0">
                <span className="text-xs text-white/40 font-mono">
                  {textAnswers[idx]?.trim() ? `${textAnswers[idx].split("\n").length} lines` : "No code yet"}
                </span>
                {isLast ? (
                  <Button onClick={handleSubmit} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Submit Interview
                  </Button>
                ) : (
                  <Button onClick={() => setIdx((i) => i + 1)} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5">
                    Next Problem <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── VOICE layout: speak-only, no MCQ buttons ──────────────────── */}
      {q.type === "VOICE" && (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="space-y-5">
              {/* Question */}
              <Card className="border-primary/20 bg-gradient-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mic className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">AI Interviewer</span>
                    <Badge variant="secondary" className="ml-auto text-[10px]">{interview?.difficulty}</Badge>
                  </div>
                  <p className="text-lg sm:text-xl font-medium leading-relaxed">{(q as VoiceQuestion).question}</p>
                </CardContent>
              </Card>

              {/* Voice recorder */}
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Press the mic button to start speaking. Press again to stop.
                    </p>

                    {supported ? (
                      <button
                        onClick={recording ? stop : start}
                        className={cn(
                          "h-20 w-20 rounded-full flex items-center justify-center transition-all duration-200",
                          recording
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110"
                            : "bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary/30 hover:scale-105"
                        )}
                      >
                        {recording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 text-sm text-amber-700">
                        <MicOff className="h-4 w-4 shrink-0" />
                        Microphone not available — type your answer below
                      </div>
                    )}

                    {recording && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200/50">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        <p className="text-xs text-red-600">
                          {interimText ? `"${interimText.slice(0, 70)}…"` : "Listening…"}
                        </p>
                      </div>
                    )}
                  </div>

                  {speechError && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-700">{speechError}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Your answer transcript:</p>
                    <Textarea
                      placeholder="Your spoken answer will appear here, or type directly…"
                      value={(textAnswers[idx] ?? "") + (recording && interimText ? " " + interimText : "")}
                      onChange={(e) => {
                        setTextAnswers((prev) => { const n = [...prev]; n[idx] = e.target.value; return n; });
                        setInterimText("");
                      }}
                      className="min-h-[130px] resize-none text-sm"
                    />
                  </div>

                  {textAnswers[idx]?.trim().length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Answer recorded — you can proceed to the next question
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setIdx((i) => i - 1)} disabled={idx === 0} className="gap-1.5">
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {questions.map((_, qi) => {
                const ans = textAnswers[qi]?.trim().length > 0;
                return (
                  <button key={qi} onClick={() => setIdx(qi)} className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    qi === idx ? "bg-primary w-4" : ans ? "bg-primary/40" : "bg-muted"
                  )} />
                );
              })}
            </div>
            {isLast ? (
              <Button onClick={handleSubmit} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Submit Interview
              </Button>
            ) : (
              <Button onClick={() => setIdx((i) => i + 1)} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5" disabled={!answered}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── MCQ layout ────────────────────────────────────────────────── */}
      {q.type === "MCQ" && (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="space-y-5">
              {/* Question */}
              <Card className="border-primary/20 bg-gradient-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">AI Interviewer</span>
                    <Badge variant="secondary" className="ml-auto text-[10px]">{interview?.difficulty}</Badge>
                  </div>
                  <p className="text-lg sm:text-xl font-medium leading-relaxed">{(q as MCQQuestion).question}</p>
                </CardContent>
              </Card>

              {/* Options */}
              <Card>
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Select your answer:</p>
                  {(q as MCQQuestion).options.map((opt, oi) => {
                    const chosen = mcqAnswers[idx] === oi;
                    return (
                      <button
                        key={oi}
                        onClick={() => setMcqAnswers((prev) => { const n = [...prev]; n[idx] = oi; return n; })}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border-2 text-sm transition-all font-medium",
                          chosen ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 hover:bg-muted/30"
                        )}
                      >
                        <span className={cn(
                          "inline-flex h-6 w-6 rounded-full items-center justify-center text-xs font-bold mr-3 shrink-0",
                          chosen ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt.replace(/^[A-D]\.\s*/, "")}
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* MCQ navigation */}
          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setIdx((i) => i - 1)} disabled={idx === 0} className="gap-1.5">
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {questions.map((_, qi) => {
                const ans = mcqAnswers[qi] >= 0;
                return (
                  <button key={qi} onClick={() => setIdx(qi)} className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    qi === idx ? "bg-primary w-4" : ans ? "bg-primary/40" : "bg-muted"
                  )} />
                );
              })}
            </div>
            {isLast ? (
              <Button onClick={handleSubmit} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Submit Interview
              </Button>
            ) : (
              <Button onClick={() => setIdx((i) => i + 1)} className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5" disabled={!answered}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
