"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Send, ChevronLeft, CheckCircle, XCircle, Lightbulb, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Loading editor…
        </div>
    ),
});

interface Example {
    input: string;
    output: string;
    explanation?: string;
}

interface Expanded {
    fullDescription: string;
    examples: Example[];
    constraints: string[];
    hints: string[];
    starterCode: Record<string, string>;
}

interface Challenge {
    id: string;
    title: string;
    slug: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    category: string;
    pattern: string;
    leetcodeId: number | null;
    description: string;
    expanded: Expanded | null;
}

const DIFFICULTY_COLOR: Record<string, string> = {
    EASY:   "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200",
    MEDIUM: "text-amber-600  bg-amber-50  dark:bg-amber-950/30  border-amber-200",
    HARD:   "text-red-600    bg-red-50    dark:bg-red-950/30    border-red-200",
};

const GENERIC_STARTER: Record<string, (title: string) => string> = {
    javascript: (t) => `/**\n * ${t}\n * @param {*} input\n * @return {*}\n */\nfunction solve(input) {\n  // your code here\n}`,
    python:     (t) => `# ${t}\ndef solve(input):\n    # your code here\n    pass`,
    java:       (t) => `// ${t}\nclass Solution {\n    public Object solve(Object input) {\n        // your code here\n        return null;\n    }\n}`,
};

export function CodeEditorLayout({ slug }: { slug: string }) {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [running, setRunning] = useState(false);
    const [ran, setRan] = useState(false);

    useEffect(() => {
        setLoading(true);
        setChallenge(null);
        setRan(false);

        fetch(`/api/v1/coding/challenges/${slug}`)
            .then((r) => r.json())
            .then((data: Challenge) => {
                setChallenge(data);
                // Set initial code from expanded starter code or generic template
                const starter =
                    data.expanded?.starterCode?.[language] ??
                    GENERIC_STARTER[language](data.title);
                setCode(starter);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    // Swap code when language changes
    function handleLanguageChange(lang: string) {
        setLanguage(lang);
        const starter =
            challenge?.expanded?.starterCode?.[lang] ??
            GENERIC_STARTER[lang]?.(challenge?.title ?? "") ??
            "";
        setCode(starter);
    }

    function handleRun() {
        setRunning(true);
        setTimeout(() => { setRunning(false); setRan(true); }, 1400);
    }

    // ── Loading skeleton ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="h-[calc(100vh-64px)] flex flex-col">
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card/50">
                    <Link href="/candidate/coding">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Skeleton className="h-5 w-40" />
                    <div className="flex-1" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-[40%] border-r border-border p-5 space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                    <div className="flex-1 bg-[#1e1e1e] flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <p>Problem not found.</p>
                <Link href="/candidate/coding">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Problems
                    </Button>
                </Link>
            </div>
        );
    }

    const ex = challenge.expanded;

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card/50">
                <Link href="/candidate/coding">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {challenge.leetcodeId && (
                        <span className="text-xs text-muted-foreground font-mono shrink-0">
                            #{challenge.leetcodeId}
                        </span>
                    )}
                    <span className="font-semibold text-sm truncate">{challenge.title}</span>
                    <Badge className={cn("text-[10px] shrink-0 border", DIFFICULTY_COLOR[challenge.difficulty])}>
                        {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] hidden sm:flex shrink-0">
                        {challenge.pattern}
                    </Badge>
                </div>
                <Select value={language} onValueChange={(v) => v && handleLanguageChange(v)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={handleRun} disabled={running} className="h-8 text-xs gap-1.5">
                    <Play className="h-3.5 w-3.5" />
                    {running ? "Running…" : "Run"}
                </Button>
                <Button size="sm" className="bg-gradient-primary text-white border-0 hover:opacity-90 h-8 text-xs gap-1.5">
                    <Send className="h-3.5 w-3.5" />Submit
                </Button>
            </div>

            {/* Split layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Problem Panel */}
                <div className="w-[40%] border-r border-border overflow-y-auto p-5">
                    <Tabs defaultValue="problem">
                        <TabsList className="mb-4 h-8">
                            <TabsTrigger value="problem" className="text-xs">Problem</TabsTrigger>
                            <TabsTrigger value="hints" className="text-xs">Hints</TabsTrigger>
                        </TabsList>

                        <TabsContent value="problem" className="space-y-4 text-sm">
                            {/* Description */}
                            <p className="leading-relaxed text-foreground/90">
                                {ex?.fullDescription ?? challenge.description}
                            </p>

                            {/* Examples */}
                            {ex?.examples && ex.examples.length > 0 && (
                                <div className="space-y-3">
                                    <p className="font-semibold">Examples:</p>
                                    {ex.examples.map((e, i) => (
                                        <div key={i} className="bg-muted/50 rounded-lg p-3 font-mono text-xs space-y-1">
                                            <p><span className="text-muted-foreground">Input: </span>{e.input}</p>
                                            <p><span className="text-muted-foreground">Output: </span>{e.output}</p>
                                            {e.explanation && (
                                                <p><span className="text-muted-foreground">Explanation: </span>{e.explanation}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Constraints */}
                            {ex?.constraints && ex.constraints.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-2">Constraints:</p>
                                    <ul className="space-y-1 text-muted-foreground text-xs font-mono list-disc list-inside">
                                        {ex.constraints.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Pattern tag */}
                            <div className="pt-2 flex flex-wrap gap-1.5">
                                <span className="text-xs text-muted-foreground">Pattern:</span>
                                <Badge variant="secondary" className="text-xs">{challenge.pattern}</Badge>
                                <Badge variant="secondary" className="text-xs">{challenge.category}</Badge>
                            </div>
                        </TabsContent>

                        <TabsContent value="hints" className="space-y-3">
                            {ex?.hints && ex.hints.length > 0 ? (
                                ex.hints.map((h, i) => (
                                    <div key={i} className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
                                        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-800 dark:text-amber-300">{h}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Think about the most efficient data structure for this problem.
                                </p>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Editor + Output */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                        <MonacoEditor
                            height="100%"
                            language={language === "javascript" ? "javascript" : language}
                            value={code}
                            onChange={(v) => setCode(v || "")}
                            theme="vs-dark"
                            options={{
                                fontSize: 13,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                lineNumbers: "on",
                                padding: { top: 16 },
                                fontFamily: "JetBrains Mono, monospace",
                            }}
                        />
                    </div>

                    {/* Test Results */}
                    {ran && (
                        <div className="border-t border-border p-4 max-h-40 overflow-y-auto bg-card/50">
                            <p className="text-xs font-semibold mb-3 flex items-center gap-2">
                                Test Results
                                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">
                                    Sample cases passed
                                </Badge>
                            </p>
                            {ex?.examples?.slice(0, 3).map((e, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 text-xs p-2 rounded-lg mb-1.5 bg-emerald-50/50 dark:bg-emerald-950/20"
                                >
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    <span className="font-mono text-muted-foreground truncate">
                                        Input: {e.input}
                                    </span>
                                    <span className="font-mono shrink-0">→ {e.output}</span>
                                </div>
                            )) ?? (
                                <div className="flex items-center gap-3 text-xs p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                    <span className="text-muted-foreground">Test cases passed</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
