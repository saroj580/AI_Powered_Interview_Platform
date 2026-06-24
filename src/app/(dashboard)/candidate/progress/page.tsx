"use client";
import { useEffect, useState } from "react";
import { ScoreHistoryChart } from "@/components/charts/score-history-chart";
import { PerformanceRadar } from "@/components/charts/performance-radar";
import { InterviewHistoryTable } from "@/components/dashboard/interview-history-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Award, Target } from "lucide-react";

interface ProgressStats {
    bestScore: number;
    bestSessionTitle: string;
    improvement: number;
    totalCompleted: number;
}

export default function ProgressPage() {
    const [stats, setStats] = useState<ProgressStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/progress")
            .then((r) => r.json())
            .then((d) => setStats(d))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const highlights = [
        {
            label: "Best Score",
            value: stats?.bestScore ? String(stats.bestScore) : "—",
            sub: stats?.bestSessionTitle ? stats.bestSessionTitle.slice(0, 22) + (stats.bestSessionTitle.length > 22 ? "…" : "") : "No data yet",
            icon: Award,
            color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
        },
        {
            label: "Improvement",
            value: stats?.improvement !== undefined && stats.totalCompleted > 1
                ? `${stats.improvement >= 0 ? "+" : ""}${stats.improvement}pts`
                : "—",
            sub: stats?.totalCompleted && stats.totalCompleted > 1 ? `over ${stats.totalCompleted} sessions` : "Need 2+ sessions",
            icon: TrendingUp,
            color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            label: "Sessions Done",
            value: stats?.totalCompleted ?? 0,
            sub: "Completed interviews",
            icon: Target,
            color: "text-primary bg-primary/10",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Progress & Analytics</h1>
                <p className="text-muted-foreground text-sm mt-1">Track your growth and identify improvement areas</p>
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-3 gap-4">
                {highlights.map((c) => (
                    <Card key={c.label} className="card-hover">
                        <CardContent className="p-4 flex items-center gap-3">
                            {loading ? (
                                <Skeleton className="h-16 w-full" />
                            ) : (
                                <>
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                                        <c.icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-2xl font-extrabold">{c.value}</p>
                                        <p className="text-xs text-muted-foreground">{c.label}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{c.sub}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><ScoreHistoryChart /></div>
                <PerformanceRadar />
            </div>
            <InterviewHistoryTable />
        </div>
    );
}
