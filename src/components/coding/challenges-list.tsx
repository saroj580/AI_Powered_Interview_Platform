"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Code2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CHALLENGES = [
    { id: "two-sum", title: "Two Sum", difficulty: "EASY", category: "Array", acceptance: 48, solved: true },
    { id: "valid-parentheses", title: "Valid Parentheses", difficulty: "EASY", category: "Stack", acceptance: 41, solved: true },
    { id: "merge-intervals", title: "Merge Intervals", difficulty: "MEDIUM", category: "Array", acceptance: 44, solved: false },
    { id: "lru-cache", title: "LRU Cache", difficulty: "MEDIUM", category: "Design", acceptance: 39, solved: false },
    { id: "word-search", title: "Word Search", difficulty: "MEDIUM", category: "Backtracking", acceptance: 37, solved: false },
    { id: "binary-tree-max-depth", title: "Maximum Depth of Binary Tree", difficulty: "EASY", category: "Tree", acceptance: 72, solved: true },
    { id: "serialize-tree", title: "Serialize and Deserialize Binary Tree", difficulty: "HARD", category: "Tree", acceptance: 53, solved: false },
    { id: "median-data-stream", title: "Find Median from Data Stream", difficulty: "HARD", category: "Heap", acceptance: 49, solved: false },
];

const DIFFICULTY_COLORS: Record<string, string> = {
    EASY: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/30",
    MEDIUM: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/30",
    HARD: "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/30",
};

const FILTERS = ["All", "EASY", "MEDIUM", "HARD"];

export function CodingChallengesList() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = CHALLENGES.filter((c) => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "All" || c.difficulty === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-5">
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
                {[
                    { label: "Solved", value: CHALLENGES.filter(c => c.solved).length, color: "text-emerald-500" },
                    { label: "Total", value: CHALLENGES.length, color: "text-foreground" },
                    { label: "Easy", value: CHALLENGES.filter(c => c.difficulty === "EASY").length, color: "text-emerald-500" },
                    { label: "Medium", value: CHALLENGES.filter(c => c.difficulty === "MEDIUM").length, color: "text-amber-500" },
                    { label: "Hard", value: CHALLENGES.filter(c => c.difficulty === "HARD").length, color: "text-red-500" },
                ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
                        <span className="text-muted-foreground text-sm">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search problems…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <div className="flex gap-2">
                    {FILTERS.map((f) => (
                        <Button key={f} variant={filter === f ? "default" : "outline"} size="sm"
                            onClick={() => setFilter(f)}
                            className={filter === f ? "bg-gradient-primary text-white border-0" : ""}
                        >{f}</Button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {filtered.map((c, i) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <Link href={`/candidate/coding/${c.id}`}>
                                    <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group">
                                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                            c.solved ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-muted"
                                        )}>
                                            {c.solved
                                                ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                : <Code2 className="h-4 w-4 text-muted-foreground" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("font-medium text-sm group-hover:text-primary transition-colors", c.solved && "text-muted-foreground")}>{c.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{c.category}</p>
                                        </div>
                                        <Badge className={cn("text-xs font-semibold border", DIFFICULTY_COLORS[c.difficulty])}>
                                            {c.difficulty}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground w-16 text-right">{c.acceptance}% accepted</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}