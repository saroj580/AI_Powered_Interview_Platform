import { cn } from "@/lib/utils";

function ProductFrame({
    path,
    children,
    className,
}: {
    path: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "rounded-lg border border-border bg-card overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md",
                className
            )}
        >
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/40">
                <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="mx-auto max-w-[220px] h-6 rounded-md bg-background border border-border flex items-center px-2.5">
                        <span className="text-[10px] text-muted-foreground truncate font-mono">{path}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-5 bg-background">{children}</div>
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
            <div className="h-9 rounded-md border border-border bg-card px-3 flex items-center text-sm text-foreground">
                {value}
            </div>
        </div>
    );
}

function Tag({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground">
            {children}
        </span>
    );
}

export function ResumeSetupMockup() {
    return (
        <ProductFrame path="interviewai.app/candidate/resume">
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border bg-muted/30">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">alex_johnson_resume.pdf</p>
                        <p className="text-[11px] text-muted-foreground">248 KB · Uploaded just now</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-primary">Analyzing</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="Target role" value="Senior React Developer" />
                    <Field label="Experience" value="4 years · Mid-level" />
                    <Field label="Interview type" value="Technical + Behavioral" />
                    <Field label="Difficulty" value="Medium" />
                </div>

                <div className="rounded-md border border-border p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-foreground">ATS compatibility</span>
                        <span className="font-semibold text-foreground">87<span className="text-muted-foreground font-normal">/100</span></span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[87%] rounded-full bg-primary" />
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[11px] font-medium text-muted-foreground">Extracted skills</p>
                    <div className="flex flex-wrap gap-1.5">
                        {["React", "TypeScript", "Node.js", "GraphQL", "AWS", "System Design"].map((skill) => (
                            <Tag key={skill}>{skill}</Tag>
                        ))}
                    </div>
                </div>
            </div>
        </ProductFrame>
    );
}

export function QuestionGenerationMockup() {
    const questions = [
        { n: 1, text: "Walk through your approach to optimizing React re-renders in a large dashboard.", type: "Technical" },
        { n: 2, text: "Describe a production incident you debugged and how you prevented recurrence.", type: "Behavioral" },
        { n: 3, text: "Design a real-time notification system for 1M concurrent users.", type: "System Design" },
        { n: 4, text: "When would you choose useCallback over useMemo in a component tree?", type: "Technical" },
    ];

    return (
        <ProductFrame path="interviewai.app/candidate/interviews/new">
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Senior React Developer</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">10 questions · tailored to resume & role</p>
                    </div>
                    <span className="shrink-0 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary">
                        Ready
                    </span>
                </div>

                <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">
                        Generated from profile: <span className="text-foreground">React hooks, performance, leadership</span>
                    </p>
                </div>

                <div className="space-y-2">
                    {questions.map((q) => (
                        <div
                            key={q.n}
                            className="flex gap-3 rounded-md border border-border bg-card p-2.5"
                        >
                            <span className="shrink-0 w-5 text-[11px] font-mono text-muted-foreground pt-0.5">
                                {String(q.n).padStart(2, "0")}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-[12px] leading-relaxed text-foreground">{q.text}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">{q.type}</p>
                            </div>
                        </div>
                    ))}
                    <p className="text-center text-[11px] text-muted-foreground pt-1">+ 6 more questions</p>
                </div>
            </div>
        </ProductFrame>
    );
}

export function LiveInterviewMockup() {
    return (
        <ProductFrame path="interviewai.app/candidate/interviews/session">
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-muted-foreground">Question 3 of 10</span>
                    <span className="font-mono font-medium text-foreground">12:41</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[30%] rounded-full bg-primary" />
                </div>

                <div className="rounded-md border border-border p-3.5 space-y-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">AI Interviewer</p>
                    <p className="text-[13px] leading-relaxed text-foreground">
                        Explain the difference between <span className="font-mono text-[12px] text-primary">useCallback</span> and{" "}
                        <span className="font-mono text-[12px] text-primary">useMemo</span>. When would you use each in production code?
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-border p-2.5">
                        <p className="text-[10px] text-muted-foreground mb-1.5">Response mode</p>
                        <p className="text-[12px] font-medium text-foreground">Voice + Text</p>
                        <div className="flex items-end gap-0.5 h-4 mt-2">
                            {[3, 5, 4, 7, 5, 3, 6, 4].map((h, i) => (
                                <span
                                    key={i}
                                    className="w-1 rounded-sm bg-muted-foreground/30"
                                    style={{ height: `${h * 2}px` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="rounded-md border border-border p-2.5">
                        <p className="text-[10px] text-muted-foreground mb-1.5">Live assessment</p>
                        <div className="space-y-1.5">
                            {[
                                { label: "Clarity", value: 82 },
                                { label: "Depth", value: 76 },
                            ].map((m) => (
                                <div key={m.label} className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground w-10">{m.label}</span>
                                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full rounded-full bg-foreground/20" style={{ width: `${m.value}%` }} />
                                    </div>
                                    <span className="text-[10px] font-mono text-foreground">{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-md border border-border bg-muted/20 p-3 min-h-[72px]">
                    <p className="text-[11px] text-muted-foreground mb-1">Your answer</p>
                    <p className="text-[12px] text-foreground/80 leading-relaxed">
                        useCallback memoizes functions to prevent unnecessary re-renders when passed as props...
                    </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-3">
                    <span>Coding challenge available</span>
                    <span className="text-foreground font-medium">Evaluate answer →</span>
                </div>
            </div>
        </ProductFrame>
    );
}

export function FeedbackDashboardMockup() {
    const scores = [
        { label: "Technical", value: 82 },
        { label: "Communication", value: 88 },
        { label: "Problem solving", value: 74 },
        { label: "Confidence", value: 79 },
    ];

    return (
        <ProductFrame path="interviewai.app/candidate/interviews/report">
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Interview Report</p>
                        <p className="text-[11px] text-muted-foreground">Senior React Developer · 42 min session</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-foreground leading-none">81</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Overall</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {scores.map((s) => (
                        <div key={s.label} className="rounded-md border border-border p-2.5">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-muted-foreground">{s.label}</span>
                                <span className="text-[12px] font-semibold text-foreground">{s.value}</span>
                            </div>
                            <div className="h-1 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-primary/70" style={{ width: `${s.value}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-border p-2.5 space-y-1.5">
                        <p className="text-[10px] font-medium text-foreground">Strengths</p>
                        <ul className="space-y-1">
                            {["Clear React fundamentals", "Structured answers"].map((item) => (
                                <li key={item} className="text-[11px] text-muted-foreground leading-snug">· {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-md border border-border p-2.5 space-y-1.5">
                        <p className="text-[10px] font-medium text-foreground">Gaps</p>
                        <ul className="space-y-1">
                            {["System design depth", "Time complexity"].map((item) => (
                                <li key={item} className="text-[11px] text-muted-foreground leading-snug">· {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="rounded-md border border-border p-2.5">
                    <p className="text-[10px] font-medium text-foreground mb-2">Learning roadmap</p>
                    <div className="space-y-1.5">
                        {[
                            "Review distributed systems patterns",
                            "Practice 2 medium LeetCode problems daily",
                            "Record behavioral answers with STAR format",
                        ].map((item, i) => (
                            <div key={item} className="flex items-center gap-2 text-[11px]">
                                <span className="shrink-0 w-4 font-mono text-muted-foreground">{i + 1}.</span>
                                <span className="text-muted-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProductFrame>
    );
}
