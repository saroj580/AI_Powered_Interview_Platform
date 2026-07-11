"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Assessment {
  id: string; title: string; type: string; difficulty: string;
  totalInvites: number; completedCount: number; isActive: boolean; createdAt: string;
}

const DIFF_COLOR: Record<string, string> = {
  EASY:   "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
  MEDIUM: "text-amber-600  bg-amber-50  dark:bg-amber-950/30",
  HARD:   "text-red-600    bg-red-50    dark:bg-red-950/30",
};

export function RecentAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recruiter/assessments")
      .then((r) => r.json())
      .then((d) => setAssessments(Array.isArray(d) ? d.slice(0, 5) : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Recent Assessments</CardTitle>
        <Link href="/recruiter/assessments">
          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">View all <ArrowRight className="h-3 w-3" /></Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-40" /><Skeleton className="h-3 w-24" /></div>
            </div>
          ))
        ) : assessments.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <ClipboardList className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm mb-3">No assessments yet</p>
            <Link href="/recruiter/assessments/new">
              <Button size="sm" className="bg-gradient-primary text-white border-0 gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Create first assessment
              </Button>
            </Link>
          </div>
        ) : (
          assessments.map((a) => (
            <Link key={a.id} href="/recruiter/assessments">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/40 transition-colors group">
                <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center shrink-0">
                  <ClipboardList className="h-4 w-4 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.completedCount}/{a.totalInvites} completed</p>
                </div>
                <Badge className={cn("text-[10px] shrink-0", DIFF_COLOR[a.difficulty])}>{a.difficulty}</Badge>
                <div className={cn("h-2 w-2 rounded-full shrink-0", a.isActive ? "bg-emerald-500" : "bg-muted-foreground/40")} />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
