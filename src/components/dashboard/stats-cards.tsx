"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, TrendingUp, Target, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Stats {
  totalInterviews: number;
  averageScore: number;
  strong: string[];
  weak: string[];
  weeklyChange: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/dashboard/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="p-5"><Skeleton className="h-24 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Total Interviews",
      value: stats?.totalInterviews ?? 0,
      change: stats?.weeklyChange
        ? `${stats.weeklyChange > 0 ? "+" : ""}${stats.weeklyChange} this week`
        : "Start your first interview",
      positive: (stats?.weeklyChange ?? 0) >= 0,
      icon: Video,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "Average Score",
      value: stats?.averageScore ?? 0,
      change: stats?.averageScore ? `Out of 100` : "No data yet",
      positive: (stats?.averageScore ?? 0) >= 70,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Strong Areas",
      value: stats?.strong.length ?? 0,
      change: stats?.strong.length ? stats.strong.join(", ") : "Complete interviews to track",
      positive: true,
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Needs Work",
      value: stats?.weak.length ?? 0,
      change: stats?.weak.length ? stats.weak.join(", ") : "Keep practicing",
      positive: false,
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
              <p className="text-3xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
              <p className={cn("text-xs truncate", stat.positive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
