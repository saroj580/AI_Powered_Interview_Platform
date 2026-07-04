"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Mic, MicOff, PhoneOff, BrainCircuit, Timer,
  Loader2, AlertCircle, Volume2, VolumeX, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

// ── Avatar with animated rings ────────────────────────────────────────────────

function AvatarRings({ status }: { status: CallStatus }) {
  const isSpeaking = status === "speaking";
  const isListening = status === "listening";
  const isThinking = status === "thinking" || status === "loading";
  const active = isSpeaking || isListening;

  const ringColor = isListening ? "border-emerald-400" : "border-violet-400";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
      {/* Outer ring */}
      <motion.div
        className={cn("absolute rounded-full border-2", ringColor, "opacity-20")}
        style={{ width: 240, height: 240 }}
        animate={active ? { scale: [1, 1.09, 1], opacity: [0.15, 0.4, 0.15] } : { scale: 1, opacity: 0.15 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Middle ring */}
      <motion.div
        className={cn("absolute rounded-full border-2", ringColor, "opacity-30")}
        style={{ width: 195, height: 195 }}
        animate={
          active
            ? { scale: [1, 1.07, 1], opacity: [0.25, 0.55, 0.25] }
            : isThinking
            ? { scale: [1, 1.03, 1], opacity: [0.15, 0.3, 0.15] }
            : { scale: 1, opacity: 0.2 }
        }
        transition={{ duration: active ? 1.6 : 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      {/* Inner circle */}
      <motion.div
        className={cn(
          "relative flex items-center justify-center rounded-full shadow-2xl",
          isListening
            ? "bg-gradient-to-br from-emerald-600 to-emerald-800"
            : isSpeaking
            ? "bg-gradient-to-br from-violet-600 to-violet-900"
            : "bg-gradient-to-br from-slate-700 to-slate-900",
        )}
        style={{ width: 150, height: 150 }}
        animate={isThinking ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <BrainCircuit className="h-16 w-16 text-white/90" />

        {/* Sound bars when AI speaking */}
        {isSpeaking && (
          <div className="absolute bottom-7 flex items-end gap-1">
            {[4, 7, 11, 7, 4].map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-white/60 rounded-full"
                animate={{ height: [h, h * 2.8, h] }}
                transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
                style={{ height: h }}
              />
            ))}
          </div>
        )}

        {/* Mic icon overlay when listening */}
        {isListening && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute bottom-6"
          >
            <Mic className="h-6 w-6 text-white/80" />
          </motion.div>
        )}
      </motion.div>
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

  const srRef = useRef<ISR | null>(null);
  const lastSpokenId = useRef("");
  const mutedRef = useRef(false);
  const statusRef = useRef<CallStatus>("loading");

  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // ── Text-to-speech ──────────────────────────────────────────────────────────

  const speak = useCallback((text: string) => {
    if (mutedRef.current || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9;
    utt.pitch = 1.0;
    utt.volume = 1;
    const voice = getBestVoice();
    if (voice) utt.voice = voice;
    utt.onstart = () => setStatus("speaking");
    utt.onend = () => { if (statusRef.current === "speaking") setStatus("idle"); };
    utt.onerror = () => { if (statusRef.current === "speaking") setStatus("idle"); };
    window.speechSynthesis.speak(utt);
  }, []);

  // Speak new AI messages automatically
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === "interviewer" && last.id !== lastSpokenId.current) {
      lastSpokenId.current = last.id;
      setCurrentAIMessage(last.content);
      speak(last.content);
    }
  }, [messages, speak]);

  // Load voices asynchronously (Chrome fires voiceschanged)
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => { /* voices now ready */ };
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

  // ── API call ────────────────────────────────────────────────────────────────

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

  // ── Send message ────────────────────────────────────────────────────────────

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? (transcript + " " + interimText + " " + textInput)).trim();
    if (!text || status === "thinking" || isComplete) return;

    stopRecording();
    window.speechSynthesis?.cancel();

    const candidateMsg: LiveMessage = { id: crypto.randomUUID(), role: "candidate", content: text };
    const newHistory = [...messages, candidateMsg];
    setMessages(newHistory);
    setTranscript("");
    setInterimText("");
    setTextInput("");

    await sendTurn(newHistory, observations, stage, questionIndex);
  }, [transcript, interimText, textInput, status, isComplete, messages, observations, stage, questionIndex, sendTurn]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Voice ────────────────────────────────────────────────────────────────────

  function startRecording() {
    const SR = getSR();
    if (!SR || status === "thinking" || status === "loading") return;
    window.speechSynthesis?.cancel();
    setStatus("listening");
    setTranscript("");
    setInterimText("");

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
      if (final) setTranscript(prev => (prev + " " + final).trim());
      setInterimText(interim);
    };
    sr.onerror = () => { setInterimText(""); if (statusRef.current === "listening") setStatus("idle"); };
    sr.onend = () => { setInterimText(""); if (statusRef.current === "listening") setStatus("idle"); };
    srRef.current = sr;
    sr.start();
  }

  function stopRecording() {
    srRef.current?.stop();
    srRef.current = null;
    setInterimText("");
    if (statusRef.current === "listening") setStatus("idle");
  }

  function toggleMic() {
    if (status === "listening") stopRecording();
    else startRecording();
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

  // ── Loading / error screens ─────────────────────────────────────────────────

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
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-slate-950">
        <motion.div
          className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <BrainCircuit className="h-12 w-12 text-primary" />
        </motion.div>
        <div className="text-center">
          <p className="font-bold text-2xl text-white">Analysing your interview…</p>
          <p className="text-slate-400 text-sm mt-2">Generating your full report — about 15 seconds</p>
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

  const statusLabel: Record<CallStatus, string> = {
    loading: "Connecting…",
    speaking: "Alex is speaking",
    thinking: "Thinking…",
    listening: "Listening…",
    idle: (transcript || textInput) ? "Ready to send" : "Your turn",
    complete: "Interview complete",
  };

  const statusColor: Record<CallStatus, string> = {
    loading:   "text-slate-400",
    speaking:  "text-violet-400",
    thinking:  "text-amber-400",
    listening: "text-emerald-400",
    idle:      "text-slate-400",
    complete:  "text-primary",
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-950 via-[#0d0d1a] to-slate-950 text-white select-none">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-slate-200">Live Interview</span>
          {interview && (
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs hidden sm:flex">
              {interview.targetRole} · {interview.difficulty}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {targetQ > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs font-mono text-slate-500">Q{questionIndex}/{targetQ}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
            <Timer className="h-3.5 w-3.5" />
            {elapsed}
          </div>
          <button
            onClick={() => {
              const next = !muted;
              setMuted(next);
              if (next) window.speechSynthesis?.cancel();
            }}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            title={muted ? "Unmute Alex" : "Mute Alex"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Center stage ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-2">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <AvatarRings status={status} />

          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">Alex</p>
            <p className="text-slate-500 text-sm">AI Interviewer</p>
          </div>

          {/* Status chip */}
          <motion.div
            key={statusLabel[status]}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex items-center gap-2 text-sm font-medium", statusColor[status])}
          >
            {(status === "thinking" || status === "loading") && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {statusLabel[status]}
          </motion.div>
        </div>

        {/* Caption cards */}
        <div className="w-full max-w-lg space-y-3">
          {/* AI caption */}
          <AnimatePresence mode="wait">
            {currentAIMessage && (
              <motion.div
                key={currentAIMessage.slice(0, 40)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white/5 border border-white/8 backdrop-blur px-5 py-4"
              >
                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Alex</p>
                <p className="text-sm text-slate-200 leading-relaxed">{currentAIMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candidate transcript */}
          <AnimatePresence>
            {(transcript || interimText) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-emerald-950/40 border border-emerald-800/40 px-5 py-4"
              >
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">You</p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {transcript}
                  {interimText && <span className="text-slate-500 italic"> {interimText}</span>}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text input (keyboard fallback / optional) */}
          <AnimatePresence>
            {showTextInput && !isComplete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 pt-1">
                  <input
                    autoFocus
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type your response…"
                    disabled={status === "thinking"}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-primary/50 transition-colors"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!canSend}
                    size="icon"
                    className="h-10 w-10 bg-primary shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom controls ── */}
      <div className="shrink-0 pb-10 px-6 flex flex-col items-center gap-5">

        {/* Hint text */}
        <p className="text-xs text-slate-600 h-4">
          {isComplete
            ? "Interview complete — generating your report"
            : isRecording
            ? "Tap mic to stop · tap ➤ to send"
            : status === "thinking" || status === "speaking"
            ? ""
            : srSupported
            ? "Tap mic to speak · or use keyboard ⌨"
            : "Type your response and press send"}
        </p>

        {/* Buttons row */}
        <div className="flex items-center justify-center gap-6">

          {/* Keyboard toggle */}
          {!isComplete && (
            <motion.button
              onClick={() => setShowTextInput(v => !v)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                showTextInput ? "bg-slate-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700",
              )}
              title="Toggle keyboard input"
            >
              <span className="text-lg">⌨</span>
            </motion.button>
          )}

          {/* Mic button */}
          {srSupported && !isComplete && (
            <motion.button
              onClick={toggleMic}
              disabled={status === "thinking" || status === "loading"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className={cn(
                "h-20 w-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-200",
                isRecording
                  ? "bg-emerald-500 shadow-emerald-500/40 ring-4 ring-emerald-500/20"
                  : status === "thinking" || status === "loading"
                  ? "bg-slate-800 opacity-40 cursor-not-allowed"
                  : "bg-slate-700 hover:bg-slate-600 shadow-slate-900/50",
              )}
            >
              {isRecording
                ? <Mic className="h-8 w-8 text-white" />
                : <MicOff className="h-8 w-8 text-slate-300" />
              }
            </motion.button>
          )}

          {/* Send button — appears when transcript ready */}
          <AnimatePresence>
            {canSend && (
              <motion.button
                onClick={() => handleSend()}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <Send className="h-6 w-6 text-white" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* End call */}
          {!isComplete && (
            <motion.button
              onClick={() => setShowEndDialog(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-600/30 transition-colors"
            >
              <PhoneOff className="h-7 w-7 text-white" />
            </motion.button>
          )}
        </div>
      </div>

      {/* ── End call dialog ── */}
      <AnimatePresence>
        {showEndDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                <PhoneOff className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-bold text-lg mb-1">End the interview?</h3>
              <p className="text-slate-400 text-sm mb-5">
                Your report will be generated from the conversation so far. You won&apos;t be able to continue.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleEndEarly}
                >
                  End &amp; Get Report
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => setShowEndDialog(false)}
                >
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
