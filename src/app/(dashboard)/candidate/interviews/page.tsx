"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Video, Code2, MessageSquare, Mic, Layers, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getScoreColor } from "@/lib/utils";
import { format } from "date-fns";

const TYPE_ICONS: Record<string, React.ElementType> = {
    TECHNICAL: Code2, BEHAVIORAL: MessageSquare, CODING: Video, VOICE: Mic, MIXED: Layers, LIVE: BrainCircuit,
};

const STATUS_STYLES: Record<string, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
    SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
    DRAFT: "bg-muted text-muted-foreground border-border",
};

const DIFFICULTY_COLORS: Record<string, string> = {
    EASY: "text-emerald-600", MEDIUM: "text-amber-600", HARD: "text-red-600",
};

interface Interview {
    id: string;
    title: string;
    type: string;
    difficulty: string;
    status: string;
    score: number | null;
    createdAt: string;
    durationMinutes: number;
    sessionId: string | null;
}

function statusLabel(s: string) {
    if (s === "IN_PROGRESS") return "In Progress";
    return s.charAt(0) + s.slice(1).toLowerCase();
}

export default function InterviewsPage() {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetch("/api/v1/interviews?limit=100")
            .then((r) => r.json())
            .then((d) => setInterviews(Array.isArray(d) ? d : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = interviews.filter((i) => {
        const matchSearch = i.title.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "All" || i.status === filter;
        return matchSearch && matchFilter;
    });

    const completed = interviews.filter((i) => i.status === "COMPLETED");
    const avgScore = completed.length > 0
        ? Math.round(completed.reduce((a, i) => a + (i.score ?? 0), 0) / completed.filter(i => i.score !== null).length)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Interviews</h1>
                    <p className="text-muted-foreground text-sm mt-1">Review your past sessions and start new practice</p>
                </div>
                <Link href="/candidate/interviews/new">
                    <Button className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-2">
                        <Plus className="h-4 w-4" /> New Interview
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search interviews…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <div className="flex gap-2">
                    {["All", "COMPLETED", "IN_PROGRESS", "DRAFT"].map((f) => (
                        <Button key={f} variant={filter === f ? "default" : "outline"} size="sm"
                            onClick={() => setFilter(f)}
                            className={filter === f ? "bg-gradient-primary text-white border-0" : ""}>
                            {f === "All" ? "All" : statusLabel(f)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total", value: interviews.length, color: "text-foreground" },
                        { label: "Completed", value: completed.length, color: "text-emerald-500" },
                        { label: "In Progress", value: interviews.filter(i => i.status === "IN_PROGRESS").length, color: "text-blue-500" },
                        { label: "Avg Score", value: avgScore ? `${avgScore}%` : "—", color: "text-primary" },
                    ].map((s) => (
                        <Card key={s.label}>
                            <CardContent className="p-4">
                                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Interview list */}
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 px-5 py-4">
                                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="py-16 text-center text-muted-foreground">
                                <Filter className="h-8 w-8 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">{interviews.length === 0 ? "No interviews yet" : "No interviews found"}</p>
                                <p className="text-sm mt-1">{interviews.length === 0
                                    ? "Start your first AI interview to begin tracking progress"
                                    : "Try adjusting your search or filter"}</p>
                                {interviews.length === 0 && (
                                    <Link href="/candidate/interviews/new">
                                        <Button size="sm" className="mt-4 bg-gradient-primary text-white border-0 hover:opacity-90">
                                            <Plus className="h-4 w-4 mr-1" /> Start Interview
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : filtered.map((interview, i) => {
                            const Icon = TYPE_ICONS[interview.type] ?? Code2;
                            const href = interview.status === "COMPLETED"
                                ? `/candidate/interviews/${interview.id}/report`
                                : `/candidate/interviews/${interview.id}/session`;
                            return (
                                <motion.div key={interview.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                                    <Link href={href}>
                                        <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">{interview.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">{format(new Date(interview.createdAt), "MMM d, yyyy")}</span>
                                                    <span className="text-xs text-muted-foreground">·</span>
                                                    <span className="text-xs text-muted-foreground">{interview.durationMinutes}m</span>
                                                    <span className="text-xs text-muted-foreground">·</span>
                                                    <span className={cn("text-xs font-medium", DIFFICULTY_COLORS[interview.difficulty])}>{interview.difficulty}</span>
                                                </div>
                                            </div>
                                            <Badge className={cn("text-xs font-medium border", STATUS_STYLES[interview.status])}>
                                                {statusLabel(interview.status)}
                                            </Badge>
                                            {interview.score !== null && (
                                                <span className={`text-lg font-bold ${getScoreColor(interview.score)}`}>{interview.score}</span>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
