"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Code2, ChevronDown, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface Challenge {
    id: string;
    slug: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    category: string;
    pattern: string;
    leetcodeId: number | null;
    totalSubmissions: number;
    acceptedSubmissions: number;
}

const DIFFICULTY_COLOR: Record<string, string> = {
    EASY:   "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    MEDIUM: "text-amber-600  bg-amber-50  dark:bg-amber-950/30  border-amber-200  dark:border-amber-800",
    HARD:   "text-red-600    bg-red-50    dark:bg-red-950/30    border-red-200    dark:border-red-800",
};

const DIFFICULTY_FILTERS = ["All", "EASY", "MEDIUM", "HARD"];

const PATTERN_ORDER = [
    "Array & Hashing", "Two Pointers", "Sliding Window", "Stack",
    "Binary Search", "Linked List", "Trees", "Tries",
    "Heap / Priority Queue", "Backtracking", "Graphs",
    "Dynamic Programming", "Greedy", "Intervals", "Math & Geometry", "Bit Manipulation",
];

function acceptanceRate(c: Challenge) {
    return c.totalSubmissions > 0
        ? Math.round((c.acceptedSubmissions / c.totalSubmissions) * 100)
        : 0;
}

function PatternGroup({
    pattern, challenges, defaultOpen,
}: { pattern: string; challenges: Challenge[]; defaultOpen: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const easy   = challenges.filter((c) => c.difficulty === "EASY").length;
    const medium = challenges.filter((c) => c.difficulty === "MEDIUM").length;
    const hard   = challenges.filter((c) => c.difficulty === "HARD").length;

    return (
        <div className="border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3 px-5 py-3.5 bg-muted/50 hover:bg-muted/80 transition-colors text-left"
            >
                {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                <Layers className="h-4 w-4 text-primary shrink-0" />
                <span className="font-semibold text-sm flex-1">{pattern}</span>
                <div className="flex items-center gap-2 text-xs">
                    {easy   > 0 && <span className="text-emerald-600 font-medium">{easy}E</span>}
                    {medium > 0 && <span className="text-amber-600  font-medium">{medium}M</span>}
                    {hard   > 0 && <span className="text-red-600    font-medium">{hard}H</span>}
                    <span className="text-muted-foreground ml-1">{challenges.length} problems</span>
                </div>
            </button>

            {/* Problems */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="divide-y divide-border">
                            {challenges.map((c, i) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                >
                                    <Link href={`/candidate/coding/${c.slug}`}>
                                        <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors group">
                                            {/* LC number */}
                                            <span className="text-xs text-muted-foreground w-8 shrink-0 font-mono">
                                                {c.leetcodeId ?? "—"}
                                            </span>
                                            {/* Title */}
                                            <p className="flex-1 font-medium text-sm group-hover:text-primary transition-colors truncate">
                                                {c.title}
                                            </p>
                                            {/* Category tag */}
                                            <span className="hidden sm:block text-xs text-muted-foreground w-28 text-right truncate">{c.category}</span>
                                            {/* Difficulty badge */}
                                            <Badge className={cn("text-xs font-semibold border shrink-0", DIFFICULTY_COLOR[c.difficulty])}>
                                                {c.difficulty}
                                            </Badge>
                                            {/* Acceptance */}
                                            <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
                                                {acceptanceRate(c)}%
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function CodingChallengesList() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");
    const [diffFilter, setDiffFilter] = useState("All");
    const [patternFilter, setPatternFilter] = useState("All");

    useEffect(() => {
        fetch("/api/v1/coding/challenges")
            .then((r) => r.json())
            .then((d) => setChallenges(Array.isArray(d) ? d : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // All unique patterns in preferred order
    const patterns = useMemo(() => {
        const inData = [...new Set(challenges.map((c) => c.pattern).filter(Boolean))];
        return PATTERN_ORDER.filter((p) => inData.includes(p));
    }, [challenges]);

    // Filtered list
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return challenges.filter((c) => {
            const matchSearch = !q || c.title.toLowerCase().includes(q) || c.pattern.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || String(c.leetcodeId).includes(q);
            const matchDiff   = diffFilter === "All" || c.difficulty === diffFilter;
            const matchPat    = patternFilter === "All" || c.pattern === patternFilter;
            return matchSearch && matchDiff && matchPat;
        });
    }, [challenges, search, diffFilter, patternFilter]);

    // Group by pattern in canonical order
    const grouped = useMemo(() => {
        const map = new Map<string, Challenge[]>();
        for (const c of filtered) {
            const key = c.pattern || "Other";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(c);
        }
        const ordered: { pattern: string; list: Challenge[] }[] = [];
        for (const p of PATTERN_ORDER) {
            if (map.has(p)) ordered.push({ pattern: p, list: map.get(p)! });
        }
        for (const [k, v] of map.entries()) {
            if (!PATTERN_ORDER.includes(k)) ordered.push({ pattern: k, list: v });
        }
        return ordered;
    }, [filtered]);

    const total  = challenges.length;
    const easy   = challenges.filter((c) => c.difficulty === "EASY").length;
    const medium = challenges.filter((c) => c.difficulty === "MEDIUM").length;
    const hard   = challenges.filter((c) => c.difficulty === "HARD").length;

    const isSearching = search.length > 0 || diffFilter !== "All" || patternFilter !== "All";

    return (
        <div className="space-y-5">
            {/* Stats bar */}
            <div className="flex flex-wrap gap-5">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-16" />)
                ) : [
                    { label: "Total",  value: total,  color: "text-foreground" },
                    { label: "Easy",   value: easy,   color: "text-emerald-500" },
                    { label: "Medium", value: medium, color: "text-amber-500" },
                    { label: "Hard",   value: hard,   color: "text-red-500" },
                ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
                        <span className="text-muted-foreground text-sm">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Search + filters */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, pattern, or LC number…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {/* Difficulty filter */}
                    <div className="flex gap-1.5 flex-wrap">
                        {DIFFICULTY_FILTERS.map((f) => (
                            <Button
                                key={f}
                                variant={diffFilter === f ? "default" : "outline"}
                                size="sm"
                                onClick={() => setDiffFilter(f)}
                                className={cn("h-9 text-xs", diffFilter === f && "bg-gradient-primary text-white border-0")}
                            >
                                {f}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Pattern filter chips */}
                <div className="flex flex-wrap gap-1.5">
                    <Button
                        variant={patternFilter === "All" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPatternFilter("All")}
                        className={cn("h-7 text-xs", patternFilter === "All" && "bg-gradient-primary text-white border-0")}
                    >
                        All Patterns
                    </Button>
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-7 w-24 rounded-md" />)
                        : patterns.map((p) => (
                            <Button
                                key={p}
                                variant={patternFilter === p ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPatternFilter(patternFilter === p ? "All" : p)}
                                className={cn("h-7 text-xs", patternFilter === p && "bg-gradient-primary text-white border-0")}
                            >
                                {p}
                            </Button>
                        ))
                    }
                </div>
            </div>

            {/* Column header */}
            {!loading && filtered.length > 0 && (
                <div className="hidden sm:flex items-center gap-4 px-5 text-xs text-muted-foreground font-medium">
                    <span className="w-8">#</span>
                    <span className="flex-1">Problem</span>
                    <span className="w-28 text-right">Category</span>
                    <span className="w-16">Level</span>
                    <span className="w-16 text-right">Accept %</span>
                </div>
            )}

            {/* Groups */}
            {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="border border-border rounded-xl overflow-hidden">
                        <Skeleton className="h-12 w-full" />
                    </div>
                ))
            ) : grouped.length === 0 ? (
                <Card>
                    <CardContent className="py-14 text-center text-muted-foreground">
                        <Code2 className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p>No challenges match your filters</p>
                        {isSearching && (
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => { setSearch(""); setDiffFilter("All"); setPatternFilter("All"); }}
                                className="mt-2"
                            >
                                Clear filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {grouped.map(({ pattern, list }, i) => (
                        <PatternGroup
                            key={pattern}
                            pattern={pattern}
                            challenges={list}
                            defaultOpen={i === 0 || isSearching}
                        />
                    ))}
                </div>
            )}

            {!loading && filtered.length > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                    Showing {filtered.length} of {total} problems
                </p>
            )}
        </div>
    );
}
