"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Mic, PhoneOff, BrainCircuit, Timer, Loader2, AlertCircle,
  Volume2, VolumeX, Send, ArrowLeft, Settings, CheckCircle2,
  Briefcase, Clock, Users, Hash, Globe, Lock,
  Code2, Lightbulb, MessageSquare, Zap, LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

type CallStatus = "loading" | "speaking" | "thinking" | "listening" | "idle" | "complete";

// ── Speech Recognition ────────────────────────────────────────────────────────

interface SREvent extends Event {
  resultIndex: number;
  results: { length: number; [i: number]: { isFinal: boolean; [i: number]: { transcript: string } } };
}
interface ISR extends EventTarget {
  continuous: boolean; interimResults: boolean; lang: string; maxAlternatives: number;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
declare global { interface Window { SpeechRecognition?: new () => ISR; webkitSpeechRecognition?: new () => ISR } }

function getSR() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

// ── Text-to-Speech ────────────────────────────────────────────────────────────

function getBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.name === "Google UK English Male") ??
    voices.find(v => v.name.includes("Daniel")) ??
    voices.find(v => v.name.includes("James")) ??
    voices.find(v => v.name === "Alex") ??
    voices.find(v => v.lang.startsWith("en-") && v.name.toLowerCase().includes("male")) ??
    voices.find(v => v.lang.startsWith("en-")) ??
    null
  );
}

// ── Elapsed timer ─────────────────────────────────────────────────────────────

