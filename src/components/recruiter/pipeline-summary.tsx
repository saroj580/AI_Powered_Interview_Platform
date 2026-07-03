"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

const STAGES = [
  { key: "APPLIED",             label: "Applied",    color: "bg-slate-400" },
  { key: "INTERVIEW_SCHEDULED", label: "Scheduled",  color: "bg-blue-500" },
  { key: "INTERVIEW_COMPLETED", label: "Completed",  color: "bg-violet-500" },
  { key: "SHORTLISTED",         label: "Shortlisted",color: "bg-amber-500" },
  { key: "HIRED",               label: "Hired",      color: "bg-emerald-500" },
  { key: "REJECTED",            label: "Rejected",   color: "bg-red-400" },
];

export function CandidatePipelineSummary() {
  const [stageCounts, setStageCounts] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recruiter/reports")
      .then((r) => r.json())
      .then((d) => setStageCounts(d.stageCounts ?? null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = stageCounts ? Object.values(stageCounts).reduce((a, b) => a + b, 0) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Pipeline</CardTitle>
        <Link href="/recruiter/pipeline">
          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">View <ArrowRight className="h-3 w-3" /></Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-6" />
              </div>
            ))
          : STAGES.map(({ key, label, color }) => {
              const count = stageCounts?.[key] ?? 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                      <span className="text-muted-foreground">{label}</span>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
        {!loading && total === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No candidates in pipeline yet</p>
        )}
      </CardContent>
    </Card>
  );
}
