"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Sparkles, Video, Code2, MessageSquare, Mic, Layers, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

const TYPES = [
    { id: "TECHNICAL", label: "Technical", desc: "Coding & system design", icon: Code2, color: "text-violet-500" },
    { id: "BEHAVIORAL", label: "Behavioral", desc: "Soft skills & scenarios", icon: MessageSquare, color: "text-emerald-500" },
    { id: "CODING", label: "Live Coding", desc: "Monaco editor + AI review", icon: Video, color: "text-blue-500" },
    { id: "VOICE", label: "Voice", desc: "Speech to text analysis", icon: Mic, color: "text-rose-500" },
    { id: "MIXED", label: "Mixed", desc: "Technical + behavioral", icon: Layers, color: "text-amber-500" },
];

const DIFFICULTIES = [
    { id: "EASY", label: "Easy", desc: "Fresher / Entry level", color: "text-emerald-500 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30" },
    { id: "MEDIUM", label: "Medium", desc: "2–4 years experience", color: "text-amber-500 border-amber-300 bg-amber-50 dark:bg-amber-950/30" },
    { id: "HARD", label: "Hard", desc: "Senior / Lead level", color: "text-red-500 border-red-300 bg-red-50 dark:bg-red-950/30" },
];

const QUESTION_COUNTS = [5, 8, 10, 15, 20];
const DURATION_MAP: Record<number, number> = { 5: 20, 8: 30, 10: 40, 15: 55, 20: 75 };

interface Config {
    type: string;
    role: string;
    experience: string;
    difficulty: string;
    count: number;
}

export function InterviewSetupWizard() {
    const router = useRouter();
    const { user, token } = useAuthStore();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [config, setConfig] = useState<Config>({
        type: "TECHNICAL",
        role: "",
        experience: "Junior",
        difficulty: "MEDIUM",
        count: 10,
    });

    const steps = ["Interview Type", "Role & Level", "Difficulty & Count", "Review & Start"];

    async function handleStart() {
        if (!user) {
            setError("Please log in to start an interview.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/v1/interviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    title: `${config.role || "Software Engineer"} — ${config.type}`,
                    type: config.type,
                    targetRole: config.role || "Software Engineer",
                    difficulty: config.difficulty,
                    questionCount: config.count,
                    durationMinutes: DURATION_MAP[config.count] ?? 40,
                    status: "IN_PROGRESS",
                    createdById: user.id,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error?.message ?? "Failed to create interview");
            }

            const interview = await res.json();
            toast.success("Interview created! Starting session…");
            router.push(`/candidate/interviews/${interview.id}/session`);
        } catch (err) {
            setError((err as Error).message);
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
                {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                            i === step ? "bg-primary text-white shadow-glow-purple" :
                                i < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                            {i < step ? "✓" : i + 1}
                        </div>
                        <span className={cn("text-xs font-medium hidden sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                        {i < steps.length - 1 && <div className="flex-1 h-px bg-border" />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                >
                    {step === 0 && (
                        <Card>
                            <CardHeader><CardTitle>What type of interview?</CardTitle><CardDescription>Choose the format that matches your practice goal</CardDescription></CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-3">
                                {TYPES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setConfig({ ...config, type: t.id })}
                                        className={cn(
                                            "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                                            config.type === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                        )}
                                    >
                                        <t.icon className={cn("h-5 w-5 mt-0.5 shrink-0", t.color)} />
                                        <div>
                                            <p className="font-semibold text-sm">{t.label}</p>
                                            <p className="text-muted-foreground text-xs">{t.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {step === 1 && (
                        <Card>
                            <CardHeader><CardTitle>Target role & experience</CardTitle><CardDescription>Questions will be tailored to your specific role</CardDescription></CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Target Role <span className="text-destructive">*</span></Label>
                                    <Input
                                        placeholder="e.g. Senior React Developer, Java Backend Engineer…"
                                        value={config.role}
                                        onChange={(e) => setConfig({ ...config, role: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Experience Level</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Fresher", "Junior", "Mid-Level", "Senior", "Lead"].map((level) => (
                                            <Badge
                                                key={level}
                                                variant={config.experience === level ? "default" : "outline"}
                                                className="cursor-pointer px-4 py-1.5 text-sm"
                                                onClick={() => setConfig({ ...config, experience: level })}
                                            >
                                                {level}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 2 && (
                        <Card>
                            <CardHeader><CardTitle>Difficulty & question count</CardTitle><CardDescription>Set the challenge level for this session</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {DIFFICULTIES.map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => setConfig({ ...config, difficulty: d.id })}
                                                className={cn(
                                                    "p-3 rounded-xl border-2 text-center transition-all",
                                                    config.difficulty === d.id ? `border-current ${d.color}` : "border-border hover:border-primary/30"
                                                )}
                                            >
                                                <p className={cn("font-semibold text-sm", config.difficulty === d.id ? "" : "text-foreground")}>{d.label}</p>
                                                <p className="text-muted-foreground text-xs mt-0.5">{d.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Number of Questions</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {QUESTION_COUNTS.map((c) => (
                                            <Badge
                                                key={c}
                                                variant={config.count === c ? "default" : "outline"}
                                                className="cursor-pointer px-5 py-1.5 text-sm"
                                                onClick={() => setConfig({ ...config, count: c })}
                                            >
                                                {c} Q
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Ready to start?</CardTitle>
                                <CardDescription>Review your configuration before Gemini generates your questions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl bg-muted/50 p-5 space-y-3">
                                    {[
                                        { label: "Interview Type", value: config.type },
                                        { label: "Target Role", value: config.role || "Not specified" },
                                        { label: "Experience", value: config.experience },
                                        { label: "Difficulty", value: config.difficulty },
                                        { label: "Questions", value: `${config.count} questions` },
                                        { label: "Est. Duration", value: `~${DURATION_MAP[config.count] ?? 40} min` },
                                    ].map((item) => (
                                        <div key={item.label} className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-sm">{item.label}</span>
                                            <Badge variant="secondary" className="font-medium">{item.value}</Badge>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                                    <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                    <p className="text-sm text-muted-foreground">
                                        Gemini 2.5 Pro will generate <strong className="text-foreground">{config.count} personalized questions</strong> for a <strong className="text-foreground">{config.role || "software engineering"}</strong> role at <strong className="text-foreground">{config.difficulty.toLowerCase()}</strong> difficulty.
                                    </p>
                                </div>
                                {error && (
                                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                {step < steps.length - 1 ? (
                    <Button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !config.role} className="bg-gradient-primary text-white border-0 hover:opacity-90">
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                ) : (
                    <Button onClick={handleStart} disabled={loading} className="bg-gradient-primary text-white border-0 hover:opacity-90 px-6">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating session…
                            </span>
                        ) : (
                            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Start Interview</span>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