function useElapsed() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return `${Math.floor(secs / 60).toString().padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;
}

// ── Stage tracker ─────────────────────────────────────────────────────────────

const STAGES = [
  { id: "intro",          label: "Introduction" },
  { id: "technical",      label: "Technical" },
  { id: "problem_solving",label: "Problem Solving" },
  { id: "system_design",  label: "System Design" },
  { id: "behavioral",     label: "Behavioral" },
  { id: "closing",        label: "Closing" },
];

function getStageIndex(stage: string): number {
  if (["welcome", "intro", "readiness"].includes(stage)) return 0;
  if (["technical", "depth", "followup"].includes(stage)) return 1;
  if (["problem_solving", "problem"].includes(stage)) return 2;
  if (["system_design", "design"].includes(stage)) return 3;
  if (stage === "behavioral") return 4;
  if (["closing", "complete"].includes(stage)) return 5;
  return 0;
}

// ── Static content ────────────────────────────────────────────────────────────

const TIPS = [
  "Speak clearly and at a normal pace",
  "It's okay to take a moment to think",
  "Explain your thought process",
  "Ask for clarification if needed",
  "Be honest and confident",
];

const EVAL_FACTORS = [
  { icon: Code2,        label: "Technical Knowledge" },
  { icon: Lightbulb,   label: "Problem Solving" },
  { icon: MessageSquare, label: "Communication" },
  { icon: Zap,          label: "Confidence" },
  { icon: LayoutList,   label: "Clarity & Structure" },
];

// ── Waveform animation ────────────────────────────────────────────────────────

const WAVEFORM = [
  { h: 6,  d: 0.80 }, { h: 10, d: 0.90 }, { h: 16, d: 0.75 }, { h: 24, d: 1.00 },
  { h: 36, d: 0.85 }, { h: 28, d: 0.95 }, { h: 20, d: 0.80 }, { h: 32, d: 1.10 },
  { h: 40, d: 0.70 }, { h: 28, d: 0.90 }, { h: 18, d: 0.85 }, { h: 30, d: 0.75 },
  { h: 22, d: 1.00 }, { h: 14, d: 0.80 }, { h: 8,  d: 0.95 }, { h: 16, d: 0.90 },
  { h: 26, d: 0.80 }, { h: 20, d: 0.70 }, { h: 12, d: 0.85 }, { h: 6,  d: 0.80 },
];

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-12 w-full">
      {WAVEFORM.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-primary"
          animate={active ? { height: [bar.h * 0.4, bar.h, bar.h * 0.5, bar.h * 0.8, bar.h * 0.4] } : { height: 4 }}
          transition={{ duration: bar.d, repeat: active ? Infinity : 0, delay: i * 0.04, ease: "easeInOut" }}
          style={{ height: bar.h * 0.4 }}
        />
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function LiveInterview({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const elapsed = useElapsed();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [observations, setObservations] = useState<string[]>([]);
  const [stage, setStage] = useState("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [status, setStatus] = useState<CallStatus>("loading");
  const [currentAIMessage, setCurrentAIMessage] = useState("");
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [muted, setMuted] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [recordingSecs, setRecordingSecs] = useState(0);

  const srRef = useRef<ISR | null>(null);
  const lastSpokenId = useRef("");
  const mutedRef = useRef(false);
  const statusRef = useRef<CallStatus>("loading");
  const transcriptRef = useRef("");
  const intentionalStopRef = useRef(false);

  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Recording timer
  useEffect(() => {
    if (status !== "listening") { setRecordingSecs(0); return; }
    const t = setInterval(() => setRecordingSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const recordingTimer = `${Math.floor(recordingSecs / 60).toString().padStart(2, "0")}:${(recordingSecs % 60).toString().padStart(2, "0")}`;

  // ── Text-to-speech ──────────────────────────────────────────────────────────

  const speak = useCallback((text: string) => {
    if (mutedRef.current || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9; utt.pitch = 1.0; utt.volume = 1;
    const voice = getBestVoice();
    if (voice) utt.voice = voice;
    utt.onstart = () => setStatus("speaking");
    utt.onend = () => { if (statusRef.current === "speaking") setStatus("idle"); };
    utt.onerror = () => { if (statusRef.current === "speaking") setStatus("idle"); };
    window.speechSynthesis.speak(utt);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === "interviewer" && last.id !== lastSpokenId.current) {
      lastSpokenId.current = last.id;
      setCurrentAIMessage(last.content);
      speak(last.content);
    }
  }, [messages, speak]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, []);

  // ── Load interview ──────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`/api/v1/interviews/${interviewId}`);
        if (!res.ok) throw new Error("Interview not found");
        const iv = await res.json();
        setInterview(iv);
        await sendTurn([], [], "welcome", 0, iv);
      } catch (err) {
        setLoadError((err as Error).message);
        setStatus("idle");
      }
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  // ── API turn ────────────────────────────────────────────────────────────────

  const sendTurn = useCallback(async (
    currentHistory: LiveMessage[],
    currentObs: string[],
    currentStage: string,
    currentQIdx: number,
    iv?: Interview,
  ) => {
    setStatus("thinking");
    try {
      const res = await fetch(`/api/v1/interviews/${interviewId}/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: currentHistory.map(m => ({ role: m.role, content: m.content })),
          observations: currentObs,
          stage: currentStage,
          questionIndex: currentQIdx,
        }),
      });
      if (!res.ok) throw new Error("AI failed");
      const data = await res.json();

      const aiMsg: LiveMessage = { id: crypto.randomUUID(), role: "interviewer", content: data.message };
      const newHistory = [...currentHistory, aiMsg];
      setMessages(newHistory);
      setStage(data.stage);
      setQuestionIndex(data.questionIndex ?? currentQIdx);

      const newObs = data.observation ? [...currentObs, data.observation] : currentObs;
      if (data.observation) setObservations(newObs);

      if (data.isComplete) {
        setIsComplete(true);
        setTimeout(() => generateReport(newHistory, newObs, iv), 3000);
      }
    } catch {
      setCurrentAIMessage("Connection issue — please try again.");
      setStatus("idle");
    }
  }, [interviewId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Report ──────────────────────────────────────────────────────────────────

  const generateReport = useCallback(async (
    finalHistory: LiveMessage[],
    finalObs: string[],
    _iv?: Interview,
  ) => {
    window.speechSynthesis?.cancel();
    setIsGeneratingReport(true);
    try {
      const res = await fetch(`/api/v1/interviews/${interviewId}/live/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: finalHistory.map(m => ({ role: m.role, content: m.content })),
          observations: finalObs,
        }),
      });
      if (!res.ok) throw new Error("Report failed");
      const data = await res.json();
      sessionStorage.setItem(`live_report_${interviewId}`, JSON.stringify(data));
      router.push(`/candidate/interviews/${interviewId}/live/report`);
    } catch {
      setIsGeneratingReport(false);
    }
  }, [interviewId, router]);

  // ── Send ────────────────────────────────────────────────────────────────────

  const handleSend = useCallback(async (overrideText?: string) => {
    const voiceText = transcriptRef.current || transcript;
    const text = (overrideText ?? (voiceText + " " + interimText + " " + textInput)).trim();
    if (!text || status === "thinking" || isComplete) return;

    stopRecording();
    window.speechSynthesis?.cancel();
    transcriptRef.current = "";

    const candidateMsg: LiveMessage = { id: crypto.randomUUID(), role: "candidate", content: text };
    const newHistory = [...messages, candidateMsg];
    setMessages(newHistory);
    setTranscript("");
    setInterimText("");
    setTextInput("");

    await sendTurn(newHistory, observations, stage, questionIndex);
  }, [transcript, interimText, textInput, status, isComplete, messages, observations, stage, questionIndex, sendTurn]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Voice (auto-restart on silence) ─────────────────────────────────────────

  function createAndStartSR(accumulated: string) {
    const SR = getSR();
    if (!SR) return;

    const sr = new SR();
    sr.continuous = true;
    sr.interimResults = true;
    sr.lang = "en-US";
    sr.maxAlternatives = 1;

    sr.onresult = (e: SREvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          accumulated = (accumulated + " " + t).trim();
          transcriptRef.current = accumulated;
          setTranscript(accumulated);
        } else {
          interim += t;
        }
      }
      setInterimText(interim);
    };

    sr.onerror = (e: Event) => {
      const code = (e as { error?: string }).error ?? "";
      if (code === "no-speech" || code === "aborted") return;
      setInterimText("");
      if (statusRef.current === "listening") setStatus("idle");
    };

    sr.onend = () => {
      setInterimText("");
      if (!intentionalStopRef.current && statusRef.current === "listening") {
        setTimeout(() => {
          if (!intentionalStopRef.current && statusRef.current === "listening") {
            createAndStartSR(transcriptRef.current);
          }
        }, 120);
      }
    };

    try {
      srRef.current = sr;
      sr.start();
    } catch {
      setStatus("idle");
    }
  }

  function startRecording() {
    if (status === "thinking" || status === "loading") return;
    window.speechSynthesis?.cancel();
    intentionalStopRef.current = false;
    transcriptRef.current = "";
    setTranscript("");
    setInterimText("");
    setStatus("listening");
    createAndStartSR("");
  }

  function stopRecording() {
    intentionalStopRef.current = true;
    srRef.current?.stop();
    srRef.current = null;
    setInterimText("");
    if (statusRef.current === "listening") setStatus("idle");
  }

  async function handleEndEarly() {
    setShowEndDialog(false);
    stopRecording();
    window.speechSynthesis?.cancel();
    const closingMsg: LiveMessage = { id: crypto.randomUUID(), role: "candidate", content: "[Interview ended early by candidate]" };
    const finalHistory = [...messages, closingMsg];
    setIsComplete(true);
    await generateReport(finalHistory, observations);
  }

  // ── Error / generating screens ──────────────────────────────────────────────

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
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <motion.div
          className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <BrainCircuit className="h-10 w-10 text-primary" />
        </motion.div>
        <div className="text-center">
          <p className="font-bold text-xl">Analysing your interview…</p>
          <p className="text-muted-foreground text-sm mt-1">Generating your full report — about 15 seconds</p>
        </div>
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
      </div>
    );
  }

  // ── Computed ────────────────────────────────────────────────────────────────

  const targetQ = interview?.questionCount ?? 0;
  const progressPct = targetQ > 0 ? Math.min((questionIndex / targetQ) * 100, 100) : 0;
  const srSupported = !!getSR();
  const isRecording = status === "listening";
  const canSend = !!(transcript + interimText + textInput).trim() && status !== "thinking" && !isComplete;
  const currentStageIdx = getStageIndex(stage);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">

      {/* ── Header ── */}
      <div className="border-b bg-card/80 backdrop-blur px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Interviews
          </button>
          <div className="h-4 w-px bg-border" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold">Live Interview</h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-medium px-2 py-0">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-1.5 inline-block animate-pulse" />
                Live
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              AI is interviewing you. Answer out loud and have a conversation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEndDialog(true)}
            className="text-destructive border-destructive/30 hover:bg-destructive/5 text-xs"
          >
            <PhoneOff className="h-3.5 w-3.5 mr-1.5" />
            End Interview
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Body: main + sidebar ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left / Main ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-w-0">

          {/* AI Message card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="font-semibold text-sm">AI Interviewer</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Timer className="h-3 w-3" />
                      {elapsed}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {status === "thinking" || status === "loading" ? (
                      <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 h-6">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="h-2 w-2 bg-primary/40 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.p key={currentAIMessage.slice(0, 30)}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm leading-relaxed text-foreground">
                        {currentAIMessage || "…"}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice / Input card */}
          <Card>
            <CardContent className="p-5">
              <AnimatePresence mode="wait">

                {isComplete ? (
                  <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3 py-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    <p className="font-semibold">Interview Complete</p>
                    <p className="text-sm text-muted-foreground">Generating your report…</p>
                  </motion.div>

                ) : isRecording ? (
                  // Recording state — waveform + stop button
                  <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">You are speaking...</span>
                      <span className="font-mono text-muted-foreground text-xs">{recordingTimer}</span>
                    </div>

                    <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3 flex items-center justify-center">
                      <WaveformBars active />
                    </div>

                    {transcript && (
                      <p className="text-xs text-muted-foreground italic px-1 line-clamp-2">
                        {transcript}
                        {interimText && <span className="opacity-60"> {interimText}</span>}
                      </p>
                    )}

                    <div className="flex flex-col items-center gap-1.5">
                      <motion.button
                        onClick={stopRecording}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25"
                      >
                        <div className="h-5 w-5 bg-white rounded-[3px]" />
                      </motion.button>
                      <span className="text-xs text-muted-foreground">Click to stop</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t">
                      <div className="flex items-center gap-1.5 text-primary font-medium">
                        <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse inline-block" />
                        Listening...
                      </div>
                      <button onClick={() => handleSend()}
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        Press Enter to submit
                      </button>
                    </div>
                  </motion.div>

                ) : (
                  // Idle / ready state
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                    {transcript ? (
                      // Transcript ready — show with send/clear
                      <>
                        <div className="rounded-xl bg-muted/40 border px-4 py-3 text-sm leading-relaxed">
                          {transcript}
                          {interimText && <span className="text-muted-foreground italic"> {interimText}</span>}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSend()} disabled={!canSend} className="flex-1">
                            Send Response
                          </Button>
                          <Button variant="outline"
                            onClick={() => { transcriptRef.current = ""; setTranscript(""); setInterimText(""); }}>
                            Clear
                          </Button>
                        </div>
                      </>
                    ) : (
                      // No transcript yet — prompt to tap mic
                      <div className="flex flex-col items-center gap-3 py-2">
                        {srSupported ? (
                          <motion.button
                            onClick={startRecording}
                            disabled={status === "thinking" || status === "speaking"}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className={cn(
                              "h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-colors",
                              status === "thinking" || status === "speaking"
                                ? "bg-muted cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90 shadow-primary/25",
                            )}
                          >
                            {status === "thinking"
                              ? <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                              : <Mic className="h-6 w-6 text-white" />
                            }
                          </motion.button>
                        ) : null}
                        <p className="text-sm text-muted-foreground text-center">
                          {status === "thinking" ? "Alex is thinking…"
                            : status === "speaking" ? "Alex is speaking…"
                            : srSupported ? "Click the microphone to start speaking"
                            : "Type your response below"}
                        </p>
                      </div>
                    )}

                    {/* Controls row */}
                    <div className="flex items-center justify-between text-xs border-t pt-3">
                      <button
                        onClick={() => { const n = !muted; setMuted(n); if (n) window.speechSynthesis?.cancel(); }}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                        {muted ? "Unmute AI" : "Mute AI"}
                      </button>
                      <button onClick={() => setShowTextInput(v => !v)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                        ⌨ Keyboard
                      </button>
                    </div>

                    {/* Keyboard fallback */}
                    <AnimatePresence>
                      {showTextInput && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="flex gap-2 pt-1">
                            <input
                              autoFocus
                              value={textInput}
                              onChange={e => setTextInput(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                              placeholder="Type your response…"
                              disabled={status === "thinking"}
                              className="flex-1 bg-background border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                            <Button onClick={() => handleSend()} disabled={!canSend} size="icon" className="h-10 w-10 shrink-0">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Interview Progress */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Interview Progress</h3>
                <span className="text-sm text-muted-foreground font-mono">
                  {questionIndex} / {targetQ || "—"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full mb-5 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex gap-1">
                {STAGES.map((s, idx) => {
                  const done = idx < currentStageIdx;
                  const active = idx === currentStageIdx;
                  return (
                    <div key={s.id} className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                        done   ? "bg-emerald-500 border-emerald-500 text-white" :
                        active ? "bg-primary border-primary text-primary-foreground" :
                                 "bg-background border-border text-muted-foreground",
                      )}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <span>{idx + 1}</span>}
                      </div>
                      <span className={cn(
                        "text-[10px] text-center leading-tight font-medium",
                        active ? "text-primary" : done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                      )}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Live Notes */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Live Notes</h3>
                <Badge variant="outline" className="text-[10px] font-normal">
                  <Lock className="h-2.5 w-2.5 mr-1" />
                  Private
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Your key points will appear here during the interview...
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-72 xl:w-80 border-l overflow-y-auto p-4 space-y-4 shrink-0 hidden md:block">

          {/* Interview Details */}
          <Card>
            <CardHeader className="pb-0 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-4 space-y-3.5">
              {[
                { Icon: Briefcase,     label: "Role",      value: interview?.targetRole ?? "—" },
                { Icon: BrainCircuit,  label: "Type",      value: "Live AI Interview" },
                { Icon: Users,         label: "Level",     value: interview?.difficulty ?? "—" },
                { Icon: Clock,         label: "Duration",  value: `${interview?.durationMinutes ?? 30} mins` },
                { Icon: Hash,          label: "Questions", value: "Dynamic" },
                { Icon: Globe,         label: "Language",  value: "English" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-xs font-medium capitalize">{value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Interview Tips */}
          <Card>
            <CardHeader className="pb-0 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Interview Tips</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-4 space-y-2.5">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI is evaluating */}
          <Card className="border-primary/20">
            <CardHeader className="pb-0 pt-4 px-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full animate-pulse inline-block" />
                <CardTitle className="text-sm font-semibold text-primary">AI is evaluating</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pt-3 pb-4">
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                The AI is analyzing your answers in real-time based on multiple factors.
              </p>
              <div className="space-y-2">
                {EVAL_FACTORS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary/60" />
                    {label}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-1">And more...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── End interview dialog ── */}
      <AnimatePresence>
        {showEndDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }} transition={{ type: "spring", damping: 22 }}
              className="bg-card border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="h-11 w-11 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <PhoneOff className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-bold text-base mb-1">End the interview?</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Your report will be generated from the conversation so far.
              </p>
              <div className="flex gap-3">
                <Button variant="destructive" className="flex-1" onClick={handleEndEarly}>
                  End &amp; Get Report
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowEndDialog(false)}>
                  Continue
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
