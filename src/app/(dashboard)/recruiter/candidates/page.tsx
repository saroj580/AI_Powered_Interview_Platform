"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Candidate {
  id: string; email: string; stage: string; score: number | null;
  completedAt: string | null; createdAt: string; notes: string | null;
  assessment: { id: string; title: string; targetRole: string };
  candidate: { name: string; email: string; image: string | null };
}

const STAGE_STYLES: Record<string, string> = {
  APPLIED:             "bg-muted text-muted-foreground",
  INTERVIEW_SCHEDULED: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  INTERVIEW_COMPLETED: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  SHORTLISTED:         "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
  HIRED:               "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  REJECTED:            "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const STAGE_LABELS: Record<string, string> = {
  APPLIED: "Applied", INTERVIEW_SCHEDULED: "Scheduled", INTERVIEW_COMPLETED: "Completed",
  SHORTLISTED: "Shortlisted", HIRED: "Hired", REJECTED: "Rejected",
};

function scoreColor(s: number | null) {
  if (s === null) return "text-muted-foreground";
  if (s >= 80) return "text-emerald-600";
  if (s >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function RecruiterCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  const fetchCandidates = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (stageFilter !== "ALL") params.set("stage", stageFilter);
    if (search) params.set("search", search);
    fetch(`/api/v1/recruiter/candidates?${params}`)
      .then((r) => r.json())
      .then((d) => setCandidates(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [stageFilter, search]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  async function updateStage(inviteId: string, stage: string) {
    await fetch(`/api/v1/recruiter/candidates/${inviteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    toast.success(`Moved to ${STAGE_LABELS[stage]}`);
    fetchCandidates();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="text-muted-foreground text-sm mt-1">All invited candidates across your assessments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by email…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={stageFilter} onValueChange={(v) => v && setStageFilter(v)}>
          <SelectTrigger className="w-44 h-9 text-sm"><SelectValue placeholder="All Stages" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Stages</SelectItem>
            {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-56" /></div>
              <Skeleton className="h-7 w-28 rounded-md" />
            </CardContent></Card>
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <Card><CardContent className="py-14 text-center text-muted-foreground">
          <Mail className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p>No candidates yet. Invite candidates from an assessment.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {candidates.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    {c.candidate.image && <AvatarImage src={c.candidate.image} />}
                    <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                      {c.candidate.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.candidate.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.email} · {c.assessment.title}</p>
                  </div>
                  <div className="hidden sm:block text-right shrink-0 w-16">
                    <p className={cn("text-sm font-bold", scoreColor(c.score))}>
                      {c.score != null ? `${Math.round(c.score)}` : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">score</p>
                  </div>
                  <Select value={c.stage} onValueChange={(v) => v && updateStage(c.id, v)}>
                    <SelectTrigger className={cn("w-36 h-7 text-xs border-0 font-medium shrink-0", STAGE_STYLES[c.stage])}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
