"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Video, Code2, MessageSquare, Mic, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getScoreColor } from "@/lib/utils";

const TYPE_ICONS: Record<string, React.ElementType> = {
    TECHNICAL: Code2, BEHAVIORAL: MessageSquare, CODING: Video, VOICE: Mic, MIXED: Layers,
};

const MOCK_INTERVIEWS = [
    { id: "1", title: "Senior React Developer", type: "TECHNICAL", difficulty: "HARD", status: "COMPLETED", score: 81, date: "Jun 22, 2026", duration: "42 min" },
    { id: "2", title: "Backend Node.js Engineer", type: "CODING", difficulty: "MEDIUM", status: "COMPLETED", score: 74, date: "Jun 19, 2026", duration: "35 min" },
    { id: "3", title: "Full Stack Developer", type: "MIXED", difficulty: "MEDIUM", status: "COMPLETED", score: 89, date: "Jun 15, 2026", duration: "50 min" },
    { id: "4", title: "Frontend Developer", type: "BEHAVIORAL", difficulty: "EASY", status: "COMPLETED", score: 92, date: "Jun 10, 2026", duration: "28 min" },
    { id: "5", title: "System Design — Distributed Systems", type: "TECHNICAL", difficulty: "HARD", status: "IN_PROGRESS", score: null, date: "Today", duration: "—" },
];

const STATUS_STYLES: Record<string, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30",
    SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/30",
    DRAFT: "bg-muted text-muted-foreground border-border",
};

const DIFFICULTY_COLORS: Record<string, string> = {
    EASY: "text-emerald-600",
    MEDIUM: "text-amber-600",
    HARD: "text-red-600",
};

export default function InterviewsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = MOCK_INTERVIEWS.filter((i) => {
        const matchSearch = i.title.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "All" || i.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Interviews</h1>
                    <p className="text-muted-foreground text-sm mt-1">Review your past sessions and start new practice</p>
                </div>
                <Link href="/candidate/interviews/new">
                    <Button className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-2">
                        <Plus className="h-4 w-4" />
                        New Interview
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
                    {["All", "COMPLETED", "IN_PROGRESS", "SCHEDULED"].map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className={filter === f ? "bg-gradient-primary text-white border-0" : ""}
                        >
                            {f === "All" ? "All" : f === "IN_PROGRESS" ? "In Progress" : f.charAt(0) + f.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: MOCK_INTERVIEWS.length, color: "text-foreground" },
                    { label: "Completed", value: MOCK_INTERVIEWS.filter(i => i.status === "COMPLETED").length, color: "text-emerald-500" },
                    { label: "In Progress", value: MOCK_INTERVIEWS.filter(i => i.status === "IN_PROGRESS").length, color: "text-blue-500" },
                    { label: "Avg Score", value: Math.round(MOCK_INTERVIEWS.filter(i => i.score).reduce((a, i) => a + (i.score ?? 0), 0) / MOCK_INTERVIEWS.filter(i => i.score).length) + "%", color: "text-primary" },
                ].map((s) => (
                    <Card key={s.label}>
                        <CardContent className="p-4">
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Interview list */}
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <div className="py-16 text-center text-muted-foreground">
                                <Filter className="h-8 w-8 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No interviews found</p>
                                <p className="text-sm mt-1">Try adjusting your search or filter</p>
                            </div>
                        ) : filtered.map((interview, i) => {
                            const Icon = TYPE_ICONS[interview.type] ?? Code2;
                            return (
                                <motion.div
                                    key={interview.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <Link href={interview.status === "COMPLETED" ? `/candidate/interviews/${interview.id}/report` : `/candidate/interviews/${interview.id}/session`}>
                                        <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">{interview.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">{interview.date}</span>
                                                    <span className="text-xs text-muted-foreground">·</span>
                                                    <span className="text-xs text-muted-foreground">{interview.duration}</span>
                                                    <span className="text-xs text-muted-foreground">·</span>
                                                    <span className={cn("text-xs font-medium", DIFFICULTY_COLORS[interview.difficulty])}>{interview.difficulty}</span>
                                                </div>
                                            </div>
                                            <Badge className={cn("text-xs font-medium border", STATUS_STYLES[interview.status])}>
                                                {interview.status === "IN_PROGRESS" ? "In Progress" : interview.status.charAt(0) + interview.status.slice(1).toLowerCase()}
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
