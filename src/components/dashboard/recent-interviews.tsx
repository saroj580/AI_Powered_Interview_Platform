"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Video, Code2, MessageSquare, Mic, Layers, ChevronRight, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { getScoreColor } from "@/lib/utils";
import { format } from "date-fns";

interface Interview {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  status: string;
  score: number | null;
  createdAt: string;
  durationMinutes: number;
  sessionId: string | null;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  TECHNICAL: Code2, BEHAVIORAL: MessageSquare, CODING: Video, VOICE: Mic, MIXED: Layers,
};

export function RecentInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/interviews?limit=4")
      .then((r) => r.json())
      .then((d) => setInterviews(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Recent Interviews</CardTitle>
          <CardDescription>Your latest sessions</CardDescription>
        </div>
        <Link href="/candidate/interviews">
          <Button variant="ghost" size="sm" className="text-primary text-xs gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-3.5 flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))
        ) : interviews.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground mb-3">No interviews yet</p>
            <Link href="/candidate/interviews/new">
              <Button size="sm" className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Start your first interview
              </Button>
            </Link>
          </div>
        ) : (
          interviews.map((interview) => {
            const Icon = TYPE_ICONS[interview.type] ?? Code2;
            const href =
              interview.status === "COMPLETED"
                ? `/candidate/interviews/${interview.id}/report`
                : `/candidate/interviews/${interview.id}/session`;
            return (
              <Link key={interview.id} href={href}>
                <div className="flex items-center gap-4 py-3.5 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{interview.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{interview.type}</Badge>
                      <span className="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />{interview.durationMinutes}m
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(interview.createdAt), "MMM d")}
                      </span>
                    </div>
                  </div>
                  {interview.score !== null ? (
                    <div className="text-right">
                      <span className={`text-xl font-bold ${getScoreColor(interview.score)}`}>{interview.score}</span>
                      <p className="text-muted-foreground text-xs">/100</p>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-xs">{interview.status}</Badge>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
