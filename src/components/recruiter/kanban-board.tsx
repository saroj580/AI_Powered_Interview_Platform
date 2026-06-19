"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getScoreColor } from "@/lib/utils";

const COLUMNS = [
    { id: "APPLIED", label: "Applied", color: "bg-slate-100 dark:bg-slate-800/50" },
    { id: "INTERVIEW_SCHEDULED", label: "Scheduled", color: "bg-blue-50 dark:bg-blue-950/30" },
    { id: "INTERVIEW_COMPLETED", label: "Completed", color: "bg-violet-50 dark:bg-violet-950/30" },
    { id: "SHORTLISTED", label: "Shortlisted", color: "bg-amber-50 dark:bg-amber-950/30" },
    { id: "HIRED", label: "Hired", color: "bg-emerald-50 dark:bg-emerald-950/30" },
];

const CANDIDATES = [
    { id: "1", name: "Arjun Mehta", role: "React Developer", avatar: "AM", score: 84, stage: "SHORTLISTED", days: 3 },
    { id: "2", name: "Sneha Patel", role: "Full Stack", avatar: "SP", score: 91, stage: "HIRED", days: 1 },
    { id: "3", name: "Rohit Kumar", role: "Node.js Dev", avatar: "RK", score: 72, stage: "INTERVIEW_COMPLETED", days: 5 },
    { id: "4", name: "Priya Singh", role: "React Dev", avatar: "PS", score: 68, stage: "INTERVIEW_SCHEDULED", days: 2 },
    { id: "5", name: "Aditya Shah", role: "Full Stack", avatar: "AS", score: 55, stage: "APPLIED", days: 8 },
    { id: "6", name: "Meena Rao", role: "Frontend", avatar: "MR", score: 79, stage: "INTERVIEW_COMPLETED", days: 4 },
    { id: "7", name: "Karan Joshi", role: "Backend", avatar: "KJ", score: 88, stage: "SHORTLISTED", days: 2 },
    { id: "8", name: "Divya Nair", role: "React Dev", avatar: "DN", score: 62, stage: "APPLIED", days: 10 },
];

export function KanbanBoard() {
    const [candidates, setCandidates] = useState(CANDIDATES);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {COLUMNS.map((col) => {
                const colCandidates = candidates.filter((c) => c.stage === col.id);
                return (
                    <div key={col.id} className="flex-shrink-0 w-64">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-sm">{col.label}</h3>
                            <Badge variant="secondary" className="text-xs">{colCandidates.length}</Badge>
                        </div>
                        <div className="space-y-3 min-h-[200px]">
                            {colCandidates.map((candidate, i) => (
                                <motion.div
                                    key={candidate.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                >
                                    <Card className={`card-hover cursor-pointer border-border/60`}>
                                        <CardContent className="p-3.5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-gradient-primary text-white text-xs">{candidate.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-xs">{candidate.name}</p>
                                                        <p className="text-muted-foreground text-[10px]">{candidate.role}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                            {candidate.score > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                                        <span className={`text-xs font-bold ${getScoreColor(candidate.score)}`}>{candidate.score}</span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground">{candidate.days}d ago</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}