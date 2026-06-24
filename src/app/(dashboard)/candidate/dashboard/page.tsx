"use client";
import { useAuthStore } from "@/stores/auth-store";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentInterviews } from "@/components/dashboard/recent-interviews";
import { PerformanceRadar } from "@/components/charts/performance-radar";
import { ScoreHistoryChart } from "@/components/charts/score-history-chart";
import { QuickStartPanel } from "@/components/dashboard/quick-start-panel";
import { WeakAreasPanel } from "@/components/dashboard/weak-areas-panel";

export default function CandidateDashboard() {
    const { user } = useAuthStore();
    const firstName = user?.name?.split(" ")[0] ?? "there";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {firstName} 👋</h1>
                <p className="text-muted-foreground text-sm mt-1">Here&apos;s your interview performance overview</p>
            </div>

            <StatsCards />

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ScoreHistoryChart />
                    <RecentInterviews />
                </div>
                <div className="space-y-5">
                    <PerformanceRadar />
                    <WeakAreasPanel />
                    <QuickStartPanel />
                </div>
            </div>
        </div>
    );
}
