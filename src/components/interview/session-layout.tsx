"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Mic, MicOff, Timer, Sparkles, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [isRecording, setIsRecording] = useState(false);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const { display, time } = useCountdown(300);

    const currentQ = MOCK_QUESTIONS[currentIdx];
    const isLast = currentIdx === MOCK_QUESTIONS.length - 1;
    const progress = ((currentIdx) / MOCK_QUESTIONS.length) * 100;

    function handleNext() {
        setAnswers({ ...answers, [currentIdx]: answer });
        setAnswer("");
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
                    <div className={cn("flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-lg",
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
                            <Button
                                variant={isRecording ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => setIsRecording(!isRecording)}
                                className="gap-1.5 text-xs h-8"
                            >
                                {isRecording ? <><MicOff className="h-3.5 w-3.5" /> Stop Recording</> : <><Mic className="h-3.5 w-3.5" /> Voice Answer</>}
                            </Button>
                        </div>

                        {isRecording && (
                            <div className="flex items-center gap-2 mb-3 p-2.5 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Recording… speak your answer clearly</p>
                            </div>
                        )}

                        <Textarea
                            placeholder="Type your answer here, or use voice recording above…"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="min-h-[160px] resize-none bg-muted/40 border-0 focus-visible:ring-1 text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-2">{answer.length} characters</p>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Take your time — there's no penalty for thinking
                    </p>
                    <Button
                        onClick={handleNext}
                        disabled={!answer.trim()}
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