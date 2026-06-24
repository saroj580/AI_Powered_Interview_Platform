"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getScoreColor } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_CANDIDATES = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", targetRole: "Senior React Developer", experienceLevel: "Senior", totalInterviews: 3, avgScore: 87, stage: "SHORTLISTED" },
    { id: "2", name: "Bob Martinez", email: "bob@example.com", targetRole: "Backend Node.js Engineer", experienceLevel: "Mid-Level", totalInterviews: 2, avgScore: 74, stage: "INTERVIEW_COMPLETED" },
    { id: "3", name: "Carol Kim", email: "carol@example.com", targetRole: "Full Stack Developer", experienceLevel: "Junior", totalInterviews: 1, avgScore: 61, stage: "APPLIED" },
    { id: "4", name: "David Chen", email: "david@example.com", targetRole: "DevOps Engineer", experienceLevel: "Senior", totalInterviews: 4, avgScore: 92, stage: "HIRED" },
    { id: "5", name: "Emma Wilson", email: "emma@example.com", targetRole: "Frontend Developer", experienceLevel: "Mid-Level", totalInterviews: 2, avgScore: 68, stage: "REJECTED" },
];

const STAGE_STYLES: Record<string, string> = {
    APPLIED: "bg-muted text-muted-foreground",
    INTERVIEW_SCHEDULED: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    INTERVIEW_COMPLETED: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    SHORTLISTED: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
    HIRED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    REJECTED: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const STAGE_LABELS: Record<string, string> = {
    APPLIED: "Applied", INTERVIEW_SCHEDULED: "Scheduled", INTERVIEW_COMPLETED: "Completed",
    SHORTLISTED: "Shortlisted", HIRED: "Hired", REJECTED: "Rejected",
};

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function RecruiterCandidatesPage() {
    const [search, setSearch] = useState("");
    const [stageFilter, setStageFilter] = useState("All");

    const filtered = MOCK_CANDIDATES.filter((c) => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.targetRole.toLowerCase().includes(search.toLowerCase());
        const matchStage = stageFilter === "All" || c.stage === stageFilter;
        return matchSearch && matchStage;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Candidates</h1>
                <p className="text-muted-foreground text-sm mt-1">Review and manage all candidate profiles</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: MOCK_CANDIDATES.length },
                    { label: "Shortlisted", value: MOCK_CANDIDATES.filter(c => c.stage === "SHORTLISTED").length },
                    { label: "Hired", value: MOCK_CANDIDATES.filter(c => c.stage === "HIRED").length },
                    { label: "Avg Score", value: Math.round(MOCK_CANDIDATES.reduce((a, c) => a + c.avgScore, 0) / MOCK_CANDIDATES.length) + "%" },
                ].map((s) => (
                    <Card key={s.label}>
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold text-primary">{s.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search candidates…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["All", "SHORTLISTED", "HIRED", "REJECTED"].map((f) => (
                        <Button
                            key={f}
                            variant={stageFilter === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStageFilter(f)}
                            className={stageFilter === f ? "bg-gradient-primary text-white border-0" : ""}
                        >
                            {f === "All" ? "All" : STAGE_LABELS[f]}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Candidate cards */}
            <div className="space-y-3">
                {filtered.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                                        <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold">
                                            {getInitials(c.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-sm">{c.name}</p>
                                            <Badge className={cn("text-xs", STAGE_STYLES[c.stage])}>
                                                {STAGE_LABELS[c.stage]}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{c.targetRole} · {c.experienceLevel}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-muted-foreground">{c.totalInterviews} interviews</span>
                                            <span className="text-xs text-muted-foreground">·</span>
                                            <span className={cn("text-xs font-semibold", getScoreColor(c.avgScore))}>
                                                Avg: {c.avgScore}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Email sent to ${c.name}`)}>
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success(`${c.name} shortlisted!`)}>
                                            <Star className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => toast.info("View profile coming soon!")}>
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
