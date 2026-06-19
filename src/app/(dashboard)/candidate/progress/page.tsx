import { ScoreHistoryChart } from "@/components/charts/score-history-chart";
import { PerformanceRadar } from "@/components/charts/performance-radar";
import { InterviewHistoryTable } from "@/components/dashboard/interview-history-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, Target } from "lucide-react";

export default function ProgressPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Progress & Analytics</h1>
                <p className="text-muted-foreground text-sm mt-1">Track your growth and identify improvement areas</p>
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Best Score", value: "94", sub: "System Design · Jan", icon: Award, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
                    { label: "Improvement", value: "+24pts", sub: "over 3 months", icon: TrendingUp, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
                    { label: "Next Goal", value: "85+", sub: "Overall average", icon: Target, color: "text-primary bg-primary/10" },
                ].map((c) => (
                    <Card key={c.label} className="card-hover">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${c.color}`}>
                                <c.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold">{c.value}</p>
                                <p className="text-xs text-muted-foreground">{c.label}</p>
                                <p className="text-[10px] text-muted-foreground">{c.sub}</p>
                            </div>
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