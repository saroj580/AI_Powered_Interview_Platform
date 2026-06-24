"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Code2, MessageSquare, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TYPE_ICONS: Record<string, React.ElementType> = {
    TECHNICAL: Code2, BEHAVIORAL: MessageSquare, MIXED: Layers, CODING: Code2,
};

const MOCK_ASSESSMENTS = [
    { id: "1", title: "Senior React Developer Assessment", type: "TECHNICAL", difficulty: "HARD", questionCount: 10, durationMinutes: 40, totalInvites: 24, completedCount: 18, isActive: true, createdAt: "Jun 10, 2026" },
    { id: "2", title: "Backend Engineer — Node.js", type: "CODING", difficulty: "MEDIUM", questionCount: 8, durationMinutes: 35, totalInvites: 15, completedCount: 11, isActive: true, createdAt: "Jun 5, 2026" },
    { id: "3", title: "Behavioral Screening", type: "BEHAVIORAL", difficulty: "EASY", questionCount: 6, durationMinutes: 25, totalInvites: 50, completedCount: 44, isActive: false, createdAt: "May 28, 2026" },
    { id: "4", title: "Full Stack Developer", type: "MIXED", difficulty: "MEDIUM", questionCount: 12, durationMinutes: 50, totalInvites: 8, completedCount: 3, isActive: true, createdAt: "Jun 20, 2026" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
    EASY: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
    MEDIUM: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
    HARD: "text-red-600 bg-red-50 dark:bg-red-950/30",
};

export default function RecruiterAssessmentsPage() {
    const [search, setSearch] = useState("");
    const [assessments, setAssessments] = useState(MOCK_ASSESSMENTS);

    const filtered = assessments.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    function toggleActive(id: string) {
        setAssessments(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
        toast.success("Assessment status updated");
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Assessments</h1>
                    <p className="text-muted-foreground text-sm mt-1">Create and manage candidate assessments</p>
                </div>
                <Button className="bg-gradient-primary text-white border-0 hover:opacity-90 gap-2" onClick={() => toast.info("Assessment creation coming soon!")}>
                    <Plus className="h-4 w-4" />
                    Create Assessment
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: assessments.length },
                    { label: "Active", value: assessments.filter(a => a.isActive).length },
                    { label: "Total Invites", value: assessments.reduce((a, x) => a + x.totalInvites, 0) },
                    { label: "Completed", value: assessments.reduce((a, x) => a + x.completedCount, 0) },
                ].map((s) => (
                    <Card key={s.label}>
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold text-primary">{s.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search assessments…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>

            <div className="space-y-3">
                {filtered.map((a, i) => {
                    const Icon = TYPE_ICONS[a.type] ?? Code2;
                    const completionRate = Math.round((a.completedCount / a.totalInvites) * 100);
                    return (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className={cn("transition-all", !a.isActive && "opacity-60")}>
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-sm">{a.title}</p>
                                                <Badge className={cn("text-xs font-medium", DIFFICULTY_COLORS[a.difficulty])}>
                                                    {a.difficulty}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                <span className="text-xs text-muted-foreground">{a.type}</span>
                                                <span className="text-xs text-muted-foreground">·</span>
                                                <span className="text-xs text-muted-foreground">{a.questionCount} questions</span>
                                                <span className="text-xs text-muted-foreground">·</span>
                                                <span className="text-xs text-muted-foreground">{a.durationMinutes} min</span>
                                                <span className="text-xs text-muted-foreground">·</span>
                                                <span className="text-xs text-muted-foreground">Created {a.createdAt}</span>
                                            </div>
                                            <div className="mt-3 flex items-center gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs text-muted-foreground">Completion:</span>
                                                    <span className="text-xs font-semibold text-foreground">{a.completedCount}/{a.totalInvites} ({completionRate}%)</span>
                                                </div>
                                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-24">
                                                    <div className="h-full bg-primary rounded-full" style={{ width: `${completionRate}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 shrink-0">
                                            <Switch checked={a.isActive} onCheckedChange={() => toggleActive(a.id)} />
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => toast.info("Share link copied!")}>Share</Button>
                                                <Button variant="outline" size="sm" onClick={() => toast.info("Edit coming soon!")}>Edit</Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
