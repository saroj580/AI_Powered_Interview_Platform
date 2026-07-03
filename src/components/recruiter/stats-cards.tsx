"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Users, CheckCircle, TrendingUp } from "lucide-react";

interface Stats {
  totalAssessments: number;
  activeAssessments: number;
  totalCandidates: number;
  completedInterviews: number;
  completionRate: number;
  avgScore: number;
  candidateChange: string;
}

export function RecruiterStatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recruiter/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Active Assessments", value: String(stats.activeAssessments), sub: `${stats.totalAssessments} total`, icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
        { label: "Total Candidates", value: String(stats.totalCandidates), sub: stats.candidateChange, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
        { label: "Interviews Completed", value: String(stats.completedInterviews), sub: `${stats.completionRate}% completion rate`, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
        { label: "Avg Candidate Score", value: stats.avgScore ? String(stats.avgScore) : "—", sub: "across all assessments", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
      ]
    : [];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="p-5 space-y-3"><Skeleton className="h-10 w-10 rounded-xl" /><Skeleton className="h-8 w-16" /><Skeleton className="h-4 w-24" /></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
          <Card className="card-hover">
            <CardContent className="p-5">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-3xl font-extrabold mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground font-medium mb-1">{s.label}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">{s.sub}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
