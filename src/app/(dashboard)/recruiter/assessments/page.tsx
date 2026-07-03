"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Code2, MessageSquare, Layers, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { InviteModal } from "@/components/recruiter/invite-modal";

const TYPE_ICONS: Record<string, React.ElementType> = {
  TECHNICAL: Code2, BEHAVIORAL: MessageSquare, MIXED: Layers, CODING: Code2, VOICE: MessageSquare,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY:   "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
  MEDIUM: "text-amber-600  bg-amber-50  dark:bg-amber-950/30",
  HARD:   "text-red-600    bg-red-50    dark:bg-red-950/30",
};

interface Assessment {
  id: string; title: string; type: string; difficulty: string; targetRole: string;
  questionCount: number; durationMinutes: number; totalInvites: number;
  completedCount: number; isActive: boolean; createdAt: string;
}

export default function RecruiterAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inviteTarget, setInviteTarget] = useState<Assessment | null>(null);

  const fetchAssessments = useCallback(() => {
    fetch("/api/v1/recruiter/assessments")
      .then((r) => r.json())
      .then((d) => setAssessments(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  async function toggleActive(id: string, isActive: boolean) {
    setAssessments((prev) => prev.map((a) => a.id === id ? { ...a, isActive } : a));
    await fetch(`/api/v1/recruiter/assessments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    toast.success(isActive ? "Assessment activated" : "Assessment deactivated");
  }

  async function deleteAssessment(id: string) {
    if (!confirm("Delete this assessment and all its invites?")) return;
    setAssessments((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/v1/recruiter/assessments/${id}`, { method: "DELETE" });
    toast.success("Assessment deleted");
  }

  const filtered = assessments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.targetRole.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assessments</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage your interview assessments</p>
        </div>
        <Link href="/recruiter/assessments/new">
          <Button className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-1.5">
            <Plus className="h-4 w-4" /> New Assessment
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search assessments…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-8 w-full rounded-lg" />
            </CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-14 text-center text-muted-foreground">
          <Layers className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="mb-3">No assessments yet</p>
          <Link href="/recruiter/assessments/new">
            <Button size="sm" className="bg-gradient-primary text-white border-0 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Create your first assessment
            </Button>
          </Link>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((a, i) => {
            const Icon = TYPE_ICONS[a.type] ?? Layers;
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="card-hover h-full">
                  <CardContent className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm leading-tight">{a.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.targetRole}</p>
                        </div>
                      </div>
                      <Switch checked={a.isActive} onCheckedChange={(v) => toggleActive(a.id, v)} className="shrink-0" />
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <Badge className={cn("text-[10px]", DIFFICULTY_COLORS[a.difficulty])}>{a.difficulty}</Badge>
                      <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                      <Badge variant="outline" className="text-[10px]">{a.questionCount}Q · {a.durationMinutes}min</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{a.completedCount}/{a.totalInvites} completed</span>
                      {a.totalInvites > 0 && (
                        <span className="text-emerald-600">
                          {Math.round((a.completedCount / a.totalInvites) * 100)}% rate
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-border">
                      <Button
                        size="sm" variant="outline" className="flex-1 text-xs gap-1.5 h-8"
                        onClick={() => setInviteTarget(a)}
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Invite
                      </Button>
                      <Button
                        size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                        onClick={() => deleteAssessment(a.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {inviteTarget && (
        <InviteModal
          assessmentId={inviteTarget.id}
          assessmentTitle={inviteTarget.title}
          onClose={() => setInviteTarget(null)}
        />
      )}
    </div>
  );
}
