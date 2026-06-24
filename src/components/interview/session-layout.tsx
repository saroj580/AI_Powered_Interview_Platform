"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Mic, MicOff, Timer, Sparkles, Volume2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Speech Recognition types (not in all TS libs yet) ────────────────────────
interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}
interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}
interface ISpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
    onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
}
declare global {
    interface Window {
        SpeechRecognition?: new () => ISpeechRecognition;
        webkitSpeechRecognition?: new () => ISpeechRecognition;
    }
}
// ─────────────────────────────────────────────────────────────────────────────

function getSpeechRecognition(): (new () => ISpeechRecognition) | null {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function useSpeechRecognition(onTranscript: (text: string, isFinal: boolean) => void) {
    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!getSpeechRecognition()) setIsSupported(false);
        return () => recognitionRef.current?.abort();
    }, []);

    const start = useCallback(() => {
        const SR = getSpeechRecognition();
        if (!SR) {
            setIsSupported(false);
            return;
        }

        setError(null);
        const recognition = new SR();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);

        recognition.onresult = (e: SpeechRecognitionEvent) => {
            let interim = "";
            let finalText = "";

            for (let i = e.resultIndex; i < e.results.length; i++) {
                const transcript = e.results[i][0].transcript;
                if (e.results[i].isFinal) {
                    finalText += transcript;
                } else {
                    interim += transcript;
                }
            }

            if (finalText) onTranscript(finalText, true);
            else if (interim) onTranscript(interim, false);
        };

        recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
            if (e.error === "not-allowed" || e.error === "permission-denied") {
                setError("Microphone access denied. Please allow microphone access in your browser settings.");
            } else if (e.error === "no-speech") {
                setError("No speech detected. Please speak clearly and try again.");
            } else if (e.error === "network") {
                setError("Network error during speech recognition. Check your connection.");
            } else {
                setError(`Speech error: ${e.error}`);
            }
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        try {
            recognition.start();
        } catch {
            setError("Failed to start microphone. Please try again.");
        }
    }, [onTranscript]);

    const stop = useCallback(() => {
        recognitionRef.current?.stop();
        setIsRecording(false);
    }, []);

    return { isRecording, isSupported, error, start, stop };
}

// ─────────────────────────────────────────────────────────────────────────────

const MOCK_QUESTIONS = [
    { id: 1, text: "Explain the concept of closures in JavaScript and provide a practical use case.", category: "Technical", difficulty: "MEDIUM" },
    { id: 2, text: "What are the differences between useCallback and useMemo hooks in React? When would you use each?", category: "Technical", difficulty: "MEDIUM" },
    { id: 3, text: "Describe a challenging technical problem you solved and walk me through your approach.", category: "Behavioral", difficulty: "MEDIUM" },
    { id: 4, text: "How would you design a rate limiter for a high-traffic API? What data structures would you use?", category: "System Design", difficulty: "HARD" },
    { id: 5, text: "Explain the event loop in Node.js and how it handles asynchronous operations.", category: "Technical", difficulty: "MEDIUM" },
];

function useCountdown(initial: number) {
    const [time, setTime] = useState(initial);
    useEffect(() => {
        const interval = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 1000);
        return () => clearInterval(interval);
    }, []);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return { time, display: `${minutes}:${seconds.toString().padStart(2, "0")}` };
}

export function InterviewSession() {
    const router = useRouter();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answer, setAnswer] = useState("");
    const [interimText, setInterimText] = useState("");
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const { display, time } = useCountdown(300);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Callback called by speech recognition with transcribed text
    const handleTranscript = useCallback((text: string, isFinal: boolean) => {
        if (isFinal) {
            setAnswer((prev) => {
                const trimmed = prev.trimEnd();
                return trimmed ? `${trimmed} ${text}` : text;
            });
            setInterimText("");
        } else {
            setInterimText(text);
        }
    }, []);

    const { isRecording, isSupported, error: speechError, start, stop } = useSpeechRecognition(handleTranscript);

    function toggleRecording() {
        if (isRecording) {
            stop();
        } else {
            start();
        }
    }

    const currentQ = MOCK_QUESTIONS[currentIdx];
    const isLast = currentIdx === MOCK_QUESTIONS.length - 1;
    const progress = (currentIdx / MOCK_QUESTIONS.length) * 100;
    const displayAnswer = answer + (interimText ? (answer ? " " : "") + interimText : "");

    function handleNext() {
        if (isRecording) stop();
        setAnswers({ ...answers, [currentIdx]: answer });
        setAnswer("");
        setInterimText("");
        if (isLast) {
            router.push("/candidate/interviews/demo-session/report");
        } else {
            setCurrentIdx((i) => i + 1);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header bar */}
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
                    <div className="flex-1">
                        <Progress value={progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-1">Question {currentIdx + 1} of {MOCK_QUESTIONS.length}</p>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-lg",
                        time < 60 ? "bg-red-50 text-red-600 dark:bg-red-950/30" : "bg-muted text-foreground"
                    )}>
                        <Timer className="h-3.5 w-3.5" />
                        {display}
                    </div>
                    <Badge variant="secondary" className="hidden sm:flex">{currentQ.category}</Badge>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-primary/20 bg-gradient-card">
                            <CardContent className="p-6 sm:p-8">
                                <div className="flex items-start justify-between gap-4 mb-5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">AI Interviewer</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <Volume2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-lg sm:text-xl font-medium leading-relaxed text-foreground">
                                    {currentQ.text}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                {/* Answer Area */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium">Your Answer</p>
                            {!isSupported ? (
                                <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                                    <MicOff className="h-3 w-3" /> Voice not supported in this browser
                                </Badge>
                            ) : (
                                <Button
                                    variant={isRecording ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={toggleRecording}
                                    className="gap-1.5 text-xs h-8"
                                >
                                    {isRecording
                                        ? <><MicOff className="h-3.5 w-3.5" /> Stop Recording</>
                                        : <><Mic className="h-3.5 w-3.5" /> Voice Answer</>}
                                </Button>
                            )}
                        </div>

                        {/* Recording indicator */}
                        {isRecording && (
                            <div className="flex items-center gap-2 mb-3 p-2.5 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    Listening… speak clearly
                                    {interimText && <span className="text-muted-foreground"> — &ldquo;{interimText.slice(0, 60)}{interimText.length > 60 ? "…" : ""}&rdquo;</span>}
                                </p>
                            </div>
                        )}

                        {/* Speech error */}
                        {speechError && (
                            <div className="flex items-start gap-2 mb-3 p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
                                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 dark:text-amber-400">{speechError}</p>
                            </div>
                        )}

                        <Textarea
                            ref={textareaRef}
                            placeholder="Type your answer here, or click 'Voice Answer' to speak…"
                            value={displayAnswer}
                            onChange={(e) => {
                                setAnswer(e.target.value);
                                setInterimText("");
                            }}
                            className={cn(
                                "min-h-[160px] resize-none bg-muted/40 border-0 focus-visible:ring-1 text-sm",
                                isRecording && "ring-1 ring-red-400"
                            )}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">{displayAnswer.length} characters</p>
                            {isSupported && !isRecording && displayAnswer.length === 0 && (
                                <p className="text-xs text-muted-foreground">Tip: Click the mic button to speak your answer</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Take your time — there&apos;s no penalty for thinking
                    </p>
                    <Button
                        onClick={handleNext}
                        disabled={!answer.trim() && !interimText.trim()}
                        className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-2"
                    >
                        {isLast ? "Finish Interview" : "Next Question"}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
