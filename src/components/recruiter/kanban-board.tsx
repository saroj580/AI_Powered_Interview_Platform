"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Candidate {
  id: string; email: string; stage: string; score: number | null;
  candidate: { name: string; email: string; image: string | null };
  assessment: { title: string; targetRole: string };
}

const COLUMNS = [
  { id: "APPLIED",             label: "Applied",    color: "bg-slate-100 dark:bg-slate-800/50",   dot: "bg-slate-400" },
  { id: "INTERVIEW_SCHEDULED", label: "Scheduled",  color: "bg-blue-50 dark:bg-blue-950/30",      dot: "bg-blue-500" },
  { id: "INTERVIEW_COMPLETED", label: "Completed",  color: "bg-violet-50 dark:bg-violet-950/30",  dot: "bg-violet-500" },
  { id: "SHORTLISTED",         label: "Shortlisted",color: "bg-amber-50 dark:bg-amber-950/30",    dot: "bg-amber-500" },
  { id: "HIRED",               label: "Hired",      color: "bg-emerald-50 dark:bg-emerald-950/30",dot: "bg-emerald-500" },
];

function scoreColor(s: number | null) {
  if (s === null) return "text-muted-foreground";
  if (s >= 80) return "text-emerald-600";
  if (s >= 60) return "text-amber-600";
  return "text-red-500";
}

export function KanbanBoard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);

  const fetchCandidates = useCallback(() => {
    fetch("/api/v1/recruiter/candidates")
      .then((r) => r.json())
      .then((d) => setCandidates(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  async function moveCandidate(inviteId: string, stage: string) {
    setCandidates((prev) =>
      prev.map((c) => (c.id === inviteId ? { ...c, stage } : c))
    );
    try {
      const res = await fetch(`/api/v1/recruiter/candidates/${inviteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) throw new Error("Server error");
      toast.success(`Moved to ${stage.replace(/_/g, " ").toLowerCase()}`);
    } catch {
      toast.error("Failed to update stage");
      fetchCandidates();
    }
  }

  function onDragStart(e: React.DragEvent, inviteId: string) {
    setDragging(inviteId);
    e.dataTransfer.setData("inviteId", inviteId);
  }

  function onDrop(e: React.DragEvent, stage: string) {
    e.preventDefault();
    const inviteId = e.dataTransfer.getData("inviteId");
    if (inviteId) moveCandidate(inviteId, stage);
    setDragging(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const cards = candidates.filter((c) => c.stage === col.id);
        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-64"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className={cn("rounded-xl p-3 min-h-[400px]", col.color)}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={cn("h-2 w-2 rounded-full", col.dot)} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{col.label}</span>
                <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">{loading ? "…" : cards.length}</Badge>
              </div>

              <div className="space-y-2">
                {loading
                  ? Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))
                  : cards.length === 0
                  ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/40">
                      <Users className="h-5 w-5 mb-1" />
                      <p className="text-xs">Drop here</p>
                    </div>
                  )
                  : cards.map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, c.id)}
                      className={cn("cursor-grab active:cursor-grabbing", dragging === c.id && "opacity-50")}
                    >
                      <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-7 w-7 shrink-0">
                              {c.candidate.image && <AvatarImage src={c.candidate.image} />}
                              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                                {c.candidate.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{c.candidate.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{c.assessment.targetRole}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-muted-foreground truncate flex-1">{c.assessment.title}</p>
                            {c.score != null && (
                              <span className={cn("text-xs font-bold shrink-0 ml-1", scoreColor(c.score))}>
                                {Math.round(c.score)}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
