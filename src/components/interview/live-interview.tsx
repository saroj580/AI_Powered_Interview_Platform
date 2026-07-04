"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Mic, MicOff, SendHorizontal, BrainCircuit, User, Timer,
  StopCircle, Loader2, AlertCircle, ChevronDown,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface LiveMessage {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
}

interface Interview {
  id: string;
  title: string;
  type: string;
  targetRole: string;
  difficulty: string;
  questionCount: number;
  durationMinutes: number;
}

// ── Speech Recognition (reuse pattern from session-layout) ────────────────────

interface SREvent extends Event { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; [i: number]: { transcript: string } } } }
interface ISR extends EventTarget {
  continuous: boolean; interimResults: boolean; lang: string; maxAlternatives: number;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null; onstart: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
declare global { interface Window { SpeechRecognition?: new () => ISR; webkitSpeechRecognition?: new () => ISR } }

function getSR() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function useElapsed() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export function LiveInterview({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const elapsed = useElapsed();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [stage, setStage] = useState("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAITyping, setIsAITyping] = useState(false);
  const [candidateInput, setCandidateInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [interimText, setInterimText] = useState("");
  const [recording, setRecording] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);

  const srRef = useRef<ISR | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAITyping]);

  // Load interview and kick off the first AI message
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`/api/v1/interviews/${interviewId}`);
        if (!res.ok) throw new Error("Interview not found");
        const iv = await res.json();
        setInterview(iv);
        // Trigger welcome message
        await sendTurn([], [], "welcome", 0, iv);
      } catch (err) {
        setLoadError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const sendTurn = useCallback(async (
    currentHistory: LiveMessage[],
    currentObservations: string[],
    currentStage: string,
    currentQIdx: number,
    iv?: Interview,
  ) => {
    setIsAITyping(true);
    try {
      const res = await fetch(`/api/v1/interviews/${interviewId}/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: currentHistory.map((m) => ({ role: m.role, content: m.content })),
          observations: currentObservations,
          stage: currentStage,
          questionIndex: currentQIdx,
        }),
      });
      if (!res.ok) throw new Error("AI response failed");
      const data = await res.json();

      const aiMsg: LiveMessage = {
        id: crypto.randomUUID(),
        role: "interviewer",
        content: data.message,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setStage(data.stage);
      setQuestionIndex(data.questionIndex ?? currentQIdx);

      if (data.observation) {
        setObservations((prev) => [...prev, data.observation]);
      }

      if (data.isComplete) {
        setIsComplete(true);
        // Auto-generate report after a short delay so candidate reads the closing message
        setTimeout(() => generateReport([...currentHistory, aiMsg], [...currentObservations, data.observation ?? ""], iv), 2500);
      }
    } catch {
      const errMsg: LiveMessage = {
        id: crypto.randomUUID(),
        role: "interviewer",
        content: "I'm having trouble connecting. Please try sending your message again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsAITyping(false);
    }
  }, [interviewId]);

  const generateReport = useCallback(async (
    finalHistory: LiveMessage[],
    finalObservations: string[],
    iv?: Interview,
  ) => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch(`/api/v1/interviews/${interviewId}/live/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: finalHistory.map((m) => ({ role: m.role, content: m.content })),
          observations: finalObservations,
        }),
      });
      if (!res.ok) throw new Error("Report generation failed");
      const data = await res.json();
      sessionStorage.setItem(`live_report_${interviewId}`, JSON.stringify(data));
      router.push(`/candidate/interviews/${interviewId}/live/report`);
    } catch {
      setIsGeneratingReport(false);
      // Stay on page so candidate can retry
    }
  }, [interviewId, router]);

  async function handleSend() {
    const text = candidateInput.trim();
    if (!text || isAITyping || isComplete) return;
    if (recording) stopRecording();

    const candidateMsg: LiveMessage = {
      id: crypto.randomUUID(),
      role: "candidate",
      content: text,
    };

    const newHistory = [...messages, candidateMsg];
    setMessages(newHistory);
    setCandidateInput("");
    setInterimText("");

    await sendTurn(newHistory, observations, stage, questionIndex);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Voice recording
  function startRecording() {
    const SR = getSR();
    if (!SR) return;
    const sr = new SR();
    sr.continuous = true;
    sr.interimResults = true;
    sr.lang = "en-US";
    sr.onresult = (e: SREvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) {
        setCandidateInput((prev) => (prev + " " + final).trim());
        setInterimText("");
      } else {
        setInterimText(interim);
      }
    };
    sr.onerror = () => setRecording(false);
    sr.onend = () => setRecording(false);
    srRef.current = sr;
    sr.start();
    setRecording(true);
  }

  function stopRecording() {
    srRef.current?.stop();
    srRef.current = null;
    setRecording(false);
    setInterimText("");
  }

  async function handleEndEarly() {
    setShowEndDialog(false);
    if (recording) stopRecording();
    const closingMsg: LiveMessage = {
      id: crypto.randomUUID(),
      role: "candidate",
      content: "[Candidate ended the interview early]",
    };
    const finalHistory = [...messages, closingMsg];
    setIsComplete(true);
    await generateReport(finalHistory, observations);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BrainCircuit className="h-10 w-10 text-primary animate-pulse" />
        <p className="text-muted-foreground text-sm">Preparing your interviewer…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="font-medium">{loadError}</p>
      </div>
    );
  }

  if (isGeneratingReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-semibold text-lg">Generating your report…</p>
        <p className="text-muted-foreground text-sm">Analyzing the full conversation — this takes about 15 seconds</p>
      </div>
    );
  }

  const srSupported = !!getSR();
  const targetQ = interview?.questionCount ?? 0;
  const progressPct = targetQ > 0 ? Math.min((questionIndex / targetQ) * 100, 100) : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur rounded-t-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{interview?.targetRole} — Live Interview</p>
            <p className="text-xs text-muted-foreground">{interview?.difficulty} difficulty</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Question progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Q{questionIndex}/{targetQ}
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            {elapsed}
          </div>

          {/* Stage badge */}
          <Badge variant="outline" className="hidden sm:flex text-xs capitalize">
            {stage}
          </Badge>

          {/* End button */}
          {!isComplete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEndDialog(true)}
              className="text-destructive border-destructive/30 hover:bg-destructive/5 text-xs"
            >
              <StopCircle className="h-3.5 w-3.5 mr-1" /> End
            </Button>
          )}
        </div>
      </div>

      {/* ── Early-end confirmation ── */}
      <AnimatePresence>
        {showEndDialog && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-2 p-4 rounded-xl border border-destructive/30 bg-destructive/5 shrink-0"
          >
            <p className="text-sm font-medium text-destructive mb-3">End the interview now?</p>
            <p className="text-xs text-muted-foreground mb-3">
              Your report will be generated from the conversation so far. You can&apos;t continue after ending.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleEndEarly}>End & Generate Report</Button>
              <Button size="sm" variant="outline" onClick={() => setShowEndDialog(false)}>Continue Interview</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("flex gap-3", msg.role === "candidate" ? "flex-row-reverse" : "flex-row")}
            >
              {/* Avatar */}
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.role === "interviewer" ? "bg-primary/10" : "bg-secondary",
              )}>
                {msg.role === "interviewer"
                  ? <BrainCircuit className="h-4 w-4 text-primary" />
                  : <User className="h-4 w-4 text-secondary-foreground" />
                }
              </div>

              {/* Bubble */}
              <div className={cn(
                "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "interviewer"
                  ? "bg-card border border-border text-foreground rounded-tl-sm"
                  : "bg-primary text-primary-foreground rounded-tr-sm",
              )}>
                {msg.role === "interviewer" && (
                  <p className="text-[10px] font-semibold text-primary mb-1 uppercase tracking-wide">Alex · AI Interviewer</p>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isAITyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <BrainCircuit className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-[10px] font-semibold text-primary mb-1 uppercase tracking-wide">Alex · AI Interviewer</p>
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-border bg-card/80 backdrop-blur rounded-b-2xl p-4">
        {isComplete ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <p className="text-sm font-medium text-muted-foreground">Interview complete</p>
            {isGeneratingReport && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating your report…
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={candidateInput + interimText}
                onChange={(e) => setCandidateInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  stage === "welcome" || stage === "intro" || stage === "readiness"
                    ? "Type your response…"
                    : "Type your answer or use the mic…"
                }
                rows={1}
                className="min-h-[44px] max-h-40 resize-none pr-2 text-sm"
                disabled={isAITyping}
              />
              {interimText && (
                <div className="absolute bottom-full left-0 mb-1 px-3 py-1 bg-muted rounded-lg text-xs text-muted-foreground max-w-full truncate">
                  <ChevronDown className="inline h-3 w-3 mr-1" />
                  {interimText}
                </div>
              )}
            </div>

            {srSupported && (
              <Button
                variant={recording ? "destructive" : "outline"}
                size="icon"
                onClick={recording ? stopRecording : startRecording}
                disabled={isAITyping}
                className="h-11 w-11 shrink-0"
                title={recording ? "Stop recording" : "Start voice input"}
              >
                {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}

            <Button
              size="icon"
              onClick={handleSend}
              disabled={isAITyping || !candidateInput.trim()}
              className="h-11 w-11 shrink-0 bg-gradient-primary text-white border-0 hover:opacity-90"
            >
              {isAITyping
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <SendHorizontal className="h-4 w-4" />
              }
            </Button>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Press Enter to send · Shift+Enter for new line · Responses are evaluated in real time
        </p>
      </div>
    </div>
  );
}
